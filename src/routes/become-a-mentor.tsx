import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Clock, HeartHandshake, Users, CheckCircle2, ClipboardList, Video, PhoneCall } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { TrustBar } from "@/components/site/TrustBar";
import { BecomeMentorForm } from "@/components/BecomeMentorForm";
import { PageBackdrop } from "@/components/site/PageBackdrop";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

const TITLE = "Become a Mentor — PrepBuddy | Mentor JEE & NEET Students as an IITian or AIIMS/Medical Student";
const DESC = "Paid, flexible 1-on-1 mentorship for JEE and NEET aspirants. We work with IITians and AIIMS/medical students who cleared their exam recently. 2–4 hours/week, remote.";

export const Route = createFileRoute("/become-a-mentor")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/become-a-mentor" },
    ],
    links: [{ rel: "canonical", href: "/become-a-mentor" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Become a Mentor", item: "/become-a-mentor" },
          ],
        }),
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
              <span className="text-gradient-primary">Help someone else do it.</span>
            </h1>
            <p className="mt-5 text-lg text-ink-muted max-w-2xl mx-auto">
              Flexible hours, paid per student, and a selective process — mentor one to three aspirants at a time
              on your own schedule.
            </p>
          </div>
        </section>

        <TrustBar stats={[
          { target: 180, suffix: "+", label: "Active mentors" },
          { target: 3200, suffix: "+", label: "Students mentored" },
          { target: 4, suffix: "-stage", label: "Review process" },
          { target: 4, prefix: "2–", suffix: " hrs/wk", label: "Flexible commitment" },
        ]} />

        <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Why mentor with PrepBuddy</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
              Real impact, <span className="text-gradient-primary">on your terms</span>.
            </h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Wallet,         title: "Paid per student",     body: "Predictable compensation per mentee, plus performance bonuses." },
              { icon: Clock,          title: "Flexible hours",        body: "Set your own weekly hours around college / job commitments." },
              { icon: HeartHandshake, title: "Real impact",           body: "Work 1:1 with 1–3 aspirants — see their outcomes actually change." },
              { icon: Users,          title: "A mentor community",    body: "Onboarding, playbooks, and a Slack of fellow IIT / AIIMS mentors." },
            ].map((c) => (
              <div key={c.title} className="glass-card card-lift rounded-2xl p-5">
                <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/50 border-y border-border/60">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
            <div className="max-w-3xl">
              <p className="eyebrow">Selection process</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Four stages. Then you're in.</h2>
            </div>
            <ol className="relative mt-12 space-y-6">
              <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-primary via-secondary to-accent hidden sm:block" />
              {[
                { icon: ClipboardList, title: "Application",             body: "Submit rank, institute and year of study — takes 2 minutes." },
                { icon: CheckCircle2,  title: "Subject test",             body: "A short subject screener to confirm current fluency." },
                { icon: Video,         title: "Mock mentoring session",   body: "A recorded mock call — we look at teaching style, not just knowledge." },
                { icon: PhoneCall,     title: "Final interview",          body: "A 20-minute conversation with our mentor lead. Then onboarding." },
              ].map((s, i) => (
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

        <section id="apply" className="mx-auto max-w-3xl px-5 py-20 sm:py-24">
          <div className="text-center mb-10">
            <p className="eyebrow">Apply</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
              Apply to be a <span className="text-gradient-primary">PrepBuddy mentor</span>.
            </h2>
          </div>
          <BecomeMentorForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
