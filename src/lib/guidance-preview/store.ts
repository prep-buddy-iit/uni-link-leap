import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_KEYS, getCategories } from "./questions";
import { formatLeadNote, type GuidancePreviewPayload } from "./lead-note";

export type GuidancePreviewLead = GuidancePreviewPayload & {
  name: string;
  phone: string;
};

/**
 * The id of the row a finished questionnaire wrote, so the trial signup that
 * follows can point back at it. Null when the write failed.
 */
export type SavedPreviewId = string | null;

/**
 * `leads.id` defaults to gen_random_uuid(), but a student filling this in is
 * anonymous and anon has INSERT on `leads` and nothing else - no SELECT grant,
 * and the only SELECT policy is admin-only. So `.insert().select("id")` cannot
 * read the id back. Minting it here instead is the only way the browser can
 * know which row it just wrote.
 */
function newLeadId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Older Safari and some embedded webviews. Only needs to be unique, not
  // unguessable - the column is a join key, never a credential.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Writes the completed questionnaire straight into `leads`, the same table and
 * the same anonymous insert path every other form on the site uses - no auth,
 * no signup. RLS allows anon INSERT and admin-only SELECT, so the full note
 * lands somewhere only the team can read it.
 *
 * Returns the new row's id, or null on failure. The result screen shows the
 * teaser either way: a dropped write must never cost the student their answer.
 */
export async function saveGuidancePreviewLead(lead: GuidancePreviewLead): Promise<SavedPreviewId> {
  const categories = getCategories(lead.exam);
  const labelFor = (id: string) =>
    categories.flatMap((c) => c.items).find((i) => i.id === id)?.label ?? id;

  const ids = CATEGORY_KEYS.flatMap((key) => lead.responses[key] ?? []);
  const id = newLeadId();

  const { error } = await supabase.from("leads").insert({
    id,
    name: lead.name.trim(),
    phone: lead.phone.trim(),
    email: null,
    current_class: "Not specified",
    exam: lead.exam,
    subjects: [lead.subject],
    // Readable in admin; the ids in `notes` are what rebuilds the full note.
    problems: ids.map(labelFor),
    source: "Guidance preview",
    notes: formatLeadNote(lead, ids),
  });

  if (error) {
    console.error("[guidance-preview] failed to store lead", error);
    return null;
  }
  return id;
}
