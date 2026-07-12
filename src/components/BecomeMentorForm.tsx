import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2 } from "lucide-react";

const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS", "Other"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Graduated"];
const EXAMS = ["JEE", "NEET", "Both"];

export function BecomeMentorForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [exam, setExam] = useState("");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("");
  const [institute, setInstitute] = useState("");
  const [year, setYear] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "Please enter your full name.";
    if (!/^[0-9+\-\s]{10,15}$/.test(phone.trim())) errs.phone = "Please enter a valid phone number.";
    const rankNum = parseInt(rank, 10);
    if (!rankNum || rankNum < 1) errs.rank = "Please enter your rank.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    const { error } = await supabase.from("mentor_applications").insert({
      name: name.trim(),
      phone: phone.trim(),
      jee_rank: rankNum,
      exam: exam || null,
      category: category || null,
      iit_name: institute.trim() || null,
      year_of_study: year || null,
    });
    setSubmitting(false);

    if (error) {
      console.error(error);
      setErrors({ _root: "Couldn't submit. Please try again." });
      return;
    }
    setDone(true);
    setName(""); setPhone(""); setExam(""); setRank(""); setCategory(""); setInstitute(""); setYear("");
  }

  if (done) {
    return (
      <div className="glass-strong rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-white">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="font-display text-2xl font-bold">Application received</h3>
        <p className="mt-2 text-ink-muted">
          Our team reviews mentor applications weekly. You'll hear from us on the number you shared.
        </p>
        <p className="mt-4 mono text-xs text-emerald-700 bg-emerald-50 inline-block px-3 py-1.5 rounded-full">
          ✓ Submitted successfully
        </p>
        <div className="mt-5">
          <button onClick={() => setDone(false)}
            className="pill-btn border border-input text-ink hover:border-primary">
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass-strong rounded-3xl p-6 sm:p-8 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" error={errors.name}>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className={inputCls(!!errors.name)} placeholder="e.g. Aarav Sharma" />
        </Field>
        <Field label="Phone number" error={errors.phone}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel"
            className={inputCls(!!errors.phone)} placeholder="98XXXXXXXX" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Exam you want to mentor for">
          <select value={exam} onChange={(e) => setExam(e.target.value)} className={inputCls(false)}>
            <option value="">Select</option>
            {EXAMS.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Rank (JEE Advanced / NEET AIR)" error={errors.rank}>
          <input value={rank} onChange={(e) => setRank(e.target.value)} inputMode="numeric"
            className={inputCls(!!errors.rank)} placeholder="e.g. 312" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls(false)}>
            <option value="">Select</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Year of study">
          <select value={year} onChange={(e) => setYear(e.target.value)} className={inputCls(false)}>
            <option value="">Select</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Institute name (IIT or medical college)">
        <input value={institute} onChange={(e) => setInstitute(e.target.value)}
          className={inputCls(false)} placeholder="e.g. IIT Bombay / AIIMS Delhi" />
      </Field>

      {errors._root && <p className="text-sm text-destructive">{errors._root}</p>}

      <button type="submit" disabled={submitting}
        className="w-full pill-btn pill-btn-primary pill-btn-primary-hover h-12 text-base disabled:opacity-70">
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
        ) : (
          "Apply to be a mentor →"
        )}
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
