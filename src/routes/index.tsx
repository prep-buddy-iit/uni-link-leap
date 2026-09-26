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
import { COMMUNITIES } from "@/lib/exam-content";
import { PrepCheckLaunchCard } from "@/components/site/PrepCheckLaunchCard";
import { MethodPanel } from "@/components/site/MethodPanel";
import { SITE_URL, absoluteUrl, heroVideoSchema } from "@/lib/site";

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
      { property: "og:url", content: absoluteUrl("/") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
    // The Organization node lives once, in __root.tsx. Repeating it here made
    // two competing Organization entities on "/", so this page describes the
    // thing it actually sells instead, and points back at that one entity.
    scripts: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}/#mentorship`,
        name: "PrepBuddy 1-on-1 JEE & NEET Mentorship",
        serviceType: "1-on-1 exam mentorship",
        description: DESC,
        url: absoluteUrl("/"),
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "India" },
        audience: {
          "@type": "EducationalAudience",
          educationalRole: "student",
          audienceType: "JEE and NEET aspirants in Class 11, Class 12 and droppers",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Mentorship tracks",
          itemListElement: [
            { name: "JEE Mentorship", path: "/jee" },
            { name: "NEET Mentorship", path: "/neet" },
          ].map((t) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: t.name, url: absoluteUrl(t.path) },
          })),
        },
      },
      heroVideoSchema(),
    ].map((schema) => ({
      type: "application/ld+json" as const,
      children: JSON.stringify(schema),
    })),
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
      <div className="mx-auto max-w-7xl px-5 pt-14 sm:pt-20 pb-16 sm:pb-20 grid lg:grid-cols-[1.05fr_1fr] items-center gap-10 lg:gap-14">
        <div>
          <p className="eyebrow">1-on-1 Mentorship, not another coaching batch</p>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            A mentor who checks on your prep{" "}
            <span className="text-primary">every single day.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-muted max-w-xl">
            One dedicated mentor, a study plan built around your actual mock scores, and daily accountability -
            for JEE and NEET aspirants, Class 11 through Droppers.
          </p>
          <div className="mt-7 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#4a7fe8", "#8b4fdb", "#4372d1", "#8b4fdb"].map((c, i) => (
                <div key={i} className="h-9 w-9 rounded-full ring-2 ring-background"
                  style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="text-sm text-ink-muted">
              Trusted by <b className="text-ink">150+ students</b> and their parents
            </p>
          </div>
          <p className="mt-6 text-sm text-primary-strong font-semibold">
            <a href="#guidance-preview" className="inline-block py-1">Pick your exam below →</a>
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
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28 grid lg:grid-cols-[1fr_1.05fr] items-center gap-10 lg:gap-14">
        <div>
          <p className="eyebrow">Two minutes, no signup</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold leading-[1.1]">
            Not sure what's actually going wrong?{" "}
            <span className="text-primary">Find out before you pay anything.</span>
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
        <PrepCheckLaunchCard />
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
  return (
    <section id="why" className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Asymmetric: the argument stays pinned on the left while the list scrolls past it. */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Why mentorship works</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold leading-[1.15]">
              Prep doesn't fail from lack of content. It fails from{" "}
              <span className="text-primary">lack of a plan someone is actually watching.</span>
            </h2>
            <MethodPanel />
          </div>
        </div>

        {/* A divided list, not a card grid: no boxes, no shadows, no hover lift. */}
        <ul className="lg:col-span-7 lg:border-l lg:border-border lg:pl-16">
          {items.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className={"flex gap-5 py-6 " + (i > 0 ? "border-t border-border" : "lg:pt-1")}
            >
              <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
              <div>
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-ink-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>
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
    <section id="how" className="bg-white border-y border-border">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Four steps. No middlemen.</h2>
        </div>

        {/* One continuous rule threaded through the step markers - a real
            timeline rather than four identical boxes stacked up. */}
        <ol className="mt-12 pl-12 sm:pl-16">
          {steps.map((s, i) => (
            <li key={s.title} className={"relative " + (i === steps.length - 1 ? "pb-0" : "pb-10")}>
              <span
                aria-hidden
                className="absolute -left-12 sm:-left-16 top-0 grid h-6 w-6 sm:h-8 sm:w-8 place-items-center rounded-full border border-border bg-white mono text-[0.65rem] sm:text-xs font-semibold text-primary-strong"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Connector runs from this marker to the next one, so the rule
                  always lands exactly on the markers at any text length. */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[-36px] sm:left-[-48px] top-6 sm:top-8 bottom-0 w-px bg-border"
                />
              )}
              <div className="flex items-center gap-2 text-ink">
                <s.icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                <h3 className="font-display font-bold text-lg sm:text-xl">{s.title}</h3>
              </div>
              <p className="mt-1.5 max-w-2xl text-ink-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CommunityPreview() {
  const cards = [
    { label: "JEE", title: "JEE WhatsApp", body: "PYQ breakdowns, mock-day threads and mentor AMAs with IITians.", href: COMMUNITIES.jee.whatsapp },
    { label: "NEET", title: "NEET WhatsApp", body: "Biology doubt threads, NCERT drills and AMAs with AIIMS mentors.", href: COMMUNITIES.neet.whatsapp },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
      <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className="eyebrow">Community</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">You're not doing this alone.</h2>
          <p className="mt-4 text-ink-muted">
            Pick the community that matches your exam. Daily prompts, mentor AMAs and doubt threads -
            free to join, no application needed.
          </p>
        </div>

        {/* One panel split by a rule, rather than two matching tiles side by side. */}
        <div className="overflow-hidden rounded-xl border border-border bg-white lg:col-span-7">
          {cards.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className={
                "group flex items-center gap-4 px-5 py-5 sm:px-6 transition-colors hover:bg-muted/60 " +
                (i > 0 ? "border-t border-border" : "")
              }
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white"
                style={{ backgroundColor: "var(--whatsapp)" }}
              >
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display font-bold text-ink">{c.title}</span>
                <span className="mt-0.5 block text-sm text-ink-muted">{c.body}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-strong">
                Join
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
