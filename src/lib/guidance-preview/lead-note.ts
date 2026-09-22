import type { ExamKey } from "@/components/ApplicationModal";
import type { Note, Responses } from "./engine";

/**
 * Everything the questionnaire learned, before it is written to a lead.
 */
export type GuidancePreviewPayload = {
  exam: ExamKey;
  subject: string;
  responses: Responses;
  freeText: string | null;
  note: Note;
};

/**
 * Marks a lead as having come through the guidance preview. There is no
 * dedicated column, so the marker lives at the start of `notes`.
 */
export const GUIDANCE_PREVIEW_MARKER = "[Guidance preview]";

/** `leads.notes` is capped by a check constraint (leads_notes_len). */
export const NOTES_MAX = 1000;

/** Keeps the free-text answer well inside the notes budget. */
export const FREE_TEXT_MAX = 300;

const TICKED_PREFIX = "Ticked:";
const WORDS_PREFIX = "In their words:";

/**
 * Renders the preview into the lead's `notes`.
 *
 * The full note is deliberately NOT stored: at roughly 2,000 characters it
 * breaks the 1,000-character constraint on this column. It is also entirely
 * derivable - `generateNote(scoreResponses(...), exam, freeText)` reproduces it
 * exactly - so the ticked item ids are stored instead and the note is rebuilt
 * on the admin side by `rebuildFullNote`.
 */
export function formatLeadNote(payload: GuidancePreviewPayload, ids: string[]): string {
  const words = payload.freeText?.trim().slice(0, FREE_TEXT_MAX);

  const out = [
    GUIDANCE_PREVIEW_MARKER,
    words ? `${WORDS_PREFIX} ${words}` : "",
    `${TICKED_PREFIX} ${ids.join(",")}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Belt and braces: a rejected insert would cost the student their answers.
  return out.length > NOTES_MAX ? out.slice(0, NOTES_MAX) : out;
}

export function isGuidancePreviewLead(notes: string | null | undefined): boolean {
  return Boolean(notes?.startsWith(GUIDANCE_PREVIEW_MARKER));
}

/** Pulls back what `formatLeadNote` stored. */
export function parseLeadNote(notes: string | null | undefined): {
  ids: string[];
  freeText: string | null;
} {
  if (!isGuidancePreviewLead(notes)) return { ids: [], freeText: null };

  const lines = (notes ?? "").split("\n");
  const ticked = lines.find((l) => l.startsWith(TICKED_PREFIX));
  const words = lines.find((l) => l.startsWith(WORDS_PREFIX));

  return {
    ids: (ticked?.slice(TICKED_PREFIX.length) ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    freeText: words ? words.slice(WORDS_PREFIX.length).trim() || null : null,
  };
}
