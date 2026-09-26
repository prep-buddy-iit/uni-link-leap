import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { useApplicationModal } from "@/lib/application-modal";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { HeroVideoCard } from "@/components/site/HeroVideoCard";
import { TrustBar } from "@/components/site/TrustBar";
import { PricingCards } from "@/components/site/PricingCards";
import { CommunityCards } from "@/components/site/CommunityCards";
import { FAQAccordion } from "@/components/site/FAQAccordion";
import { MentorsPreview } from "@/components/site/MentorsPreview";
import { KnowledgeHub } from "@/components/site/KnowledgeHub";
import { Testimonials } from "@/components/site/Testimonials";
import { TrialBanner, SessionBanner } from "@/components/site/TrialSessionBanners";
import { PageBackdrop } from "@/components/site/PageBackdrop";
import { UrgencyStrip } from "@/components/site/UrgencyStrip";
import { nextJeeSession } from "@/lib/exam-dates";
import { EXAM } from "@/lib/exam-content";
import { absoluteUrl } from "@/lib/site";
import { examPageSchemas } from "@/lib/exam-schema";

const ex = EXAM.jee;

export const Route = createFileRoute("/jee")({
  head: () => ({
    meta: [
      { title: ex.metaTitle },
      { name: "description", content: ex.metaDesc },
      { name: "keywords", content: ex.keywords },
      { property: "og:title", content: ex.metaTitle },
      { property: "og:description", content: ex.metaDesc },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/jee") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/jee") }],
    scripts: examPageSchemas("jee"),
  }),
  component: JeePage,
});

function JeePage() {
  const { open } = useApplicationModal();
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <UrgencyStrip
        target={nextJeeSession()}
        template="JEE Main {label} is {days} away - plans built this month get the full runway."
        fallback="Applications for the next JEE Main session open soon - get a head start on your plan."
      />
      <Navbar />
      <main>
        <Breadcrumbs items={[{ label: "JEE Mentorship" }]} />
        <section className="relative">
          <PageBackdrop />
          <div className="mx-auto max-w-7xl px-5 pt-14 sm:pt-20 pb-16 grid lg:grid-cols-[1.05fr_1fr] items-center gap-10 lg:gap-14">
            <div>
              <p className="eyebrow">{ex.heroEyebrow}</p>
              <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
                A mentor who checks on your JEE prep{" "}
                <span className="text-primary">every single day.</span>
              </h1>
              <p className="mt-5 text-lg text-ink-muted max-w-xl">{ex.heroSubhead}</p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button onClick={() => open("trial", "jee")}
                  className="pill-btn pill-btn-primary pill-btn-primary-hover">
                  Start 3-Day Trial - ₹99 <ArrowRight className="h-4 w-4" />
                </button>
                <Link to="/jee" hash="stories"
                  className="pill-btn border border-input bg-white text-ink hover:border-primary">
                  Read Success Stories
                </Link>
              </div>
            </div>
            <HeroVideoCard />
          </div>
        </section>

        <TrustBar />
        <PricingCards exam="jee" />
        <TrialBanner exam="jee" />
        <SessionBanner exam="jee" />
        <MentorsPreview mentors={ex.mentors} headline={`IITians who <span class='text-primary'>recently cracked JEE</span>.`} />
        <Testimonials items={ex.testimonials} />
        <CommunityCards exam="jee" />
        <KnowledgeHub posts={ex.hub} />
        <FAQAccordion faqs={ex.faqs} />
      </main>
      <Footer />
    </div>
  );
}
