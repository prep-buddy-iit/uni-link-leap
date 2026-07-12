import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ label: "Home", to: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-5 pt-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
          {full.map((c, i) => {
            const last = i === full.length - 1;
            return (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" aria-hidden />}
                {c.to && !last ? (
                  <Link to={c.to} className="hover:text-ink">{c.label}</Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className={last ? "text-ink" : ""}>{c.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export function breadcrumbSchema(items: Crumb[]) {
  const full: Crumb[] = [{ label: "Home", to: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: full.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: c.to ?? undefined,
    })),
  };
}
