import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, Section, List } from "@/components/site/LegalPage";
import { absoluteUrl } from "@/lib/site";
import { teamChatUrl } from "@/lib/whatsapp";

const TITLE = "Trust & Safety | PrepBuddy";
const DESC =
  "How PrepBuddy verifies mentors, keeps 1-on-1 sessions safe for minors, involves parents, and handles reports and mentor re-matching.";

export const Route = createFileRoute("/trust-and-safety")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: absoluteUrl("/trust-and-safety") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/trust-and-safety") }],
  }),
  component: TrustAndSafetyPage,
});

function TrustAndSafetyPage() {
  return (
    <LegalPage
      crumb="Trust & Safety"
      title="Trust & Safety"
      intro="Most of our students are minors, and every one of them is paired 1-on-1 with an adult mentor. This page sets out what we check, what we log, and what to do if something feels wrong."
      updated="23 September 2026"
    >
      <Section heading="How mentors are verified">
        <p>
          Every mentor passes a four-stage selection before they are matched with a student, and we
          verify their claimed credential — an IIT admission for JEE mentors, an AIIMS or medical
          college admission for NEET mentors — against official documentation.
        </p>
        <List
          items={[
            "Written application, including exam year, rank and institute.",
            "Subject screener to confirm they can still work the paper.",
            "A mock mentoring session, assessed for how they explain and how they listen.",
            "A final interview covering conduct expectations and boundaries with minors.",
          ]}
        />
        <p>
          Credentials shown on mentor profiles reflect what we verified at the time of onboarding.
          You can see the current roster on the{" "}
          <Link to="/find-a-mentor" className="font-medium text-primary-strong hover:underline">
            mentors page
          </Link>
          .
        </p>
      </Section>

      <Section heading="Conduct rules for 1-on-1 sessions">
        <List
          items={[
            "Sessions and daily check-ins happen on PrepBuddy's channels. Mentors do not move a student to a private personal account.",
            "Mentors never ask a student for money, gifts, or payments of any kind. All payments go to PrepBuddy.",
            "Mentors do not request photographs, personal social media handles, or any information unrelated to exam preparation.",
            "Conversation stays on preparation: study plans, mock analysis, subject doubts, and exam stress.",
          ]}
        />
        <p>
          Breaking any of these ends the mentor's engagement with PrepBuddy, and we tell the
          affected student's family directly.
        </p>
      </Section>

      <Section heading="Parents and guardians">
        <p>
          If the student is under 18, we take a parent or guardian's contact details at signup and
          treat that adult as a party to the mentorship. Parents can ask us at any time for a
          summary of their child's plan and progress, sit in on a review call, or ask for the
          mentorship to stop. Plans of three months and longer include a scheduled parent-mentor
          meet.
        </p>
      </Section>

      <Section heading="Reporting a concern">
        <p>
          If a mentor's behaviour worries you — or a student's messages worry you — tell us
          immediately. We acknowledge every report within 24 hours, and we suspend the mentorship
          while we look into anything involving a minor's safety.
        </p>
        <List
          items={[
            <>
              WhatsApp:{" "}
              <a
                href={teamChatUrl("I'd like to report a concern about a PrepBuddy mentorship.")}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary-strong hover:underline"
              >
                message the PrepBuddy team
              </a>
            </>,
            <>
              Email:{" "}
              <a
                href="mailto:hello@prepbuddy.co"
                className="font-medium text-primary-strong hover:underline"
              >
                hello@prepbuddy.co
              </a>
            </>,
            <>
              Or use the form on our{" "}
              <Link to="/contact" className="font-medium text-primary-strong hover:underline">
                contact page
              </Link>
              .
            </>,
          ]}
        />
      </Section>

      <Section heading="Changing or ending a mentorship">
        <p>
          You never have to stay with a mentor who isn't the right fit, and you don't need a reason.
          Ask us for a re-match and we'll move you to a different mentor. You can also stop an
          ongoing plan at any time — see the{" "}
          <Link to="/terms" className="font-medium text-primary-strong hover:underline">
            terms
          </Link>{" "}
          for how cancellation works.
        </p>
      </Section>
    </LegalPage>
  );
}
