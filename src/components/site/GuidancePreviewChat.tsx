import { useMemo, useState } from "react";
import { ArrowRight, Loader2, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useApplicationModal } from "@/lib/application-modal";
import type { ExamKey } from "@/components/ApplicationModal";
import {
  EXAMS,
  SUBJECTS_BY_EXAM,
  getCategories,
  type CategoryKey,
} from "@/lib/guidance-preview/questions";
import {
  generateNote,
  scoreResponses,
  type Note,
  type Responses,
} from "@/lib/guidance-preview/engine";
import { saveGuidancePreviewLead } from "@/lib/guidance-preview/store";
import { FREE_TEXT_MAX } from "@/lib/guidance-preview/lead-note";
import { TRIAL_CTA_COPY } from "@/lib/guidance-preview/copy";

const STEP_EXAM = 0;
const STEP_SUBJECT = 1;
/** Categories occupy STEP_FIRST_CATEGORY .. STEP_FIRST_CATEGORY + count - 1. */
const STEP_FIRST_CATEGORY = 2;

/** Same shape the application modal accepts, so the two agree. */
const PHONE_RE = /^[0-9+\-\s]{10,15}$/;

type Result = {
  note: Note;
  exam: ExamKey;
  name: string;
  phone: string;
  saved: boolean;
};

export function GuidancePreviewChat({
  initialExam,
  className = "",
}: {
  /** Pre-selects the exam, e.g. from ?exam=jee. The student can still change it. */
  initialExam?: ExamKey;
  className?: string;
}) {
  const { open } = useApplicationModal();

  const [step, setStep] = useState(initialExam ? STEP_SUBJECT : STEP_EXAM);
  const [exam, setExam] = useState<ExamKey | undefined>(initialExam);
  const [subject, setSubject] = useState<string>("");
  const [responses, setResponses] = useState<Responses>({});
  const [freeText, setFreeText] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const categories = useMemo(() => (exam ? getCategories(exam) : []), [exam]);
  const freeTextStep = STEP_FIRST_CATEGORY + categories.length;
  const contactStep = freeTextStep + 1;

  const totalChecked = useMemo(
    () => Object.values(responses).reduce((n, ids) => n + (ids?.length ?? 0), 0),
    [responses],
  );

  function pickExam(next: ExamKey) {
    // Wording and subject list both depend on the exam, so a late change has to
    // clear answers rather than leave them attached to questions never asked.
    if (exam && exam !== next) {
      setResponses({});
      setSubject("");
    }
    setExam(next);
  }

  function toggle(category: CategoryKey, id: string) {
    setResponses((r) => {
      const current = r[category] ?? [];
      return {
        ...r,
        [category]: current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
      };
    });
  }

  async function finish() {
    if (!exam) return;
    if (totalChecked === 0) {
      toast.error("Tick at least one thing so there's something to read.");
      return;
    }

    const errs: { name?: string; phone?: string } = {};
    if (name.trim().length < 2) errs.name = "Please enter your name.";
    if (!PHONE_RE.test(phone.trim())) errs.phone = "Please enter a valid phone number.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);

    const scored = scoreResponses(responses);
    const trimmed = freeText.trim() || null;
    const note = generateNote(scored, exam, trimmed);

    // Straight into `leads` - the same anonymous insert every other form on the
    // site uses. The full note goes with it; only `note.teaser` is rendered.
    const saved = await saveGuidancePreviewLead({
      exam,
      subject,
      responses,
      freeText: trimmed,
      note,
      name,
      phone,
    });

    setSubmitting(false);
    setResult({ note, exam, name: name.trim(), phone: phone.trim(), saved });
    setStep(contactStep + 1);
  }

  if (result) {
    return (
      <ResultScreen
        note={result.note}
        saved={result.saved}
        className={className}
        onStartTrial={() => open("trial", result.exam, { name: result.name, phone: result.phone })}
      />
    );
  }

  const progress = Math.round((step / (contactStep + 1)) * 100);
  const subjects = exam ? SUBJECTS_BY_EXAM[exam] : [];

  return (
    <div className={"panel-raised rounded-3xl p-6 sm:p-8 " + className}>
      <div className="flex items-center gap-2 text-ink-muted">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="eyebrow !mb-0">Free guidance preview</p>
      </div>

      <div className="mt-4 h-1.5 w-full rounded-full bg-black/10" role="presentation">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${Math.max(progress, 4)}%` }}
        />
      </div>

      {step === STEP_EXAM && (
        <Step
          question="Which exam are you preparing for?"
          hint="Everything after this is worded for the one you pick."
        >
          <div className="flex flex-wrap gap-2">
            {EXAMS.map((e) => (
              <Chip key={e.key} active={exam === e.key} onClick={() => pickExam(e.key)}>
                {e.label} <span className="opacity-70">· {e.blurb}</span>
              </Chip>
            ))}
          </div>
          <Nav onNext={() => setStep(STEP_SUBJECT)} nextDisabled={!exam} nextLabel="Next" />
        </Step>
      )}

      {step === STEP_SUBJECT && (
        <Step
          question="Which subject is giving you the most trouble right now?"
          hint="Pick the one that worries you most - we'll go from there."
        >
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <Chip key={s} active={subject === s} onClick={() => setSubject(s)}>
                {s}
              </Chip>
            ))}
          </div>
          <Nav
            onBack={() => setStep(STEP_EXAM)}
            onNext={() => setStep(STEP_FIRST_CATEGORY)}
            nextDisabled={!subject}
            nextLabel="Start"
          />
        </Step>
      )}

      {categories.map((c, i) =>
        step === STEP_FIRST_CATEGORY + i ? (
          <Step key={c.key} question={c.question} hint={c.hint}>
            <div className="flex flex-col gap-2">
              {c.items.map((item) => {
                const active = (responses[c.key] ?? []).includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={
                      "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition " +
                      (active
                        ? "border-primary bg-primary/5 text-ink"
                        : "border-input bg-white text-ink hover:border-primary/60")
                    }
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggle(c.key, item.id)}
                      className="mt-0.5 h-4 w-4 accent-primary"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
            <Nav
              onBack={() => setStep(STEP_FIRST_CATEGORY + i - 1)}
              onNext={() => setStep(STEP_FIRST_CATEGORY + i + 1)}
              nextLabel={i === categories.length - 1 ? "Almost done" : "Next"}
            />
          </Step>
        ) : null,
      )}

      {step === freeTextStep && (
        <Step
          question="Anything else you want the mentor to know?"
          hint="Optional - a line or two is plenty."
        >
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={4}
            maxLength={FREE_TEXT_MAX}
            placeholder="e.g. I dropped a year and I'm scared it won't pay off."
            className="w-full rounded-2xl border border-input bg-white px-4 py-3 text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
          <Nav
            onBack={() => setStep(freeTextStep - 1)}
            onNext={() => setStep(contactStep)}
            nextLabel="Almost there"
          />
        </Step>
      )}

      {step === contactStep && (
        <Step
          question="Last thing - where do we send this?"
          hint="So your mentor can pick up where your answers leave off."
        >
          <div className="space-y-4">
            <Field label="Your name" value={name} onChange={setName} error={errors.name}
              placeholder="e.g. Aarav Sharma" />
            <Field label="Phone number" value={phone} onChange={setPhone} error={errors.phone}
              type="tel" inputMode="tel" placeholder="98XXXXXXXX" />
          </div>
          <Nav
            onBack={() => setStep(freeTextStep)}
            onNext={finish}
            nextLabel={submitting ? "Reading your answers…" : "See what this points at"}
            nextDisabled={submitting}
            busy={submitting}
          />
          <p className="mt-3 text-center text-xs text-ink-muted">
            🔒 Your data is never shared or sold.
          </p>
        </Step>
      )}
    </div>
  );
}

/**
 * The free result screen.
 *
 * Renders the teaser and nothing else. `fullNote`, the cluster keys and the
 * scores stay out of the DOM entirely - see `guidance-preview.test.tsx`.
 */
function ResultScreen({
  note,
  onStartTrial,
  saved,
  className = "",
}: {
  note: Note;
  onStartTrial: () => void;
  saved: boolean;
  className?: string;
}) {
  return (
    <div className={"panel-raised rounded-3xl p-6 sm:p-8 " + className}>
      <div className="flex items-center gap-2 text-ink-muted">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="eyebrow !mb-0">Here's what your answers point at</p>
      </div>

      <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold">
        <span className="text-primary">{note.teaserLabel}</span>
      </h2>

      <p className="mt-4 text-lg text-ink-muted leading-relaxed">{note.teaser}</p>

      <div className="mt-8 rounded-2xl border border-dashed border-input bg-white/60 p-5">
        <div className="flex items-center gap-2 text-ink">
          <Lock className="h-4 w-4 text-primary" />
          <p className="font-semibold">The rest of this is written up and waiting</p>
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          What's actually causing it, what to change first, and the order to do it in - your mentor
          walks you through the whole thing on day one.
        </p>
      </div>

      <button
        onClick={onStartTrial}
        className="mt-6 w-full pill-btn pill-btn-primary pill-btn-primary-hover h-12 text-base"
      >
        {TRIAL_CTA_COPY} <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-3 text-center text-xs text-ink-muted">
        {saved
          ? "Your answers are saved - your mentor reads them before you speak."
          : "We couldn't save your answers just now, but our team will still reach out."}
      </p>
    </div>
  );
}

function Step({
  question,
  hint,
  children,
}: {
  question: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h2 className="font-display text-xl sm:text-2xl font-bold">{question}</h2>
      <p className="mt-1.5 text-sm text-ink-muted">{hint}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  inputMode?: "text" | "tel";
}) {
  return (
    <div>
      {/* The input sits inside the label so the two are associated without ids. */}
      <label className="block">
        <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
        <input
          type={type}
          value={value}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={
            "w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition " +
            (error
              ? "border-destructive"
              : "border-input focus:border-primary focus:ring-4 focus:ring-primary/15")
          }
        />
      </label>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-4 py-2 text-sm transition " +
        (active
          ? "bg-primary text-white border-transparent"
          : "bg-white border-input text-ink hover:border-primary")
      }
    >
      {children}
    </button>
  );
}

function Nav({
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
  busy,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  busy?: boolean;
}) {
  return (
    <div className="mt-6 flex items-center gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="pill-btn border border-input bg-white text-ink-muted hover:text-ink"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="pill-btn pill-btn-primary pill-btn-primary-hover flex-1 disabled:opacity-70"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {nextLabel}
        {!busy && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  );
}
