import { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { extractYouTubeId, uploadSubmissionImage, type SubmissionKind, type SubmissionExam } from "@/lib/resource-submissions";

export function ResourceSubmissionForm({ onClose }: { onClose: () => void }) {
  const [kind, setKind] = useState<SubmissionKind>("article");
  const [exam, setExam] = useState<SubmissionExam>("both");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [credential, setCredential] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (title.trim().length < 4) errs.title = "Please add a clear title (min 4 chars).";
    if (name.trim().length < 2) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email.";
    if (kind === "article" && body.trim().length < 100) errs.body = "Article body should be at least 100 characters.";
    if (kind === "video") {
      const id = extractYouTubeId(youtubeUrl);
      if (!id) errs.youtubeUrl = "Please paste a valid YouTube URL.";
    }
    if (kind === "photo" && !file) errs.file = "Please choose an image.";
    if (kind === "photo" && file && file.size > 8 * 1024 * 1024) errs.file = "Image must be under 8MB.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      let imagePath: string | null = null;
      if (kind === "photo" && file) {
        imagePath = await uploadSubmissionImage(file);
      }
      const payload = {
        kind,
        title: title.trim(),
        description: description.trim() || null,
        body: kind === "article" ? body.trim() : null,
        youtube_url: kind === "video" ? youtubeUrl.trim() : null,
        image_url: imagePath,
        exam,
        submitter_name: name.trim(),
        submitter_email: email.trim(),
        submitter_credential: credential.trim() || null,
      };
      const { error } = await supabase.from("resource_submissions" as never).insert(payload as never);
      if (error) throw error;
      setDone(true);
    } catch (err) {
      console.error(err);
      setErrors({ _root: "Couldn't submit. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-lift" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full p-2 hover:bg-black/5" aria-label="Close">
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl font-bold">Thanks - submission received</h3>
            <p className="mt-2 text-ink-muted max-w-md mx-auto">
              Our team reviews submissions within a few days. If it's approved, you'll see it live on the Resources page.
            </p>
            <button onClick={onClose} className="mt-6 pill-btn pill-btn-primary pill-btn-primary-hover">Done</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="p-6 sm:p-8 space-y-5">
            <div>
              <p className="eyebrow">Submit to Resources</p>
              <h3 className="mt-2 font-display text-2xl font-bold">Share your article, video, or campus photo</h3>
              <p className="mt-1 text-sm text-ink-muted">
                Every submission is reviewed by our team before it goes live.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">What are you submitting?</label>
              <div className="grid grid-cols-3 gap-2">
                {(["article", "video", "photo"] as const).map((k) => (
                  <button type="button" key={k} onClick={() => setKind(k)}
                    className={
                      "rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize transition " +
                      (kind === k ? "border-primary bg-primary-tint text-primary-deep" : "border-input text-ink-muted hover:text-ink")
                    }>
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title" error={errors.title}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls(!!errors.title)}
                  placeholder={kind === "photo" ? "e.g. IIT Bombay main gate at dusk" : "A short, clear title"} maxLength={140} />
              </Field>
              <Field label="Which exam?">
                <select value={exam} onChange={(e) => setExam(e.target.value as SubmissionExam)} className={inputCls(false)}>
                  <option value="both">Both / General</option>
                  <option value="jee">JEE</option>
                  <option value="neet">NEET</option>
                </select>
              </Field>
            </div>

            <Field label="Short description (optional)">
              <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls(false)}
                placeholder="One-line summary shown in the card" maxLength={200} />
            </Field>

            {kind === "article" && (
              <Field label="Article body" error={errors.body}>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8}
                  className={inputCls(!!errors.body) + " resize-y"}
                  placeholder="Write your article here. Plain text - use line breaks between paragraphs." maxLength={12000} />
                <p className="mt-1 text-xs text-ink-muted">{body.length} / 12000 characters</p>
              </Field>
            )}

            {kind === "video" && (
              <Field label="YouTube URL" error={errors.youtubeUrl}>
                <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className={inputCls(!!errors.youtubeUrl)}
                  placeholder="https://www.youtube.com/watch?v=..." />
              </Field>
            )}

            {kind === "photo" && (
              <Field label="Photo (JPG/PNG, max 8MB)" error={errors.file}>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-ink file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2.5 file:text-primary file:font-semibold hover:file:bg-primary/15" />
              </Field>
            )}

            <div className="pt-4 border-t border-border/60">
              <p className="text-sm font-semibold mb-3">About you</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Your name" error={errors.name}>
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls(!!errors.name)} maxLength={80} />
                </Field>
                <Field label="Your email" error={errors.email}>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls(!!errors.email)}
                    placeholder="We'll reach out if we need clarification" type="email" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Your credential (optional)">
                  <input value={credential} onChange={(e) => setCredential(e.target.value)} className={inputCls(false)}
                    placeholder="e.g. AIR 512, IIT Delhi CSE · Class 12 student" maxLength={120} />
                </Field>
              </div>
            </div>

            {errors._root && <p className="text-sm text-destructive">{errors._root}</p>}

            <button type="submit" disabled={submitting}
              className="w-full pill-btn pill-btn-primary pill-btn-primary-hover h-12 text-base disabled:opacity-70">
              {submitting ? (<><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>) : "Submit for review →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function inputCls(err: boolean) {
  return "w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition "
    + (err ? "border-destructive" : "border-input focus:border-primary focus:ring-4 focus:ring-primary/15");
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
