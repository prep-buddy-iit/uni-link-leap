import { useCountUp } from "@/hooks/useCountUp";

type Stat = { target: number; label: string; prefix?: string; suffix?: string; decimals?: number };

/**
 * A tight horizontal data strip with hairline dividers — deliberately not a row
 * of matching cards, and deliberately shorter than the sections around it.
 */
export function TrustBar({ stats }: { stats?: Stat[] }) {
  const items = stats ?? [
    { target: 150, suffix: "+", label: "Students mentored" },
    { target: 20, suffix: "+", label: "Verified mentors" },
    { target: 4.9, decimals: 1, label: "Avg. parent rating" },
    { target: 2, prefix: "<", suffix: " hrs", label: "Mentor response time" },
  ];
  return (
    <section className="border-y border-border bg-white">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 px-5">
        {items.map((s, i) => (
          <StatCell
            key={s.label}
            {...s}
            className={[
              // 2x2 on mobile, one row from md up — dividers follow the grid.
              i % 2 === 1 ? "border-l border-border" : "",
              i >= 2 ? "border-t border-border md:border-t-0" : "",
              i > 0 ? "md:border-l md:border-border" : "",
            ].join(" ")}
          />
        ))}
      </dl>
    </section>
  );
}

function StatCell({
  target,
  label,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: Stat & { className?: string }) {
  const { ref, display } = useCountUp(target, 1000, decimals);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={"px-4 py-5 sm:px-6 sm:py-6 first:pl-0 md:last:pr-0 " + className}
    >
      {/* tabular-nums keeps the width stable while the count-up runs, so the
          strip never reflows mid-animation. */}
      <dd className="font-display text-2xl sm:text-3xl font-bold text-ink tabular-nums">
        {prefix}
        {display}
        {suffix}
      </dd>
      <dt className="mono mt-1 text-[0.68rem] sm:text-xs uppercase tracking-wider text-ink-muted">
        {label}
      </dt>
    </div>
  );
}
