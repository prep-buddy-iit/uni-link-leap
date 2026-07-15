import { useApplicationModal } from "@/lib/application-modal";
import type { ExamKey } from "@/components/ApplicationModal";
import { EXAM } from "@/lib/exam-content";

export function TrialBanner({ exam }: { exam: ExamKey }) {
  const { open } = useApplicationModal();
  const ex = EXAM[exam];
  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="relative overflow-hidden rounded-3xl gradient-dark text-white p-8 sm:p-12">
        <div className="blob right-[-10%] top-[-40%] h-[420px] w-[420px]" style={{ background: "radial-gradient(circle, #8b5cf6, transparent 60%)" }} />
        <div className="blob left-[-10%] bottom-[-40%] h-[420px] w-[420px]" style={{ background: "radial-gradient(circle, #2a4fe0, transparent 60%)" }} />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>3-day trial</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white">
              Try {ex.label} mentorship for 3 days before you commit.
            </h2>
            <p className="mt-4 text-white/85 max-w-xl">
              One mentor call, a personalized plan built from your last {ex.label} mock score, and daily check-ins -
              priced low on purpose to filter for students who are serious.
            </p>
          </div>
          <div className="glass-strong rounded-2xl p-6 text-ink">
            <div className="mono text-xs text-ink-muted uppercase tracking-wider">Trial</div>
            <div className="mt-1 font-display text-4xl font-bold">₹99 <span className="text-lg text-ink-muted font-medium">/ 3 days</span></div>
            <button onClick={() => open("trial", exam)}
              className="mt-5 w-full pill-btn pill-btn-primary pill-btn-primary-hover">
              Start Trial →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SessionBanner({ exam }: { exam: ExamKey }) {
  const { open } = useApplicationModal();
  const ex = EXAM[exam];
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16">
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12" style={{ backgroundImage: "linear-gradient(135deg, #fff2e6 0%, #ffe0eb 100%)" }}>
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <p className="eyebrow" style={{ color: "#c04a20" }}>1:1 session</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
              {ex.sessionCopy.split("selected")[0]}
              <span className="text-gradient-accent">selected {exam === "jee" ? "IIT student" : "AIIMS/medical student"}</span>.
            </h2>
            <p className="mt-4 text-ink-muted max-w-xl">
              No ongoing plan required. Useful for a second opinion on your prep, strategy advice on one topic,
              or figuring out what's actually going wrong.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <div className="mono text-xs text-ink-muted uppercase tracking-wider">Session</div>
            <div className="mt-1 font-display text-4xl font-bold">₹999 <span className="text-lg text-ink-muted font-medium">/ session</span></div>
            <button onClick={() => open("session", exam)}
              className="mt-5 w-full pill-btn text-white gradient-accent hover:opacity-95"
              style={{ boxShadow: "0 10px 24px -10px rgba(255,92,138,0.55)" }}>
              Book a Session →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
