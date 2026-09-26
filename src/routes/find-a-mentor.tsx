import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageBackdrop } from "@/components/site/PageBackdrop";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ALL_MENTORS } from "@/lib/exam-content";
import type { ExamKey } from "@/components/ApplicationModal";
import { absoluteUrl, breadcrumbSchema } from "@/lib/site";

const TITLE = "Meet Our Mentors - PrepBuddy JEE & NEET Mentors";
const DESC = "Every PrepBuddy mentor is a verified topper - IITians for JEE, AIIMS/medical-college students for NEET. Browse mentor credentials; matching happens when you start your trial.";

export const Route = createFileRoute("/find-a-mentor")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: absoluteUrl("/find-a-mentor") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/find-a-mentor") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([{ name: "Find a Mentor", path: "/find-a-mentor" }])),
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
              <span className="text-primary">verified topper</span>.
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
                    ? "bg-primary-strong text-white shadow-glass"
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
              <div key={m.name + m.exam} className="panel-raised rounded-3xl p-5">
                <div className="flex items-start justify-between">
                  <div className="h-16 w-16 rounded-lg grid place-items-center bg-secondary-tint text-secondary font-display text-2xl font-bold">
                    {m.initials}
                  </div>
                  <span className={
                    "mono text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 " +
                    (m.exam === "jee"
                      ? "bg-primary-tint text-primary-deep"
                      : "bg-secondary-tint text-secondary")
                  }>
                    {m.exam.toUpperCase()}
                  </span>
                </div>
                <h3 className="mt-4 font-display font-bold text-lg">{m.name}</h3>
                <p className="mono text-xs text-ink-muted mt-0.5">{m.rank} · {m.institute}</p>
                <p className="mt-2 text-sm text-ink">{m.specialty}</p>
                <Link to={m.exam === "jee" ? "/jee" : "/neet"} hash="plans"
                  className="mt-4 inline-flex items-center gap-1 py-1 text-sm font-semibold text-primary-strong hover:underline">
                  Start Your Trial →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-ink text-white p-10 sm:p-14 text-center">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Not sure who's right for you?
            </h2>
            <p className="mt-3 text-white max-w-xl mx-auto">
              Start with the ₹99 trial - we'll match you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/jee" hash="plans" className="pill-btn bg-white text-primary-strong hover:opacity-90">
                Start with JEE →
              </Link>
              <Link to="/neet" hash="plans" className="pill-btn bg-white text-primary-strong hover:opacity-90">
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
