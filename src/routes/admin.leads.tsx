import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell, useAdminGate, AdminLoading, AdminDenied } from "@/components/site/AdminShell";
import { Search, Trash2, Download, Sparkles } from "lucide-react";
import { isGuidancePreviewLead, parseLeadNote } from "@/lib/guidance-preview/lead-note";
import { rebuildFullNote } from "@/lib/guidance-preview/engine";
import { getCategories } from "@/lib/guidance-preview/questions";
import type { ExamKey } from "@/components/ApplicationModal";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Leads / mentees - Admin CRM" },
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
  const [onlyPreviews, setOnlyPreviews] = useState(false);
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
      if (onlyPreviews && !isGuidancePreviewLead(r.notes)) return false;
      if (!q) return true;
      const hay = `${r.name} ${r.phone} ${r.email ?? ""} ${r.exam ?? ""} ${r.current_class}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [rows, q, statusFilter, onlyPreviews]);

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
    // subjects/problems carry the guidance preview's subject and ticked options.
    const headers = ["created_at", "name", "phone", "email", "exam", "current_class", "target_year", "prep_status", "plan", "source", "status", "subjects", "problems", "notes"];
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
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input type="checkbox" checked={onlyPreviews} onChange={(e) => setOnlyPreviews(e.target.checked)}
            className="h-4 w-4 accent-primary" />
          From guidance preview
        </label>
        <button onClick={exportCsv} className="pill-btn border border-input text-sm h-10 px-3">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="panel-raised rounded-2xl overflow-hidden">
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
                  <td className="p-3 font-semibold">
                    {r.name}
                    {isGuidancePreviewLead(r.notes) && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary-tint px-2 py-0.5 text-[10px] font-medium text-primary-deep align-middle">
                        <Sparkles className="h-2.5 w-2.5" /> Preview
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-ink-muted">
                    <div>{r.phone}</div>
                    {r.email && <div className="text-xs">{r.email}</div>}
                  </td>
                  <td className="p-3 text-ink-muted">
                    <div className="mono text-xs uppercase">{r.exam ?? "-"}</div>
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
              {!isGuidancePreviewLead(open.notes) && (
                <Field k="Problems" v={open.problems?.join(", ")} />
              )}
            </dl>
            {open.notes &&
              (isGuidancePreviewLead(open.notes) ? (
                <GuidancePreviewNote notes={open.notes} exam={open.exam} />
              ) : (
                <div className="mt-6">
                  <p className="mono text-[10px] uppercase tracking-wider text-ink-muted">Notes</p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{open.notes}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

/**
 * The mentor-side pickup point for the guidance preview's full note.
 *
 * The note is rebuilt here rather than stored: it is ~2,000 characters and
 * `leads.notes` is capped at 1,000, but it is fully determined by the ticked
 * ids, the exam and the free text, all of which are stored. The student never
 * sees it before signing up - only the teaser on the free result screen.
 *
 * It is a placeholder diagnosis assembled from a checklist. Once real mock-test
 * data is available, the actual diagnostic engine takes over here.
 */
function GuidancePreviewNote({ notes, exam }: { notes: string; exam: string | null }) {
  const { ids, freeText } = parseLeadNote(notes);
  const examKey: ExamKey = exam === "neet" ? "neet" : "jee";
  const fullNote = rebuildFullNote(ids, examKey, freeText);

  const categories = getCategories(examKey);
  // Anything the current questionnaire no longer defines - surfaced rather than
  // dropped, so an answer is never silently lost after a wording change.
  const known = new Set(categories.flatMap((c) => c.items.map((i) => i.id)));
  const unknown = ids.filter((id) => !known.has(id));

  return (
    <>
      <div className="mt-6">
        <p className="mono text-[10px] uppercase tracking-wider text-ink-muted">
          What they ticked ({ids.length})
        </p>
        <div className="mt-2 space-y-3">
          {categories.map((c) => {
            const picked = c.items.filter((i) => ids.includes(i.id));
            if (picked.length === 0) return null;
            return (
              <div key={c.key}>
                <p className="text-xs font-semibold text-ink">{c.question}</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-ink-muted">
                  {picked.map((i) => (
                    <li key={i.id}>{i.label}</li>
                  ))}
                </ul>
              </div>
            );
          })}
          {unknown.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-ink">No longer in the questionnaire</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-ink-muted">
                {unknown.map((id) => (
                  <li key={id} className="mono text-xs">
                    {id}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {ids.length === 0 && <p className="text-sm text-ink-muted">Nothing recorded.</p>}
        </div>
      </div>

      {freeText && (
        <div className="mt-6">
          <p className="mono text-[10px] uppercase tracking-wider text-ink-muted">In their words</p>
          <p className="mt-1 text-sm whitespace-pre-wrap">{freeText}</p>
        </div>
      )}
      <div className="mt-6 rounded-2xl border border-input bg-muted/40 p-4">
        <p className="mono text-[10px] uppercase tracking-wider text-ink-muted">
          Guidance preview · full note (not shown pre-trial)
        </p>
        <p className="mt-2 text-sm whitespace-pre-wrap leading-relaxed">{fullNote}</p>
      </div>
    </>
  );
}

function Field({ k, v }: { k: string; v: string | null | undefined }) {
  return (
    <div>
      <dt className="mono text-[10px] uppercase tracking-wider text-ink-muted">{k}</dt>
      <dd className="mt-0.5 text-ink">{v || "-"}</dd>
    </div>
  );
}
