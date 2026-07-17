
-- Remove public read of full row (which exposed submitter_email) and replace with a safe view.
DROP POLICY IF EXISTS "Anyone can view approved resources" ON public.resource_submissions;

CREATE OR REPLACE VIEW public.resource_submissions_public
WITH (security_invoker = true) AS
SELECT
  id, kind, title, description, body, youtube_url, image_url, exam,
  submitter_name, submitter_credential, status, created_at
FROM public.resource_submissions
WHERE status = 'approved';

-- Base table: allow the view (which runs as invoker) to read approved rows without exposing email directly.
CREATE POLICY "Public can read approved (safe cols via view)"
  ON public.resource_submissions
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Revoke column-level access to submitter_email from public roles on the base table.
REVOKE SELECT ON public.resource_submissions FROM anon, authenticated;
GRANT SELECT
  (id, kind, title, description, body, youtube_url, image_url, exam,
   submitter_name, submitter_credential, status, created_at)
  ON public.resource_submissions TO anon, authenticated;

GRANT SELECT ON public.resource_submissions_public TO anon, authenticated;
