import { useState } from "react";
import { Plus } from "lucide-react";
import type { FAQ } from "@/lib/exam-content";

export function FAQAccordion({ faqs, title = "Real questions students ask us." }: { faqs: FAQ[]; title?: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
      <div className="text-center">
        <p className="eyebrow">FAQ</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold">{title}</h2>
      </div>
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={f.q} className="rounded-lg border border-border bg-white overflow-hidden">
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-display font-semibold text-ink">{f.q}</span>
                <Plus className={"h-5 w-5 shrink-0 text-primary transition-transform duration-300 " + (isOpen ? "rotate-45" : "")} />
              </button>
              <div className="grid transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-ink-muted">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
