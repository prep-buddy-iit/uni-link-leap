import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Clock, HeartHandshake, Users, CheckCircle2, ClipboardList, Video, PhoneCall } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { TrustBar } from "@/components/site/TrustBar";
import { BecomeMentorForm } from "@/components/BecomeMentorForm";
import { PageBackdrop } from "@/components/site/PageBackdrop";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { absoluteUrl, breadcrumbSchema } from "@/lib/site";

const TITLE = "Become a Mentor - PrepBuddy | Mentor JEE & NEET Students as an IITian or AIIMS/Medical Student";
const DESC = "Paid, flexible 1-on-1 mentorship for JEE and NEET aspirants. We work with IITians and AIIMS/medical students who cleared their exam recently. 2–4 hours/week, remote.";

export const Route = createFileRoute("/become-a-mentor")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: absoluteUrl("/become-a-mentor") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/become-a-mentor") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([{ name: "Become a Mentor", path: "/become-a-mentor" }])),
      },
    ],
  }),
  component: BecomeMentorPage,
});

function BecomeMentorPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main>
        <Breadcrumbs items={[{ label: "Become a Mentor" }]} />
        <section className="relative">
          <PageBackdrop />
          <div className="mx-auto max-w-4xl px-5 pt-14 sm:pt-20 pb-10 text-center">
            <p className="eyebrow">Become a mentor</p>
            <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              You cracked JEE or NEET.{" "}
              <span className="text-primary">Help someone else do it.</span>
            </h1>
            <p className="mt-5 text-lg text-ink-muted max-w-2xl mx-auto">
              Flexible hours, paid per student, and a selective process - mentor one to three aspirants at a time
              on your own schedule.
            </p>
          </div>
        </section>

        <TrustBar stats={[
          { target: 20, suffix: "+", label: "Active mentors" },
          { target: 150, suffix: "+", label: "Students mentored" },
          { target: 4, suffix: "-stage", label: "Review process" },
          { target: 4, prefix: "2–", suffix: " hrs/wk", label: "Flexible commitment" },
        ]} />

        <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Why mentor with PrepBuddy</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
              Real impact, <span className="text-primary">on your terms</span>.
            </h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Wallet,         title: "Paid per student",     body: "Predictable compensation per mentee, plus performance bonuses." },
              { icon: Clock,          title: "Flexible hours",        body: "Set your own weekly hours around college / job commitments." },
              { icon: HeartHandshake, title: "Real impact",           body: "Work 1:1 with 1–3 aspirants - see their outcomes actually change." },
              { icon: Users,          title: "A mentor community",    body: "Onboarding, playbooks, and a Slack of fellow IIT / AIIMS mentors." },
            ].map((c) => (
              <div key={c.title} className="border-t-2 border-border pt-4">
                <div className="flex items-center gap-2">
                  <c.icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
                  <h3 className="font-display text-lg font-bold">{c.title}</h3>
                </div>
                <p className="mt-2 text-sm text-ink-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border-y border-border">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
            <div className="max-w-3xl">
              <p className="eyebrow">Selection process</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Four stages. Then you're in.</h2>
            </div>
            <ol className="mt-12 pl-12 sm:pl-16">
              {[
                { icon: ClipboardList, title: "Application",             body: "Submit rank, institute and year of study - takes 2 minutes." },
                { icon: CheckCircle2,  title: "Subject test",             body: "A short subject screener to confirm current fluency." },
                { icon: Video,         title: "Mock mentoring session",   body: "A recorded mock call - we look at teaching style, not just knowledge." },
                { icon: PhoneCall,     title: "Final interview",          body: "A 20-minute conversation with our mentor lead. Then onboarding." },
              ].map((s, i) => (
                <li key={s.title} className={"relative " + (i === 3 ? "pb-0" : "pb-10")}>
                  <span
                    aria-hidden
                    className="absolute -left-12 sm:-left-16 top-0 grid h-6 w-6 sm:h-8 sm:w-8 place-items-center rounded-full border border-border bg-white mono text-[0.65rem] sm:text-xs font-semibold text-primary-strong"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i < 3 && (
                    <span
                      aria-hidden
                      className="absolute left-[-36px] sm:left-[-48px] top-6 sm:top-8 bottom-0 w-px bg-border"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-ink">
                      <s.icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                      <h3 className="font-display font-bold text-lg sm:text-xl">{s.title}</h3>
                    </div>
                    <p className="mt-1.5 max-w-2xl text-ink-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="apply" className="mx-auto max-w-3xl px-5 py-20 sm:py-24">
          <div className="text-center mb-10">
            <p className="eyebrow">Apply</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
              Apply to be a <span className="text-primary">PrepBuddy mentor</span>.
            </h2>
          </div>
          <BecomeMentorForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
