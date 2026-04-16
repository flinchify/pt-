import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';
import { getSession } from '@/lib/auth';

const DOCUMENT_PROMPTS: Record<string, string> = {
  wwcc: `Analyze this Working With Children Check (WWCC) document. Extract and verify:
- Full name on the card
- Card/clearance number
- Expiry date
- Issuing state (NSW, VIC, QLD, WA, SA, TAS, NT, ACT)
Return JSON: { "name": "", "document_number": "", "expiry_date": "YYYY-MM-DD", "issuing_authority": "", "valid": true/false, "notes": "" }
Mark valid=false if expired, illegible, or appears tampered.`,

  first_aid: `Analyze this First Aid Certificate (HLTAID011). Extract and verify:
- Full name
- Certificate number
- Completion/issue date
- Issuing RTO (Registered Training Organisation)
- Expiry: 3 years from issue date
Return JSON: { "name": "", "document_number": "", "issue_date": "YYYY-MM-DD", "expiry_date": "YYYY-MM-DD", "issuing_authority": "", "valid": true/false, "notes": "" }
Mark valid=false if expired (>3 years from issue), illegible, or appears tampered.`,

  cpr: `Analyze this CPR Certificate (HLTAID009). Extract and verify:
- Full name
- Certificate number
- Completion/issue date
- Issuing RTO (Registered Training Organisation)
- Expiry: 1 year from issue date
Return JSON: { "name": "", "document_number": "", "issue_date": "YYYY-MM-DD", "expiry_date": "YYYY-MM-DD", "issuing_authority": "", "valid": true/false, "notes": "" }
Mark valid=false if expired (>1 year from issue), illegible, or appears tampered.`,

  cert_iii_fitness: `Analyze this Certificate III in Fitness (SIS30321). Extract and verify:
- Full name
- Qualification/certificate number
- Issuing RTO (Registered Training Organisation)
- Completion date
Return JSON: { "name": "", "document_number": "", "issue_date": "YYYY-MM-DD", "issuing_authority": "", "valid": true/false, "notes": "" }
This qualification does not expire. Mark valid=false if illegible or appears tampered.`,

  cert_iv_fitness: `Analyze this Certificate IV in Fitness (SIS40221). Extract and verify:
- Full name
- Qualification/certificate number
- Issuing RTO (Registered Training Organisation)
- Completion date
Return JSON: { "name": "", "document_number": "", "issue_date": "YYYY-MM-DD", "issuing_authority": "", "valid": true/false, "notes": "" }
This qualification does not expire. Mark valid=false if illegible or appears tampered.`,

  police_check: `Analyze this National Police Check document. Extract and verify:
- Full name
- Date issued (must be within 12 months of today)
- Result (looking for "No Disclosable Court Outcomes" or similar clear result)
Return JSON: { "name": "", "issue_date": "YYYY-MM-DD", "issuing_authority": "", "result": "", "valid": true/false, "notes": "" }
Mark valid=false if issued more than 12 months ago, has disclosable outcomes, illegible, or appears tampered.`,

  insurance: `Analyze this Professional Indemnity / Public Liability Insurance certificate. Extract and verify:
- Policy holder name
- Policy number
- Coverage amount (minimum $10,000,000 for public liability)
- Expiry date
Return JSON: { "name": "", "document_number": "", "expiry_date": "YYYY-MM-DD", "issuing_authority": "", "coverage_amount": "", "valid": true/false, "notes": "" }
Mark valid=false if expired, coverage below $10M, illegible, or appears tampered.`,

  ausactive: `Analyze this AUSactive (formerly Fitness Australia) Registration document. Extract and verify:
- Full name
- Membership/registration number
- Registration type/level
- Expiry date
Return JSON: { "name": "", "document_number": "", "expiry_date": "YYYY-MM-DD", "issuing_authority": "AUSactive", "valid": true/false, "notes": "" }
Mark valid=false if expired, illegible, or appears tampered.`,
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureTables();
    const sql = getDb();
    const { id } = await params;
    const trainerId = parseInt(id);

    // Verify ownership
    const trainer = await sql`SELECT id, user_id FROM trainers WHERE id = ${trainerId}`;
    if (trainer.length === 0) {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }
    if (trainer[0].user_id !== session.user_id && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('document') as File | null;
    const documentType = formData.get('document_type') as string;

    if (!file || !documentType) {
      return NextResponse.json({ error: 'Missing document or document_type' }, { status: 400 });
    }

    if (!DOCUMENT_PROMPTS[documentType]) {
      return NextResponse.json({ error: 'Invalid document_type' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = file.type || 'image/jpeg';

    // Call OpenAI GPT-4o vision
    let aiResult: {
      name?: string;
      document_number?: string;
      issue_date?: string;
      expiry_date?: string;
      issuing_authority?: string;
      valid?: boolean;
      notes?: string;
      result?: string;
      coverage_amount?: string;
    };

    if (!process.env.OPENAI_API_KEY) {
      // Fallback for dev: mark as pending_review
      await sql`
        INSERT INTO credential_documents (trainer_id, document_type, ai_status, ai_notes)
        VALUES (${trainerId}, ${documentType}, 'pending', 'AI verification unavailable - manual review required')
      `;
      return NextResponse.json({
        status: 'pending_review',
        notes: 'Document uploaded. AI verification is not configured - manual review required.',
      });
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a document verification specialist for an Australian personal trainer marketplace. Analyze credential documents and return ONLY valid JSON. Today\'s date is ' + new Date().toISOString().split('T')[0],
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: DOCUMENT_PROMPTS[documentType] },
              {
                type: 'image_url',
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0,
      }),
    });

    if (!openaiResponse.ok) {
      console.error('[Verify Credential] OpenAI error:', await openaiResponse.text());
      await sql`
        INSERT INTO credential_documents (trainer_id, document_type, ai_status, ai_notes)
        VALUES (${trainerId}, ${documentType}, 'pending', 'AI verification failed - manual review required')
      `;
      return NextResponse.json({
        status: 'pending_review',
        notes: 'AI verification temporarily unavailable. Document queued for manual review.',
      });
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      aiResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { valid: false, notes: 'Could not parse AI response' };
    } catch {
      aiResult = { valid: false, notes: 'Could not parse AI response' };
    }

    const aiStatus = aiResult.valid ? 'verified' : 'rejected';
    const notes = aiResult.notes || '';

    // Store in credential_documents
    const doc = await sql`
      INSERT INTO credential_documents (
        trainer_id, document_type, document_number, issuing_authority,
        issue_date, expiry_date, ai_status, ai_notes, verified_at
      )
      VALUES (
        ${trainerId},
        ${documentType},
        ${aiResult.document_number || null},
        ${aiResult.issuing_authority || null},
        ${aiResult.issue_date || null},
        ${aiResult.expiry_date || null},
        ${aiStatus},
        ${notes},
        ${aiStatus === 'verified' ? new Date().toISOString() : null}
      )
      RETURNING *
    `;

    // Check if trainer should be marked as verified
    await updateTrainerVerifiedStatus(sql, trainerId);

    return NextResponse.json({
      status: aiStatus === 'verified' ? 'verified' : 'rejected',
      notes,
      credential: doc[0],
    });
  } catch (error) {
    console.error('[Verify Credential] Error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

async function updateTrainerVerifiedStatus(sql: ReturnType<typeof getDb>, trainerId: number) {
  // Trainer is verified if they have: (cert_iii_fitness OR cert_iv_fitness) + first_aid + cpr all verified
  const creds = await sql`
    SELECT document_type FROM credential_documents
    WHERE trainer_id = ${trainerId} AND ai_status = 'verified'
  `;

  const types = new Set(creds.map((c: Record<string, unknown>) => c.document_type));
  const hasFitnessCert = types.has('cert_iii_fitness') || types.has('cert_iv_fitness');
  const hasFirstAid = types.has('first_aid');
  const hasCpr = types.has('cpr');

  const verified = hasFitnessCert && hasFirstAid && hasCpr;

  await sql`
    UPDATE trainers SET verified = ${verified}, updated_at = NOW()
    WHERE id = ${trainerId}
  `;
}
