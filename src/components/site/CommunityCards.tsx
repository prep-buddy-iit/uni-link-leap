import { ArrowRight, Check, MessageCircle } from "lucide-react";
import type { ExamKey } from "@/components/ApplicationModal";
import { COMMUNITIES } from "@/lib/exam-content";
import { useReveal } from "@/hooks/useReveal";

export function CommunityCards({ exam }: { exam: ExamKey }) {
  const c = COMMUNITIES[exam];
  const label = exam === "jee" ? "JEE" : "NEET";
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="community" className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className="eyebrow">Community</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">You're not doing this alone.</h2>
          <p className="mt-4 text-ink-muted">
            A human from our team will reach out within 4 hours of your application - community is the
            extra layer, not the only one.
          </p>
          <p className="mt-3 text-sm text-ink-muted">
            Free to join, open to every {label} aspirant - no application needed.
          </p>
        </div>
        <div ref={ref} className="reveal lg:col-span-7">
          <a href={c.whatsapp} target="_blank" rel="noreferrer"
            className="card-lift flex flex-col rounded-3xl p-7 sm:p-8 text-white"
            style={{ backgroundImage: "linear-gradient(135deg,#22c35e,#12a04a)" }}>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/20">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold">{label} WhatsApp Community</span>
            </div>
            <p className="mt-3 text-white/90">Daily study prompts, doubt threads, and mentor micro-tips.</p>
            <ul className="mt-5 space-y-2.5 border-t border-white/20 pt-5">
              {c.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2.5 text-sm text-white/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 font-semibold">
              Join <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
