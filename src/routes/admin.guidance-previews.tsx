import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell, useAdminGate, AdminLoading, AdminDenied } from "@/components/site/AdminShell";
import { Search, Trash2 } from "lucide-react";
import { CATEGORY_KEYS, getCategories, getItem } from "@/lib/guidance-preview/questions";
import type { ExamKey } from "@/components/ApplicationModal";
import type { Responses } from "@/lib/guidance-preview/engine";

export const Route = createFileRoute("/admin/guidance-previews")({
  head: () => ({
    meta: [
      { title: "Guidance previews - Admin CRM" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminGuidancePreviews,
});

type Preview = {
  id: string;
  created_at: string;
  exam: ExamKey;
  subject: string;
  responses: Responses;
  free_text: string | null;
  primary_cluster: string;
  secondary_cluster: string | null;
  full_note: string;
  handed_off: boolean;
};

type MatchedLead = { id: string; name: string; phone: string; guidance_preview_id: string | null };

function AdminGuidancePreviews() {
  const gate = useAdminGate();
  const [rows, setRows] = useState<Preview[]>([]);
  const [leads, setLeads] = useState<MatchedLead[]>([]);
  const [q, setQ] = useState("");
  const [onlyUnmatched, setOnlyUnmatched] = useState(false);
  const [open, setOpen] = useState<Preview | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (gate !== "ok") return;
    supabase
      .from("guidance_preview_responses")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data ?? []) as unknown as Preview[]));
    supabase
      .from("leads")
      .select("id,name,phone,guidance_preview_id")
      .not("guidance_preview_id", "is", null)
      .then(({ data }) => setLeads((data ?? []) as MatchedLead[]));
  }, [gate]);

  const leadByPreview = useMemo(() => {
    const m: Record<string, MatchedLead> = {};
    for (const l of leads) if (l.guidance_preview_id) m[l.guidance_preview_id] = l;
    return m;
  }, [leads]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (onlyUnmatched && r.handed_off) return false;
      if (!q) return true;
      const lead = leadByPreview[r.id];
      const hay = `${r.exam} ${r.subject} ${r.free_text ?? ""} ${lead?.name ?? ""} ${lead?.phone ?? ""}`;
      return hay.toLowerCase().includes(q.toLowerCase());
    });
  }, [rows, q, onlyUnmatched, leadByPreview]);

  const unmatchedCount = rows.filter((r) => !r.handed_off).length;

  async function remove(id: string) {
    if (!confirm("Delete this guidance preview permanently?")) return;
    setBusy(id);
    const { error } = await supabase.from("guidance_preview_responses").delete().eq("id", id);
    setBusy(null);
    if (error) return alert(error.message);
    setRows((rs) => rs.filter((r) => r.id !== id));
    if (open?.id === id) setOpen(null);
  }

  if (gate === "loading") return <AdminLoading />;
  if (gate === "denied") return <AdminDenied onSignOut={() => supabase.auth.signOut()} />;

  return (
    <AdminShell
      title="Guidance Previews"
      subtitle={`${rows.length} previews taken · ${unmatchedCount} not yet matched to a trial signup.`}
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search subject, notes, matched name or phone…"
            className="w-full rounded-xl border border-input bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={onlyUnmatched}
            onChange={(e) => setOnlyUnmatched(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Only unmatched
        </label>
      </div>

      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5">
              <tr className="text-left">
                <th className="p-3 font-semibold">Subject</th>
                <th className="p-3 font-semibold">Ticked</th>
                <th className="p-3 font-semibold">Matched to</th>
                <th className="p-3 font-semibold">Taken</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const lead = leadByPreview[r.id];
                const ticked = CATEGORY_KEYS.reduce(
                  (n, key) => n + (r.responses?.[key]?.length ?? 0),
                  0,
                );
                return (
                  <tr key={r.id} className="border-t border-border/40 hover:bg-black/[0.02]">
                    <td className="p-3 font-semibold">
                      <div className="mono text-xs uppercase text-ink-muted">{r.exam}</div>
                      <div>{r.subject}</div>
                    </td>
                    <td className="p-3 text-ink-muted">{ticked} items</td>
                    <td className="p-3 text-ink-muted">
                      {lead ? (
                        <>
                          <div>{lead.name}</div>
                          <div className="text-xs">{lead.phone}</div>
                        </>
                      ) : (
                        <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs">
                          Unmatched
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-ink-muted mono">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setOpen(r)}
                          className="px-2 py-1 text-xs rounded-lg border border-input hover:bg-black/5"
                        >
                          View
                        </button>
                        <button
                          onClick={() => remove(r.id)}
                          disabled={busy === r.id}
                          className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-ink-muted">
                    No guidance previews match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <PreviewDetail preview={open} lead={leadByPreview[open.id]} onClose={() => setOpen(null)} />
      )}
    </AdminShell>
  );
}

function PreviewDetail({
  preview,
  lead,
  onClose,
}: {
  preview: Preview;
  lead?: MatchedLead;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-2xl">
          ×
        </button>
        <h2 className="font-display text-2xl font-bold">
          {preview.exam.toUpperCase()} · {preview.subject}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Taken {new Date(preview.created_at).toLocaleString()} ·{" "}
          {lead ? `matched to ${lead.name} (${lead.phone})` : "not yet matched to a trial signup"}
        </p>

        <div className="mt-6">
          <p className="mono text-[10px] uppercase tracking-wider text-ink-muted">
            What they ticked
          </p>
          <div className="mt-2 space-y-3">
            {getCategories(preview.exam).map((c) => {
              const ids = preview.responses?.[c.key] ?? [];
              if (ids.length === 0) return null;
              return (
                <div key={c.key}>
                  <p className="text-xs font-semibold text-ink">{c.question}</p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-ink-muted">
                    {ids.map((id) => (
                      <li key={id}>{getItem(id, preview.exam)?.label ?? id}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {preview.free_text && (
          <div className="mt-6">
            <p className="mono text-[10px] uppercase tracking-wider text-ink-muted">
              In their words
            </p>
            <p className="mt-1 text-sm whitespace-pre-wrap">{preview.free_text}</p>
          </div>
        )}

        {/*
          This is where the trial/mentor-side experience picks up the stored
          fullNote - the student never sees it before signing up for the ₹99
          trial, only the teaser on the free result screen.

          It is a placeholder diagnosis assembled from a checklist. Once real
          mock-test data is flowing, the actual diagnostic engine takes over
          here and this template-generated note goes away.
        */}
        <div className="mt-6 rounded-2xl border border-input bg-muted/40 p-4">
          <p className="mono text-[10px] uppercase tracking-wider text-ink-muted">
            Full note (mentor-side · not shown pre-trial)
          </p>
          <p className="mt-2 text-sm whitespace-pre-wrap leading-relaxed">{preview.full_note}</p>
        </div>
      </div>
    </div>
  );
}
