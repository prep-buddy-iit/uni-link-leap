# PrepBuddy Marketing Site — Build Plan

Full rebuild of the current landing page. We keep the existing Lovable Cloud + `leads` table backend and reuse the Sunset backend plumbing (`src/lib/leads.functions.ts` pattern) but replace visual system, sections, and copy end-to-end.

## Design system (src/styles.css)

Replace Sunset tokens with PrepBuddy palette:
- `--primary` #2A4FE0, `--primary-light` #5B7CFF, `--secondary` #8B5CF6, `--accent` #FF7A45, `--accent-pink` #FF5C8A
- `--background` #F5F6FC, `--ink` #14162B, `--ink-muted` #565973
- `--gradient-primary` 135° blue→purple, `--gradient-accent` 135° orange→pink
- Glass surface tokens: `--glass-bg` rgba(255,255,255,.7), `--glass-border` rgba(255,255,255,.9), `--shadow-glass`

Fonts via `<link>` in `src/routes/__root.tsx` head:
- Space Grotesk (600/700) → `--font-display`
- Inter (400–700) → `--font-sans`
- JetBrains Mono (500/600) → `--font-mono` (eyebrows uppercase + tracked, stat numbers)

Utilities: `glass-card`, `gradient-primary`, `gradient-accent`, `text-gradient-primary`, `pill-btn`, `float-slow` (5s ease-in-out), `reveal` (fade + 24px up via IntersectionObserver hook), respect `prefers-reduced-motion`.

## Page structure (`src/routes/index.tsx`)

Order: UrgencyStrip → Navbar → Hero → TrustBar → WhyMentorship → HowItWorks → Plans → TrialBanner → SessionBanner → Mentors → Testimonials → Community → KnowledgeHub → FAQ → BecomeMentorForm → Footer.

Content, copy, prices, and CTAs follow the spec verbatim (₹99 trial, ₹1,599/₹3,999/₹5,999 plans, ₹999 session; 5 Why cards; 4 How-It-Works steps; 4–5 mentor cards; 3 testimonials without rank numbers; 6 hub cards; 8 FAQ questions; footer with Platform/Company/Trust/Contact + Hyderabad · India).

Hero right column: glass-framed thumbnail card, centered gradient play button, floating "▶ 2 min watch" glass badge (float-slow), caption "See how a real mentorship week works →". Clicking opens a lightweight modal with `<iframe>` YouTube embed (placeholder ID `dQw4w9WgXcQ`). Thumbnail image generated with imagegen (mentor + student on a video call, glassy premium feel).

Trust bar: 4 counters animated 0→target over ~1s when in view (custom `useCountUp` hook + IntersectionObserver). Numbers: 3200, 180, 4.8, <2h.

FAQ: single-open accordion (reuse shadcn `Accordion type="single" collapsible`), plus icon → × via CSS rotate. Questions worded per spec (feeds FAQPage JSON-LD).

Plans: 3 glass pricing cards, middle "Most Chosen", right "Best Value". Each `Choose Plan` opens shared modal with plan preset.

Trial + Session banners: distinct full-width sections (dark gradient / warm gradient) — each appears once, right after Plans.

Become a Mentor: inline form (name, phone, JEE Adv rank, category, IIT, year of study). JS validation with inline red errors; on success show green inline confirmation. Stored in a new `mentor_applications` table (see backend).

## Shared application modal (`src/components/ApplicationModal.tsx`)

Global context/provider (`ApplicationModalProvider` in `__root.tsx`) exposing `openApplication({ plan })`. Every CTA (hero primary, pricing cards, trial banner, session banner, navbar CTA) calls it with the correct pre-selected plan.

Fields: name, phone, class, plan (preset from trigger), problems faced (multi-checkbox), source. JS-only validation — no `required` attributes. On submit → insert into `leads` table (reuse existing schema; add columns via migration for `plan`, `problems`, `source`). Swap form view for thank-you view: heading, message, WhatsApp + Telegram glass cards, Done button. Reset to form on next open.

Small trust line above submit: "🔒 Your data is never shared or sold."

## Backend (migration)

Alter `public.leads`:
- Add `plan text`, `problems text[]`, `source text` (nullable)
- Keep existing anon INSERT policy; extend CHECK where safe

New table `public.mentor_applications`:
- Columns: name, phone, jee_rank int, category, iit_name, year_of_study
- GRANT INSERT to anon, SELECT to admin (has_role), full to service_role
- RLS enabled with anon-insert-only policy

Both writes go through Supabase client directly (matches current LeadForm pattern) — no new server fn required.

## SEO / AEO (`src/routes/index.tsx` head + `__root.tsx`)

- `<title>` and meta description per spec
- OG + canonical (relative `/`)
- One `<h1>` in hero, semantic `<header>/<nav>/<main>/<footer>`
- JSON-LD via route `scripts`:
  - `EducationalOrganization` with `knowsAbout`, `areaServed: "IN"`, five `makesOffer` entries (INR)
  - `FAQPage` mirroring visible Q&A verbatim
- Lazy-load hero thumbnail; reserve space for floating badge to avoid CLS
- Alt text on mentor + thumbnail images

## Files touched

- `src/styles.css` — new tokens + utilities (replace Sunset)
- `src/routes/__root.tsx` — font `<link>`s, ApplicationModalProvider, site-wide OG defaults
- `src/routes/index.tsx` — all sections + head meta + JSON-LD
- `src/components/ApplicationModal.tsx` — new
- `src/components/BecomeMentorForm.tsx` — new
- `src/components/VideoLightbox.tsx` — new
- `src/components/sections/*` — split large sections for readability
- `src/hooks/useCountUp.ts`, `src/hooks/useReveal.ts` — new
- `src/lib/application-modal.tsx` — context/provider
- `supabase/migrations/*` — alter `leads` + create `mentor_applications`
- Delete/replace `src/components/LeadForm.tsx` (superseded by ApplicationModal + BecomeMentorForm)
- One generated hero thumbnail image via imagegen

## Out of scope

- Real YouTube video ID (placeholder used, swappable)
- Countdown auto-computation (static "218 days" as spec allows)
- Payment integration (form submission only; team follows up)
- Individual Knowledge Hub article pages (preview cards only, no routes yet)
