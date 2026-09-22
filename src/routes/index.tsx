import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ClipboardList, ClipboardCheck, UserCheck, LineChart, HeartHandshake,
  HandshakeIcon, BookOpen, MessagesSquare, MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { HeroVideoCard } from "@/components/site/HeroVideoCard";
import { TrustBar } from "@/components/site/TrustBar";
import { PageBackdrop } from "@/components/site/PageBackdrop";
import { useReveal } from "@/hooks/useReveal";
import { COMMUNITIES } from "@/lib/exam-content";
import { GuidancePreviewChat } from "@/components/site/GuidancePreviewChat";

const TITLE = "PrepBuddy - 1-on-1 Mentorship for JEE & NEET | Class 11, 12 & Droppers";
const DESC = "PrepBuddy pairs Class 11, 12 and Droppers with a dedicated topper-mentor - IITians for JEE, AIIMS/medical students for NEET. Personalized plans, daily accountability, weekly review calls. Start your 3-day trial for ₹99.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "PrepBuddy",
        url: "/",
        description: DESC,
        areaServed: "IN",
        sameAs: ["/jee", "/neet"],
      }),
    }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main>
        <Hero />
        <GuidancePreview />
        <TrustBar />
        <WhyMentorship />
        <HowItWorks />
        <CommunityPreview />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <PageBackdrop />
      <div className="mx-auto max-w-7xl px-5 pt-14 sm:pt-20 pb-14 grid lg:grid-cols-[1.05fr_1fr] items-center gap-10 lg:gap-14">
        <div>
          <p className="eyebrow">1-on-1 Mentorship, not another coaching batch</p>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            A mentor who checks on your prep{" "}
            <span className="text-gradient-primary">every single day.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-muted max-w-xl">
            One dedicated mentor, a study plan built around your actual mock scores, and daily accountability -
            for JEE and NEET aspirants, Class 11 through Droppers.
          </p>
          <div className="mt-7 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#ff7a45,#ff5c8a", "#2a4fe0,#8b5cf6", "#8b5cf6,#5b7cff", "#ff5c8a,#8b5cf6"].map((g, i) => (
                <div key={i} className="h-9 w-9 rounded-full ring-2 ring-background"
                  style={{ backgroundImage: `linear-gradient(135deg, ${g})` }} />
              ))}
            </div>
            <p className="text-sm text-ink-muted">
              Trusted by <b className="text-ink">3,200+ students</b> and their parents
            </p>
          </div>
          <p className="mt-6 text-sm text-primary font-semibold">
            <a href="#guidance-preview">Pick your exam below →</a>
          </p>
        </div>
        <HeroVideoCard />
      </div>
    </section>
  );
}

function GuidancePreview() {
  return (
    <section id="guidance-preview" className="bg-white/50 border-y border-border/60 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 grid lg:grid-cols-[1fr_1.05fr] items-center gap-10 lg:gap-14">
        <div>
          <p className="eyebrow">Two minutes, no signup</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold leading-[1.1]">
            Not sure what's actually going wrong?{" "}
            <span className="text-gradient-primary">Find out before you pay anything.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-muted max-w-xl">
            Answer a few questions about how prep is really going - the honest version, not the
            version you tell relatives. You'll get the pattern a mentor would spot in your first
            call.
          </p>
          <ul className="mt-6 space-y-2.5 text-ink-muted">
            {[
              "No score, no rank prediction, no lecture",
              "Worded for your exam - JEE or NEET",
              "Nothing to sign up for to see your result",
            ].map((l) => (
              <li key={l} className="flex items-start gap-2.5">
                <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
        <GuidancePreviewChat />
      </div>
    </section>
  );
}

function WhyMentorship() {
  const items = [
    { icon: ClipboardList, title: "Daily Planning",     body: "A plan rebuilt weekly around your real mock data, not a fixed syllabus calendar." },
    { icon: ClipboardCheck, title: "Accountability",    body: "Someone actually checks if you did the work - the biggest predictor of consistency." },
    { icon: UserCheck,      title: "Personal Mentor",   body: "One topper who knows your strengths, gaps and pace - not a rotating support ticket." },
    { icon: LineChart,      title: "Mock Analysis",     body: "Error-pattern review after every mock, so the same mistake doesn't repeat for months." },
    { icon: HeartHandshake, title: "Stress Management", body: "A mentor who's been through the exam recently - practical calm, not generic motivation." },
  ];
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="why" className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow">Why mentorship works</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
          Prep doesn't fail from lack of content. It fails from{" "}
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

function HowItWorks() {
  const steps = [
    { icon: ClipboardList,  title: "Apply in 2 minutes",                     body: "Tell us your class, the plan you're interested in, and what you're struggling with." },
    { icon: HandshakeIcon,  title: "Get matched with your mentor",           body: "We allot a mentor based on your subject strengths, target year and pace - you don't have to pick one." },
    { icon: BookOpen,       title: "Personal study plan, built from your mocks", body: "Not a generic syllabus - your actual gaps, prioritized." },
    { icon: MessagesSquare, title: "Daily guidance + weekly review call",    body: "Short daily check-ins, one deeper call every week." },
  ];
  return (
    <section id="how" className="bg-white/50 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Four steps. No middlemen.</h2>
        </div>
        <ol className="relative mt-12 space-y-6">
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-primary via-secondary to-accent hidden sm:block" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-5">
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

function CommunityPreview() {
  const cards = [
    { label: "JEE WhatsApp",  href: COMMUNITIES.jee.whatsapp,  icon: MessageCircle, bg: "linear-gradient(135deg,#22c35e,#12a04a)" },
    { label: "NEET WhatsApp", href: COMMUNITIES.neet.whatsapp, icon: MessageCircle, bg: "linear-gradient(135deg,#22c35e,#12a04a)" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow">Community</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">You're not doing this alone.</h2>
        <p className="mt-3 text-ink-muted">
          Pick the community that matches your exam. Daily prompts, mentor AMAs and doubt threads.
        </p>
      </div>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
              className="card-lift rounded-2xl p-5 text-white" style={{ backgroundImage: c.bg }}>
              <div className="flex items-center gap-2 font-display font-bold text-lg">
                <Icon className="h-5 w-5" /> {c.label}
              </div>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                Join <ArrowRight className="h-3.5 w-3.5" />
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
