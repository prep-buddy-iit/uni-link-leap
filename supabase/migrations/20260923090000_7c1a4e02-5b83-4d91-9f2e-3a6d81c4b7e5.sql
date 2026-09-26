-- Links a trial signup back to the Free Guidance Preview the student came from.
--
-- Both records are rows in `leads`: the preview writes one when the
-- questionnaire finishes, and the trial form writes another when the student
-- takes the CTA. Until now nothing connected the two, so the answers a student
-- gave were only findable by searching their phone number by hand.
--
-- Deliberately NOT a foreign key. Referential integrity checks would reject the
-- whole insert if the referenced preview row had since been deleted from the
-- admin table, and losing a trial signup is far worse than holding an orphaned
-- id. The admin UI already treats a missing preview as "no preview".
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS guidance_preview_id uuid;

COMMENT ON COLUMN public.leads.guidance_preview_id IS
  'For a trial/plan signup: the id of the leads row written by the Free Guidance Preview this student came from. Null for direct signups.';

-- Admins look these up one signup at a time, and the column is null for most rows.
CREATE INDEX IF NOT EXISTS leads_guidance_preview_id_idx
  ON public.leads (guidance_preview_id)
  WHERE guidance_preview_id IS NOT NULL;
