import type { ExamKey } from "@/components/ApplicationModal";
import type { Note, Responses } from "./engine";
import { CATEGORY_KEYS, getCategories } from "./questions";

/**
 * Everything the preview learned, carried in the browser from the result screen
 * to the trial form. Nothing is written until the student actually signs up -
 * see the note on `formatLeadNote` below.
 */
export type GuidancePreviewPayload = {
  exam: ExamKey;
  subject: string;
  responses: Responses;
  freeText: string | null;
  note: Note;
};

/**
 * Marks a lead as having come through the guidance preview. Admin uses this to
 * spot them - there is no dedicated column, so the marker lives in `notes`.
 */
export const GUIDANCE_PREVIEW_MARKER = "[Guidance preview]";

/**
 * Renders the preview into the lead's `notes` field.
 *
 * This is the mentor-side handoff point: `fullNote` lands here, where only
 * admins can read it (leads are admin-only by RLS), and never in the pre-trial
 * UI. It is a placeholder diagnosis assembled from a checklist - once real
 * mock-test data is flowing, the actual diagnostic engine takes over and this
 * template-generated note goes away.
 */
export function formatLeadNote(payload: GuidancePreviewPayload): string {
  const categories = getCategories(payload.exam);
  const labelFor = (id: string) =>
    categories.flatMap((c) => c.items).find((i) => i.id === id)?.label ?? id;

  const ticked = CATEGORY_KEYS.flatMap((key) => payload.responses[key] ?? []).map(labelFor);

  const sections = [
    `${GUIDANCE_PREVIEW_MARKER} ${payload.exam.toUpperCase()} · ${payload.subject}`,
    ticked.length ? `What they ticked:\n${ticked.map((t) => `- ${t}`).join("\n")}` : "",
    payload.freeText ? `In their words:\n${payload.freeText}` : "",
    `Full note:\n${payload.note.fullNote}`,
  ];

  return sections.filter(Boolean).join("\n\n");
}

export function isGuidancePreviewLead(notes: string | null | undefined): boolean {
  return Boolean(notes?.startsWith(GUIDANCE_PREVIEW_MARKER));
}
