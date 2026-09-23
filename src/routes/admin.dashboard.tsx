import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell, useAdminGate, AdminLoading, AdminDenied } from "@/components/site/AdminShell";
import { Users, GraduationCap, MessageSquare, FileText, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin dashboard - PrepBuddy CRM" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type Stats = {
  leads: { total: number; new: number; last7: number };
  mentors: { total: number; new: number; last7: number };
  contacts: { total: number; new: number; last7: number };
  submissions: { total: number; pending: number; approved: number };
};

function AdminDashboard() {
  const gate = useAdminGate();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (gate !== "ok") return;
    (async () => {
      const since = new Date(Date.now() - 7 * 864e5).toISOString();
      const [leads, mentors, contacts, subs] = await Promise.all([
        supabase.from("leads").select("status,created_at"),
        supabase.from("mentor_applications").select("status,created_at"),
        supabase.from("contact_submissions").select("status,created_at"),
        supabase.from("resource_submissions" as never).select("status"),
      ]);
      const bucket = (rows: { status: string; created_at: string }[] | null) => ({
        total: rows?.length ?? 0,
        new: rows?.filter((r) => r.status === "new").length ?? 0,
        last7: rows?.filter((r) => r.created_at >= since).length ?? 0,
      });
      const subRows = (subs.data ?? []) as unknown as { status: string }[];
      setStats({
        leads: bucket(leads.data as never),
        mentors: bucket(mentors.data as never),
        contacts: bucket(contacts.data as never),
        submissions: {
          total: subRows.length,
          pending: subRows.filter((r) => r.status === "pending").length,
          approved: subRows.filter((r) => r.status === "approved").length,
        },
      });
    })();
  }, [gate]);

  if (gate === "loading") return <AdminLoading />;
  if (gate === "denied") return <AdminDenied onSignOut={() => supabase.auth.signOut()} />;

  const cards = stats
    ? [
        { label: "Leads / Mentees", to: "/admin/leads", icon: Users, total: stats.leads.total, sub: `${stats.leads.new} new · ${stats.leads.last7} this week` },
        { label: "Mentor applications", to: "/admin/mentors", icon: GraduationCap, total: stats.mentors.total, sub: `${stats.mentors.new} new · ${stats.mentors.last7} this week` },
        { label: "Contact messages", to: "/admin/contacts", icon: MessageSquare, total: stats.contacts.total, sub: `${stats.contacts.new} new · ${stats.contacts.last7} this week` },
        { label: "Resource submissions", to: "/admin/resources", icon: FileText, total: stats.submissions.total, sub: `${stats.submissions.pending} pending · ${stats.submissions.approved} live` },
      ]
    : [];

  return (
    <AdminShell title="Overview" subtitle="Everything happening across your funnel at a glance.">
      {!stats ? (
        <p className="text-ink-muted">Loading stats…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <Link key={c.to} to={c.to} className="panel-raised rounded-2xl p-5 hover:border-primary/40 transition">
                <div className="flex items-center justify-between">
                  <c.icon className="h-5 w-5 text-primary" />
                  <TrendingUp className="h-4 w-4 text-ink-muted" />
                </div>
                <p className="mt-3 mono text-[10px] uppercase tracking-wider text-ink-muted">{c.label}</p>
                <p className="mt-1 font-display text-3xl font-bold">{c.total}</p>
                <p className="mt-1 text-xs text-ink-muted">{c.sub}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="panel-raised rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold">Weekly velocity</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-ink-muted">New leads (7d)</span><span className="mono font-semibold">{stats.leads.last7}</span></li>
                <li className="flex justify-between"><span className="text-ink-muted">New mentor apps (7d)</span><span className="mono font-semibold">{stats.mentors.last7}</span></li>
                <li className="flex justify-between"><span className="text-ink-muted">New contacts (7d)</span><span className="mono font-semibold">{stats.contacts.last7}</span></li>
              </ul>
            </div>
            <div className="panel-raised rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold">Needs your attention</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-ink-muted">Unreviewed leads</span><span className="mono font-semibold">{stats.leads.new}</span></li>
                <li className="flex justify-between"><span className="text-ink-muted">New mentor apps</span><span className="mono font-semibold">{stats.mentors.new}</span></li>
                <li className="flex justify-between"><span className="text-ink-muted">New messages</span><span className="mono font-semibold">{stats.contacts.new}</span></li>
                <li className="flex justify-between"><span className="text-ink-muted">Pending submissions</span><span className="mono font-semibold">{stats.submissions.pending}</span></li>
              </ul>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
