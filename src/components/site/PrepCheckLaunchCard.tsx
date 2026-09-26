import { ArrowRight, Lock } from "lucide-react";
import type { ExamKey } from "@/components/ApplicationModal";
import { usePrepCheck } from "@/lib/prep-check";
import { INTRO } from "@/lib/guidance-preview/script";
import { TOTAL_STEPS } from "@/lib/guidance-preview/use-preview-flow";

/**
 * The in-page entry point to the floating prep check.
 *
 * A still frame of the conversation rather than a second copy of it: the
 * questionnaire itself only ever runs in one place, `PrepCheckBot`.
 */
export function PrepCheckLaunchCard({
  /** Pre-selects the exam, e.g. from ?exam=jee. The student can still change it. */
  exam,
  className = "",
}: {
  exam?: ExamKey;
  className?: string;
}) {
  const { open, status } = usePrepCheck();

  const label =
    status === "done"
      ? "See my prep pattern"
      : status === "in-progress"
        ? "Pick up where I left off"
        : "Start my prep check";

  return (
    <div className={"panel-raised rounded-3xl p-6 sm:p-7 " + className}>
      <div className="flex items-center gap-3">
        <img
          src="/logo-128.webp"
          alt=""
          className="h-10 w-10 rounded-full object-cover"
          aria-hidden="true"
        />
        <div>
          <p className="font-display text-base font-bold">PrepBuddy Prep Check</p>
          <p className="mono text-[0.65rem] uppercase tracking-wider text-ink-muted">
            {TOTAL_STEPS} questions · about two minutes
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {INTRO.map((line) => (
          <div key={line} className="flex justify-start">
            <p className="max-w-[88%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-sm leading-relaxed text-ink">
              {line}
            </p>
          </div>
        ))}
        <div className="flex justify-start">
          <p className="max-w-[88%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-sm font-medium leading-relaxed text-ink">
            Which exam are you preparing for?
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => open(exam)}
        className="pill-btn pill-btn-primary pill-btn-primary-hover mt-6 h-12 w-full text-base"
      >
        {label} <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
        <Lock className="h-3 w-3" aria-hidden="true" />
        Nothing to sign up for to see your result.
      </p>
    </div>
  );
}
