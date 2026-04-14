# AnywherePT Build Task

You are building AnywherePT (anywherept.com.au) — Australia's marketplace for verified personal trainers. This is a FULL production build from scratch. Use the AnywhereTradie codebase at C:\Users\useco\Projects\tradies as reference for architecture patterns (Next.js 16 App Router, TypeScript, Tailwind CSS v4, Neon PostgreSQL with @neondatabase/serverless, Stripe, Resend, Framer Motion).

BRAND: AnywherePT — 'Health is Wealth' motto. Australia-only. Clean professional design (no emojis on public pages). Fonts: Plus Jakarta Sans (body) + Outfit (display). Color scheme: energetic but professional — deep teal/emerald primary, warm coral accent, clean whites.

BUILD EVERYTHING BELOW. Every file, every API route, every component. Production-ready code.

## 1. DATABASE SCHEMA (src/lib/db.ts + src/lib/ensure-tables.ts)
Auto-migrating ensureTables() pattern (same as tradies). Tables:
- users (id, email, name, phone, avatar_url, role ENUM client/trainer/admin/gym/enterprise, google_id, created_at, updated_at)
- auth_sessions (id, user_id, token, expires_at, created_at)
- auth_codes (id, email, code, expires_at, used, created_at)
- trainers (id, user_id, slug, bio, specialisations TEXT[], certifications JSONB, experience_years, hourly_rate, session_types TEXT[], travel_radius_km, home_suburb, state, lat, lon, photo_url, gallery JSONB, verified, stripe_account_id, avg_rating, review_count, profile_views, status active/pending/suspended, created_at, updated_at)
- clients (id, user_id, fitness_goals TEXT[], current_weight, target_weight, height_cm, date_of_birth, medical_notes, emergency_contact JSONB, created_at, updated_at)
- client_progress (id, client_id, date, weight, body_fat_pct, measurements JSONB, photos JSONB, notes, created_at)
- client_goals (id, client_id, title, description, target_value, current_value, unit, target_date, completed, created_at, updated_at)
- gyms (id, user_id, name, slug, address, suburb, state, postcode, lat, lon, phone, email, website, logo_url, photos JSONB, amenities TEXT[], operating_hours JSONB, verified, created_at, updated_at)
- gym_trainers (id, gym_id, trainer_id, status active/pending/removed, created_at)
- availability_slots (id, trainer_id, day_of_week 0-6, start_time TIME, end_time TIME, location_type gym/park/home/online, gym_id nullable, address nullable, created_at)
- bookings (id, client_id, trainer_id, gym_id nullable, date DATE, start_time TIME, end_time TIME, session_type TEXT, location_type, location_address, status pending/confirmed/completed/cancelled/no_show, stripe_session_id, amount_cents, trainer_payout_cents, platform_fee_cents, notes, created_at, updated_at)
- reviews (id, booking_id, client_id, trainer_id, rating 1-5, comment, trainer_reply, created_at)
- subscriptions (id, user_id, plan casual/committed/unlimited/enterprise, stripe_subscription_id, status active/cancelled/past_due, current_period_start, current_period_end, created_at, updated_at)
- enterprises (id, user_id, company_name, abn, industry, employee_count, contact_name, contact_email, contact_phone, plan, logo_url, created_at, updated_at)
- enterprise_employees (id, enterprise_id, user_id, employee_id_ext, department, booking_limit, bookings_used, created_at)
- notifications (id, user_id, type, title, body, read, data JSONB, created_at)
- newsletter_subscribers (id, email, created_at)
- contact_submissions (id, name, email, phone, subject, message, created_at)

## 2. AUTH (src/app/api/auth/*)
- /api/auth/google + /api/auth/google/callback — Google OAuth (same pattern as tradies)
- /api/auth/login — email+code send via Resend
- /api/auth/verify — verify code, create session
- /api/auth/session — get current session
- /api/auth/logout — destroy session
- AuthProvider context in src/components/auth-provider.tsx

## 3. API ROUTES (src/app/api/*)
- /api/trainers — GET (browse/search with filters: specialisation, location, price range, rating, availability)
- /api/trainers/[id] — GET/PATCH trainer profile
- /api/trainers/[id]/availability — GET/POST/DELETE availability slots
- /api/trainers/[id]/reviews — GET reviews
- /api/trainers/[id]/gallery — POST/DELETE gallery photos
- /api/trainers/[id]/stripe-connect — POST onboard to Stripe Connect
- /api/clients/me — GET/PATCH client profile
- /api/clients/me/progress — GET/POST progress entries
- /api/clients/me/goals — GET/POST/PATCH/DELETE goals
- /api/clients/me/bookings — GET booking history
- /api/gyms — GET (browse) / POST (register)
- /api/gyms/[id] — GET/PATCH
- /api/gyms/[id]/trainers — GET/POST/DELETE gym-trainer relationships
- /api/bookings — POST create booking (with Stripe Checkout)
- /api/bookings/[id] — GET/PATCH (cancel, complete, no-show)
- /api/subscriptions — GET/POST (create Stripe subscription)
- /api/subscriptions/cancel — POST
- /api/enterprise/register — POST
- /api/enterprise/employees — GET/POST/DELETE
- /api/enterprise/bookings — GET (usage reports)
- /api/stripe/webhooks — handle checkout.session.completed, invoice.paid, customer.subscription.updated/deleted, account.updated
- /api/newsletter — POST subscribe
- /api/contact — POST contact form
- /api/admin/stats — GET dashboard stats
- /api/admin/accounts — GET all users
- /api/admin/trainers — GET/PATCH (approve/suspend trainers)
- /api/admin/gyms — GET/PATCH
- /api/admin/bookings — GET all bookings
- /api/admin/revenue — GET revenue analytics
- /api/seed — POST seed 30 realistic Australian trainers across Sydney/Melbourne/Brisbane/Perth/Adelaide with real-sounding names, proper suburbs, varied specialisations (strength, HIIT, yoga, pilates, boxing, CrossFit, rehabilitation, sports performance, pre/post natal, senior fitness, weight loss, functional training)

## 4. PUBLIC PAGES
### Homepage (src/app/page.tsx)
- Hero: 'Health is Wealth' — bold headline, search bar (location + specialisation), CTA buttons
- How It Works: 3 steps (Find → Book → Train)
- Featured Trainers carousel (real data from DB)
- Stats bar (trainers, sessions, cities)
- Testimonials
- For Trainers CTA section
- For Gyms CTA section
- Enterprise CTA section
- Newsletter signup footer

### /trainers (Browse)
- Search/filter sidebar: location (suburb/postcode), specialisation multi-select, price range slider, rating filter, session type (in-person/online/both), availability day filter
- Trainer cards: photo, name, specialisations, rating, price, suburb, verified badge
- Map view toggle (placeholder for Google Maps)
- Pagination

### /trainer/[slug] (Public Profile)
- Hero with cover photo, avatar, name, verified badge
- Bio, experience, specialisations tags
- Gallery lightbox
- Certifications list
- Session types & pricing
- Availability calendar (weekly view)
- Reviews with ratings
- Book Now CTA (sticky)
- Share button, QR code

### /book (Booking Flow)
- Step 1: Select session type
- Step 2: Choose date/time from availability
- Step 3: Choose location (trainer's gym, specific gym, park, home, online)
- Step 4: Review & Pay (Stripe Checkout)
- /book/success and /book/cancel pages

### /pricing
- 3 tiers: Casual (pay per session), Committed ($149/mo - 8 sessions), Unlimited ($249/mo)
- Enterprise section with 'Contact Us'
- Feature comparison table
- FAQ

### /for-trainers
- Why join, earnings calculator, how verification works, testimonials from trainers, CTA to register

### /for-gyms
- Benefits: extra foot traffic, trainer management, booking integration
- How it works, CTA to register gym

### /enterprise
- 'Health is Wealth — For Your Team' hero
- Benefits: reduced sick days, productivity, team building
- How it works: company signs up → employees get accounts → book trainers → company gets reports
- ROI calculator (simple)
- Plans: Starter (up to 50 employees), Growth (up to 200), Enterprise (unlimited + dedicated account manager)
- Contact form / demo request

### /about, /contact, /terms, /privacy, /faq

## 5. DASHBOARDS

### Client Dashboard (/dashboard)
- Overview: upcoming sessions, progress snapshot, favourite trainers, goals
- /dashboard/bookings — history with status, review button
- /dashboard/progress — weight chart (simple SVG), body measurements, progress photos, add entry form
- /dashboard/goals — CRUD goals with progress bars, target dates
- /dashboard/settings — profile edit, medical info, emergency contact

### Trainer Dashboard (/trainer/dashboard)
- Overview: today's schedule, earnings this month, pending bookings, rating
- /trainer/dashboard/calendar — week/day view of bookings + availability management
- /trainer/dashboard/clients — list of clients with session history
- /trainer/dashboard/earnings — earnings chart, payout history, Stripe Connect status
- /trainer/dashboard/profile — edit bio, specialisations, gallery, certifications
- /trainer/dashboard/reviews — view reviews, reply
- /trainer/dashboard/settings — account settings, notification preferences

### Gym Dashboard (/gym/dashboard)
- Overview: active trainers, bookings at gym, revenue
- /gym/dashboard/trainers — manage trainer relationships (invite/remove)
- /gym/dashboard/bookings — bookings at this gym
- /gym/dashboard/settings — gym profile, hours, amenities, photos

### Enterprise Dashboard (/enterprise/dashboard)
- Overview: active employees, sessions this month, budget usage
- /enterprise/dashboard/employees — add/remove employees, set booking limits
- /enterprise/dashboard/reports — usage by department, most active employees, cost breakdown
- /enterprise/dashboard/settings — company settings, billing

### Admin Panel (/admin)
- Admin login with ADMIN_SECRET
- /admin — stats overview (users, trainers, gyms, bookings, revenue)
- /admin/accounts — all users with role filter
- /admin/trainers — verify/suspend trainers, view credentials
- /admin/gyms — verify/manage gyms
- /admin/bookings — all bookings with filters
- /admin/revenue — revenue charts, platform fees, trainer payouts
- /admin/compliance — trainer cert expiry tracking

## 6. COMPONENTS (src/components/)
- Header with auth state (same pattern as tradies AuthProvider)
- Footer with newsletter, links, 'Health is Wealth' tagline
- TrainerCard, GymCard, BookingCard
- ReviewStars, ProgressChart, GoalProgressBar
- AvailabilityCalendar, BookingCalendar
- SearchFilters, PriceRangeSlider
- Modal, Toast, LoadingSpinner
- All with Framer Motion animations

## 7. CONFIG
- package.json with: next@16, react@19, @neondatabase/serverless, stripe, resend, framer-motion, sharp, uuid
- tailwind.config.ts with custom colors (teal/emerald/coral palette)
- next.config.ts
- tsconfig.json
- .env.example with all needed vars
- .gitignore

## 8. SEO
- Metadata on every page (title, description, OG tags)
- sitemap.xml route
- robots.txt route
- JSON-LD structured data (Organization, WebSite, LocalBusiness for gyms)

## 9. SEED DATA
The /api/seed route should create 30 trainers with realistic Australian data — real suburb names, proper specialisations, varied pricing ($60-$150/hr), review data, gallery placeholder URLs. Also seed 5 gyms in major cities.

IMPORTANT NOTES:
- Australia-only — all addresses, phone numbers (+61), ABNs, suburbs are Australian
- Stripe is AUD
- No emojis on any public-facing page
- Use ensureTables() auto-migration pattern — NO separate migration files
- Every API route must call ensureTables() before DB queries
- Cookie-based auth sessions (same as tradies)
- Mobile-first responsive design
- Professional, clean, Stripe-quality design
- Use the exact same lib/db.ts connection pattern as tradies
- Tailwind v4 (import in globals.css, not tailwind.config.js — use @theme inline)

Build EVERY file. Do not skip any. Do not use placeholder comments like 'implement later'. Every route, every page, every component must be fully functional.

When completely finished, run this command to notify me:
openclaw system event --text "Done: Built entire AnywherePT platform" --mode now
