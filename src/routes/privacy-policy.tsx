import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, Section, List } from "@/components/site/LegalPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Privacy Policy | PrepBuddy";
const DESC =
  "What PrepBuddy collects from students and parents, why, who it is shared with, how long it is kept, and how to have it deleted.";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: absoluteUrl("/privacy-policy") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/privacy-policy") }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <LegalPage
      crumb="Privacy Policy"
      title="Privacy Policy"
      intro="PrepBuddy is operated from Hyderabad, India. This page explains what we collect from students, parents and prospective mentors, why we collect it, and how to get it removed."
      updated="23 September 2026"
    >
      <Section heading="What we collect">
        <List
          items={[
            "Contact details you give us: name, phone number, email address, and a parent or guardian's contact where the student is a minor.",
            "Preparation details you give us: your exam (JEE or NEET), class or dropper year, subjects you're struggling with, recent mock scores, and the answers you give in the free guidance preview.",
            "Mentor applications: exam year, rank, institute, and the supporting documents we use to verify a credential.",
            "Basic technical data your browser sends when you load a page, such as IP address and user agent, used to keep the site working and secure.",
          ]}
        />
        <p>
          We do not run advertising trackers, and we do not sell or rent anyone's data to third
          parties.
        </p>
      </Section>

      <Section heading="Why we use it">
        <List
          items={[
            "To respond to an enquiry, application, or trial request — usually within four hours.",
            "To match a student with a suitable mentor and to build the study plan.",
            "To let your mentor read your guidance-preview answers before your first call, so you don't have to repeat yourself.",
            "To contact a parent or guardian about a minor's mentorship.",
            "To keep records we are required to keep, such as payment records.",
          ]}
        />
      </Section>

      <Section heading="Who sees it">
        <p>
          Your preparation details are visible to the mentor matched with you and to the PrepBuddy
          team members who handle matching and support. Data is stored with Supabase, our database
          provider. Payments are handled by our payment provider; we never store your card details.
          We disclose data to anyone else only where the law requires it.
        </p>
      </Section>

      <Section heading="Students under 18">
        <p>
          Most of our students are minors. When a student is under 18 we ask for a parent or
          guardian's contact details and treat that adult as the person who can consent to, review,
          or end the mentorship. A parent or guardian can ask us to show or delete everything we
          hold about their child, and we will act on it.
        </p>
      </Section>

      <Section heading="How long we keep it">
        <p>
          Enquiries that don't turn into a mentorship are deleted within 12 months. Records for
          active and past students are kept while the mentorship runs and for 24 months afterwards,
          except for payment records, which we keep as long as Indian tax law requires. Guidance
          preview answers from someone who never contacts us are deleted within 6 months.
        </p>
      </Section>

      <Section heading="Your choices">
        <p>
          You can ask us for a copy of what we hold about you, ask us to correct it, or ask us to
          delete it. You can also tell us to stop contacting you at any time, including by replying
          to any WhatsApp message from us. Write to{" "}
          <a
            href="mailto:hello@prepbuddy.co"
            className="font-medium text-primary-strong hover:underline"
          >
            hello@prepbuddy.co
          </a>{" "}
          or use the{" "}
          <Link to="/contact" className="font-medium text-primary-strong hover:underline">
            contact form
          </Link>
          . We reply to these requests within 30 days.
        </p>
      </Section>

      <Section heading="Cookies">
        <p>
          The site uses only the storage it needs to work: a session for anyone signed in to the
          admin area, and local storage to remember your progress through the guidance preview so a
          refresh doesn't lose your answers. There are no advertising or cross-site tracking
          cookies.
        </p>
      </Section>

      <Section heading="Changes to this policy">
        <p>
          If we change how we handle data we will update this page and the date above. Material
          changes affecting current students will also be sent to the contact details we hold.
        </p>
      </Section>
    </LegalPage>
  );
}
