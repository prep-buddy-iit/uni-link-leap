import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/prepbuddy-logo.jpg.asset.json";


export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white/50">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={logoAsset.url} alt="PrepBuddy logo" className="h-9 w-9 rounded-xl object-cover shadow-soft" />
              <span className="font-display text-lg font-bold">PrepBuddy</span>
            </Link>
            <p className="mt-3 text-sm text-ink-muted max-w-sm">
              1-on-1 mentorship for JEE and NEET aspirants — IITians and AIIMS/medical students, personalized plans, daily accountability.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <FooterCol h="Exams" items={[
              { l: "JEE Mentorship", to: "/jee" },
              { l: "NEET Mentorship", to: "/neet" },
              { l: "Meet Our Mentors", to: "/find-a-mentor" },
            ]} />
            <FooterCol h="Company" items={[
              { l: "Our Method", to: "/" },
              { l: "Resources", to: "/resources" },
              { l: "Become a Mentor", to: "/become-a-mentor" },
              { l: "Contact Us", to: "/contact" },
            ]} />
            <FooterCol h="Trust" items={[
              { l: "Trust & Safety", href: "#" },
              { l: "Privacy Policy", href: "#" },
              { l: "Terms", href: "#" },
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
      <ul className="mt-3 space-y-2 text-sm text-ink-muted">
        {items.map((it) => (
          <li key={it.l}>
            {it.to ? (
              <Link to={it.to} className="hover:text-ink">{it.l}</Link>
            ) : (
              <a href={it.href} className="hover:text-ink">{it.l}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
