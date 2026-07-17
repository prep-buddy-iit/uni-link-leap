import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, Loader2, MessageCircle, Send } from "lucide-react";
import { COMMUNITIES } from "@/lib/exam-content";

export type PlanKey = "trial" | "month1" | "month3" | "month6" | "session";
export type ExamKey = "jee" | "neet";

const PLAN_LABEL: Record<PlanKey, string> = {
  trial: "₹99 - 3-Day Trial",
  month1: "₹1,599 - 1 Month",
  month3: "₹3,999 - 3 Months",
  month6: "₹5,999 - 6 Months",
  session: "₹999 - 1:1 Session",
};

const PLAN_OPTIONS: PlanKey[] = ["trial", "month1", "month3", "month6", "session"];

const PROBLEMS = [
  "Lack of consistency",
  "Weak concepts",
  "Poor time management",
  "Low motivation",
  "Exam anxiety / stress",
  "Can't analyze mock mistakes",
  "Other",
];

const SOURCES = [
  "Instagram",
  "YouTube",
  "Facebook",
  "Google Search",
  "AI Search (ChatGPT / Perplexity etc.)",
  "Other",
];

const CLASSES = ["Class 11", "Class 12", "Dropper"];

type State = {
  name: string;
  phone: string;
  current_class: string;
  plan: PlanKey;
  problems: string[];
  source: string;
};

const empty = (plan: PlanKey = "trial"): State => ({
  name: "", phone: "", current_class: "", plan, problems: [], source: "",
});

export function ApplicationModal({
  open, onOpenChange, initialPlan, initialExam,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialPlan?: PlanKey;
  initialExam?: ExamKey;
}) {
  const [form, setForm] = useState<State>(empty(initialPlan ?? "trial"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(empty(initialPlan ?? "trial"));
      setErrors({});
      setSubmitted(false);
    }
  }, [open, initialPlan]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const exam: ExamKey | undefined = initialExam;
  const examLabel = exam === "neet" ? "NEET" : exam === "jee" ? "JEE" : null;
  const community = exam ? COMMUNITIES[exam] : null;

  function update<K extends keyof State>(k: K, v: State[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function toggleProblem(p: string) {
    setForm((f) => ({
      ...f,
      problems: f.problems.includes(p) ? f.problems.filter((x) => x !== p) : [...f.problems, p],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your full name.";
    const phone = form.phone.trim();
    if (!/^[0-9+\-\s]{10,15}$/.test(phone)) errs.phone = "Please enter a valid phone number.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: form.name.trim(),
      phone,
      email: null,
      current_class: form.current_class || "Not specified",
      plan: PLAN_LABEL[form.plan],
      problems: form.problems,
      source: form.source || null,
      subjects: [],
      exam: exam ?? null,
    });
    setSubmitting(false);

    if (error) {
      console.error(error);
      setErrors({ _root: "Something went wrong. Please try again in a moment." });
      return;
    }
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 backdrop-blur-sm p-0 sm:p-6"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-lift"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-ink-muted hover:bg-ink hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {!submitted ? (
          <form onSubmit={onSubmit} noValidate className="p-6 sm:p-8">
            <p className="eyebrow">{examLabel ? `${examLabel} Application` : "Application"}</p>
            <h2 className="mt-1 font-display text-2xl font-bold">
              Get matched with your{" "}
              <span className="text-gradient-primary">
                {exam === "neet" ? "AIIMS/medical mentor" : exam === "jee" ? "IITian mentor" : "topper mentor"}
              </span>
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              A human from our team responds within 4 hours.
            </p>

            <div className="mt-6 space-y-4">
              <FieldInput label="Full name" value={form.name} onChange={(v) => update("name", v)}
                error={errors.name} placeholder="e.g. Aarav Sharma" />
              <FieldInput label="Phone number" value={form.phone} onChange={(v) => update("phone", v)}
                error={errors.phone} type="tel" inputMode="tel" placeholder="98XXXXXXXX" />

              <FieldSelect label="Class" value={form.current_class}
                onChange={(v) => update("current_class", v)} options={CLASSES} placeholder="Select your class" />

              <FieldSelect label="Plan interested in" value={form.plan}
                onChange={(v) => update("plan", v as PlanKey)}
                options={PLAN_OPTIONS.map((k) => ({ value: k, label: PLAN_LABEL[k] }))} />

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Problems faced in preparation
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROBLEMS.map((p) => {
                    const active = form.problems.includes(p);
                    return (
                      <button type="button" key={p} onClick={() => toggleProblem(p)}
                        className={
                          "rounded-full border px-3.5 py-1.5 text-sm transition " +
                          (active
                            ? "gradient-primary text-white border-transparent"
                            : "bg-white border-input text-ink hover:border-primary")
                        }
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <FieldSelect label="How did you find PrepBuddy?" value={form.source}
                onChange={(v) => update("source", v)} options={SOURCES} placeholder="Select one" />
            </div>

            {errors._root && (
              <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errors._root}
              </p>
            )}

            <button type="submit" disabled={submitting}
              className="mt-6 w-full pill-btn pill-btn-primary pill-btn-primary-hover h-12 text-base disabled:opacity-70"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
              ) : (
                "Submit application →"
              )}
            </button>
            <p className="mt-3 text-xs text-ink-muted text-center">
              🔒 Your data is never shared or sold. See our privacy policy.
            </p>
          </form>
        ) : (
          <div className="p-6 sm:p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-white text-3xl">
              🎉
            </div>
            <h2 className="font-display text-2xl font-bold">You're in!</h2>
            <p className="mt-2 text-ink-muted">
              Our team will reach out within 4 hours. While you wait, join the community - daily
              motivation, doubt-solving, and mentor AMAs.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 text-left">
              <a href={community?.whatsapp ?? "https://chat.whatsapp.com/"} target="_blank" rel="noreferrer"
                className="group rounded-2xl p-4 text-white card-lift"
                style={{ backgroundImage: "linear-gradient(135deg,#22c35e,#12a04a)" }}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <MessageCircle className="h-5 w-5" /> {examLabel ? `${examLabel} WhatsApp` : "WhatsApp Community"}
                </div>
                <p className="mt-1 text-sm opacity-90">Daily study prompts & doubt-solving.</p>
                <p className="mt-3 text-sm font-semibold">Join →</p>
              </a>
              <a href={community?.telegram ?? "https://t.me/"} target="_blank" rel="noreferrer"
                className="group rounded-2xl p-4 text-white card-lift"
                style={{ backgroundImage: "linear-gradient(135deg,#2AABEE,#1e7fbf)" }}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Send className="h-5 w-5" /> {examLabel ? `${examLabel} Telegram` : "Telegram Community"}
                </div>
                <p className="mt-1 text-sm opacity-90">Mock discussions, mentor AMAs, notes.</p>
                <p className="mt-3 text-sm font-semibold">Join →</p>
              </a>
            </div>

            <button onClick={() => onOpenChange(false)}
              className="mt-6 pill-btn pill-btn-primary pill-btn-primary-hover px-8">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldInput({
  label, value, onChange, error, type = "text", placeholder, inputMode,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string;
  type?: string; placeholder?: string; inputMode?: "text" | "tel" | "email" | "numeric";
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      <input type={type} value={value} inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={
          "w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition " +
          (error ? "border-destructive" : "border-input focus:border-primary focus:ring-4 focus:ring-primary/15")
        } />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

type Option = string | { value: string; label: string };

function FieldSelect({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: Option[]; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-input bg-white px-4 py-3 text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/15">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const val = typeof o === "string" ? o : o.value;
          const lbl = typeof o === "string" ? o : o.label;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  );
}
