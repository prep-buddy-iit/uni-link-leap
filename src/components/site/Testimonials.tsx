import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/exam-content";

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section id="stories" className="bg-white/50 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow">Success stories</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">In their own words.</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {items.map((t) => (
            <div key={t.name} className="glass-strong card-lift rounded-3xl p-6">
              <div className="flex gap-1 text-accent">
                {[0,1,2,3,4].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-3 text-ink">"{t.quote}"</p>
              <p className="mt-4 mono text-xs text-ink-muted">{t.name} · {t.meta}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
