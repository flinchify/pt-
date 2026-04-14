import { neon } from '@neondatabase/serverless';

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

let tablesEnsured = false;

export async function ensureTables() {
  if (tablesEnsured) return;
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      phone VARCHAR(50),
      avatar_url VARCHAR(500),
      role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'trainer', 'admin', 'gym', 'enterprise')),
      google_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_sessions (
      id VARCHAR(255) PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(255),
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_codes (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      code VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS trainers (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      slug VARCHAR(255) UNIQUE,
      bio TEXT,
      specialisations TEXT[],
      certifications JSONB DEFAULT '[]',
      experience_years INTEGER DEFAULT 0,
      hourly_rate INTEGER DEFAULT 0,
      session_types TEXT[],
      travel_radius_km INTEGER DEFAULT 10,
      home_suburb VARCHAR(100),
      state VARCHAR(10),
      lat DECIMAL(10,7),
      lon DECIMAL(10,7),
      photo_url VARCHAR(500),
      gallery JSONB DEFAULT '[]',
      verified BOOLEAN DEFAULT false,
      stripe_account_id VARCHAR(255),
      avg_rating DECIMAL(2,1) DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      profile_views INTEGER DEFAULT 0,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      fitness_goals TEXT[],
      current_weight DECIMAL(5,1),
      target_weight DECIMAL(5,1),
      height_cm INTEGER,
      date_of_birth DATE,
      medical_notes TEXT,
      emergency_contact JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS client_progress (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      weight DECIMAL(5,1),
      body_fat_pct DECIMAL(4,1),
      measurements JSONB,
      photos JSONB DEFAULT '[]',
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS client_goals (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      target_value DECIMAL(10,2),
      current_value DECIMAL(10,2) DEFAULT 0,
      unit VARCHAR(50),
      target_date DATE,
      completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS gyms (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      address TEXT,
      suburb VARCHAR(100),
      state VARCHAR(10),
      postcode VARCHAR(10),
      lat DECIMAL(10,7),
      lon DECIMAL(10,7),
      phone VARCHAR(50),
      email VARCHAR(255),
      website VARCHAR(500),
      logo_url VARCHAR(500),
      photos JSONB DEFAULT '[]',
      amenities TEXT[],
      operating_hours JSONB,
      verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS gym_trainers (
      id SERIAL PRIMARY KEY,
      gym_id INTEGER REFERENCES gyms(id) ON DELETE CASCADE,
      trainer_id INTEGER REFERENCES trainers(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'removed')),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS availability_slots (
      id SERIAL PRIMARY KEY,
      trainer_id INTEGER REFERENCES trainers(id) ON DELETE CASCADE,
      day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      location_type VARCHAR(20) DEFAULT 'gym' CHECK (location_type IN ('gym', 'park', 'home', 'online')),
      gym_id INTEGER REFERENCES gyms(id) ON DELETE SET NULL,
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      trainer_id INTEGER REFERENCES trainers(id) ON DELETE CASCADE,
      gym_id INTEGER REFERENCES gyms(id) ON DELETE SET NULL,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      session_type VARCHAR(50),
      location_type VARCHAR(20),
      location_address TEXT,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
      stripe_session_id VARCHAR(255),
      amount_cents INTEGER DEFAULT 0,
      trainer_payout_cents INTEGER DEFAULT 0,
      platform_fee_cents INTEGER DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
      client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
      trainer_id INTEGER REFERENCES trainers(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      trainer_reply TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      plan VARCHAR(20) NOT NULL CHECK (plan IN ('casual', 'committed', 'unlimited', 'enterprise')),
      stripe_subscription_id VARCHAR(255),
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
      current_period_start TIMESTAMP,
      current_period_end TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS enterprises (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      company_name VARCHAR(255) NOT NULL,
      abn VARCHAR(20),
      industry VARCHAR(100),
      employee_count INTEGER,
      contact_name VARCHAR(255),
      contact_email VARCHAR(255),
      contact_phone VARCHAR(50),
      plan VARCHAR(50),
      logo_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS enterprise_employees (
      id SERIAL PRIMARY KEY,
      enterprise_id INTEGER REFERENCES enterprises(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      employee_id_ext VARCHAR(100),
      department VARCHAR(100),
      booking_limit INTEGER DEFAULT 8,
      bookings_used INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      body TEXT,
      read BOOLEAN DEFAULT false,
      data JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  tablesEnsured = true;
}
