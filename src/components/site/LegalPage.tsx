import type { ReactNode } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

/**
 * Shared shell for the policy pages. Deliberately plainer than the marketing
 * pages — no blobs, no glass, no hover lift. These are documents, not pitches.
 */
export function LegalPage({
  crumb,
  title,
  intro,
  updated,
  children,
}: {
  crumb: string;
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main>
        <Breadcrumbs items={[{ label: crumb }]} />
        <article className="mx-auto max-w-3xl px-5 pt-8 pb-20 sm:pt-12 sm:pb-24">
          <header className="border-b border-border pb-8">
            <p className="eyebrow">Policies</p>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold">{title}</h1>
            <p className="mt-4 text-lg text-ink-muted">{intro}</p>
            <p className="mono mt-5 text-xs uppercase tracking-wider text-ink-muted">
              Last updated {updated}
            </p>
          </header>
          <div className="mt-10 space-y-10">{children}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold">{heading}</h2>
      <div className="mt-3 space-y-3 text-ink-muted leading-relaxed">{children}</div>
    </section>
  );
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-5">
      {items.map((item, i) => (
        <li key={i} className="list-disc marker:text-primary">
          {item}
        </li>
      ))}
    </ul>
  );
}
