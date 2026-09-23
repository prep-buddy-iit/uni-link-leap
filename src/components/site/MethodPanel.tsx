/**
 * A diagram of how a mentorship week is structured.
 *
 * This is editorial content, not a screenshot and not stock art: the cadence
 * and the four error tags are the method already described in the site's own
 * FAQ copy. Deliberately carries no numbers, so nothing here can read as a
 * student's real data.
 *
 * Replace wholesale once there's a real screenshot of the tracking sheet.
 */

const DAYS = [
  { d: "Mon", kind: "check" },
  { d: "Tue", kind: "check" },
  { d: "Wed", kind: "check" },
  { d: "Thu", kind: "check" },
  { d: "Fri", kind: "check" },
  { d: "Sat", kind: "mock" },
  { d: "Sun", kind: "call" },
] as const;

const TAGS = ["Concept gap", "Silly mistake", "Misread", "Time pressure"];

export function MethodPanel() {
  return (
    <figure className="mt-10 rounded-xl border border-border bg-white p-5 sm:p-6">
      <figcaption className="eyebrow">How a week runs</figcaption>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {DAYS.map(({ d, kind }) => (
          <div key={d} className="text-center">
            <div
              className={
                "rounded-md " +
                (kind === "check"
                  ? "h-8 bg-primary-tint"
                  : kind === "mock"
                    ? "h-8 bg-primary"
                    : "h-8 bg-secondary")
              }
              aria-hidden
            />
            <div className="mono mt-1.5 text-[0.6rem] uppercase tracking-wider text-ink-muted">
              {d}
            </div>
          </div>
        ))}
      </div>

      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary-tint" aria-hidden />
          <dt className="text-ink-muted">Daily check-in</dt>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" aria-hidden />
          <dt className="text-ink-muted">Full mock</dt>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-secondary" aria-hidden />
          <dt className="text-ink-muted">Review call</dt>
        </div>
      </dl>

      <div className="mt-5 border-t border-border pt-5">
        <p className="eyebrow">Every wrong answer gets tagged</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <li
              key={t}
              className="rounded-full bg-secondary-tint px-3 py-1.5 text-sm font-medium text-secondary"
            >
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-3.5 text-sm text-ink-muted">
          The tags that keep recurring are what the next week's plan is built around.
        </p>
      </div>
    </figure>
  );
}
