import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'AnywherePT — Health is Wealth';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const logoPath = join(process.cwd(), 'public', 'logo.png');
  const logoData = await readFile(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A1F1B 0%, #0A4830 40%, #0A6847 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <img
          src={logoBase64}
          width={300}
          height={300}
          style={{ objectFit: 'contain' }}
        />
        <div
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#22C55E',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            marginTop: '24px',
          }}
        >
          Health is Wealth
        </div>
        <div
          style={{
            fontSize: '20px',
            color: '#99F6E4',
            marginTop: '12px',
          }}
        >
          Find Verified Personal Trainers Near You
        </div>
      </div>
    ),
    { ...size },
  );
}
