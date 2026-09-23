import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageBackdrop } from "@/components/site/PageBackdrop";
import { PrepCheckLaunchCard } from "@/components/site/PrepCheckLaunchCard";
import { usePrepCheck } from "@/lib/prep-check";
import type { ExamKey } from "@/components/ApplicationModal";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Free Guidance Preview - PrepBuddy";
const DESC =
  "Answer a few questions about how your JEE or NEET prep is actually going and see what the pattern points at - in about two minutes, no signup.";

type Search = { exam?: ExamKey };

export const Route = createFileRoute("/guidance-preview")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    exam: search.exam === "jee" || search.exam === "neet" ? search.exam : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/guidance-preview") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/guidance-preview") }],
  }),
  component: GuidancePreviewPage,
});

function GuidancePreviewPage() {
  const { exam } = Route.useSearch();
  const { open } = usePrepCheck();

  // This page exists to run the prep check, so it opens the assistant itself
  // rather than making the student find the corner button.
  useEffect(() => {
    open(exam);
  }, [open, exam]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main>
        <Breadcrumbs items={[{ label: "Free Guidance Preview" }]} />
        <section className="relative">
          <PageBackdrop />
          <div className="mx-auto max-w-2xl px-5 pt-10 sm:pt-14 pb-24">
            <p className="eyebrow">Two minutes, no signup</p>
            <h1 className="mt-4 font-display font-bold text-3xl sm:text-4xl leading-[1.1]">
              Tell us how prep is actually going.{" "}
              <span className="text-primary">We'll tell you what it points at.</span>
            </h1>
            <p className="mt-4 text-ink-muted">
              No score, no rank prediction, no lecture. Just the pattern a mentor would spot in your
              first call.
            </p>

            <div className="mt-8">
              <PrepCheckLaunchCard exam={exam} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
