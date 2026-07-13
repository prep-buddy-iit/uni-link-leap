
CREATE TABLE public.resource_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('article','video','photo')),
  title text NOT NULL,
  description text,
  body text,
  youtube_url text,
  image_url text,
  exam text NOT NULL DEFAULT 'both' CHECK (exam IN ('jee','neet','both')),
  submitter_name text NOT NULL,
  submitter_email text NOT NULL,
  submitter_credential text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.resource_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resource_submissions TO authenticated;
GRANT ALL ON public.resource_submissions TO service_role;

ALTER TABLE public.resource_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a resource"
  ON public.resource_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

CREATE POLICY "Anyone can view approved resources"
  ON public.resource_submissions FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Admins can view all submissions"
  ON public.resource_submissions FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions"
  ON public.resource_submissions FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete submissions"
  ON public.resource_submissions FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER resource_submissions_updated_at
  BEFORE UPDATE ON public.resource_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
