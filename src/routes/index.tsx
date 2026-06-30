import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/LeadForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GraduationCap,
  Target,
  Clock,
  Flame,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MentorIIT — Get 1:1 IIT JEE mentorship from IITians" },
      {
        name: "description",
        content:
          "Connect with verified IITian mentors for personalized JEE prep strategy, doubt solving and weekly accountability. Free matching — get started in 60 seconds.",
      },
      { property: "og:title", content: "MentorIIT — Mentorship by IITians for JEE aspirants" },
      {
        property: "og:description",
        content:
          "1:1 mentorship from IITians who actually cracked JEE. Personalized plan, weekly check-ins, doubt support.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <SocialProof />
      <Benefits />
      <HowItWorks />
      <StatsBand />
      <FormSection />
      <FAQ />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display font-bold text-lg">
          <div className="h-8 w-8 rounded-lg gradient-sunset shadow-soft flex items-center justify-center text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          MentorIIT
        </a>
        <a
          href="#apply"
          className="rounded-full gradient-warm text-white text-sm font-semibold px-5 py-2 shadow-soft hover:opacity-95 transition"
        >
          Find my mentor
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full gradient-sunset opacity-30 blur-3xl" />
        <div className="absolute top-20 -right-20 h-80 w-80 rounded-full gradient-warm opacity-25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-16 sm:pt-24 pb-12 sm:pb-20">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Mentorship by IITians, built for JEE
            </div>
            <h1 className="mt-6 font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              Crack JEE with a mentor who{" "}
              <span className="text-gradient-sunset">already did</span>.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Get matched 1:1 with a verified IITian mentor — personalized
              study plan, weekly check-ins, and on-demand doubt solving. No
              coaching marketplaces. No noise.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href="#apply"
                className="inline-flex items-center justify-center gap-2 rounded-full gradient-sunset text-white font-semibold px-6 py-3.5 shadow-sunset hover:opacity-95 transition"
              >
                Get matched in 60 seconds <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3.5 font-medium hover:border-primary/50 transition"
              >
                How it works
              </a>
            </div>
            <div className="mt-8 flex items-center gap-5 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[
                  "from-sunset-orange to-sunset-amber",
                  "from-sunset-magenta to-sunset-indigo",
                  "from-sunset-indigo to-sunset-orange",
                  "from-sunset-amber to-sunset-magenta",
                ].map((g, i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded-full bg-gradient-to-br ${g} ring-2 ring-background`}
                  />
                ))}
              </div>
              <span><b className="text-foreground">500+ aspirants</b> matched this year</span>
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="absolute inset-0 gradient-sunset rounded-[2rem] rotate-3 opacity-20 blur-2xl" />
            <div className="relative rounded-[2rem] bg-card border border-border p-6 shadow-sunset">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="h-11 w-11 rounded-full gradient-warm flex items-center justify-center text-white font-bold">
                  AR
                </div>
                <div>
                  <div className="font-semibold">Aarav R.</div>
                  <div className="text-xs text-muted-foreground">IIT Bombay · CSE · AIR 312</div>
                </div>
                <span className="ml-auto text-xs font-semibold text-accent">Your mentor</span>
              </div>
              <div className="mt-4 space-y-3">
                <ChatBubble side="them">
                  Hey Rohan! I looked at your mock — let's hit Rotational Mechanics this week.
                </ChatBubble>
                <ChatBubble side="me">
                  Sounds good. Stuck on moment of inertia problems 😩
                </ChatBubble>
                <ChatBubble side="them">
                  I'll share a 5-problem set tonight + a 20-min screen-share tomorrow. Deal?
                </ChatBubble>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[
                  ["1:1", "weekly call"],
                  ["24h", "doubt SLA"],
                  ["12wk", "roadmap"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-secondary px-2 py-3">
                    <div className="font-display font-bold text-lg text-foreground">{k}</div>
                    <div className="text-[11px] text-muted-foreground">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ side, children }: { side: "me" | "them"; children: React.ReactNode }) {
  const isMe = side === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
          isMe
            ? "gradient-warm text-white rounded-br-sm"
            : "bg-secondary text-foreground rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function SocialProof() {
  const iits = ["IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur", "IIT Roorkee"];
  return (
    <section className="border-y border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-5">
          Mentors from
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-display font-semibold text-muted-foreground">
          {iits.map((i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: Target, title: "Personalized roadmap", body: "A 12-week study plan built around your current mocks, syllabus gaps, and target college." },
    { icon: MessageCircle, title: "On-demand doubt solving", body: "Drop a doubt anytime — get a clear walkthrough within 24 hours, not days." },
    { icon: Clock, title: "Weekly accountability", body: "1:1 calls to review progress, fix what's slipping and protect your study hours." },
    { icon: Flame, title: "Motivation that lasts", body: "A mentor who's been in your seat — to push you on bad days and celebrate the wins." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <div className="max-w-2xl">
        <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
          Why aspirants choose a <span className="text-gradient-sunset">1:1 mentor</span>
        </h2>
        <p className="mt-3 text-muted-foreground">
          Coaching gives you content. A mentor gives you direction — and someone who actually has your back.
        </p>
      </div>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-sunset hover:-translate-y-1 transition"
          >
            <div className="h-11 w-11 rounded-xl gradient-sunset flex items-center justify-center text-white">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display font-bold text-lg">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Share your details", body: "60-second form: where you are in prep and what you need help with." },
    { n: "02", title: "Get matched", body: "We hand-pick an IITian mentor who fits your goals, branch interest and weak areas." },
    { n: "03", title: "Start 1:1 sessions", body: "Kickoff call within 48 hours. Weekly mentorship + doubt support from day one." },
  ];
  return (
    <section id="how" className="bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground">Three steps. No middlemen.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5 relative">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-3xl bg-card border border-border p-7 shadow-soft">
              <div className="font-display font-extrabold text-5xl text-gradient-sunset">{s.n}</div>
              <h3 className="mt-2 font-display font-bold text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  const stats = [
    ["120+", "IITian mentors"],
    ["500+", "Aspirants matched"],
    ["10k+", "Doubts solved"],
    ["4.9★", "Mentee rating"],
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="rounded-3xl gradient-sunset p-8 sm:p-12 shadow-sunset text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(([k, v]) => (
            <div key={k}>
              <div className="font-display font-extrabold text-3xl sm:text-4xl">{k}</div>
              <div className="text-sm opacity-90 mt-1">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FormSection() {
  return (
    <section id="apply" className="mx-auto max-w-6xl px-5 py-20 sm:py-28 scroll-mt-20">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
        <div className="lg:sticky lg:top-24">
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
            Tell us about your <span className="text-gradient-sunset">prep</span> — we'll do the rest.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Fill the form once. We'll match you with an IITian mentor who's
            cracked JEE and knows exactly what you need.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Free mentor matching",
              "Reply within 24 hours",
              "No spam, ever",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full gradient-warm" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Who are the mentors?", a: "Verified students and alumni from IITs (Bombay, Delhi, Madras, Kanpur, Kharagpur and more). Each is screened for teaching ability — not just rank." },
    { q: "Is it free?", a: "Mentor matching is free. After the kickoff call, you and your mentor pick a plan that fits your needs and budget." },
    { q: "How much time do I need to commit?", a: "Most aspirants do one 45-minute call per week + async doubt support. Mentors adapt the rhythm to your schedule." },
    { q: "Can I switch mentors?", a: "Yes. If the fit isn't right, we'll rematch you — no questions asked." },
    { q: "I'm a Class 11 / dropper. Is this for me?", a: "Yes. We match Class 11, 12 and droppers separately based on syllabus stage and target year." },
  ];
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-center">
        Questions, answered
      </h2>
      <Accordion type="single" collapsible className="mt-8">
        {items.map(({ q, a }) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="text-left font-display font-semibold">{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-display font-bold text-foreground">
          <div className="h-7 w-7 rounded-lg gradient-sunset flex items-center justify-center text-white">
            <GraduationCap className="h-3.5 w-3.5" />
          </div>
          MentorIIT
        </div>
        <p>© {new Date().getFullYear()} MentorIIT. Built for JEE aspirants.</p>
      </div>
    </footer>
  );
}
