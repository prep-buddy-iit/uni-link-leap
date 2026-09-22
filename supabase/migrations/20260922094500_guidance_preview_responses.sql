-- Free Guidance Preview: store the full response record so a mentor does not
-- start cold once the student converts on the ₹99 trial.

CREATE TABLE public.guidance_preview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  subject TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  free_text TEXT,
  primary_cluster TEXT NOT NULL,
  secondary_cluster TEXT,
  full_note TEXT NOT NULL DEFAULT '',
  handed_off BOOLEAN NOT NULL DEFAULT false
);

GRANT INSERT ON public.guidance_preview_responses TO anon, authenticated;
GRANT ALL ON public.guidance_preview_responses TO service_role;
GRANT SELECT, UPDATE, DELETE ON public.guidance_preview_responses TO authenticated;

ALTER TABLE public.guidance_preview_responses ENABLE ROW LEVEL SECURITY;

-- Anonymous visitors take the preview, so they must be able to insert.
CREATE POLICY "Anyone can submit a guidance preview"
  ON public.guidance_preview_responses FOR INSERT TO anon, authenticated WITH CHECK (true);

-- The row holds the gated full note, so reads are admin-only. Nothing in the
-- pre-trial UI ever selects from this table.
CREATE POLICY "Admins can view guidance previews"
  ON public.guidance_preview_responses FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update guidance previews"
  ON public.guidance_preview_responses FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete guidance previews"
  ON public.guidance_preview_responses FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_guidance_preview_responses_created_at
  ON public.guidance_preview_responses(created_at DESC);

CREATE INDEX idx_guidance_preview_responses_unmatched
  ON public.guidance_preview_responses(created_at DESC) WHERE handed_off = false;

-- The handoff itself: the existing trial application modal carries the preview
-- id through onto the lead it creates.
ALTER TABLE public.leads ADD COLUMN guidance_preview_id UUID
  REFERENCES public.guidance_preview_responses(id) ON DELETE SET NULL;

CREATE INDEX idx_leads_guidance_preview_id
  ON public.leads(guidance_preview_id) WHERE guidance_preview_id IS NOT NULL;

-- Anonymous submitters may flip their own preview to handed_off when the trial
-- form is sent, but must not be able to touch anything else on the row.
CREATE OR REPLACE FUNCTION public.mark_guidance_preview_handed_off(_id uuid)
RETURNS void LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.guidance_preview_responses SET handed_off = true WHERE id = _id;
$$;

GRANT EXECUTE ON FUNCTION public.mark_guidance_preview_handed_off(uuid) TO anon, authenticated;
