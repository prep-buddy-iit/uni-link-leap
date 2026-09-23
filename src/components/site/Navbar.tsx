import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useApplicationModal } from "@/lib/application-modal";


export function Navbar() {
  const [open, setOpen] = useState(false);
  const { open: openApp } = useApplicationModal();
  const { pathname } = useLocation();

  const onJee = pathname === "/jee";
  const onNeet = pathname === "/neet";
  const onBecome = pathname === "/become-a-mentor";

  function handleTrial() {
    if (onJee) return openApp("trial", "jee");
    if (onNeet) return openApp("trial", "neet");
    return openApp("trial");
  }

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link
        to="/"
        onClick={onClick}
        activeOptions={{ exact: true }}
        className="text-sm font-medium text-ink-muted hover:text-primary-strong transition"
        activeProps={{ className: "text-ink" }}
      >
        Home
      </Link>
      <Link
        to="/jee"
        onClick={onClick}
        className={
          "text-sm font-medium transition rounded-full " +
          (onJee ? "bg-primary-strong text-white px-4 py-1.5 shadow-glass" : "text-ink-muted hover:text-primary-strong")
        }
      >
        JEE
      </Link>
      <Link
        to="/neet"
        onClick={onClick}
        className={
          "text-sm font-medium transition rounded-full " +
          (onNeet ? "bg-primary-strong text-white px-4 py-1.5 shadow-glass" : "text-ink-muted hover:text-primary-strong")
        }
      >
        NEET
      </Link>
      <Link
        to="/resources"
        onClick={onClick}
        className="text-sm font-medium text-ink-muted hover:text-primary-strong transition"
        activeProps={{ className: "text-ink" }}
      >
        Resources
      </Link>
      <Link
        to="/contact"
        onClick={onClick}
        className="text-sm font-medium text-ink-muted hover:text-primary-strong transition"
        activeProps={{ className: "text-ink" }}
      >
        Contact Us
      </Link>
    </>
  );

  const CTAs = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link
        to="/become-a-mentor"
        onClick={onClick}
        className={
          "inline-flex items-center rounded-full border-[1.5px] px-4 py-2 text-sm font-semibold transition " +
          (onBecome
            ? "bg-secondary text-white border-secondary shadow-glass"
            : "border-secondary text-secondary hover:bg-secondary hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(139,92,246,0.55)]")
        }
      >
        Become a Mentor
      </Link>
      <button
        onClick={() => {
          onClick?.();
          handleTrial();
        }}
        className="pill-btn pill-btn-primary pill-btn-primary-hover text-sm px-5 py-2"
      >
        Start Your Trial
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo.png"
            alt="PrepBuddy logo"
            className="h-10 w-10 rounded-lg object-cover shadow-soft"
          />


          <span className="font-display text-lg font-bold">PrepBuddy</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <CTAs />
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="md:hidden grid h-10 w-10 place-items-center rounded-xl border border-border"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white px-5 py-3">
          {/* Stacked links need a real tap target; the scope stops at the nav
              links so the CTA buttons keep their own sizing. */}
          <div className="flex flex-col [&>a]:block [&>a]:py-2.5">
            <NavLinks onClick={() => setOpen(false)} />
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:hidden">
            <CTAs onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
