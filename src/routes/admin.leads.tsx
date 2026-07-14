import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell, useAdminGate, AdminLoading, AdminDenied } from "@/components/site/AdminShell";
import { Search, Trash2, Download } from "lucide-react";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Leads / mentees — Admin CRM" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLeads,
});

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  current_class: string;
  target_year: string | null;
  prep_status: string | null;
  subjects: string[] | null;
  problems: string[] | null;
  plan: string | null;
  source: string | null;
  exam: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;

function AdminLeads() {
  const gate = useAdminGate();
  const [rows, setRows] = useState<Lead[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState<Lead | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (gate !== "ok") return;
    supabase.from("leads").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setRows((data ?? []) as Lead[]);
    });
  }, [gate]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      const hay = `${r.name} ${r.phone} ${r.email ?? ""} ${r.exam ?? ""} ${r.current_class}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [rows, q, statusFilter]);

  async function updateStatus(id: string, status: string) {
    setBusy(id);
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    setBusy(null);
    if (error) return alert(error.message);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    if (open?.id === id) setOpen({ ...open, status });
  }

  async function remove(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    setBusy(id);
    const { error } = await supabase.from("leads").delete().eq("id", id);
    setBusy(null);
    if (error) return alert(error.message);
    setRows((rs) => rs.filter((r) => r.id !== id));
    if (open?.id === id) setOpen(null);
  }

  function exportCsv() {
    const headers = ["created_at", "name", "phone", "email", "exam", "current_class", "target_year", "prep_status", "plan", "source", "status", "notes"];
    const csv = [
      headers.join(","),
      ...filtered.map((r) =>
        headers
          .map((h) => {
            const v = (r as unknown as Record<string, unknown>)[h];
            const s = v == null ? "" : String(v);
            return `"${s.replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (gate === "loading") return <AdminLoading />;
  if (gate === "denied") return <AdminDenied onSignOut={() => supabase.auth.signOut()} />;

  return (
    <AdminShell title="Leads / Mentees" subtitle={`${rows.length} total leads captured from the site.`}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, email…"
            className="w-full rounded-xl border border-input bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-input bg-white px-3 py-2.5 text-sm">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={exportCsv} className="pill-btn border border-input text-sm h-10 px-3">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5">
              <tr className="text-left">
                <th className="p-3 font-semibold">Name</th>
                <th className="p-3 font-semibold">Contact</th>
                <th className="p-3 font-semibold">Exam / Class</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Received</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border/40 hover:bg-black/[0.02]">
                  <td className="p-3 font-semibold">{r.name}</td>
                  <td className="p-3 text-ink-muted">
                    <div>{r.phone}</div>
                    {r.email && <div className="text-xs">{r.email}</div>}
                  </td>
                  <td className="p-3 text-ink-muted">
                    <div className="mono text-xs uppercase">{r.exam ?? "—"}</div>
                    <div className="text-xs">{r.current_class}{r.target_year ? ` · ${r.target_year}` : ""}</div>
                  </td>
                  <td className="p-3">
                    <select value={r.status} disabled={busy === r.id} onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="rounded-lg border border-input bg-white px-2 py-1 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-xs text-ink-muted mono">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => setOpen(r)} className="px-2 py-1 text-xs rounded-lg border border-input hover:bg-black/5">View</button>
                      <button onClick={() => remove(r.id)} disabled={busy === r.id} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center text-ink-muted">No leads match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(null)} className="absolute right-4 top-4 text-2xl">×</button>
            <h2 className="font-display text-2xl font-bold">{open.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">Received {new Date(open.created_at).toLocaleString()}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <Field k="Phone" v={open.phone} />
              <Field k="Email" v={open.email} />
              <Field k="Exam" v={open.exam?.toUpperCase()} />
              <Field k="Current class" v={open.current_class} />
              <Field k="Target year" v={open.target_year} />
              <Field k="Prep status" v={open.prep_status} />
              <Field k="Plan interested in" v={open.plan} />
              <Field k="Source" v={open.source} />
              <Field k="Subjects" v={open.subjects?.join(", ")} />
              <Field k="Problems" v={open.problems?.join(", ")} />
            </dl>
            {open.notes && (
              <div className="mt-6">
                <p className="mono text-[10px] uppercase tracking-wider text-ink-muted">Notes</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{open.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Field({ k, v }: { k: string; v: string | null | undefined }) {
  return (
    <div>
      <dt className="mono text-[10px] uppercase tracking-wider text-ink-muted">{k}</dt>
      <dd className="mt-0.5 text-ink">{v || "—"}</dd>
    </div>
  );
}
