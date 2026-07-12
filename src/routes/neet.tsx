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
import { EXAM } from "@/lib/exam-content";

const ex = EXAM.neet;

export const Route = createFileRoute("/neet")({
  head: () => ({
    meta: [
      { title: ex.metaTitle },
      { name: "description", content: ex.metaDesc },
      { name: "keywords", content: ex.keywords },
      { property: "og:title", content: ex.metaTitle },
      { property: "og:description", content: ex.metaDesc },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/neet" },
    ],
    links: [{ rel: "canonical", href: "/neet" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "PrepBuddy — NEET Mentorship",
          url: "/neet",
          description: ex.metaDesc,
          areaServed: "IN",
          knowsAbout: ex.keywords.split(",").map((k) => k.trim()),
          makesOffer: [
            { "@type": "Offer", name: "NEET 3-Day Trial", price: "99", priceCurrency: "INR" },
            { "@type": "Offer", name: "NEET 1 Month Mentorship", price: "1599", priceCurrency: "INR" },
            { "@type": "Offer", name: "NEET 3 Months Mentorship", price: "3999", priceCurrency: "INR" },
            { "@type": "Offer", name: "NEET 6 Months Mentorship", price: "5999", priceCurrency: "INR" },
            { "@type": "Offer", name: "NEET 1-Hour 1:1 Session", price: "999", priceCurrency: "INR" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: ex.faqs.map((f) => ({
            "@type": "Question", name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "NEET Mentorship", item: "/neet" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: "How PrepBuddy NEET mentorship works",
          description: "A 2-minute walkthrough of a real week of 1-on-1 NEET mentorship at PrepBuddy.",
          thumbnailUrl: "/favicon.ico",
          uploadDate: "2026-01-01",
          embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          ex.mentors.map((m) => ({
            "@context": "https://schema.org",
            "@type": "Person",
            name: m.name,
            jobTitle: "NEET Mentor",
            alumniOf: { "@type": "CollegeOrUniversity", name: m.institute },
            description: `${m.rank} · ${m.specialty}`,
          })),
        ),
      },
    ],
  }),
  component: NeetPage,
});

function NeetPage() {
  const { open } = useApplicationModal();
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main>
        <Breadcrumbs items={[{ label: "NEET Mentorship" }]} />
        <section className="relative">
          <PageBackdrop />
          <div className="mx-auto max-w-7xl px-5 pt-14 sm:pt-20 pb-16 grid lg:grid-cols-[1.05fr_1fr] items-center gap-10 lg:gap-14">
            <div>
              <p className="eyebrow">{ex.heroEyebrow}</p>
              <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
                A mentor who checks on your NEET prep{" "}
                <span className="text-gradient-primary">every single day.</span>
              </h1>
              <p className="mt-5 text-lg text-ink-muted max-w-xl">{ex.heroSubhead}</p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button onClick={() => open("trial", "neet")}
                  className="pill-btn pill-btn-primary pill-btn-primary-hover">
                  Start 3-Day Trial — ₹99 <ArrowRight className="h-4 w-4" />
                </button>
                <Link to="/neet" hash="stories"
                  className="pill-btn border border-input bg-white text-ink hover:border-primary">
                  Read Success Stories
                </Link>
              </div>
            </div>
            <HeroVideoCard />
          </div>
        </section>

        <TrustBar />
        <PricingCards exam="neet" />
        <TrialBanner exam="neet" />
        <SessionBanner exam="neet" />
        <MentorsPreview mentors={ex.mentors} headline={`AIIMS & medical-college students who <span class='text-gradient-primary'>recently cracked NEET</span>.`} />
        <Testimonials items={ex.testimonials} />
        <CommunityCards exam="neet" />
        <KnowledgeHub posts={ex.hub} />
        <FAQAccordion faqs={ex.faqs} />
      </main>
      <Footer />
    </div>
  );
}
