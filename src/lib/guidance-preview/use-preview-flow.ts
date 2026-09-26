import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ExamKey } from "@/components/ApplicationModal";
import {
  CATEGORY_KEYS,
  SUBJECTS_BY_EXAM,
  getCategories,
  type Category,
  type CategoryKey,
} from "./questions";
import { generateNote, scoreResponses, type Note, type Responses } from "./engine";
import { saveGuidancePreviewLead } from "./store";

/**
 * The questionnaire as a headless state machine.
 *
 * This file owns *when* each question is asked and what happens on finish. It
 * owns no markup, so the same flow can be driven by the floating bot, a page
 * section, or a test, without a second copy of the questions or the scoring.
 */

/** One question, in the order the student meets it. */
export type Step =
  | { kind: "exam" }
  | { kind: "subject"; options: readonly string[] }
  | { kind: "category"; category: Category }
  | { kind: "freeText" }
  | { kind: "contact" };

/**
 * exam + subject + one per category + free text + contact.
 *
 * Known before an exam has been picked, because no question is ever skipped -
 * only its wording depends on the exam. Progress can therefore be shown from
 * the very first message.
 */
export const TOTAL_STEPS = 2 + CATEGORY_KEYS.length + 2;

/** Same shape the application modal accepts, so the two agree. */
const PHONE_RE = /^[0-9+\-\s]{10,15}$/;

export type PreviewResult = {
  note: Note;
  exam: ExamKey;
  name: string;
  phone: string;
  /** False when the write to `leads` failed. The teaser shows either way. */
  storedOk: boolean;
  /**
   * The `leads` row this questionnaire wrote. Handed to the trial form so the
   * signup can point back at these answers. Null if the write failed.
   */
  leadId: string | null;
};

/** Why `finish()` declined to submit, so the caller can say so its own way. */
export type FinishOutcome = { ok: true } | { ok: false; reason: "empty" | "invalid" };

/**
 * Enough to put a half-finished prep check back on screen after a reload.
 *
 * Name and phone are deliberately left out: they are the only personal data the
 * questionnaire holds, and a corner widget has no business keeping them in
 * browser storage. A reload at the last step costs two fields, nothing else.
 */
type SavedFlow = {
  v: 1;
  stepIndex: number;
  exam?: ExamKey;
  subject: string;
  responses: Responses;
  freeText: string;
  finished: boolean;
  /** Kept so a reload does not sever the link to the trial signup. */
  leadId: string | null;
};

const STORAGE_KEY = "prepbuddy.prep-check.v1";

function readSaved(): SavedFlow | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedFlow;
    return parsed?.v === 1 ? parsed : null;
  } catch {
    // Private mode, storage disabled, or a shape we no longer understand.
    return null;
  }
}

function writeSaved(saved: SavedFlow) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    /* Storage being unavailable must never break the questionnaire. */
  }
}

function clearSaved() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function usePreviewFlow() {
  const [exam, setExam] = useState<ExamKey | undefined>(undefined);
  const [subject, setSubject] = useState("");
  const [responses, setResponses] = useState<Responses>({});
  const [freeText, setFreeText] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PreviewResult | null>(null);
  const [ready, setReady] = useState(false);

  // sessionStorage does not exist while the page is server-rendered, and
  // reading it during render would make the first paint disagree with the
  // server's. So it is read once, after mount.
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const saved = readSaved();
    if (saved) {
      setExam(saved.exam);
      setSubject(saved.subject ?? "");
      setResponses(saved.responses ?? {});
      setFreeText(saved.freeText ?? "");
      setStepIndex(saved.stepIndex ?? 0);

      // The note is fully derivable from the answers, so it is recomputed
      // rather than stored - the gated full note never sits in the browser.
      if (saved.finished && saved.exam) {
        setResult({
          note: generateNote(
            scoreResponses(saved.responses ?? {}),
            saved.exam,
            saved.freeText?.trim() || null,
          ),
          exam: saved.exam,
          name: "",
          phone: "",
          storedOk: saved.leadId !== null,
          leadId: saved.leadId ?? null,
        });
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    // Guarded on `ready` so the empty initial state cannot overwrite saved
    // progress in the render between mount and hydration.
    if (!ready) return;
    writeSaved({
      v: 1,
      stepIndex,
      exam,
      subject,
      responses,
      freeText,
      finished: result !== null,
      leadId: result?.leadId ?? null,
    });
  }, [ready, stepIndex, exam, subject, responses, freeText, result]);

  const steps = useMemo<Step[]>(() => {
    if (!exam) return [{ kind: "exam" }];
    return [
      { kind: "exam" },
      { kind: "subject", options: SUBJECTS_BY_EXAM[exam] },
      ...getCategories(exam).map((category) => ({ kind: "category", category }) as const),
      { kind: "freeText" },
      { kind: "contact" },
    ];
  }, [exam]);

  const current = steps[stepIndex] ?? null;

  const totalChecked = useMemo(
    () => Object.values(responses).reduce((n, ids) => n + (ids?.length ?? 0), 0),
    [responses],
  );

  const advance = useCallback(() => setStepIndex((i) => i + 1), []);

  const chooseExam = useCallback(
    (next: ExamKey) => {
      // Wording and subject list both depend on the exam, so a late change has
      // to clear answers rather than leave them attached to questions that were
      // never asked in those words.
      if (exam && exam !== next) {
        setResponses({});
        setSubject("");
      }
      setExam(next);
      setStepIndex(1);
    },
    [exam],
  );

  /** Pre-selects the exam from a link, e.g. /guidance-preview?exam=jee. */
  const presetExam = useCallback(
    (next: ExamKey) => {
      // Only ever a starting hint - a student already part-way through keeps
      // the exam they picked for themselves.
      if (exam || stepIndex > 0) return;
      setExam(next);
      setStepIndex(1);
    },
    [exam, stepIndex],
  );

  const chooseSubject = useCallback(
    (next: string) => {
      setSubject(next);
      advance();
    },
    [advance],
  );

  const toggleItem = useCallback((category: CategoryKey, id: string) => {
    setResponses((r) => {
      const picked = r[category] ?? [];
      return {
        ...r,
        [category]: picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id],
      };
    });
  }, []);

  const back = useCallback(() => setStepIndex((i) => Math.max(0, i - 1)), []);

  const restart = useCallback(() => {
    clearSaved();
    setExam(undefined);
    setSubject("");
    setResponses({});
    setFreeText("");
    setName("");
    setPhone("");
    setErrors({});
    setResult(null);
    setStepIndex(0);
  }, []);

  const finish = useCallback(async (): Promise<FinishOutcome> => {
    if (!exam) return { ok: false, reason: "invalid" };
    if (totalChecked === 0) return { ok: false, reason: "empty" };

    const errs: { name?: string; phone?: string } = {};
    if (name.trim().length < 2) errs.name = "Please enter your name.";
    if (!PHONE_RE.test(phone.trim())) errs.phone = "Please enter a valid phone number.";
    setErrors(errs);
    if (Object.keys(errs).length) return { ok: false, reason: "invalid" };

    setSubmitting(true);

    const scored = scoreResponses(responses);
    const trimmed = freeText.trim() || null;
    const note = generateNote(scored, exam, trimmed);

    // Straight into `leads` - the same anonymous insert every other form on the
    // site uses. The full note goes with it; only `note.teaser` is rendered.
    const leadId = await saveGuidancePreviewLead({
      exam,
      subject,
      responses,
      freeText: trimmed,
      note,
      name,
      phone,
    });

    setSubmitting(false);
    setResult({
      note,
      exam,
      name: name.trim(),
      phone: phone.trim(),
      storedOk: leadId !== null,
      leadId,
    });
    setStepIndex(steps.length);
    return { ok: true };
  }, [exam, freeText, name, phone, responses, steps.length, subject, totalChecked]);

  return {
    // Where we are.
    steps,
    stepIndex,
    current,
    totalSteps: TOTAL_STEPS,
    /** 1-based and clamped - what a "question 3 of 9" indicator should show. */
    questionNumber: Math.min(stepIndex + 1, TOTAL_STEPS),
    ready,

    // What has been answered.
    exam,
    subject,
    responses,
    freeText,
    name,
    phone,
    totalChecked,
    errors,
    submitting,
    result,

    // Moving through it.
    chooseExam,
    presetExam,
    chooseSubject,
    toggleItem,
    advance,
    back,
    restart,
    setFreeText,
    setName,
    setPhone,
    finish,
  };
}

export type PreviewFlow = ReturnType<typeof usePreviewFlow>;
