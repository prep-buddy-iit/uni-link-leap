import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/exam-content";

export function KnowledgeHub({ posts }: { posts: Post[] }) {
  return (
    <section className="bg-white/50 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
        <div>
          <p className="eyebrow">Knowledge hub</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">Real questions, straight answers.</h2>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((p) => (
            <article key={p.title} className="rounded-2xl border border-border bg-white p-6 flex flex-col">
              <span className="mono text-xs uppercase tracking-wider text-primary-strong">{p.tag}</span>
              <h3 className="mt-3 font-display text-lg font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{p.body}</p>
              <span className="mt-4 text-sm font-semibold text-primary-strong inline-flex items-center gap-1">
                Read <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
