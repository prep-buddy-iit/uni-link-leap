# PrepBuddy

Marketing and lead-capture site for [yourprepbuddy.com](https://yourprepbuddy.com) — 1-on-1
mentorship for India's JEE and NEET aspirants. Students are paired with a dedicated topper-mentor
(IITians for JEE, AIIMS / medical-college students for NEET) who builds a study plan from real mock
scores and runs daily accountability check-ins.

## Stack

| Layer      | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | TanStack Start (SSR) + TanStack Router file routes |
| UI         | React 19, Tailwind CSS v4, Radix primitives        |
| Data       | Supabase (leads, contacts, mentors, resources)     |
| Deploy     | Nitro → Cloudflare                                  |
| Tests      | Vitest + Testing Library                            |

## Getting started

Requires Node.js 20+ and [Bun](https://bun.sh) (the lockfile is `bun.lock`).

```sh
bun install
cp .env.example .env   # fill in the Supabase keys
bun run dev
```

| Script             | What it does                          |
| ------------------ | ------------------------------------- |
| `bun run dev`      | Dev server with HMR                   |
| `bun run build`    | Production build                      |
| `bun run preview`  | Serve the production build locally    |
| `bun run test`     | Run the Vitest suite once             |
| `bun run lint`     | ESLint over the repo                  |
| `bun run format`   | Prettier write                        |

## Layout

```
src/
  routes/              file-based routes (public pages, /admin/*, sitemap.xml)
  components/site/     page sections — hero, pricing, mentors, footer, …
  components/ui/       Radix-based primitives
  lib/                 site config, exam content, guidance-preview engine
  integrations/supabase/
public/                favicon, logo, og-image, robots.txt, llms.txt
```

- **Brand + design tokens** live in `src/styles.css`.
- **Canonical origin, OG image and absolute-URL helpers** live in `src/lib/site.ts`.
- **Exam-specific copy** (mentors, FAQs, testimonials, plans) lives in `src/lib/exam-content.ts`.
- **WhatsApp community invite links** live in `src/lib/whatsapp.ts`.

## Notes

This repository is connected to a Lovable project: commits pushed to the connected branch sync back
into that editor, so avoid rewriting published history (no force pushes, rebases or amends of pushed
commits) and keep the branch in a working state. See `AGENTS.md`.
