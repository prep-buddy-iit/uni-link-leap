import type { CSSProperties } from "react";

import type { Mentor } from "@/lib/exam-content";

/** Seconds each card spends crossing the strip. Keeps the pace identical
 *  whether a roster has four mentors or ten. */
const SECONDS_PER_MENTOR = 7;

export function MentorsPreview({ mentors, headline }: { mentors: Mentor[]; headline: string }) {
  // The roster is rendered twice so the strip can loop seamlessly. The second
  // pass is decorative, so it is hidden from assistive tech - a screen reader
  // should hear each mentor once.
  const track = [...mentors, ...mentors];

  return (
    <section id="mentors" className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">Meet our mentors</p>
        <h2
          className="mt-3 font-display text-3xl sm:text-4xl font-bold"
          dangerouslySetInnerHTML={{ __html: headline }}
        />
        <p className="mt-4 text-ink-muted">
          You don't have to pick one. Tell us your subjects, class and pace, and we allot the mentor
          who fits - and re-match you free if the fit isn't right.
        </p>
      </div>

      <div
        className="mentor-marquee mt-8 -mx-5"
        style={
          { "--marquee-duration": `${mentors.length * SECONDS_PER_MENTOR}s` } as CSSProperties
        }
      >
        <ul className="mentor-marquee-track flex">
          {track.map((m, i) => (
            <li
              key={`${m.name}-${i}`}
              aria-hidden={i >= mentors.length}
              // Trailing space lives on the card, not in a flex `gap`, so both
              // halves of the track are exactly the same width.
              className="shrink-0 w-72 pe-5"
            >
              <div className="panel-raised h-full rounded-3xl p-5">
                <div className="h-40 w-full rounded-lg grid place-items-center bg-secondary-tint text-secondary font-display text-4xl font-bold">
                  {m.initials}
                </div>
                <h3 className="mt-4 font-display font-bold text-lg">{m.name}</h3>
                <p className="mono text-xs text-ink-muted mt-1">{m.institute}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
