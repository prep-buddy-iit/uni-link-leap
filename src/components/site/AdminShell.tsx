import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Loader2, LogOut, LayoutDashboard, Users, GraduationCap, MessageSquare, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageBackdrop } from "@/components/site/PageBackdrop";

const NAV = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/leads", label: "Leads / Mentees", icon: Users },
  { to: "/admin/mentors", label: "Mentor Apps", icon: GraduationCap },
  { to: "/admin/contacts", label: "Contact Msgs", icon: MessageSquare },
  { to: "/admin/resources", label: "Resources", icon: FileText },
] as const;

export function useAdminGate() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate({ to: "/admin/login" });
        return;
      }
      const { data: ok, error } = await supabase.rpc("has_role", {
        _user_id: sess.session.user.id,
        _role: "admin",
      });
      if (error) {
        console.error("[admin] has_role failed", error);
        setState("denied");
        return;
      }
      setState(ok ? "ok" : "denied");
    })();
  }, [navigate]);

  return state;
}

export function AdminShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main>
        <section className="relative">
          <PageBackdrop />
          <div className="mx-auto max-w-7xl px-5 pt-14 pb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Admin CRM</p>
                <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold">{title}</h1>
                {subtitle && <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>}
              </div>
              <button onClick={signOut} className="pill-btn border border-input text-ink-muted hover:text-ink">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5">
          <nav className="flex flex-wrap gap-1.5 border-b border-border/60 mb-6 overflow-x-auto">
            {NAV.map((n) => {
              const active = pathname === n.to || pathname.startsWith(n.to + "/");
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={
                    "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition whitespace-nowrap " +
                    (active ? "border-primary text-primary" : "border-transparent text-ink-muted hover:text-ink")
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="pb-24">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="min-h-screen grid place-items-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

export function AdminDenied({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Not authorised</h1>
        <p className="mt-2 text-ink-muted">Your account does not have admin access.</p>
        <button onClick={onSignOut} className="mt-6 pill-btn border border-input">Sign out</button>
      </main>
      <Footer />
    </div>
  );
}
