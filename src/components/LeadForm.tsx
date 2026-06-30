import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const SUBJECTS = [
  "Physics",
  "Chemistry",
  "Maths",
  "General Strategy",
  "IIT Branch Guidance",
];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  current_class: z.string().min(1, "Select your class"),
  target_year: z.string().min(1, "Select your target year"),
  prep_status: z.string().min(1, "Select your prep status"),
  subjects: z.array(z.string()).min(1, "Pick at least one focus area"),
  notes: z.string().max(1000).optional(),
});

type FormState = z.infer<typeof schema>;

const empty: FormState = {
  name: "",
  phone: "",
  email: "",
  current_class: "",
  target_year: "",
  prep_status: "",
  subjects: [],
  notes: "",
};

export function LeadForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleSubject(subject: string) {
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(subject)
        ? f.subjects.filter((s) => s !== subject)
        : [...f.subjects, subject],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      current_class: parsed.data.current_class,
      target_year: parsed.data.target_year,
      prep_status: parsed.data.prep_status,
      subjects: parsed.data.subjects,
      notes: parsed.data.notes || null,
    });
    setSubmitting(false);
    if (error) {
      console.error(error);
      toast.error("Couldn't submit. Please try again.");
      return;
    }
    setDone(true);
    setForm(empty);
  }

  if (done) {
    return (
      <div className="rounded-3xl bg-card p-10 text-center shadow-sunset border border-border">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full gradient-warm text-white">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold">You're in. 🚀</h3>
        <p className="mt-3 text-muted-foreground">
          An IITian mentor lead from our team will reach out within 24 hours on
          your phone or email. Keep an eye out!
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setDone(false)}
        >
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-card p-6 sm:p-8 shadow-sunset border border-border space-y-5"
      noValidate
    >
      <div className="flex items-center gap-2 text-sm font-medium text-accent">
        <Sparkles className="h-4 w-4" /> Free 1:1 mentor matching
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" error={errors.name}>
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Rohan Sharma"
            autoComplete="name"
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <Input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="98XXXXXXXX"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>
      </div>

      <Field label="Email" error={errors.email}>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Current class" error={errors.current_class}>
          <Select
            value={form.current_class}
            onValueChange={(v) => update("current_class", v)}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Class 11">Class 11</SelectItem>
              <SelectItem value="Class 12">Class 12</SelectItem>
              <SelectItem value="Dropper">Dropper</SelectItem>
              <SelectItem value="Below Class 11">Below Class 11</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Target year" error={errors.target_year}>
          <Select
            value={form.target_year}
            onValueChange={(v) => update("target_year", v)}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="JEE 2026">JEE 2026</SelectItem>
              <SelectItem value="JEE 2027">JEE 2027</SelectItem>
              <SelectItem value="JEE 2028">JEE 2028</SelectItem>
              <SelectItem value="Later">Later</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Prep status" error={errors.prep_status}>
          <Select
            value={form.prep_status}
            onValueChange={(v) => update("prep_status", v)}
          >
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Self-study">Self-study</SelectItem>
              <SelectItem value="Offline coaching">Offline coaching</SelectItem>
              <SelectItem value="Online coaching">Online coaching</SelectItem>
              <SelectItem value="Just starting">Just starting</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="What do you want help with?" error={errors.subjects}>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => {
            const active = form.subjects.includes(s);
            return (
              <button
                type="button"
                key={s}
                onClick={() => toggleSubject(s)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "gradient-warm text-white border-transparent shadow-soft"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Anything else? (optional)" error={errors.notes}>
        <Textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Mock test scores, target college, weak topics..."
          rows={3}
          maxLength={1000}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full gradient-sunset text-white font-semibold text-base h-12 hover:opacity-95"
      >
        {submitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
        ) : (
          "Get matched with an IITian mentor"
        )}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        We respect your privacy. Your details are only used to match you with a mentor.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
