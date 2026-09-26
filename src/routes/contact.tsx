import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/ContactForm";
import { PageBackdrop } from "@/components/site/PageBackdrop";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SITE_URL, absoluteUrl, breadcrumbSchema } from "@/lib/site";
import { teamChatUrl, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/lib/whatsapp";

const TITLE = "Contact Us - PrepBuddy JEE & NEET Mentorship";
const DESC =
  "Questions about PrepBuddy's 1-on-1 JEE and NEET mentorship? Reach us on WhatsApp, email, or send us a message.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: absoluteUrl("/contact") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/contact") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([{ name: "Contact", path: "/contact" }])),
      },
      {
        // ContactPage, not a second LocalBusiness: the root route already
        // declares the one Organization (with the same address, phone and
        // contact point), and mentorship is delivered online nationwide rather
        // than from a premises students visit.
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact PrepBuddy",
          url: absoluteUrl("/contact"),
          mainEntity: { "@id": `${SITE_URL}/#organization` },
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main>
        <Breadcrumbs items={[{ label: "Contact" }]} />
        <section className="relative">
          <PageBackdrop />
          <div className="mx-auto max-w-4xl px-5 pt-14 sm:pt-20 pb-10 text-center">
            <p className="eyebrow">Get in touch</p>
            <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl leading-tight">
              Questions about JEE or NEET mentorship?{" "}
              <span className="text-primary">We're here.</span>
            </h1>
            <p className="mt-4 text-lg text-ink-muted max-w-2xl mx-auto">
              Whether you're a student, a parent, or a topper interested in mentoring - we usually
              reply within 4 hours.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8">
            <div className="space-y-4">
              <InfoCard
                icon={<MessageCircle className="h-5 w-5" />}
                title="WhatsApp"
                sub={`${CONTACT_PHONE_DISPLAY} - fastest response, usually under an hour.`}
                cta="Chat on WhatsApp →"
                href={teamChatUrl("Hi! I have a question about PrepBuddy mentorship.")}
                bg="var(--whatsapp)"
              />
              <InfoCard
                icon={<Mail className="h-5 w-5" />}
                title="Email"
                sub="hello@prepbuddy.co"
                cta="Send us an email →"
                href="mailto:hello@prepbuddy.co"
                bg="var(--primary-strong)"
              />
              <InfoCard
                icon={<Phone className="h-5 w-5" />}
                title="Call us"
                sub={CONTACT_PHONE_DISPLAY}
                cta="Call now →"
                href={`tel:${CONTACT_PHONE_TEL}`}
                bg="var(--secondary)"
              />
              <InfoCard
                icon={<MapPin className="h-5 w-5" />}
                title="Location"
                sub="Hyderabad, India - mentoring online, nationwide."
                bg="var(--ink)"
              />
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  sub,
  cta,
  href,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  sub: React.ReactNode;
  cta?: string;
  href?: string;
  bg: string;
}) {
  return (
    <div className="rounded-3xl p-6 text-white" style={{ backgroundColor: bg }}>
      <div className="flex items-center gap-2 font-display text-lg font-bold">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20">{icon}</span>
        {title}
      </div>
      <p className="mt-3 text-white text-sm">{sub}</p>
      {cta && href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--whatsapp)]"
        >
          {cta}
        </a>
      )}
    </div>
  );
}
