import { useEffect, useState } from "react";
import { daysUntil, type ExamTarget } from "@/lib/exam-dates";

type Props = {
  target: ExamTarget | null;
  /** Template with `{label}` and `{days}` placeholders, e.g. "JEE Main {label} is {days} away - …" */
  template: string;
  /** Copy shown when no future date is configured. */
  fallback: string;
};

export function UrgencyStrip({ target, template, fallback }: Props) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    if (!target) return;
    const recompute = () => setDays(daysUntil(target.date));
    recompute();
    // Recompute at next local midnight so the number stays fresh on long sessions.
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const t = setTimeout(recompute, nextMidnight.getTime() - now.getTime() + 1000);
    return () => clearTimeout(t);
  }, [target]);

  const showFallback = !target || days === null || days < 0;

  return (
    <div className="w-full bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-2 text-center text-xs sm:text-sm">
        {showFallback ? (
          <span className="text-white">{fallback}</span>
        ) : (
          <span className="text-white">
            {renderTemplate(template, {
              label: target!.label,
              days: (
                <span
                  key="days"
                  className="font-mono font-semibold text-secondary-on-dark"
                >
                  {days} {days === 1 ? "day" : "days"}
                </span>
              ),
            })}
          </span>
        )}
      </div>
    </div>
  );
}

function renderTemplate(
  template: string,
  vars: Record<string, React.ReactNode>,
): React.ReactNode[] {
  const parts = template.split(/(\{\w+\})/g);
  return parts.map((part, i) => {
    const m = part.match(/^\{(\w+)\}$/);
    if (m && m[1] in vars) return <span key={i}>{vars[m[1]]}</span>;
    return <span key={i}>{part}</span>;
  });
}
