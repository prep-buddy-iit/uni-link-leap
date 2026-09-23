import type { ExamKey } from "@/components/ApplicationModal";
import { EXAMS, type CategoryKey, type Item } from "./questions";
import type { Responses } from "./engine";
import type { Step } from "./use-preview-flow";

/**
 * The conversational wrapper around the questionnaire.
 *
 * Every question and every option here comes from ./questions - this file only
 * decides how they are introduced and how an answer reads once it has been
 * given. Nothing in it affects scoring.
 *
 * One constraint worth knowing: none of this copy may contain a cluster key
 * (foundation, retention, application, timing, consistency, pressure). Those
 * are internal scoring labels and `guidance-preview.test.tsx` asserts they
 * never reach the DOM.
 */

/** Opens the conversation, before the first question. */
export const INTRO = [
  "Hey! \u{1F44B} Let's work out what's actually holding your prep back.",
  "Nine quick questions, about two minutes. Nothing here is a test.",
];

/**
 * Short acknowledgements so each question reads as a reply rather than the next
 * field in a form. Indexed by step, so a given question always gets the same
 * line - re-reading the transcript should not reshuffle it.
 */
const ACKS: Record<number, string> = {
  1: "Got it.",
  2: "Right - let's get into it.",
  3: "Thanks, that helps.",
  4: "Okay.",
  5: "Noted.",
  6: "That's useful.",
  7: "Almost done.",
  8: "That's everything I need on the prep itself.",
};

type Question = { question: string; hint: string };

/**
 * The exam and subject steps carry no wording of their own in ./questions -
 * they were phrased in the old form's markup. Kept verbatim.
 */
const EXAM_QUESTION: Question = {
  question: "Which exam are you preparing for?",
  hint: "Everything after this is worded for the one you pick.",
};
const SUBJECT_QUESTION: Question = {
  question: "Which subject is giving you the most trouble right now?",
  hint: "Pick the one that worries you most - we'll go from there.",
};
const FREE_TEXT_QUESTION: Question = {
  question: "Anything else you want the mentor to know?",
  hint: "Optional - a line or two is plenty.",
};
const CONTACT_QUESTION: Question = {
  question: "Last thing - where do we send this?",
  hint: "So your mentor can pick up where your answers leave off.",
};

export function questionFor(step: Step): Question {
  switch (step.kind) {
    case "exam":
      return EXAM_QUESTION;
    case "subject":
      return SUBJECT_QUESTION;
    case "category":
      return { question: step.category.question, hint: step.category.hint };
    case "freeText":
      return FREE_TEXT_QUESTION;
    case "contact":
      return CONTACT_QUESTION;
  }
}

/** The acknowledgement that precedes a question, if it has one. */
export function ackFor(index: number): string | null {
  return ACKS[index] ?? null;
}

export function examLabel(exam: ExamKey): string {
  const match = EXAMS.find((e) => e.key === exam);
  return match ? `${match.label} - ${match.blurb}` : exam;
}

/** The items a student ticked on a category step, in the order they appear. */
export function pickedItems(
  items: readonly Item[],
  responses: Responses,
  key: CategoryKey,
): Item[] {
  const ids = responses[key] ?? [];
  return items.filter((i) => ids.includes(i.id));
}

export type AnswerState = {
  exam?: ExamKey;
  subject: string;
  responses: Responses;
  freeText: string;
  name: string;
};

/**
 * What the student's own bubble says once a step is answered. Returns several
 * lines for the multi-select steps, where they ticked more than one thing.
 */
export function answerLines(step: Step, answers: AnswerState): string[] {
  switch (step.kind) {
    case "exam":
      return answers.exam ? [examLabel(answers.exam)] : [];
    case "subject":
      return answers.subject ? [answers.subject] : [];
    case "category": {
      const picked = pickedItems(step.category.items, answers.responses, step.category.key);
      return picked.length ? picked.map((i) => i.label) : ["Nothing here, really"];
    }
    case "freeText":
      return [answers.freeText.trim() || "Nothing else for now"];
    case "contact":
      return answers.name.trim() ? [answers.name.trim()] : [];
  }
}
