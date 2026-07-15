import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageBackdrop } from "@/components/site/PageBackdrop";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ALL_MENTORS } from "@/lib/exam-content";
import type { ExamKey } from "@/components/ApplicationModal";

const TITLE = "Meet Our Mentors - PrepBuddy JEE & NEET Mentors";
const DESC = "Every PrepBuddy mentor is a verified topper - IITians for JEE, AIIMS/medical-college students for NEET. Browse mentor credentials; matching happens when you start your trial.";

export const Route = createFileRoute("/find-a-mentor")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/find-a-mentor" },
    ],
    links: [{ rel: "canonical", href: "/find-a-mentor" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Find a Mentor", item: "/find-a-mentor" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          ALL_MENTORS.map((m) => ({
            "@context": "https://schema.org",
            "@type": "Person",
            name: m.name,
            jobTitle: m.exam === "jee" ? "JEE Mentor" : "NEET Mentor",
            alumniOf: { "@type": "CollegeOrUniversity", name: m.institute },
            description: `${m.rank} · ${m.specialty}`,
          })),
        ),
      },
    ],
  }),
  component: FindMentorPage,
});

type Filter = "all" | ExamKey;

function FindMentorPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = filter === "all" ? ALL_MENTORS : ALL_MENTORS.filter((m) => m.exam === filter);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main>
        <Breadcrumbs items={[{ label: "Find a Mentor" }]} />
        <section className="relative">
          <PageBackdrop />
          <div className="mx-auto max-w-4xl px-5 pt-14 sm:pt-20 pb-8 text-center">
            <p className="eyebrow">Meet our mentors</p>
            <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Every mentor is a{" "}
              <span className="text-gradient-primary">verified topper</span>.
            </h1>
            <p className="mt-5 text-lg text-ink-muted max-w-2xl mx-auto">
              IITians for JEE, AIIMS/medical-college students for NEET - each has been through a 4-stage
              selection process. When you start your trial, we match you to the mentor who fits your subject
              gaps and pace best.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-8">
          <div className="flex justify-center gap-2">
            {(["all", "jee", "neet"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={
                  "rounded-full px-5 py-2 text-sm font-semibold transition " +
                  (filter === f
                    ? "gradient-primary text-white shadow-glass"
                    : "bg-white border border-input text-ink hover:border-primary")
                }>
                {f === "all" ? "All" : f.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((m) => (
              <div key={m.name + m.exam} className="glass-strong card-lift rounded-3xl p-5">
                <div className="flex items-start justify-between">
                  <div className="h-16 w-16 rounded-2xl grid place-items-center text-white font-display text-2xl font-bold"
                    style={{ backgroundImage: `linear-gradient(135deg, ${m.g})` }}>
                    {m.initials}
                  </div>
                  <span className={
                    "mono text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 " +
                    (m.exam === "jee" ? "bg-primary/10 text-primary" : "bg-[#12a04a]/10 text-[#12a04a]")
                  }>
                    {m.exam.toUpperCase()}
                  </span>
                </div>
                <h3 className="mt-4 font-display font-bold text-lg">{m.name}</h3>
                <p className="mono text-xs text-ink-muted mt-0.5">{m.rank} · {m.institute}</p>
                <p className="mt-2 text-sm text-ink">{m.specialty}</p>
                <Link to={m.exam === "jee" ? "/jee" : "/neet"} hash="plans"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  Start Your Trial →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24">
          <div className="relative overflow-hidden rounded-3xl gradient-dark text-white p-10 sm:p-14 text-center">
            <div className="blob right-[-10%] top-[-40%] h-[420px] w-[420px]" style={{ background: "radial-gradient(circle, #8b5cf6, transparent 60%)" }} />
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Not sure who's right for you?
            </h2>
            <p className="mt-3 text-white/85 max-w-xl mx-auto">
              Start with the ₹99 trial - we'll match you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/jee" hash="plans" className="pill-btn bg-white text-primary hover:opacity-90">
                Start with JEE →
              </Link>
              <Link to="/neet" hash="plans" className="pill-btn bg-white text-primary hover:opacity-90">
                Start with NEET →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
