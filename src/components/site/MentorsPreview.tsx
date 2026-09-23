import { Link } from "@tanstack/react-router";
import type { Mentor } from "@/lib/exam-content";

export function MentorsPreview({ mentors, headline }: { mentors: Mentor[]; headline: string }) {
  return (
    <section id="mentors" className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Meet our mentors</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold" dangerouslySetInnerHTML={{ __html: headline }} />
        </div>
        <Link to="/find-a-mentor" className="inline-block py-1 text-sm font-semibold text-primary-strong hover:underline">
          See all mentors →
        </Link>
      </div>
      <div className="mt-8 -mx-5 px-5 overflow-x-auto">
        <div className="flex gap-5 snap-x snap-mandatory pb-2">
          {mentors.map((m) => (
            <div key={m.name} className="snap-start shrink-0 w-72 panel-raised rounded-3xl p-5">
              <div className="h-40 w-full rounded-lg grid place-items-center bg-secondary-tint text-secondary font-display text-4xl font-bold">
                {m.initials}
              </div>
              <h3 className="mt-4 font-display font-bold text-lg">{m.name}</h3>
              <p className="mono text-xs text-ink-muted mt-0.5">{m.rank} · {m.institute}</p>
              <p className="mt-2 text-sm text-ink">{m.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
