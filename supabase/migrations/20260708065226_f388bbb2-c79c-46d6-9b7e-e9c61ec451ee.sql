
-- Relax leads to accommodate new application modal shape
ALTER TABLE public.leads ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.leads ALTER COLUMN target_year DROP NOT NULL;
ALTER TABLE public.leads ALTER COLUMN prep_status DROP NOT NULL;
ALTER TABLE public.leads ALTER COLUMN subjects DROP NOT NULL;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS plan text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS problems text[] DEFAULT '{}'::text[];
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source text;

-- Mentor applications
CREATE TABLE IF NOT EXISTS public.mentor_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  jee_rank integer NOT NULL,
  category text,
  iit_name text,
  year_of_study text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.mentor_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.mentor_applications TO authenticated;
GRANT ALL ON public.mentor_applications TO service_role;

ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a mentor application"
  ON public.mentor_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view mentor applications"
  ON public.mentor_applications FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update mentor applications"
  ON public.mentor_applications FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete mentor applications"
  ON public.mentor_applications FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
