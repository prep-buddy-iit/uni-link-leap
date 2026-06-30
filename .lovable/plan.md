# JEE Mentor Connect — Lead Capture Site

A single-page, high-energy landing site that captures aspirant leads and routes them to be matched with IITian mentors. Sunset Energy palette (#ff6b35, #f7931e, #e84393, #6c5ce7) with bold typography and gradient accents.

## Pages & Sections

Single route (`/`) with these sections:
1. **Hero** — Headline ("Get mentored by IITians who cracked JEE"), subheadline, primary CTA scrolls to form, social proof strip (e.g., "Mentors from IIT Bombay, Delhi, Madras, Kanpur").
2. **Why a Mentor** — 3–4 benefit cards (personalized strategy, doubt-solving, motivation, time management).
3. **How It Works** — 3 steps (Submit details → Get matched → Start 1:1 sessions).
4. **Stats / Trust band** — gradient band with numbers (mentors, hours, aspirants helped).
5. **Lead Form** — the conversion point (details below).
6. **FAQ** — short accordion (cost, time commitment, mentor verification, etc.).
7. **Footer** — brand, contact email, socials.

## Lead Form Fields

- Full name (required)
- Phone (required, 10-digit validation)
- Email (required, email validation)
- Class / Target year — select: Class 11, Class 12, Dropper; Target: JEE 2026 / 2027 / 2028
- Current prep status — select: Self-study, Coaching (offline), Coaching (online), Just starting
- Preferred mentor/subject — multi-select chips: Physics, Chemistry, Maths, General strategy, IIT branch guidance
- Anything else (optional textarea, 500 char max)

Client-side Zod validation + clear inline errors. Submit button shows loading state, then success screen ("We'll reach out within 24 hours") with option to submit another.

## Backend

Enable **Lovable Cloud** and create:

- Table `public.leads` with all form fields + `created_at`, `status` (default 'new').
- RLS: anon INSERT only (rate-limited via simple per-IP/email dedupe check); SELECT restricted to admin role.
- Server function `submitLead` — validates with Zod server-side, inserts row, then triggers email notification.
- Email notification via **Lovable Emails** (built-in): on each new lead, send a transactional email to the site owner with all lead details. Requires email domain setup (prompted during build).
- Owner notification email address captured as a project secret (`OWNER_NOTIFY_EMAIL`).

## Design Direction

- **Palette**: Sunset Energy — orange #ff6b35 primary, amber #f7931e secondary, magenta #e84393 accent, indigo #6c5ce7 deep accent. Light cream background (#fffaf5) with deep ink text.
- **Typography**: Bold display (Sora / Space Grotesk) for headlines, clean sans (Inter / Manrope) for body.
- **Visuals**: gradient hero (orange→magenta→indigo), subtle grain, large numbers, rounded-2xl cards with soft shadow, accent underlines on key words.
- All colors as semantic tokens in `src/styles.css` (HSL/oklch), no hardcoded hex in components.

## Technical Notes

- TanStack Start route at `src/routes/index.tsx` only.
- Form component in `src/components/LeadForm.tsx`; section components in `src/components/sections/`.
- Server fn in `src/lib/leads.functions.ts` (public, with built-in rate-limit guard by recent email duplicates).
- SEO: unique title, description, og tags on index route.
- No auth required for visitors; admin lead viewing can be added later if needed.

## Out of Scope (for now)

- Mentor profile pages
- Admin dashboard to view leads (leads viewable in Cloud DB; can add later)
- Payments / booking flow
