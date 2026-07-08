import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Play, Menu, X, Sparkles, ClipboardList, HandshakeIcon,
  BookOpen, LineChart, HeartHandshake, ClipboardCheck, UserCheck,
  Calendar, MessagesSquare, Check, Star, Flame, MessageCircle, Send,
  ChevronDown,
} from "lucide-react";
import { useApplicationModal } from "@/lib/application-modal";
import { useReveal } from "@/hooks/useReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { VideoLightbox } from "@/components/VideoLightbox";
import { BecomeMentorForm } from "@/components/BecomeMentorForm";
import type { PlanKey } from "@/components/ApplicationModal";
import heroImage from "@/assets/hero-mentor.jpg";

const YT_VIDEO_ID = "dQw4w9WgXcQ"; // placeholder — swap when real explainer is ready
const COUNTDOWN_DAYS = 218;

/* ------------------------- SEO copy for JSON-LD ------------------------- */

const FAQS: { q: string; a: string }[] = [
  {
    q: "Does having a mentor actually help in JEE preparation?",
    a: "Yes — the biggest predictor of JEE consistency is not content access, it's whether someone is actually checking on your work. A mentor gives you weekly plans built from your real mock data, holds you to daily study hours, and reviews the errors that keep repeating. That's what changes outcomes, not another lecture.",
  },
  {
    q: "What is the difference between a JEE mentor and a coaching institute?",
    a: "A coaching institute teaches syllabus content to a batch of hundreds on a fixed calendar. A PrepBuddy mentor is one IITian working with you 1:1 — they don't teach chapters, they build the plan, watch the mocks, catch the gaps, and keep you accountable. Most students use mentorship alongside their existing coaching or self-study.",
  },
  {
    q: "How many hours should a JEE dropper study every day?",
    a: "Most serious droppers work in the 8–10 focused hour range across Physics, Chemistry and Maths, with one full weekly mock. But raw hours are the wrong metric — what matters is whether those hours are structured against your weak areas. Your mentor rebuilds the daily plan every week from that week's mock and revision data.",
  },
  {
    q: "How do I stop making the same mistakes in JEE mock tests?",
    a: "You need an error log, not more mocks. After every mock, tag each wrong question as concept gap, silly mistake, misread, or time pressure — and revisit the recurring categories weekly. Your mentor runs this analysis with you and folds the fixes into next week's plan.",
  },
  {
    q: "What exactly happens in PrepBuddy's ₹99, 3-day trial?",
    a: "You get one call with an IITian mentor, a personalized 3-day plan built from your last mock score, and daily check-ins for those 3 days. It's priced low on purpose — to filter for students who are serious about actually doing the work, before you commit to a longer plan.",
  },
  {
    q: "Can I cancel my PrepBuddy plan anytime?",
    a: "Yes. You can stop your plan whenever you want. If the mentor fit isn't right, we'll match you with another one first — cancellation is only if you decide mentorship isn't for you.",
  },
  {
    q: "Is coaching necessary for a JEE dropper?",
    a: "No — many droppers crack JEE with only self-study and a strong mentor. Coaching is useful if you need someone to structure the content delivery for you; mentorship is what makes sure you actually execute. A dropper's biggest risk is drift, and mentorship exists precisely to prevent that.",
  },
  {
    q: "What makes a JEE mentorship program the best fit for a student?",
    a: "Look for three things: (1) mentors who cleared JEE recently themselves, (2) a plan that's rebuilt weekly from your real mock scores rather than a fixed syllabus schedule, and (3) daily accountability, not just a weekly call. PrepBuddy is built around all three.",
  },
];

/* ------------------------------ Route ------------------------------ */

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrepBuddy — Best JEE Mentorship, Guidance & Strategy for Class 11, 12 & Droppers" },
      {
        name: "description",
        content:
          "PrepBuddy pairs Class 11, 12 and JEE Droppers with a dedicated IITian mentor — a personalized JEE preparation strategy, daily accountability check-ins and weekly review calls. Start your 3-day trial for ₹99.",
      },
      { name: "keywords", content: "best JEE mentorship, JEE mentorship, JEE guidance, JEE strategies, JEE preparation strategy, JEE Main preparation tips, JEE Main exam strategy, JEE mentor online, JEE Main strategy, JEE Advanced strategy, JEE study plan, JEE preparation timetable, JEE dropper guidance, JEE dropper strategy, JEE preparation for droppers, JEE Class 11 strategy, JEE Class 12 strategy, how to prepare for JEE Main, how many hours should I study for JEE, JEE mock test analysis, best JEE mentor India, personalized JEE guidance, is coaching necessary for JEE dropper" },
      { property: "og:title", content: "PrepBuddy — Best JEE Mentorship for Class 11, 12 & Droppers" },
      { property: "og:description", content: "One dedicated IITian mentor. A study plan built from your real mock scores. Daily check-ins. Start the 3-day trial for ₹99." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "PrepBuddy",
          url: "/",
          description:
            "1:1 JEE mentorship from IITians for Class 11, Class 12 and JEE droppers. Personalized study plans, daily accountability, weekly review calls.",
          areaServed: "IN",
          knowsAbout: [
            "JEE mentorship", "JEE guidance", "JEE preparation strategy",
            "JEE Main strategy", "JEE Advanced strategy", "JEE dropper strategy",
            "JEE study plan", "JEE mock test analysis", "personalized JEE guidance",
          ],
          makesOffer: [
            { "@type": "Offer", name: "3-Day Trial", price: "99", priceCurrency: "INR" },
            { "@type": "Offer", name: "1 Month Mentorship", price: "1599", priceCurrency: "INR" },
            { "@type": "Offer", name: "3 Months Mentorship", price: "3999", priceCurrency: "INR" },
            { "@type": "Offer", name: "6 Months Mentorship", price: "5999", priceCurrency: "INR" },
            { "@type": "Offer", name: "1-Hour 1:1 Session", price: "999", priceCurrency: "INR" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Landing,
});

/* ------------------------------ Page ------------------------------ */

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <UrgencyStrip />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <WhyMentorship />
        <HowItWorks />
        <Plans />
        <TrialBanner />
        <SessionBanner />
        <Mentors />
        <Testimonials />
        <Community />
        <KnowledgeHub />
        <FAQ />
        <BecomeMentor />
      </main>
      <Footer />
    </div>
  );
}

/* --------------------------- Urgency strip --------------------------- */

function UrgencyStrip() {
  return (
    <div className="w-full bg-ink text-white text-xs sm:text-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 text-center">
        JEE Main 2027 (Session 1) is{" "}
        <span className="mono text-accent font-semibold">{COUNTDOWN_DAYS} days</span>{" "}
        away — plans built this month get the full runway.
      </div>
    </div>
  );
}

/* ------------------------------ Navbar ------------------------------ */

function Navbar() {
  const [open, setOpen] = useState(false);
  const { open: openApp } = useApplicationModal();
  const links = [
    ["#why", "Why Mentorship"],
    ["#mentors", "Mentors"],
    ["#stories", "Success Stories"],
    ["#plans", "Plans"],
    ["#become", "Become a Mentor"],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white font-display font-bold text-sm">PB</div>
          <span className="font-display text-lg font-bold">PrepBuddy</span>
        </a>
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink-muted">
          {links.map(([h, l]) => (
            <a key={h} href={h} className="hover:text-ink transition">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openApp("trial")}
            className="hidden sm:inline-flex pill-btn pill-btn-primary pill-btn-primary-hover text-sm"
          >
            Start ₹99 Trial
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-xl border border-border"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/60 bg-white px-5 py-4">
          <div className="flex flex-col gap-3 text-ink-muted">
            {links.map(([h, l]) => (
              <a key={h} href={h} onClick={() => setOpen(false)} className="py-1.5">{l}</a>
            ))}
            <button
              onClick={() => { setOpen(false); openApp("trial"); }}
              className="mt-2 pill-btn pill-btn-primary pill-btn-primary-hover text-sm"
            >
              Start ₹99 Trial
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------ Hero ------------------------------ */

function Hero() {
  const { open } = useApplicationModal();
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section id="top" className="relative">
      <div className="blob left-[-10%] top-[-10%] h-[420px] w-[420px]" style={{ background: "radial-gradient(circle, #5b7cff, transparent 60%)" }} />
      <div className="blob right-[-15%] top-[10%] h-[520px] w-[520px]" style={{ background: "radial-gradient(circle, #ff7a45, transparent 60%)" }} />
      <div className="blob left-[30%] top-[40%] h-[420px] w-[420px]" style={{ background: "radial-gradient(circle, #8b5cf6, transparent 60%)" }} />

      <div className="mx-auto max-w-7xl px-5 pt-14 sm:pt-20 pb-16 grid lg:grid-cols-[1.05fr_1fr] items-center gap-10 lg:gap-14">
        <div>
          <p className="eyebrow">IIT JEE Mentorship, not another coaching batch</p>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            A mentor who checks on your prep{" "}
            <span className="text-gradient-primary">every single day.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-muted max-w-xl">
            Not videos. Not a batch of 400. One dedicated mentor, a study plan built around your
            actual mock scores, and a daily accountability check-in — for Class 11, Class 12, and Droppers.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => open("trial")}
              className="pill-btn pill-btn-primary pill-btn-primary-hover"
            >
              Start 3-Day Trial — ₹99 <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#stories" className="pill-btn border border-input bg-white text-ink hover:border-primary">
              Read Success Stories
            </a>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#ff7a45,#ff5c8a", "#2a4fe0,#8b5cf6", "#8b5cf6,#5b7cff", "#ff5c8a,#8b5cf6"].map((g, i) => (
                <div key={i} className="h-9 w-9 rounded-full ring-2 ring-background"
                  style={{ backgroundImage: `linear-gradient(135deg, ${g})` }} />
              ))}
            </div>
            <p className="text-sm text-ink-muted">
              Trusted by <b className="text-ink">3,200+ students</b> and their parents this year
            </p>
          </div>
        </div>

        {/* Video card */}
        <HeroVideoCard onOpen={() => setVideoOpen(true)} />
      </div>

      <VideoLightbox open={videoOpen} onClose={() => setVideoOpen(false)} videoId={YT_VIDEO_ID} />
    </section>
  );
}

function HeroVideoCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 gradient-primary opacity-25 blur-3xl rounded-[2.5rem]" />
      <div className="relative glass-strong rounded-[1.75rem] p-3 sm:p-4">
        <button
          onClick={onOpen}
          className="group relative block w-full overflow-hidden rounded-2xl aspect-video"
          aria-label="Watch: See how a real mentorship week works"
        >
          <img
            src={heroImage}
            alt="An IITian mentor on a video call with a JEE student"
            width={1280}
            height={800}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-lift transition group-hover:scale-110">
              <Play className="h-6 w-6 translate-x-0.5" style={{ color: "#2a4fe0" }} fill="url(#pbGrad)" />
              <svg width="0" height="0"><defs><linearGradient id="pbGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a4fe0" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs></svg>
            </span>
          </span>
          {/* Floating duration badge */}
          <span className="float-slow absolute right-3 top-3 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-ink flex items-center gap-1">
            <Play className="h-3 w-3 text-primary" /> 2 min watch
          </span>
        </button>
        <p className="mt-3 px-2 pb-1 text-sm text-ink-muted">
          See how a real mentorship week works →
        </p>
      </div>
    </div>
  );
}

/* ---------------------------- Trust bar ---------------------------- */

function TrustBar() {
  return (
    <section className="border-y border-border/60 bg-white/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 gap-6 px-5 py-8">
        <Stat target={3200} suffix="+" label="Students mentored" />
        <Stat target={180} suffix="+" label="Verified mentors" />
        <Stat target={4.8} decimals={1} label="Avg. parent rating" />
        <Stat target={2} prefix="<" suffix=" hrs" label="Mentor response time" />
      </div>
    </section>
  );
}

function Stat({ target, label, prefix = "", suffix = "", decimals = 0 }: {
  target: number; label: string; prefix?: string; suffix?: string; decimals?: number;
}) {
  const { ref, display } = useCountUp(target, 1000, decimals);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="text-center">
      <div className="mono text-3xl sm:text-4xl font-semibold text-ink">
        {prefix}{display}{suffix}
      </div>
      <div className="mt-1 text-xs sm:text-sm text-ink-muted">{label}</div>
    </div>
  );
}

/* -------------------------- Why Mentorship -------------------------- */

function WhyMentorship() {
  const items = [
    { icon: ClipboardList, title: "Daily Planning",       body: "A plan rebuilt weekly around your real mock data, not a fixed syllabus calendar." },
    { icon: ClipboardCheck, title: "Accountability",      body: "Someone actually checks if you did the work — the biggest predictor of consistency." },
    { icon: UserCheck,      title: "Personal Mentor",     body: "One IITian who knows your strengths, gaps, and pace — not a rotating support ticket." },
    { icon: LineChart,      title: "Mock Analysis",       body: "Error-pattern review after every mock, so the same mistake doesn't repeat for months." },
    { icon: HeartHandshake, title: "Stress Management",   body: "A mentor who's been through JEE recently — practical calm, not generic motivation." },
  ];
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="why" className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow">Why mentorship works</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
          JEE prep doesn't fail from lack of content. It fails from{" "}
          <span className="text-gradient-primary">lack of a plan someone is actually watching.</span>
        </h2>
      </div>
      <div ref={ref} className="reveal mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="glass-card card-lift rounded-2xl p-5">
            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-white">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- How it works --------------------------- */

function HowItWorks() {
  const steps = [
    { icon: ClipboardList, title: "Apply in 2 minutes",                     body: "Tell us your class, the plan you're interested in, and what you're struggling with." },
    { icon: HandshakeIcon, title: "Get matched with your mentor",           body: "Matched by subject strength, target year, and mentoring style." },
    { icon: BookOpen,      title: "Personal study plan, built from your mocks", body: "Not a generic syllabus — your actual gaps, prioritized." },
    { icon: MessagesSquare, title: "Daily guidance + weekly review call",   body: "Short daily check-ins, one deeper call every week." },
  ];
  return (
    <section className="bg-white/50 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Four steps. No middlemen.</h2>
        </div>
        <ol className="relative mt-12 space-y-6">
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-primary via-secondary to-accent hidden sm:block" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 sm:pl-0">
              <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full gradient-primary text-white font-display font-bold shadow-glass">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="glass-card card-lift flex-1 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-ink">
                  <s.icon className="h-4 w-4 text-primary" />
                  <h3 className="font-display font-bold text-lg">{s.title}</h3>
                </div>
                <p className="mt-1.5 text-sm text-ink-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------ Plans ------------------------------ */

function Plans() {
  const { open } = useApplicationModal();

  const plans: {
    key: PlanKey; name: string; price: string; per: string; badge?: string; highlight?: boolean;
    features: string[];
  }[] = [
    {
      key: "month1", name: "1 Month", price: "₹1,599", per: "/mo",
      features: [
        "Personalised mentor from IITs only",
        "Weekly review call",
        "Premium progress tracking sheet + weekly performance reports",
        "Chapter-wise Problems + PYQs (Mains + Adv.)",
        "24/7 voice & chat support from mentor team",
      ],
    },
    {
      key: "month3", name: "3 Months", price: "₹3,999", per: "one-time · ≈₹1,333/mo",
      badge: "Most Chosen", highlight: true,
      features: [
        "Everything in 1 Month",
        "Exclusive Notes & Chapter-Wise Mind Maps",
        "Monthly Parent–Mentor Meet",
        "Bi-weekly test analysis support with feedback",
      ],
    },
    {
      key: "month6", name: "6 Months", price: "₹5,999", per: "one-time · ≈₹1,000/mo",
      badge: "Best Value",
      features: [
        "Everything in 3 Months",
        "Board Exam Planning",
        "2 review calls per week",
        "Stress-management sessions",
      ],
    },
  ];

  return (
    <section id="plans" className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow">Plans + Pricing</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
          Pick a runway. <span className="text-gradient-primary">Cancel anytime.</span>
        </h2>
        <p className="mt-3 text-ink-muted">All plans include your dedicated IITian mentor and daily accountability.</p>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div
            key={p.key}
            className={
              "relative rounded-3xl p-6 sm:p-7 card-lift " +
              (p.highlight
                ? "text-white shadow-glass border border-white/10"
                : "glass-strong")
            }
            style={p.highlight ? { backgroundImage: "var(--gradient-primary)" } : undefined}
          >
            {p.badge && (
              <span className={
                "absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold mono uppercase tracking-wider " +
                (p.highlight ? "bg-white text-primary" : "gradient-accent text-white")
              }>
                {p.badge}
              </span>
            )}
            <h3 className={"font-display text-xl font-bold " + (p.highlight ? "text-white" : "")}>{p.name}</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={"font-display text-4xl font-bold " + (p.highlight ? "text-white" : "text-ink")}>{p.price}</span>
              <span className={"text-sm " + (p.highlight ? "text-white/80" : "text-ink-muted")}>{p.per}</span>
            </div>
            <ul className="mt-5 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={"mt-0.5 h-4 w-4 shrink-0 " + (p.highlight ? "text-white" : "text-primary")} />
                  <span className={p.highlight ? "text-white/95" : "text-ink"}>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => open(p.key)}
              className={
                "mt-6 w-full pill-btn h-12 " +
                (p.highlight
                  ? "bg-white text-primary hover:opacity-90"
                  : "pill-btn-primary pill-btn-primary-hover")
              }
            >
              Choose Plan →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Trial banner --------------------------- */

function TrialBanner() {
  const { open } = useApplicationModal();
  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="relative overflow-hidden rounded-3xl gradient-dark text-white p-8 sm:p-12">
        <div className="blob right-[-10%] top-[-40%] h-[420px] w-[420px]" style={{ background: "radial-gradient(circle, #8b5cf6, transparent 60%)" }} />
        <div className="blob left-[-10%] bottom-[-40%] h-[420px] w-[420px]" style={{ background: "radial-gradient(circle, #2a4fe0, transparent 60%)" }} />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>3-day trial</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white">
              Try it for 3 days before you commit.
            </h2>
            <p className="mt-4 text-white/85 max-w-xl">
              One mentor call, one personalized plan built from your last mock score, and daily check-ins —
              priced low on purpose, just to filter for students who are serious.
            </p>
          </div>
          <div className="glass-strong rounded-2xl p-6 text-ink">
            <div className="mono text-xs text-ink-muted uppercase tracking-wider">Trial</div>
            <div className="mt-1 font-display text-4xl font-bold">₹99 <span className="text-lg text-ink-muted font-medium">/ 3 days</span></div>
            <button
              onClick={() => open("trial")}
              className="mt-5 w-full pill-btn pill-btn-primary pill-btn-primary-hover"
            >
              Start Trial →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- Session banner -------------------------- */

function SessionBanner() {
  const { open } = useApplicationModal();
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16">
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12" style={{ backgroundImage: "linear-gradient(135deg, #fff2e6 0%, #ffe0eb 100%)" }}>
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <p className="eyebrow" style={{ color: "#c04a20" }}>1:1 session</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
              Book a 1-hour session with a{" "}
              <span className="text-gradient-accent">selected IIT student</span>.
            </h2>
            <p className="mt-4 text-ink-muted max-w-xl">
              No ongoing plan required. Useful for a second opinion on your prep, strategy advice on one topic,
              or figuring out what's actually going wrong.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <div className="mono text-xs text-ink-muted uppercase tracking-wider">Session</div>
            <div className="mt-1 font-display text-4xl font-bold">₹999 <span className="text-lg text-ink-muted font-medium">/ session</span></div>
            <button
              onClick={() => open("session")}
              className="mt-5 w-full pill-btn text-white gradient-accent hover:opacity-95"
              style={{ boxShadow: "0 10px 24px -10px rgba(255,92,138,0.55)" }}
            >
              Book a Session →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Mentors ----------------------------- */

function Mentors() {
  const mentors = [
    { name: "Aarav R.",   iit: "IIT Bombay",     specialty: "Physics · Rotational Mechanics",     initials: "AR", g: "#ff7a45,#ff5c8a" },
    { name: "Ishita P.",  iit: "IIT Delhi",      specialty: "Maths · Calculus & Coordinate",       initials: "IP", g: "#2a4fe0,#8b5cf6" },
    { name: "Rahul K.",   iit: "IIT Madras",     specialty: "Chemistry · Physical & Organic",      initials: "RK", g: "#8b5cf6,#5b7cff" },
    { name: "Meera S.",   iit: "IIT Kanpur",     specialty: "Full-stack JEE · Dropper strategy",   initials: "MS", g: "#ff5c8a,#8b5cf6" },
    { name: "Karthik V.", iit: "IIT Kharagpur",  specialty: "Physics · Mechanics & E&M",           initials: "KV", g: "#2a4fe0,#5b7cff" },
  ];
  return (
    <section id="mentors" className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Meet our mentors</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
            IITians who <span className="text-gradient-primary">recently cracked JEE</span>.
          </h2>
        </div>
      </div>
      <div className="mt-8 -mx-5 px-5 overflow-x-auto">
        <div className="flex gap-5 snap-x snap-mandatory pb-2">
          {mentors.map((m) => (
            <div key={m.name} className="snap-start shrink-0 w-72 glass-strong card-lift rounded-3xl p-5">
              <div
                className="h-40 w-full rounded-2xl grid place-items-center text-white font-display text-4xl font-bold"
                style={{ backgroundImage: `linear-gradient(135deg, ${m.g})` }}
              >
                {m.initials}
              </div>
              <h3 className="mt-4 font-display font-bold text-lg">{m.name}</h3>
              <p className="mono text-xs text-ink-muted mt-0.5">{m.iit}</p>
              <p className="mt-2 text-sm text-ink">{m.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Testimonials ---------------------------- */

function Testimonials() {
  const items = [
    {
      quote: "The daily check-ins are what changed things. I've never studied this consistently in my life.",
      name: "Priya M.", meta: "Class 12",
    },
    {
      quote: "My mentor rebuilt my week from a single bad mock. That plan alone was worth the whole plan fee.",
      name: "Aditya S.", meta: "Dropper",
    },
    {
      quote: "Someone finally explained what to do after checking my mock score — instead of just telling me to give more.",
      name: "Sneha K.", meta: "Class 11",
    },
  ];
  return (
    <section id="stories" className="bg-white/50 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow">Success stories</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">In their own words.</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {items.map((t) => (
            <div key={t.name} className="glass-strong card-lift rounded-3xl p-5">
              <div className="relative aspect-video rounded-2xl overflow-hidden grid place-items-center gradient-primary">
                <button className="grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-lift" aria-label="Play testimonial">
                  <Play className="h-5 w-5 translate-x-0.5 text-primary" />
                </button>
              </div>
              <div className="mt-4 flex gap-1 text-accent">
                {[0,1,2,3,4].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-3 text-ink">"{t.quote}"</p>
              <p className="mt-3 mono text-xs text-ink-muted">{t.name} · {t.meta}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Community ---------------------------- */

function Community() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow">Community</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
          You're not doing this alone.
        </h2>
        <p className="mt-3 text-ink-muted">
          A human from our team will also reach out within 4 hours of your application — community is the
          extra layer, not the only one.
        </p>
      </div>
      <div className="mt-8 grid md:grid-cols-2 gap-5">
        <a
          href="https://chat.whatsapp.com/"
          target="_blank" rel="noreferrer"
          className="card-lift rounded-3xl p-6 sm:p-8 text-white"
          style={{ backgroundImage: "linear-gradient(135deg,#22c35e,#12a04a)" }}
        >
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <MessageCircle className="h-6 w-6" /> WhatsApp Community
          </div>
          <p className="mt-2 text-white/90">Daily study prompts, doubt threads, and mentor micro-tips.</p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 font-semibold">
            Join <ArrowRight className="h-4 w-4" />
          </span>
        </a>
        <a
          href="https://t.me/"
          target="_blank" rel="noreferrer"
          className="card-lift rounded-3xl p-6 sm:p-8 text-white"
          style={{ backgroundImage: "linear-gradient(135deg,#2AABEE,#1e7fbf)" }}
        >
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <Send className="h-6 w-6" /> Telegram Community
          </div>
          <p className="mt-2 text-white/90">Mock discussions, mentor AMAs, and shared notes.</p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 font-semibold">
            Join <ArrowRight className="h-4 w-4" />
          </span>
        </a>
      </div>
    </section>
  );
}

/* --------------------------- Knowledge Hub --------------------------- */

function KnowledgeHub() {
  const posts = [
    { tag: "Dropper strategy", title: "How many hours should a Class 12 dropper actually study daily?", body: "The honest answer isn't a number — it's a structure. Here's how to build yours." },
    { tag: "Mentorship",       title: "What makes a JEE mentorship program actually work?",             body: "Three components separate real mentorship from glorified progress-tracking." },
    { tag: "Coaching vs Mentor", title: "Is coaching necessary for a JEE dropper, or is mentorship enough?", body: "When each one helps, and how to combine them without burning out." },
    { tag: "Mock analysis",    title: "How to actually analyze a JEE mock test instead of just checking your score", body: "The 4-tag error log system every top scorer uses." },
    { tag: "Study plan",       title: "The 90-day Physics revision plan our mentors use",               body: "Chapter weightage, PYQ mapping, and the weekly review structure." },
    { tag: "JEE Main 2027",    title: "JEE Main 2027 Session 1 — dates, syllabus changes, key updates", body: "Everything you need to plan the next 7 months of prep." },
  ];
  return (
    <section className="bg-white/50 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Knowledge hub</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Real questions, straight answers.</h2>
          </div>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((p) => (
            <article key={p.title} className="glass-strong card-lift rounded-3xl p-6 flex flex-col">
              <span className="mono text-xs uppercase tracking-wider text-primary">{p.tag}</span>
              <h3 className="mt-3 font-display text-lg font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{p.body}</p>
              <span className="mt-4 text-sm font-semibold text-primary inline-flex items-center gap-1">
                Read <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FAQ -------------------------------- */

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 sm:py-24">
      <div className="text-center">
        <p className="eyebrow">FAQ</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
          Real questions students ask us.
        </h2>
      </div>
      <div className="mt-10 space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={f.q} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display font-semibold text-ink">{f.q}</span>
                <ChevronDown
                  className={"h-5 w-5 shrink-0 text-primary transition-transform duration-300 " + (isOpen ? "rotate-180" : "")}
                />
              </button>
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-ink-muted">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------- Become a mentor -------------------------- */

function BecomeMentor() {
  return (
    <section id="become" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
        <div className="lg:sticky lg:top-24">
          <p className="eyebrow">Become a mentor</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
            You cracked JEE. <span className="text-gradient-primary">Help someone else do it.</span>
          </h2>
          <p className="mt-4 text-ink-muted">
            Work with 1–3 aspirants on your own schedule. Compensation depends on plan tier and mentee load.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-ink">
            {[
              "Flexible hours, remote-first",
              "Onboarding + mentor playbooks provided",
              "Compensation + performance bonuses",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-accent" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <BecomeMentorForm />
      </div>
    </section>
  );
}

/* ------------------------------- Footer ------------------------------- */

function Footer() {
  const cols = [
    { h: "Platform", items: ["Plans", "3-Day Trial", "1:1 Session", "Mentors"] },
    { h: "Company",  items: ["About", "Careers", "Blog", "Contact"] },
    { h: "Trust",    items: ["Privacy", "Terms", "Refunds", "Community rules"] },
    { h: "Contact",  items: ["hello@prepbuddy.in", "+91 · Hyderabad", "WhatsApp", "Telegram"] },
  ];
  return (
    <footer className="border-t border-border/60 bg-white/50">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white font-display font-bold text-sm">PB</div>
              <span className="font-display text-lg font-bold">PrepBuddy</span>
            </div>
            <p className="mt-3 text-sm text-ink-muted max-w-sm">
              1:1 JEE mentorship from IITians — personalized plans, daily accountability, weekly review calls.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {cols.map((c) => (
              <div key={c.h}>
                <div className="mono text-xs uppercase tracking-wider text-ink">{c.h}</div>
                <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                  {c.items.map((it) => <li key={it}><a className="hover:text-ink" href="#">{it}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} PrepBuddy. All rights reserved.</p>
          <p className="mono">Hyderabad · India</p>
        </div>
      </div>
    </footer>
  );
}
