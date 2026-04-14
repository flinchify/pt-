import { NextRequest, NextResponse } from 'next/server';
import { getDb, ensureTables } from '@/lib/db';

const TRAINERS = [
  { name: 'Liam Mitchell', email: 'liam.mitchell@anywherept.dev', suburb: 'Bondi', state: 'NSW', specialisations: ['strength', 'HIIT', 'weight loss'], bio: 'Certified strength and conditioning specialist with 12 years of experience helping clients transform their bodies. Former NRL athlete turned personal trainer, specialising in high-intensity programs that deliver real results.', hourly_rate: 120, experience_years: 12, session_types: ['in-person', 'online'], photo: 'photo-1567013127542-490d757e51fc', rating: 4.8, reviews: 67 },
  { name: 'Sophie Chen', email: 'sophie.chen@anywherept.dev', suburb: 'Surry Hills', state: 'NSW', specialisations: ['yoga', 'pilates', 'functional training'], bio: 'Yoga and Pilates instructor passionate about mindful movement and holistic wellness. I help busy professionals find balance through targeted flexibility and core programs.', hourly_rate: 95, experience_years: 8, session_types: ['in-person', 'online', 'both'], photo: 'photo-1518611012118-696072aa579a', rating: 4.9, reviews: 54 },
  { name: 'Jack O\'Brien', email: 'jack.obrien@anywherept.dev', suburb: 'Manly', state: 'NSW', specialisations: ['boxing', 'HIIT', 'strength'], bio: 'Former amateur boxing champion bringing combat fitness to everyday athletes. My sessions combine boxing technique with high-intensity conditioning for a full-body workout.', hourly_rate: 110, experience_years: 10, session_types: ['in-person'], photo: 'photo-1583454110551-21f2fa2afe61', rating: 4.7, reviews: 42 },
  { name: 'Emma Watson-Smith', email: 'emma.ws@anywherept.dev', suburb: 'Mosman', state: 'NSW', specialisations: ['pre/post natal', 'pilates', 'rehabilitation'], bio: 'Specialist in pre and postnatal fitness with clinical Pilates qualifications. I support women through every stage of motherhood with safe, effective exercise programs.', hourly_rate: 130, experience_years: 15, session_types: ['in-person', 'online'], photo: 'photo-1571019613454-1cb2f99b2d8b', rating: 5.0, reviews: 38 },
  { name: 'Marcus Thompson', email: 'marcus.t@anywherept.dev', suburb: 'Newtown', state: 'NSW', specialisations: ['CrossFit', 'strength', 'sports performance'], bio: 'CrossFit Level 3 trainer and competitive athlete. I design scalable programs that challenge beginners and advanced athletes alike, focusing on functional fitness and performance.', hourly_rate: 105, experience_years: 7, session_types: ['in-person'], photo: 'photo-1534438327276-14e5300c3a48', rating: 4.6, reviews: 29 },
  { name: 'Olivia Patel', email: 'olivia.patel@anywherept.dev', suburb: 'South Yarra', state: 'VIC', specialisations: ['weight loss', 'functional training', 'HIIT'], bio: 'Dedicated to helping clients achieve sustainable weight loss through balanced nutrition guidance and progressive training programs. No fads, just science-backed results.', hourly_rate: 100, experience_years: 9, session_types: ['in-person', 'online'], photo: 'photo-1548690312-e3b507d8c110', rating: 4.8, reviews: 55 },
  { name: 'Daniel Kim', email: 'daniel.kim@anywherept.dev', suburb: 'Fitzroy', state: 'VIC', specialisations: ['strength', 'sports performance', 'functional training'], bio: 'Sports science graduate specialising in athletic performance and injury prevention. I work with weekend warriors and competitive athletes to unlock their full potential.', hourly_rate: 115, experience_years: 6, session_types: ['in-person', 'both'], photo: 'photo-1526506118085-60ce8714f8c5', rating: 4.7, reviews: 31 },
  { name: 'Sarah McAllister', email: 'sarah.m@anywherept.dev', suburb: 'St Kilda', state: 'VIC', specialisations: ['yoga', 'rehabilitation', 'senior fitness'], bio: 'Therapeutic yoga and rehabilitation specialist helping clients recover from injury and manage chronic pain. Gentle, effective approaches tailored to individual needs.', hourly_rate: 90, experience_years: 14, session_types: ['in-person', 'online'], photo: 'photo-1544367567-0f2fcb009e0b', rating: 4.9, reviews: 72 },
  { name: 'Tom Bradley', email: 'tom.bradley@anywherept.dev', suburb: 'Richmond', state: 'VIC', specialisations: ['HIIT', 'boxing', 'weight loss'], bio: 'High-energy trainer who makes every session count. My HIIT and boxing-inspired workouts are designed to maximise calorie burn and build functional strength.', hourly_rate: 95, experience_years: 5, session_types: ['in-person'], photo: 'photo-1581009146145-b5ef050c2e1e', rating: 4.5, reviews: 23 },
  { name: 'Natalie Russo', email: 'natalie.russo@anywherept.dev', suburb: 'Brighton', state: 'VIC', specialisations: ['pilates', 'pre/post natal', 'functional training'], bio: 'Clinical Pilates practitioner with a focus on women\'s health and postnatal recovery. I combine movement science with practical, enjoyable exercise programming.', hourly_rate: 125, experience_years: 11, session_types: ['in-person', 'online'], photo: 'photo-1518310383802-640c2de311b2', rating: 4.8, reviews: 46 },
  { name: 'Ryan Nguyen', email: 'ryan.nguyen@anywherept.dev', suburb: 'Paddington', state: 'QLD', specialisations: ['strength', 'CrossFit', 'sports performance'], bio: 'Strength and conditioning coach with a background in competitive powerlifting. I help clients build raw strength, improve body composition, and develop athletic capacity.', hourly_rate: 100, experience_years: 8, session_types: ['in-person', 'both'], photo: 'photo-1574680096145-d05b474e2155', rating: 4.7, reviews: 37 },
  { name: 'Chloe Anderson', email: 'chloe.anderson@anywherept.dev', suburb: 'New Farm', state: 'QLD', specialisations: ['yoga', 'functional training', 'weight loss'], bio: 'Vinyasa yoga teacher and functional fitness coach. I blend Eastern and Western training philosophies to create programs that strengthen both body and mind.', hourly_rate: 85, experience_years: 6, session_types: ['in-person', 'online'], photo: 'photo-1506126613408-eca07ce68773', rating: 4.6, reviews: 28 },
  { name: 'James Cooper', email: 'james.cooper@anywherept.dev', suburb: 'Bulimba', state: 'QLD', specialisations: ['HIIT', 'strength', 'functional training'], bio: 'Outdoor fitness specialist who takes training beyond the gym walls. Park sessions, beach workouts, and functional training that keeps things fresh and fun.', hourly_rate: 90, experience_years: 4, session_types: ['in-person'], photo: 'photo-1597347316205-36f6c451902a', rating: 4.4, reviews: 18 },
  { name: 'Isabella Martinez', email: 'isabella.m@anywherept.dev', suburb: 'West End', state: 'QLD', specialisations: ['pilates', 'rehabilitation', 'senior fitness'], bio: 'Rehabilitation-focused Pilates instructor helping clients recover mobility and build resilience. Experienced with post-surgical recovery and chronic condition management.', hourly_rate: 110, experience_years: 13, session_types: ['in-person', 'online'], photo: 'photo-1607962837359-5e7e89f86776', rating: 4.9, reviews: 61 },
  { name: 'Ben Harris', email: 'ben.harris@anywherept.dev', suburb: 'Fortitude Valley', state: 'QLD', specialisations: ['boxing', 'HIIT', 'weight loss'], bio: 'Professional boxing coach turned fitness trainer. I channel the discipline and intensity of fight training into sessions that get results for everyone.', hourly_rate: 100, experience_years: 9, session_types: ['in-person', 'both'], photo: 'photo-1549476464-37392f717541', rating: 4.6, reviews: 33 },
  { name: 'Grace Williams', email: 'grace.williams@anywherept.dev', suburb: 'Subiaco', state: 'WA', specialisations: ['yoga', 'pilates', 'pre/post natal'], bio: 'Holistic wellness practitioner combining yoga and Pilates for complete mind-body transformation. Specialist in prenatal yoga and postpartum recovery programs.', hourly_rate: 95, experience_years: 10, session_types: ['in-person', 'online'], photo: 'photo-1518459031867-a89b944bffe4', rating: 4.8, reviews: 49 },
  { name: 'Ethan Clarke', email: 'ethan.clarke@anywherept.dev', suburb: 'Fremantle', state: 'WA', specialisations: ['strength', 'functional training', 'sports performance'], bio: 'Functional strength coach passionate about helping people move better and live stronger. My evidence-based approach focuses on compound movements and progressive overload.', hourly_rate: 105, experience_years: 7, session_types: ['in-person'], photo: 'photo-1580261450046-d0a30080dc9b', rating: 4.5, reviews: 22 },
  { name: 'Mia Taylor', email: 'mia.taylor@anywherept.dev', suburb: 'Cottesloe', state: 'WA', specialisations: ['HIIT', 'weight loss', 'functional training'], bio: 'Beach fitness enthusiast specialising in outdoor HIIT sessions. I combine cardio conditioning with strength work for a complete fitness transformation.', hourly_rate: 85, experience_years: 4, session_types: ['in-person', 'both'], photo: 'photo-1609899517237-895be47ad45b', rating: 4.4, reviews: 15 },
  { name: 'Noah Johnson', email: 'noah.johnson@anywherept.dev', suburb: 'Leederville', state: 'WA', specialisations: ['CrossFit', 'strength', 'HIIT'], bio: 'CrossFit affiliate owner and competitive athlete. I bring the community spirit of CrossFit to personal training, creating programs that are challenging, varied, and effective.', hourly_rate: 110, experience_years: 8, session_types: ['in-person'], photo: 'photo-1517836357463-d25dfeac3438', rating: 4.7, reviews: 40 },
  { name: 'Zoe Campbell', email: 'zoe.campbell@anywherept.dev', suburb: 'Mount Lawley', state: 'WA', specialisations: ['rehabilitation', 'senior fitness', 'functional training'], bio: 'Exercise physiologist specialising in rehabilitation and senior fitness. I help older adults maintain independence and quality of life through targeted exercise.', hourly_rate: 120, experience_years: 16, session_types: ['in-person', 'online'], photo: 'photo-1518310383802-640c2de311b2', rating: 4.9, reviews: 58 },
  { name: 'Alexander Papadopoulos', email: 'alex.p@anywherept.dev', suburb: 'Glenelg', state: 'SA', specialisations: ['strength', 'sports performance', 'functional training'], bio: 'Strength and performance coach working with athletes across multiple sports. My training methodology combines Olympic lifting, plyometrics, and sport-specific conditioning.', hourly_rate: 115, experience_years: 11, session_types: ['in-person', 'both'], photo: 'photo-1532384748853-8f54a8f476e2', rating: 4.7, reviews: 35 },
  { name: 'Hannah Reid', email: 'hannah.reid@anywherept.dev', suburb: 'Norwood', state: 'SA', specialisations: ['yoga', 'pilates', 'weight loss'], bio: 'Mind-body fitness specialist combining yoga, Pilates, and nutritional coaching for sustainable transformations. I believe in building healthy habits that last a lifetime.', hourly_rate: 90, experience_years: 7, session_types: ['in-person', 'online'], photo: 'photo-1575052814086-f385e2e2ad33', rating: 4.6, reviews: 27 },
  { name: 'Luke Fitzgerald', email: 'luke.fitz@anywherept.dev', suburb: 'Unley', state: 'SA', specialisations: ['boxing', 'HIIT', 'strength'], bio: 'Boxing and combat fitness trainer with 15 years in martial arts. My sessions blend technique with high-intensity conditioning for incredible fitness gains.', hourly_rate: 100, experience_years: 15, session_types: ['in-person'], photo: 'photo-1594381898411-846e7d193883', rating: 4.8, reviews: 44 },
  { name: 'Amelia Scott', email: 'amelia.scott@anywherept.dev', suburb: 'North Adelaide', state: 'SA', specialisations: ['pre/post natal', 'pilates', 'rehabilitation'], bio: 'Women\'s health and Pilates specialist with extensive experience in prenatal and postnatal exercise prescription. Safe, supportive, and empowering training for all stages.', hourly_rate: 130, experience_years: 12, session_types: ['in-person', 'online'], photo: 'photo-1518611012118-696072aa579a', rating: 5.0, reviews: 52 },
  { name: 'Oscar Brown', email: 'oscar.brown@anywherept.dev', suburb: 'Cronulla', state: 'NSW', specialisations: ['functional training', 'weight loss', 'HIIT'], bio: 'Outdoor fitness trainer specialising in beach and park workouts. I create fun, challenging sessions that use natural environments to build real-world fitness.', hourly_rate: 80, experience_years: 3, session_types: ['in-person'], photo: 'photo-1571019614242-c5c5dee9f50b', rating: 4.3, reviews: 12 },
  { name: 'Charlotte Evans', email: 'charlotte.e@anywherept.dev', suburb: 'Coogee', state: 'NSW', specialisations: ['yoga', 'senior fitness', 'rehabilitation'], bio: 'Gentle yoga and movement specialist for seniors and those recovering from injury. My classes focus on improving mobility, balance, and confidence.', hourly_rate: 85, experience_years: 9, session_types: ['in-person', 'online'], photo: 'photo-1544367567-0f2fcb009e0b', rating: 4.7, reviews: 34 },
  { name: 'William Tan', email: 'william.tan@anywherept.dev', suburb: 'Toorak', state: 'VIC', specialisations: ['strength', 'weight loss', 'functional training'], bio: 'Premium personal training experience for discerning clients. I combine cutting-edge training science with luxury service to deliver exceptional results.', hourly_rate: 150, experience_years: 18, session_types: ['in-person'], photo: 'photo-1581009146145-b5ef050c2e1e', rating: 4.9, reviews: 78 },
  { name: 'Lily Morgan', email: 'lily.morgan@anywherept.dev', suburb: 'Hawthorn', state: 'VIC', specialisations: ['HIIT', 'pilates', 'weight loss'], bio: 'Dynamic fitness coach blending high-intensity training with Pilates recovery sessions. My balanced approach helps clients achieve results without burnout.', hourly_rate: 95, experience_years: 5, session_types: ['in-person', 'online', 'both'], photo: 'photo-1548690312-e3b507d8c110', rating: 4.5, reviews: 21 },
  { name: 'Sam Whitfield', email: 'sam.whitfield@anywherept.dev', suburb: 'Ascot', state: 'QLD', specialisations: ['CrossFit', 'strength', 'sports performance'], bio: 'Former professional rugby player now coaching others to elite fitness levels. My programs combine athletic conditioning with practical strength training.', hourly_rate: 120, experience_years: 10, session_types: ['in-person', 'both'], photo: 'photo-1534438327276-14e5300c3a48', rating: 4.8, reviews: 47 },
  { name: 'Ruby Zhang', email: 'ruby.zhang@anywherept.dev', suburb: 'Prospect', state: 'SA', specialisations: ['yoga', 'functional training', 'senior fitness'], bio: 'Certified yoga therapist and functional movement specialist. I create personalised programs that address individual needs, from stress management to pain relief.', hourly_rate: 90, experience_years: 8, session_types: ['in-person', 'online'], photo: 'photo-1506126613408-eca07ce68773', rating: 4.6, reviews: 25 },
];

const GYMS = [
  {
    name: 'Iron House Fitness',
    email: 'info@ironhousefitness.com.au',
    suburb: 'Surry Hills',
    state: 'NSW',
    postcode: '2010',
    address: '123 Crown Street, Surry Hills NSW 2010',
    phone: '02 9123 4567',
    amenities: ['weights', 'cardio machines', 'group fitness studio', 'showers', 'lockers', 'sauna', 'personal training area'],
    operating_hours: { mon_fri: '5:00 AM - 10:00 PM', sat: '6:00 AM - 8:00 PM', sun: '7:00 AM - 6:00 PM' },
  },
  {
    name: 'Bayside Strength Lab',
    email: 'hello@baysidestrength.com.au',
    suburb: 'St Kilda',
    state: 'VIC',
    postcode: '3182',
    address: '45 Acland Street, St Kilda VIC 3182',
    phone: '03 9876 5432',
    amenities: ['Olympic lifting platforms', 'squat racks', 'kettlebells', 'battle ropes', 'boxing ring', 'recovery room'],
    operating_hours: { mon_fri: '5:30 AM - 9:30 PM', sat: '6:00 AM - 6:00 PM', sun: '7:00 AM - 4:00 PM' },
  },
  {
    name: 'River City Athletic',
    email: 'train@rivercityathletic.com.au',
    suburb: 'Fortitude Valley',
    state: 'QLD',
    postcode: '4006',
    address: '88 Brunswick Street, Fortitude Valley QLD 4006',
    phone: '07 3456 7890',
    amenities: ['CrossFit rig', 'turf sprint track', 'cardio zone', 'yoga studio', 'juice bar', 'childcare'],
    operating_hours: { mon_fri: '5:00 AM - 9:00 PM', sat: '6:00 AM - 5:00 PM', sun: '7:00 AM - 3:00 PM' },
  },
  {
    name: 'West Coast Performance',
    email: 'info@westcoastperformance.com.au',
    suburb: 'Subiaco',
    state: 'WA',
    postcode: '6008',
    address: '22 Rokeby Road, Subiaco WA 6008',
    phone: '08 6234 5678',
    amenities: ['functional training zone', 'Pilates reformers', 'swimming pool', 'spa', 'physio clinic', 'cafe'],
    operating_hours: { mon_fri: '5:00 AM - 10:00 PM', sat: '6:00 AM - 7:00 PM', sun: '6:00 AM - 5:00 PM' },
  },
  {
    name: 'Adelaide Elite Training',
    email: 'contact@adelaideelite.com.au',
    suburb: 'Norwood',
    state: 'SA',
    postcode: '5067',
    address: '156 The Parade, Norwood SA 5067',
    phone: '08 8345 6789',
    amenities: ['strength area', 'cardio deck', 'boxing studio', 'outdoor training yard', 'showers', 'supplement shop'],
    operating_hours: { mon_fri: '5:30 AM - 9:00 PM', sat: '6:00 AM - 6:00 PM', sun: '7:00 AM - 4:00 PM' },
  },
];

const REVIEW_COMMENTS = [
  'Absolutely fantastic trainer! Really knows their stuff and pushes you just the right amount.',
  'Great session, felt challenged but supported throughout. Will definitely be back.',
  'Best PT I\'ve ever had. The program is tailored perfectly to my goals.',
  'Highly recommend! Very professional and the results speak for themselves.',
  'Amazing energy and motivation. Every session is different and engaging.',
  'Really knowledgeable about form and technique. I feel much safer lifting now.',
  'Helped me through a tough rehab period. Patient, encouraging, and skilled.',
  'Love the outdoor sessions! So much better than being stuck in a gym.',
  'Great value for money. The online sessions are just as good as in-person.',
  'Incredible transformation in just 3 months. Cannot thank them enough.',
  'Very accommodating with scheduling and always on time. A true professional.',
  'The nutrition advice alongside training has been a game changer for me.',
  'Fun, energetic sessions that fly by. I actually look forward to training days now.',
  'Perfect for beginners. Made me feel comfortable from day one.',
  'Tough but fair. Exactly what I needed to break through my plateau.',
];

export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    const sql = getDb();

    // Create trainer users and trainer records
    const trainerIds: number[] = [];

    for (const t of TRAINERS) {
      // Create user
      const existingUser = await sql`SELECT id FROM users WHERE email = ${t.email}`;
      let userId: number;

      if (existingUser.length > 0) {
        userId = existingUser[0].id;
      } else {
        const user = await sql`
          INSERT INTO users (email, name, role)
          VALUES (${t.email}, ${t.name}, 'trainer')
          RETURNING id
        `;
        userId = user[0].id;
      }

      // Create trainer
      const existingTrainer = await sql`SELECT id FROM trainers WHERE user_id = ${userId}`;
      let trainerId: number;
      const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (existingTrainer.length > 0) {
        trainerId = existingTrainer[0].id;
        await sql`
          UPDATE trainers SET
            slug = ${slug},
            bio = ${t.bio},
            specialisations = ${t.specialisations},
            experience_years = ${t.experience_years},
            hourly_rate = ${t.hourly_rate},
            session_types = ${t.session_types},
            travel_radius_km = ${Math.floor(Math.random() * 20) + 5},
            home_suburb = ${t.suburb},
            state = ${t.state},
            photo_url = ${'https://images.unsplash.com/' + t.photo + '?w=400&h=400&fit=crop'},
            avg_rating = ${t.rating},
            review_count = ${t.reviews},
            status = 'active',
            updated_at = NOW()
          WHERE id = ${trainerId}
        `;
      } else {
        const trainer = await sql`
          INSERT INTO trainers (user_id, slug, bio, specialisations, experience_years, hourly_rate, session_types, travel_radius_km, home_suburb, state, photo_url, avg_rating, review_count, status)
          VALUES (${userId}, ${slug}, ${t.bio}, ${t.specialisations}, ${t.experience_years}, ${t.hourly_rate}, ${t.session_types}, ${Math.floor(Math.random() * 20) + 5}, ${t.suburb}, ${t.state}, ${'https://images.unsplash.com/' + t.photo + '?w=400&h=400&fit=crop'}, ${t.rating}, ${t.reviews}, 'active')
          RETURNING id
        `;
        trainerId = trainer[0].id;
      }

      trainerIds.push(trainerId);
    }

    // Create gym users and gym records
    const gymIds: number[] = [];

    for (const g of GYMS) {
      const existingUser = await sql`SELECT id FROM users WHERE email = ${g.email}`;
      let userId: number;

      if (existingUser.length > 0) {
        userId = existingUser[0].id;
      } else {
        const user = await sql`
          INSERT INTO users (email, name, role)
          VALUES (${g.email}, ${g.name}, 'gym')
          RETURNING id
        `;
        userId = user[0].id;
      }

      const slug = g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existingGym = await sql`SELECT id FROM gyms WHERE user_id = ${userId}`;
      let gymId: number;

      if (existingGym.length > 0) {
        gymId = existingGym[0].id;
      } else {
        const gym = await sql`
          INSERT INTO gyms (user_id, name, slug, address, suburb, state, postcode, phone, email, amenities, operating_hours, verified)
          VALUES (${userId}, ${g.name}, ${slug}, ${g.address}, ${g.suburb}, ${g.state}, ${g.postcode}, ${g.phone}, ${g.email}, ${g.amenities}, ${JSON.stringify(g.operating_hours)}, true)
          RETURNING id
        `;
        gymId = gym[0].id;
      }

      gymIds.push(gymId);
    }

    // Create some client users for reviews
    const clientIds: number[] = [];
    const clientNames = ['Alex Murphy', 'Jessica Lee', 'Michael Chen', 'Sarah Davis', 'Chris Wilson', 'Emily Brown', 'David Park', 'Rachel Green', 'Matt Johnson', 'Kate Taylor'];

    for (let i = 0; i < clientNames.length; i++) {
      const clientEmail = `client${i + 1}@anywherept.dev`;
      const existingUser = await sql`SELECT id FROM users WHERE email = ${clientEmail}`;
      let userId: number;

      if (existingUser.length > 0) {
        userId = existingUser[0].id;
      } else {
        const user = await sql`
          INSERT INTO users (email, name, role)
          VALUES (${clientEmail}, ${clientNames[i]}, 'client')
          RETURNING id
        `;
        userId = user[0].id;
      }

      const existingClient = await sql`SELECT id FROM clients WHERE user_id = ${userId}`;
      if (existingClient.length > 0) {
        clientIds.push(existingClient[0].id);
      } else {
        const client = await sql`
          INSERT INTO clients (user_id)
          VALUES (${userId})
          RETURNING id
        `;
        clientIds.push(client[0].id);
      }
    }

    // Seed reviews for trainers
    let reviewCount = 0;
    for (let ti = 0; ti < trainerIds.length; ti++) {
      const trainerId = trainerIds[ti];
      const numReviews = Math.floor(Math.random() * 5) + 2;

      // Check existing reviews
      const existingReviews = await sql`SELECT COUNT(*) as cnt FROM reviews WHERE trainer_id = ${trainerId}`;
      if (parseInt(existingReviews[0].cnt) > 0) continue;

      for (let r = 0; r < numReviews; r++) {
        const clientId = clientIds[Math.floor(Math.random() * clientIds.length)];
        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5
        const comment = REVIEW_COMMENTS[Math.floor(Math.random() * REVIEW_COMMENTS.length)];

        await sql`
          INSERT INTO reviews (client_id, trainer_id, rating, comment)
          VALUES (${clientId}, ${trainerId}, ${rating}, ${comment})
        `;
        reviewCount++;
      }
    }

    return NextResponse.json({
      success: true,
      seeded: {
        trainers: trainerIds.length,
        gyms: gymIds.length,
        clients: clientIds.length,
        reviews: reviewCount,
      },
    });
  } catch (error) {
    console.error('[Seed] Error:', error);
    return NextResponse.json({ error: 'Seed failed', details: String(error) }, { status: 500 });
  }
}
