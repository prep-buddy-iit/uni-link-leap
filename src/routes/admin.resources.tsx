import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Check, X as XIcon, Eye, Play, RotateCcw } from "lucide-react";
import {
  getSignedImageUrl,
  extractYouTubeId,
  type ResourceSubmission,
} from "@/lib/resource-submissions";
import { VideoLightbox } from "@/components/VideoLightbox";
import { AdminShell, useAdminGate, AdminLoading, AdminDenied } from "@/components/site/AdminShell";

type Tab = "pending" | "approved" | "rejected";

export const Route = createFileRoute("/admin/resources")({
  head: () => ({
    meta: [
      { title: "Admin — Resource submissions | PrepBuddy" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminResources,
});

function AdminResources() {
  const gate = useAdminGate();
  const [rows, setRows] = useState<ResourceSubmission[]>([]);
  const [urlMap, setUrlMap] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<Tab>("pending");
  const [busy, setBusy] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState<string | null>(null);
  const [openArticle, setOpenArticle] = useState<ResourceSubmission | null>(null);
  const [openPhoto, setOpenPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (gate !== "ok") return;
    (async () => {
      const { data, error } = await supabase
        .from("resource_submissions" as never)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return console.error(error);
      const list = (data ?? []) as unknown as ResourceSubmission[];
      setRows(list);
      const photos = list.filter((r) => r.kind === "photo" && r.image_url);
      const entries = await Promise.all(
        photos.map(async (r) => [r.id, await getSignedImageUrl(r.image_url!)] as const),
      );
      const map: Record<string, string> = {};
      for (const [id, url] of entries) if (url) map[id] = url;
      setUrlMap(map);
    })();
  }, [gate]);

  async function updateStatus(id: string, status: "approved" | "rejected" | "pending") {
    setBusy(id);
    const { data: sess } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("resource_submissions" as never)
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: sess.session?.user.id ?? null,
      } as never)
      .eq("id", id);
    setBusy(null);
    if (error) return alert(error.message);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  if (gate === "loading") return <AdminLoading />;
  if (gate === "denied") return <AdminDenied onSignOut={() => supabase.auth.signOut()} />;

  const filtered = rows.filter((r) => r.status === tab);
  const counts = {
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
  };

  return (
    <AdminShell title="Resource submissions" subtitle="Approve or reject community-submitted resources.">
      <div className="flex flex-wrap gap-1.5 border-b border-border/60 mb-6">
        {(["pending", "approved", "rejected"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={
              "px-4 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition " +
              (tab === t ? "border-primary text-primary" : "border-transparent text-ink-muted hover:text-ink")
            }>
            {t} <span className="ml-1 mono text-xs text-ink-muted">({counts[t]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-ink-muted py-16">Nothing here.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="glass-strong rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mono text-[10px] uppercase tracking-wider text-primary">{r.kind}</span>
                    <span className="mono text-[10px] uppercase tracking-wider text-ink-muted">· {r.exam}</span>
                    <span className="mono text-[10px] text-ink-muted">· {new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold">{r.title}</h3>
                  {r.description && <p className="mt-1 text-sm text-ink-muted">{r.description}</p>}
                  <p className="mt-2 text-xs text-ink-muted">
                    By <span className="font-semibold text-ink">{r.submitter_name}</span> · {r.submitter_email}
                    {r.submitter_credential && <> · {r.submitter_credential}</>}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {r.kind === "article" && (
                    <button onClick={() => setOpenArticle(r)} className="pill-btn border border-input text-sm h-9 px-3">
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </button>
                  )}
                  {r.kind === "video" && r.youtube_url && (
                    <button onClick={() => setVideoOpen(extractYouTubeId(r.youtube_url!) ?? "")} className="pill-btn border border-input text-sm h-9 px-3">
                      <Play className="h-3.5 w-3.5" /> Play
                    </button>
                  )}
                  {r.kind === "photo" && urlMap[r.id] && (
                    <button onClick={() => setOpenPhoto(urlMap[r.id])} className="pill-btn border border-input text-sm h-9 px-3">
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                  )}
                  {r.status !== "approved" && (
                    <button onClick={() => updateStatus(r.id, "approved")} disabled={busy === r.id}
                      className="pill-btn pill-btn-primary pill-btn-primary-hover text-sm h-9 px-3 disabled:opacity-70">
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button onClick={() => updateStatus(r.id, "rejected")} disabled={busy === r.id}
                      className="pill-btn border border-destructive text-destructive text-sm h-9 px-3 disabled:opacity-70">
                      <XIcon className="h-3.5 w-3.5" /> Reject
                    </button>
                  )}
                  {r.status !== "pending" && (
                    <button onClick={() => updateStatus(r.id, "pending")} disabled={busy === r.id}
                      className="pill-btn border border-input text-ink-muted text-sm h-9 px-3">
                      <RotateCcw className="h-3.5 w-3.5" /> Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-ink-muted text-center pt-8">
        Approved items appear on the public{" "}
        <Link to="/resources" className="text-primary font-semibold">Resources page</Link>.
      </p>

      <VideoLightbox open={videoOpen !== null} onClose={() => setVideoOpen(null)} videoId={videoOpen ?? ""} />

      {openArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm" onClick={() => setOpenArticle(null)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenArticle(null)} className="absolute right-4 top-4 rounded-full p-2 hover:bg-black/5">
              <XIcon className="h-5 w-5" />
            </button>
            <h2 className="font-display text-2xl font-bold">{openArticle.title}</h2>
            {openArticle.description && <p className="mt-2 text-ink-muted italic">{openArticle.description}</p>}
            <div className="mt-6 whitespace-pre-wrap text-ink leading-relaxed">{openArticle.body}</div>
          </div>
        </div>
      )}

      {openPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm" onClick={() => setOpenPhoto(null)}>
          <img src={openPhoto} alt="Submission" className="max-h-[90vh] max-w-full rounded-2xl" />
        </div>
      )}
    </AdminShell>
  );
}
