import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell, useAdminGate, AdminLoading, AdminDenied } from "@/components/site/AdminShell";
import { Search, Trash2, Download } from "lucide-react";

export const Route = createFileRoute("/admin/contacts")({
  head: () => ({
    meta: [
      { title: "Contact messages — Admin CRM" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminContacts,
});

type Msg = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  topic: string | null;
  message: string;
  status: string;
  created_at: string;
};

const STATUSES = ["new", "replied", "resolved", "spam"] as const;

function AdminContacts() {
  const gate = useAdminGate();
  const [rows, setRows] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState<Msg | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (gate !== "ok") return;
    supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setRows((data ?? []) as Msg[]);
    });
  }, [gate]);

  const filtered = useMemo(
    () => rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      const hay = `${r.name} ${r.phone ?? ""} ${r.email ?? ""} ${r.message} ${r.topic ?? ""}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    }),
    [rows, q, statusFilter],
  );

  async function updateStatus(id: string, status: string) {
    setBusy(id);
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    setBusy(null);
    if (error) return alert(error.message);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    if (open?.id === id) setOpen({ ...open, status });
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    setBusy(id);
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    setBusy(null);
    if (error) return alert(error.message);
    setRows((rs) => rs.filter((r) => r.id !== id));
    if (open?.id === id) setOpen(null);
  }

  function exportCsv() {
    const headers = ["created_at", "name", "phone", "email", "topic", "status", "message"];
    const csv = [
      headers.join(","),
      ...filtered.map((r) =>
        headers.map((h) => `"${String((r as unknown as Record<string, unknown>)[h] ?? "").replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-messages-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (gate === "loading") return <AdminLoading />;
  if (gate === "denied") return <AdminDenied onSignOut={() => supabase.auth.signOut()} />;

  return (
    <AdminShell title="Contact messages" subtitle={`${rows.length} messages via the contact form.`}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…"
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

      <div className="grid gap-3">
        {filtered.map((r) => (
          <div key={r.id} className="glass-strong rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg font-bold">{r.name}</span>
                  {r.topic && <span className="mono text-[10px] uppercase tracking-wider text-primary">· {r.topic}</span>}
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  {r.email && <>{r.email} · </>}{r.phone && <>{r.phone} · </>}<span className="mono">{new Date(r.created_at).toLocaleString()}</span>
                </p>
                <p className="mt-3 text-sm whitespace-pre-wrap line-clamp-3">{r.message}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <select value={r.status} disabled={busy === r.id} onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="rounded-lg border border-input bg-white px-2 py-1 text-xs">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex gap-1">
                  <button onClick={() => setOpen(r)} className="px-2 py-1 text-xs rounded-lg border border-input hover:bg-black/5">Read full</button>
                  <button onClick={() => remove(r.id)} disabled={busy === r.id} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-ink-muted py-16">No messages match your filters.</p>}
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(null)} className="absolute right-4 top-4 text-2xl">×</button>
            <h2 className="font-display text-2xl font-bold">{open.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">
              {open.email && <>{open.email} · </>}{open.phone && <>{open.phone} · </>}{new Date(open.created_at).toLocaleString()}
            </p>
            {open.topic && <p className="mt-2 mono text-xs uppercase tracking-wider text-primary">Topic: {open.topic}</p>}
            <div className="mt-6 whitespace-pre-wrap text-ink leading-relaxed">{open.message}</div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
