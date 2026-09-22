import { supabase } from "@/integrations/supabase/client";
import type { Note } from "./engine";
import type { Responses, Scored } from "./engine";

export type PreviewRecord = {
  subject: string;
  responses: Responses;
  freeText: string | null;
  scored: Scored;
  note: Note;
};

/**
 * Persists the full response record and returns the row id, which is what gets
 * handed to the trial flow.
 *
 * Returns null on failure - the result screen must still let the student
 * through to the trial, so a dropped record can never block the CTA.
 */
export async function saveGuidancePreviewResponse(rec: PreviewRecord): Promise<string | null> {
  const { data, error } = await supabase
    .from("guidance_preview_responses")
    .insert({
      subject: rec.subject,
      responses: rec.responses,
      free_text: rec.freeText,
      primary_cluster: rec.scored.primary,
      secondary_cluster: rec.scored.secondary,
      full_note: rec.note.fullNote,
      handed_off: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[guidance-preview] failed to store response", error);
    return null;
  }
  return data?.id ?? null;
}

/**
 * Flips the preview to handed_off once the student has actually submitted the
 * trial application, so the admin list can separate matched previews from the
 * ones that dropped out before signup.
 */
export async function markGuidancePreviewHandedOff(id: string): Promise<void> {
  const { error } = await supabase.rpc("mark_guidance_preview_handed_off", { _id: id });
  if (error) console.error("[guidance-preview] failed to mark handoff", error);
}
