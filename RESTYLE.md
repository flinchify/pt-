# AnywherePT Restyle Task

## Logo
The logo file is at `public/logo.png` — it's the green "APT" lettermark (bold, italic, green outline on white). Use it in the header and favicon area.

## Design Reference: https://home.medvi.org/
Copy the overall design language of Medvi:

### Key Design Elements from Medvi:
1. **Dark gradient hero** — deep dark green/teal gradient at the top with white text, smooth flowing background
2. **Pill-shaped category buttons** — row of clickable pill buttons below hero (like "Weight Loss", "Peptides" etc)
3. **Clean white content sections** — alternating white/light gray backgrounds
4. **Card-based layouts** — rounded cards with subtle shadows
5. **Section labels** — small uppercase colored labels above section headings (like "###### Doctor-guided GLP-1 care")
6. **Large bold headings** — big section titles with supporting paragraph text
7. **CTA buttons** — rounded pill buttons, primary green color
8. **Testimonial cards** — clean cards with quotes and names
9. **Stats/badges** — small pill badges showing metrics
10. **Smooth scroll sections** — each section is a full viewport or near-full height
11. **Modern sans-serif typography** — clean, professional
12. **Subtle animations** — fade-in on scroll

### Color Palette (adapted for AnywherePT):
- Primary: Deep green (#0A6847 to #16A34A range — matching the APT logo green)
- Dark hero gradient: Very dark green/black (#0A1F1B → #0A6847)
- Accent: Light green for highlights
- Backgrounds: White (#FFFFFF) and very light gray (#F8FAF9)
- Text: White on dark sections, dark gray (#1A1A1A) on light sections
- NO coral/teal — keep it green to match the logo

### Fitness/PT Images to Use
Use Unsplash images via URL (https://images.unsplash.com/...) for:
1. Hero background: Dark gym/training atmosphere photo with overlay
2. Personal training session (trainer with client)
3. Outdoor training (park workout)
4. Group fitness class
5. Gym interior
6. Woman doing yoga/pilates
7. Man lifting weights
8. Before/after transformation concept
9. Corporate/office wellness
10. Boxing/HIIT training

Good Unsplash photo IDs for fitness:
- photo-1534438327276-14e5300c3a48 (gym interior)
- photo-1571019613454-1cb2f99b2d8b (woman training)
- photo-1581009146145-b5ef050c2e1e (man flexing)
- photo-1517836357463-d25dfeac3438 (man lifting)
- photo-1549060279-7e168fcee0c2 (woman boxing)
- photo-1574680096145-d05b474e2155 (trainer with client)
- photo-1518611012118-696072aa579a (yoga)
- photo-1544367567-0f2fcb009e0b (yoga peaceful)
- photo-1576678927484-cc907957088c (woman with weights)
- photo-1593079831268-3381b0db4a77 (outdoor training)
- photo-1552674605-db6ffd4facb5 (intense workout)
- photo-1583454110551-21f2fa2afe61 (boxing)
- photo-1526506118085-60ce8714f8c5 (athlete)

## What to Restyle

### 1. globals.css
- Update the @theme colors to green palette (matching APT logo)
- Dark background variables for hero sections
- Remove old teal/coral colors

### 2. Header (src/components/header.tsx)
- Use the APT logo (`/logo.png`) — display it at ~40-48px height
- Dark transparent header over hero, becomes solid white on scroll
- Clean nav links, green CTA button
- Mobile hamburger menu

### 3. Homepage (src/app/page.tsx) — FULL REDESIGN matching Medvi style
- **Hero Section**: Dark green gradient background with subtle pattern/image overlay. Big bold headline "Health is Wealth" with subtext "Australia's marketplace for verified personal trainers. Train anywhere, anytime." Pill-shaped category buttons below (Strength, HIIT, Yoga, Boxing, CrossFit, Pilates, etc). Search bar. Two CTA buttons.
- **Stats bar**: "50+ Verified Trainers", "100% Australian", "Hassle-Free" in a clean row
- **How It Works**: 3-step cards with icons, Medvi-style with section label
- **Featured Trainers**: Cards in a grid, real Unsplash photos, with name/specialisation/rating/price
- **Benefits section**: Icon grid showing platform benefits (like Medvi's "Everything you need" section)
- **For Trainers section**: Split layout with image and text, stats badges
- **For Gyms section**: Similar split layout
- **Enterprise section**: "Health is Wealth — For Your Team" with corporate imagery
- **Testimonials**: Card carousel/grid (Medvi style)
- **Newsletter CTA**: Clean bottom section

### 4. Footer (src/components/footer.tsx)
- Dark green background matching hero
- Logo, nav columns, newsletter form
- "Health is Wealth" tagline
- Social links, legal links, copyright

### 5. All other pages
- Apply consistent green color scheme
- Use the same section label pattern (small uppercase green label above headings)
- Rounded cards, pill buttons
- Keep all functionality intact — only change visual styling

### 6. Trainer Cards (src/components/trainer-card.tsx)
- Use Unsplash fitness photos as placeholder images
- Clean card design with rounded corners, subtle shadow
- Green verified badge
- Rating stars in green/gold

## IMPORTANT
- Keep ALL existing functionality — only change visual styling/layout
- No emojis on public pages
- Logo must appear in header on every page
- Mobile-first responsive
- All images via Unsplash URLs (no local image files needed except logo)
- Match the Medvi clean, modern, premium feel

When completely finished, run this command to notify me:
openclaw system event --text "Done: Restyled AnywherePT to match Medvi theme with APT logo" --mode now
