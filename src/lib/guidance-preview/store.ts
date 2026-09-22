import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_KEYS, getCategories } from "./questions";
import { formatLeadNote, type GuidancePreviewPayload } from "./lead-note";

export type GuidancePreviewLead = GuidancePreviewPayload & {
  name: string;
  phone: string;
};

/**
 * Writes the completed questionnaire straight into `leads`, the same table and
 * the same anonymous insert path every other form on the site uses - no auth,
 * no signup. RLS allows anon INSERT and admin-only SELECT, so the full note
 * lands somewhere only the team can read it.
 *
 * Returns false on failure. The result screen shows the teaser either way: a
 * dropped write must never cost the student their answer.
 */
export async function saveGuidancePreviewLead(lead: GuidancePreviewLead): Promise<boolean> {
  const categories = getCategories(lead.exam);
  const labelFor = (id: string) =>
    categories.flatMap((c) => c.items).find((i) => i.id === id)?.label ?? id;

  const { error } = await supabase.from("leads").insert({
    name: lead.name.trim(),
    phone: lead.phone.trim(),
    email: null,
    current_class: "Not specified",
    exam: lead.exam,
    subjects: [lead.subject],
    problems: CATEGORY_KEYS.flatMap((key) => lead.responses[key] ?? []).map(labelFor),
    source: "Guidance preview",
    notes: formatLeadNote(lead),
  });

  if (error) {
    console.error("[guidance-preview] failed to store lead", error);
    return false;
  }
  return true;
}
