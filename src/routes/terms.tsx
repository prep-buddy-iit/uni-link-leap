import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, Section, List } from "@/components/site/LegalPage";
import { absoluteUrl, breadcrumbSchema } from "@/lib/site";

const TITLE = "Terms of Service | PrepBuddy";
const DESC =
  "The terms you agree to when you buy PrepBuddy mentorship: what the service is and isn't, plans and pricing, our no-refund policy, pausing, mentor re-matching and conduct.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: absoluteUrl("/terms") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/terms") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema([{ name: "Terms", path: "/terms" }])),
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      crumb="Terms"
      title="Terms of Service"
      intro="These terms apply when you buy or use PrepBuddy mentorship. Please read them alongside our privacy policy and trust & safety pages."
      updated="23 September 2026"
    >
      <Section heading="What PrepBuddy is">
        <p>
          PrepBuddy is a 1-on-1 mentorship service for JEE and NEET aspirants. A mentor builds your
          study plan from your real mock scores, runs daily accountability check-ins, and takes a
          deeper review call each week.
        </p>
        <p>
          PrepBuddy is not a coaching institute. We do not teach syllabus content, run batches, or
          replace NCERT, your school, or your coaching. Most students use PrepBuddy alongside their
          existing study.
        </p>
      </Section>

      <Section heading="No guarantee of results">
        <p>
          We do not promise a rank, a score, a seat, or admission anywhere. Mentorship improves the
          structure and consistency of your preparation; the outcome depends on your own work and on
          factors outside anyone's control. Any ranks, scores or stories shown on this site describe
          individual past results and are not a prediction of yours.
        </p>
      </Section>

      <Section heading="Who can sign up">
        <p>
          If you are under 18, a parent or guardian must agree to these terms and give their contact
          details before the mentorship starts. By signing up you confirm the information you give
          us — class, exam, mock scores, contact details — is accurate.
        </p>
      </Section>

      <Section heading="Plans and payment">
        <List
          items={[
            "3-day trial — ₹99. One mentor call, a 3-day plan built from your last mock, daily check-ins.",
            "1-hour 1:1 session — ₹999. A single strategy or second-opinion call, with no ongoing plan.",
            "1 month — ₹1,599. 3 months — ₹3,999. 6 months — ₹5,999.",
          ]}
        />
        <p>
          Prices are in Indian rupees and include applicable taxes. Multi-month plans are paid once,
          up front. Current plan contents are listed on the{" "}
          <Link to="/jee" className="font-medium text-primary-strong hover:underline">
            JEE
          </Link>{" "}
          and{" "}
          <Link to="/neet" className="font-medium text-primary-strong hover:underline">
            NEET
          </Link>{" "}
          pages. We may change prices for new purchases, but never for a plan you have already paid
          for.
        </p>
      </Section>

      <Section heading="Refunds, cancellation and pausing">
        <p>
          PrepBuddy does not offer refunds or mid-plan cancellation. Please choose your plan
          carefully, and use the ₹99 trial first if you are unsure.
        </p>
        <List
          items={[
            "All purchases are final. Mentorship plans, the ₹99 trial and the ₹999 single session are non-refundable, whether or not the sessions are used.",
            "Plans cannot be cancelled part-way through. Once a plan is bought it runs for its full duration.",
            "If your mentor isn't the right fit, ask us for a re-match — we will move you to a different mentor at no extra cost, at any point in your plan.",
            "Plans of 3 months and above can be paused once, for up to 15 days in total. Your plan resumes where it left off, so no mentoring time is lost.",
            "The 1 month plan, the ₹99 trial and the ₹999 single session cannot be paused.",
          ]}
        />
        <p>
          To request a re-match or a pause, message us on WhatsApp or write to{" "}
          <a
            href="mailto:hello@prepbuddy.co"
            className="font-medium text-primary-strong hover:underline"
          >
            hello@prepbuddy.co
          </a>
          . Ask for a pause before you need it to start, not afterwards.
        </p>
      </Section>

      <Section heading="What we expect from you">
        <List
          items={[
            "Turn up for your calls, or tell your mentor in advance. Missed sessions are not refunded, and cannot be rescheduled indefinitely.",
            "Keep the plans, notes, mind maps and materials your mentor shares for your own use. Do not resell or redistribute them.",
            "Treat your mentor with respect. Abusive or harassing behaviour ends the mentorship immediately, without a refund.",
          ]}
        />
      </Section>

      <Section heading="What you can expect from us">
        <p>
          A verified mentor for your exam, matched to your subjects and pace; a plan rebuilt from
          your real mock data; daily check-ins and a weekly review call for as long as your plan
          runs; and a reply from our team within four hours on working days. Our standards for
          mentor conduct are set out on the{" "}
          <Link to="/trust-and-safety" className="font-medium text-primary-strong hover:underline">
            trust & safety
          </Link>{" "}
          page.
        </p>
      </Section>

      <Section heading="Content on this site">
        <p>
          Articles, plans and other material published on PrepBuddy belong to us and are provided
          for your personal study. Mentor ranks and institutes are shown as verified at onboarding.
        </p>
      </Section>

      <Section heading="Liability">
        <p>
          Where the law allows it to be limited, our liability for any claim relating to the
          mentorship is capped at the amount you paid us for the plan in question. Nothing here
          limits liability that cannot be limited under Indian law.
        </p>
      </Section>

      <Section heading="Governing law and changes">
        <p>
          These terms are governed by the laws of India, and the courts of Hyderabad, Telangana have
          jurisdiction. If we change these terms we will update this page and the date above;
          changes apply to purchases made after that date.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          Questions about these terms:{" "}
          <a
            href="mailto:hello@prepbuddy.co"
            className="font-medium text-primary-strong hover:underline"
          >
            hello@prepbuddy.co
          </a>{" "}
          or the{" "}
          <Link to="/contact" className="font-medium text-primary-strong hover:underline">
            contact page
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
