/**
 * JSON-LD for the /jee and /neet mentorship pages.
 *
 * Both pages describe the same product against a different exam, so the schema
 * is built once here rather than duplicated in two route files that then drift.
 *
 * Two rules this module exists to enforce:
 *   1. Every URL is absolute. schema.org ignores relative values, which
 *      silently invalidated every breadcrumb we previously emitted.
 *   2. Nothing is asserted that isn't on the page. Offers mirror PricingCards,
 *      the video mirrors HeroVideoCard, and the FAQs mirror FAQAccordion.
 */
import { EXAM } from "@/lib/exam-content";
import type { ExamKey } from "@/components/ApplicationModal";
import { SITE_NAME, SITE_URL, absoluteUrl, breadcrumbSchema, heroVideoSchema } from "@/lib/site";

/** Plan prices shown by PricingCards + TrialSessionBanners, in INR. */
const OFFERS = [
  { name: "3-Day Trial", price: "99" },
  { name: "1-Hour 1:1 Session", price: "999" },
  { name: "1 Month Mentorship", price: "1599" },
  { name: "3 Months Mentorship", price: "3999" },
  { name: "6 Months Mentorship", price: "5999" },
] as const;

export function examPageSchemas(key: ExamKey) {
  const ex = EXAM[key];
  const label = ex.label;
  const url = absoluteUrl(ex.urlPath);

  /** The mentorship product itself — what the page is actually selling. */
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: `${SITE_NAME} ${label} Mentorship`,
    serviceType: `1-on-1 ${label} mentorship`,
    description: ex.metaDesc,
    url,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "India" },
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: `${label} aspirants in Class 11, Class 12 and droppers`,
    },
    knowsAbout: ex.keywords.split(",").map((k) => k.trim()),
    offers: OFFERS.map((o) => ({
      "@type": "Offer",
      name: `${label} ${o.name}`,
      price: o.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url,
    })),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ex.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const mentors = ex.mentors.map((m) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    jobTitle: `${label} Mentor`,
    alumniOf: { "@type": "CollegeOrUniversity", name: m.institute },
    // Mirrors what the mentor strip actually shows. Rank and specialty were
    // removed from the cards, so they must not be asserted here either -
    // structured data has to describe visible content.
    description: `${label} mentor from ${m.institute}.`,
    worksFor: { "@id": `${SITE_URL}/#organization` },
  }));

  return [
    service,
    faq,
    breadcrumbSchema([{ name: `${label} Mentorship`, path: ex.urlPath }]),
    heroVideoSchema(),
    mentors,
  ].map((schema) => ({
    type: "application/ld+json" as const,
    children: JSON.stringify(schema),
  }));
}
