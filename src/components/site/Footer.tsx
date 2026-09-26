import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Linkedin } from "lucide-react";

import { SOCIAL_PROFILES } from "@/lib/site";

// Same URLs the Organization schema publishes as `sameAs`, so the profiles a
// crawler is told about are the ones a reader can actually click.
const SOCIALS = [
  { label: "PrepBuddy on Instagram", icon: Instagram, href: SOCIAL_PROFILES[0] },
  { label: "PrepBuddy on YouTube", icon: Youtube, href: SOCIAL_PROFILES[1] },
  { label: "PrepBuddy on LinkedIn", icon: Linkedin, href: SOCIAL_PROFILES[2] },
];


export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white/50">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo-128.webp"
                alt="PrepBuddy logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover shadow-soft"
              />
              <span className="font-display text-lg font-bold">PrepBuddy</span>
            </Link>
            <p className="mt-3 text-sm text-ink-muted max-w-sm">
              1-on-1 mentorship for JEE and NEET aspirants - IITians and AIIMS/medical students, personalized plans, daily accountability.
            </p>
            <ul className="mt-4 flex items-center gap-2">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-ink-muted transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <FooterCol h="Exams" items={[
              { l: "JEE Mentorship", to: "/jee" },
              { l: "NEET Mentorship", to: "/neet" },
              { l: "Free Guidance Preview", to: "/guidance-preview" },
            ]} />
            <FooterCol h="Company" items={[
              { l: "Our Method", to: "/" },
              { l: "Resources", to: "/resources" },
              { l: "Become a Mentor", to: "/become-a-mentor" },
              { l: "Contact Us", to: "/contact" },
            ]} />
            <FooterCol h="Trust" items={[
              { l: "Trust & Safety", to: "/trust-and-safety" },
              { l: "Privacy Policy", to: "/privacy-policy" },
              { l: "Terms", to: "/terms" },
            ]} />
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} PrepBuddy. All rights reserved.</p>
          <p className="mono">Hyderabad · India</p>
        </div>
      </div>
    </footer>
  );
}

type Item = { l: string; to?: string; href?: string };

function FooterCol({ h, items }: { h: string; items: Item[] }) {
  return (
    <div>
      <div className="mono text-xs uppercase tracking-wider text-ink">{h}</div>
      <ul className="mt-2 text-sm text-ink-muted">
        {items.map((it) => (
          <li key={it.l}>
            {it.to ? (
              <Link to={it.to} className="inline-block py-1.5 hover:text-ink">{it.l}</Link>
            ) : (
              <a href={it.href} className="inline-block py-1.5 hover:text-ink">{it.l}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
