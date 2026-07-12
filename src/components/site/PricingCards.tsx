import { Check } from "lucide-react";
import { useApplicationModal } from "@/lib/application-modal";
import type { PlanKey, ExamKey } from "@/components/ApplicationModal";
import { EXAM } from "@/lib/exam-content";

export function PricingCards({ exam }: { exam: ExamKey }) {
  const { open } = useApplicationModal();
  const ex = EXAM[exam];

  const plans: {
    key: PlanKey; name: string; price: string; per: string; badge?: string; highlight?: boolean;
    features: string[];
  }[] = [
    {
      key: "month1", name: "1 Month", price: "₹1,599", per: "/mo",
      features: [
        `Personalised mentor from ${exam === "jee" ? "IITs only" : "AIIMS / top medical colleges only"}`,
        "Weekly review call",
        "Premium progress tracking sheet + weekly performance reports",
        ex.pyqLine,
        "24/7 voice & chat support from mentor team",
      ],
    },
    {
      key: "month3", name: "3 Months", price: "₹3,999", per: "one-time · ≈₹1,333/mo",
      badge: "Most Chosen", highlight: true,
      features: [
        "Everything in 1 Month",
        "Exclusive Notes & Chapter-Wise Mind Maps",
        "Monthly Parent–Mentor Meet",
        "Bi-weekly test analysis support with feedback",
      ],
    },
    {
      key: "month6", name: "6 Months", price: "₹5,999", per: "one-time · ≈₹1,000/mo",
      badge: "Best Value",
      features: [
        "Everything in 3 Months",
        "Board Exam Planning",
        "2 review calls per week",
        "Stress-management sessions",
      ],
    },
  ];

  return (
    <section id="plans" className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow">Plans + Pricing</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">
          Pick a runway. <span className="text-gradient-primary">Cancel anytime.</span>
        </h2>
        <p className="mt-3 text-ink-muted">
          All plans include your dedicated {ex.mentorNounShort} mentor and daily accountability.
        </p>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div key={p.key}
            className={
              "relative rounded-3xl p-6 sm:p-7 card-lift " +
              (p.highlight ? "text-white shadow-glass border border-white/10" : "glass-strong")
            }
            style={p.highlight ? { backgroundImage: "var(--gradient-primary)" } : undefined}
          >
            {p.badge && (
              <span className={
                "absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold mono uppercase tracking-wider " +
                (p.highlight ? "bg-white text-primary" : "gradient-accent text-white")
              }>{p.badge}</span>
            )}
            <h3 className={"font-display text-xl font-bold " + (p.highlight ? "text-white" : "")}>{p.name}</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={"font-display text-4xl font-bold " + (p.highlight ? "text-white" : "text-ink")}>{p.price}</span>
              <span className={"text-sm " + (p.highlight ? "text-white/80" : "text-ink-muted")}>{p.per}</span>
            </div>
            <ul className="mt-5 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={"mt-0.5 h-4 w-4 shrink-0 " + (p.highlight ? "text-white" : "text-primary")} />
                  <span className={p.highlight ? "text-white/95" : "text-ink"}>{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => open(p.key, exam)}
              className={
                "mt-6 w-full pill-btn h-12 " +
                (p.highlight ? "bg-white text-primary hover:opacity-90" : "pill-btn-primary pill-btn-primary-hover")
              }
            >
              Choose Plan →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
