import { useCountUp } from "@/hooks/useCountUp";

type Stat = { target: number; label: string; prefix?: string; suffix?: string; decimals?: number };

export function TrustBar({ stats }: { stats?: Stat[] }) {
  const items = stats ?? [
    { target: 3200, suffix: "+", label: "Students mentored" },
    { target: 180,  suffix: "+", label: "Verified mentors" },
    { target: 4.8,  decimals: 1, label: "Avg. parent rating" },
    { target: 2,    prefix: "<", suffix: " hrs", label: "Mentor response time" },
  ];
  return (
    <section className="border-y border-border/60 bg-white/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 gap-6 px-5 py-8">
        {items.map((s) => <StatCell key={s.label} {...s} />)}
      </div>
    </section>
  );
}

function StatCell({ target, label, prefix = "", suffix = "", decimals = 0 }: Stat) {
  const { ref, display } = useCountUp(target, 1000, decimals);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="text-center">
      <div className="mono text-3xl sm:text-4xl font-semibold text-ink">
        {prefix}{display}{suffix}
      </div>
      <div className="mt-1 text-xs sm:text-sm text-ink-muted">{label}</div>
    </div>
  );
}
