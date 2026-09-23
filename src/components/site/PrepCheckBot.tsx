import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2, Lock, MessageCircleQuestion, Send, X } from "lucide-react";
import { toast } from "sonner";

import { useApplicationModal } from "@/lib/application-modal";
import { usePrepCheck } from "@/lib/prep-check";
import { EXAMS } from "@/lib/guidance-preview/questions";
import { FREE_TEXT_MAX } from "@/lib/guidance-preview/lead-note";
import { TRIAL_CTA_COPY } from "@/lib/guidance-preview/copy";
import {
  usePreviewFlow,
  type PreviewFlow,
  type PreviewResult,
  type Step,
} from "@/lib/guidance-preview/use-preview-flow";
import { INTRO, ackFor, answerLines, questionFor } from "@/lib/guidance-preview/script";

/**
 * The Free Guidance Preview as a floating assistant.
 *
 * This is presentation only. Every question, option, score and result sentence
 * comes from `@/lib/guidance-preview` - the same engine the admin side uses to
 * rebuild a lead's note. There is no model call anywhere in here: the
 * "assistant" is a conversational surface over a deterministic questionnaire,
 * and it runs entirely in the browser.
 */

/** Long enough to read as a reply, short enough not to be a wait. */
const THINK_MS = 380;

/** First-visit nudge, once the student has had a moment to look at the page. */
const NUDGE_AFTER_MS = 5000;
const NUDGE_KEY = "prepbuddy.prep-check.nudge.v1";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function PrepCheckBot() {
  const { isOpen, requestedExam, open, close, reportStatus } = usePrepCheck();
  const flow = usePreviewFlow();
  const { presetExam } = flow;

  const [thinking, setThinking] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [nudge, setNudge] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  const thinkTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(thinkTimer.current), []);

  /** Runs an answer, then holds the next question back for a beat. */
  const answerThen = useCallback((commit: () => void) => {
    commit();
    if (prefersReducedMotion()) return;
    setThinking(true);
    window.clearTimeout(thinkTimer.current);
    thinkTimer.current = window.setTimeout(() => setThinking(false), THINK_MS);
  }, []);

  // A link may ask for an exam, e.g. /guidance-preview?exam=jee. The flow
  // ignores it once the student has answered anything themselves.
  useEffect(() => {
    if (requestedExam) presetExam(requestedExam);
  }, [requestedExam, presetExam]);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  // Lets in-page CTAs offer "pick up where you left off" instead of "start".
  const status = flow.result ? "done" : flow.stepIndex > 0 ? "in-progress" : "idle";
  useEffect(() => {
    reportStatus(status);
  }, [status, reportStatus]);

  // The first-visit bubble. Suppressed for anyone already part-way through, and
  // remembered for the rest of the session once waved away.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(NUDGE_KEY) === "1";
    } catch {
      dismissed = true;
    }
    if (dismissed) return;
    const t = window.setTimeout(() => setNudge(true), NUDGE_AFTER_MS);
    return () => window.clearTimeout(t);
  }, []);

  const dismissNudge = useCallback(() => {
    setNudge(false);
    try {
      window.sessionStorage.setItem(NUDGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (isOpen) dismissNudge();
  }, [isOpen, dismissNudge]);

  // Escape closes the panel. Answers are kept, so this is a minimise.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // The panel covers the page behind a dimmed overlay, so that page must not
  // scroll underneath it.
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    // Hiding the scrollbar would otherwise shunt the whole page sideways.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [isOpen]);

  const showNudge = nudge && !isOpen && flow.stepIndex === 0 && !flow.result;

  return (
    <>
      {!isOpen && (
        <div className="group/launcher fixed bottom-5 right-4 z-50 flex items-center sm:bottom-6 sm:right-6">
          {showNudge ? (
            /* Solid brand blue rather than another white card: this appears
               unprompted over whatever is on the page, so it has to survive
               landing on a white section. */
            <div className="mr-3 flex max-w-[15rem] items-start gap-2 rounded-2xl rounded-br-md bg-primary-strong px-3.5 py-2.5 text-white shadow-[var(--shadow-lift)]">
              <button
                type="button"
                onClick={() => open()}
                className="text-left text-sm font-semibold leading-snug"
              >
                Take a 2-minute prep check <span aria-hidden="true">&rarr;</span>
              </button>
              <button
                type="button"
                onClick={dismissNudge}
                aria-label="Dismiss this suggestion"
                className="-mr-1 -mt-1 shrink-0 rounded-full p-1 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            /* Dark, so it reads against the site's near-white ground rather
               than dissolving into it the way a white pill does. */
            <span
              className="pointer-events-none mr-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-[var(--shadow-glass)] transition-opacity duration-150 group-focus-within/launcher:opacity-100 group-hover/launcher:opacity-100 sm:block"
              aria-hidden="true"
            >
              Not sure where your prep is going wrong?
            </span>
          )}

          <span className="relative flex">
            {/* One slow ring, and only until the student has looked inside. */}
            {!hasOpened && (
              <span
                className="absolute inset-0 animate-ping rounded-full bg-primary/30 [animation-duration:2.4s] motion-reduce:hidden"
                aria-hidden="true"
              />
            )}
            {/*
              Solid brand blue with a white glyph, for the same reason the
              WhatsApp button is solid green: a corner button has to carry its
              own contrast. The logo is a full-bleed gradient tile whose
              wordmark is illegible at this size, so it stays on the panel
              header and the in-page card, where it sits on white at a size
              that can actually be read.
            */}
            <button
              ref={launcherRef}
              type="button"
              onClick={() => open()}
              aria-label="Open the PrepBuddy prep check"
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-strong text-white ring-2 ring-white transition-colors duration-150 hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{ boxShadow: "0 10px 28px -10px rgba(26, 26, 46, 0.45)" }}
            >
              <MessageCircleQuestion className="h-7 w-7" aria-hidden="true" />
            </button>
          </span>
        </div>
      )}

      {isOpen && (
        <PrepCheckPanel
          flow={flow}
          thinking={thinking}
          answerThen={answerThen}
          onClose={close}
          onCloseAndFocusLauncher={() => {
            close();
            // The launcher unmounts with the panel, so hand focus back on the
            // next frame, once it is in the tree again.
            window.setTimeout(() => launcherRef.current?.focus(), 0);
          }}
        />
      )}
    </>
  );
}

function PrepCheckPanel({
  flow,
  thinking,
  answerThen,
  onClose,
  onCloseAndFocusLauncher,
}: {
  flow: PreviewFlow;
  thinking: boolean;
  answerThen: (commit: () => void) => void;
  onClose: () => void;
  onCloseAndFocusLauncher: () => void;
}) {
  const { open: openApplication } = useApplicationModal();
  const { steps, stepIndex, current, result, totalSteps } = flow;

  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // jsdom has no scrollTo; the guard keeps the questionnaire testable.
    el.scrollTo?.({
      top: el.scrollHeight,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [stepIndex, thinking, result]);

  const answers = {
    exam: flow.exam,
    subject: flow.subject,
    responses: flow.responses,
    freeText: flow.freeText,
    name: flow.name,
  };

  return (
    // Same treatment as the trial form: the page dims and blurs behind it, so
    // the prep check reads as the thing you are doing rather than another card
    // sitting on the page.
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200 sm:items-center sm:p-6"
      onClick={onCloseAndFocusLauncher}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="PrepBuddy Prep Check"
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[var(--shadow-lift)] outline-none motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-200 sm:h-[620px] sm:max-h-[calc(100dvh-3rem)] sm:w-[400px] sm:rounded-3xl motion-safe:sm:zoom-in-95"
      >
        <PanelHeader
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          done={result !== null}
          onClose={onCloseAndFocusLauncher}
        />

        <div ref={scrollRef} className="flex flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-5">
          {/* Anchored to the bottom, so a conversation two messages in sits by
              the reply controls rather than stranded at the top of a tall sheet. */}
          <div className="mt-auto space-y-3">
            {INTRO.map((line) => (
              <BotBubble key={line}>{line}</BotBubble>
            ))}

            {steps.slice(0, stepIndex).map((step, i) => (
              <Fragment key={`${step.kind}-${i}`}>
                <BotTurn step={step} index={i} />
                <UserBubble lines={answerLines(step, answers)} />
              </Fragment>
            ))}

            {thinking && <TypingBubble />}

            {!thinking && !result && current && (
              <>
                <BotTurn step={current} index={stepIndex} />
                <div className="pt-1">
                  <Composer flow={flow} step={current} answerThen={answerThen} />
                </div>
              </>
            )}

            {result && <ResultCard result={result} />}
          </div>
        </div>

        {result && (
          <div className="border-t border-border bg-white px-4 py-3.5 sm:px-5">
            <button
              type="button"
              onClick={() => {
                // The application modal is the thing that should have focus
                // next, so the panel steps out of its way.
                onClose();
                openApplication("trial", result.exam, {
                  name: result.name || undefined,
                  phone: result.phone || undefined,
                });
              }}
              className="pill-btn pill-btn-primary pill-btn-primary-hover h-12 w-full text-sm"
            >
              {TRIAL_CTA_COPY} <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
            <button
              type="button"
              onClick={flow.restart}
              className="mt-2 w-full rounded-full py-1.5 text-xs text-ink-muted transition-colors hover:text-ink"
            >
              Answer it again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PanelHeader({
  stepIndex,
  totalSteps,
  done,
  onClose,
}: {
  stepIndex: number;
  totalSteps: number;
  done: boolean;
  onClose: () => void;
}) {
  const answered = Math.min(stepIndex, totalSteps);
  return (
    <header className="flex items-center gap-3 border-b border-border bg-primary-tint px-4 py-3 sm:px-5">
      <img
        src="/logo.png"
        alt=""
        className="h-9 w-9 shrink-0 rounded-full object-cover"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-bold text-ink">PrepBuddy Prep Check</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="flex gap-1" aria-hidden="true">
            {Array.from({ length: totalSteps }, (_, i) => (
              <span
                key={i}
                className={
                  "h-1.5 w-1.5 rounded-full transition-colors duration-300 " +
                  (done || i < answered ? "bg-primary" : "bg-ink/15")
                }
              />
            ))}
          </span>
          <p className="mono text-[0.65rem] uppercase tracking-wider text-ink-muted">
            {done ? "Done" : `Question ${Math.min(stepIndex + 1, totalSteps)} of ${totalSteps}`}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        title="Your answers are kept"
        aria-label="Close the prep check. Your answers are kept."
        className="shrink-0 rounded-full p-2 text-ink-muted transition-colors hover:bg-white hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <X className="h-4 w-4" />
      </button>
    </header>
  );
}

/** The bot's side of one step: its acknowledgement, question and sub-line. */
function BotTurn({ step, index }: { step: Step; index: number }) {
  const ack = ackFor(index);
  const { question, hint } = questionFor(step);
  return (
    <>
      {ack && <BotBubble>{ack}</BotBubble>}
      <BotBubble>
        <span className="block font-medium text-ink">{question}</span>
        <span className="mt-1 block text-[0.8rem] text-ink-muted">{hint}</span>
      </BotBubble>
    </>
  );
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-200">
      <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-sm leading-relaxed text-ink">
        {children}
      </div>
    </div>
  );
}

function UserBubble({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;
  return (
    <div className="flex justify-end motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-200">
      <div className="max-w-[88%] space-y-1 rounded-2xl rounded-br-md bg-primary-strong px-3.5 py-2.5 text-sm leading-relaxed text-white">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start" aria-hidden="true">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-ink-muted/60 motion-safe:animate-bounce"
            style={{ animationDelay: `${i * 120}ms`, animationDuration: "900ms" }}
          />
        ))}
      </div>
    </div>
  );
}

/** The answer controls for whichever step is live. */
function Composer({
  flow,
  step,
  answerThen,
}: {
  flow: PreviewFlow;
  step: Step;
  answerThen: (commit: () => void) => void;
}) {
  switch (step.kind) {
    case "exam":
      return (
        <OptionRow>
          {EXAMS.map((e) => (
            <Option key={e.key} onClick={() => answerThen(() => flow.chooseExam(e.key))}>
              {e.label} <span className="opacity-70">- {e.blurb}</span>
            </Option>
          ))}
        </OptionRow>
      );

    case "subject":
      return (
        <>
          <OptionRow>
            {step.options.map((s) => (
              <Option key={s} onClick={() => answerThen(() => flow.chooseSubject(s))}>
                {s}
              </Option>
            ))}
          </OptionRow>
          <Actions onBack={flow.back} />
        </>
      );

    case "category": {
      const picked = flow.responses[step.category.key] ?? [];
      return (
        <>
          {/* Multi-select, exactly as the questionnaire has always been - the
              score is the sum of everything ticked, not a single choice. */}
          <div className="space-y-1.5">
            {step.category.items.map((item) => {
              const active = picked.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => flow.toggleItem(step.category.key, item.id)}
                  className={
                    "flex w-full items-start gap-2.5 rounded-2xl border px-3.5 py-2.5 text-left text-sm transition-colors " +
                    (active
                      ? "border-primary bg-primary-tint text-ink"
                      : "border-input bg-white text-ink hover:border-primary/60")
                  }
                >
                  <span
                    className={
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-colors " +
                      (active ? "border-primary bg-primary text-white" : "border-input bg-white")
                    }
                    aria-hidden="true"
                  >
                    {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <Actions
            onBack={flow.back}
            primary={{
              label: "Continue",
              count: picked.length,
              onClick: () => answerThen(flow.advance),
            }}
          />
        </>
      );
    }

    case "freeText":
      return (
        <>
          <label className="block">
            <span className="sr-only">Anything else you want the mentor to know?</span>
            <textarea
              value={flow.freeText}
              onChange={(e) => flow.setFreeText(e.target.value)}
              rows={2}
              maxLength={FREE_TEXT_MAX}
              placeholder="e.g. I dropped a year and I'm scared it won't pay off."
              className="w-full resize-none rounded-2xl border border-input bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </label>
          <Actions
            onBack={flow.back}
            primary={{
              label: flow.freeText.trim() ? "Send" : "Skip this",
              icon: "send",
              onClick: () => answerThen(flow.advance),
            }}
          />
        </>
      );

    case "contact":
      return <ContactComposer flow={flow} />;
  }
}

function ContactComposer({ flow }: { flow: PreviewFlow }) {
  async function submit() {
    const outcome = await flow.finish();
    if (!outcome.ok && outcome.reason === "empty") {
      toast.error("Tick at least one thing so there's something to read.");
    }
  }

  return (
    <div className="space-y-2.5">
      <Field
        label="Your name"
        value={flow.name}
        onChange={flow.setName}
        error={flow.errors.name}
        placeholder="e.g. Aarav Sharma"
      />
      <Field
        label="Phone number"
        value={flow.phone}
        onChange={flow.setPhone}
        error={flow.errors.phone}
        type="tel"
        inputMode="tel"
        placeholder="98XXXXXXXX"
      />
      <Actions
        onBack={flow.back}
        primary={{
          label: flow.submitting ? "Reading your answers…" : "See what this points at",
          onClick: submit,
          busy: flow.submitting,
        }}
      />
      <p className="text-center text-[0.7rem] text-ink-muted">
        🔒 Your data is never shared or sold.
      </p>
    </div>
  );
}

function OptionRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Option({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-input bg-white px-3.5 py-2 text-sm text-ink transition-colors hover:border-primary hover:bg-primary-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children}
    </button>
  );
}

function Actions({
  onBack,
  primary,
}: {
  onBack?: () => void;
  primary?: {
    label: string;
    onClick: () => void;
    count?: number;
    busy?: boolean;
    icon?: "send";
  };
}) {
  return (
    <div className="mt-2.5 flex items-center gap-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-input bg-white px-3.5 py-2 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
        >
          Back
        </button>
      )}
      {primary && (
        <button
          type="button"
          onClick={primary.onClick}
          disabled={primary.busy}
          className="pill-btn pill-btn-primary pill-btn-primary-hover flex-1 px-4 py-2 text-sm disabled:opacity-70"
        >
          {primary.busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {primary.label}
          {primary.count ? (
            <span
              className="rounded-full bg-white/25 px-1.5 text-[0.7rem] leading-5"
              aria-hidden="true"
            >
              {primary.count}
            </span>
          ) : null}
          {!primary.busy &&
            (primary.icon === "send" ? (
              <Send className="h-3.5 w-3.5" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            ))}
        </button>
      )}
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
        <span className="mb-1 block text-xs font-medium text-ink">{label}</span>
        <input
          type={type}
          value={value}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={
            "w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-ink outline-none transition " +
            (error
              ? "border-destructive"
              : "border-input focus:border-primary focus:ring-4 focus:ring-primary/15")
          }
        />
      </label>
      {error && <p className="mt-1 text-[0.7rem] text-destructive">{error}</p>}
    </div>
  );
}

/**
 * The free result.
 *
 * Renders the teaser and nothing else. `fullNote`, the cluster keys and the
 * scores stay out of the DOM entirely - see `guidance-preview.test.tsx`.
 */
function ResultCard({ result }: { result: PreviewResult }) {
  return (
    <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
      <BotBubble>Here&rsquo;s what I noticed 👀</BotBubble>

      <div className="mt-3 rounded-2xl border border-border bg-primary-tint p-4">
        <p className="eyebrow !mb-0">Your prep pattern</p>
        <h2 className="mt-2 font-display text-lg font-bold leading-snug text-primary">
          {result.note.teaserLabel}
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{result.note.teaser}</p>
      </div>

      <div className="mt-3 rounded-2xl border border-dashed border-input bg-white p-4">
        <div className="flex items-center gap-2 text-ink">
          <Lock className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm font-semibold">The rest of this is written up and waiting</p>
        </div>
        <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink-muted">
          What&rsquo;s actually causing it, what to change first, and the order to do it in - your
          mentor walks you through the whole thing on day one.
        </p>
      </div>

      <p className="mt-3 text-center text-[0.7rem] text-ink-muted">
        {result.storedOk
          ? "Your answers are saved - your mentor reads them before you speak."
          : "We couldn't save your answers just now, but our team will still reach out."}
      </p>
    </div>
  );
}
