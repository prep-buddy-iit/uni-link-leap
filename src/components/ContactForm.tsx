import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2 } from "lucide-react";

const TOPICS = ["JEE Mentorship", "NEET Mentorship", "Becoming a Mentor", "Billing", "Something else"];

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "Please enter your name.";
    if (!phone.trim() && !email.trim()) errs.contact = "Please provide either phone or email.";
    if (!message.trim()) errs.message = "Please write a short message.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
      topic: topic || null,
      message: message.trim(),
    });
    setSubmitting(false);

    if (error) {
      console.error(error);
      setErrors({ _root: "Couldn't send. Please try again in a moment." });
      return;
    }
    setDone(true);
    setName(""); setPhone(""); setEmail(""); setTopic(""); setMessage("");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass-strong rounded-3xl p-6 sm:p-8 space-y-4">
      {done && (
        <div className="flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 mt-0.5" />
          Message received. We usually reply within 4 hours.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" error={errors.name}>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className={inputCls(!!errors.name)} placeholder="Your name" />
        </Field>
        <Field label="Phone">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel"
            className={inputCls(!!errors.contact)} placeholder="98XXXXXXXX" />
        </Field>
      </div>
      <Field label="Email" error={errors.contact}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
          className={inputCls(!!errors.contact)} placeholder="you@example.com" />
      </Field>
      <Field label="What's this about?">
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={inputCls(false)}>
          <option value="">Select a topic</option>
          {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Message" error={errors.message}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
          className={inputCls(!!errors.message)} placeholder="Tell us how we can help." />
      </Field>

      {errors._root && <p className="text-sm text-destructive">{errors._root}</p>}

      <button type="submit" disabled={submitting}
        className="w-full pill-btn pill-btn-primary pill-btn-primary-hover h-12 text-base disabled:opacity-70">
        {submitting ? (<><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>) : "Send message →"}
      </button>
    </form>
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
