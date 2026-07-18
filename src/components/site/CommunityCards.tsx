import { ArrowRight, MessageCircle } from "lucide-react";
import type { ExamKey } from "@/components/ApplicationModal";
import { COMMUNITIES } from "@/lib/exam-content";

export function CommunityCards({ exam }: { exam: ExamKey }) {
  const c = COMMUNITIES[exam];
  const label = exam === "jee" ? "JEE" : "NEET";
  return (
    <section id="community" className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow">Community</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">You're not doing this alone.</h2>
        <p className="mt-3 text-ink-muted">
          A human from our team will reach out within 4 hours of your application - community is the
          extra layer, not the only one.
        </p>
      </div>
      <div className="mt-8 grid md:grid-cols-1 gap-5 max-w-lg">
        <a href={c.whatsapp} target="_blank" rel="noreferrer"
          className="card-lift rounded-3xl p-6 sm:p-8 text-white"
          style={{ backgroundImage: "linear-gradient(135deg,#22c35e,#12a04a)" }}>
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <MessageCircle className="h-6 w-6" /> {label} WhatsApp Community
          </div>
          <p className="mt-2 text-white/90">Daily study prompts, doubt threads, and mentor micro-tips.</p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 font-semibold">
            Join <ArrowRight className="h-4 w-4" />
          </span>
        </a>
      </div>
    </section>
  );
}
