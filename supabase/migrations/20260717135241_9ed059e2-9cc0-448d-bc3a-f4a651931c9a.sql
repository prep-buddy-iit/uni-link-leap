
-- Tighten public insert policy on resource_submissions with length/format checks
DROP POLICY IF EXISTS "Anyone can submit a resource" ON public.resource_submissions;

CREATE POLICY "Anyone can submit a resource"
ON public.resource_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND kind IN ('article','video','photo')
  AND char_length(title) BETWEEN 1 AND 200
  AND (description IS NULL OR char_length(description) <= 1000)
  AND (body IS NULL OR char_length(body) <= 20000)
  AND (youtube_url IS NULL OR (char_length(youtube_url) <= 500 AND youtube_url ~* '^https?://'))
  AND (submitter_name IS NULL OR char_length(submitter_name) BETWEEN 1 AND 120)
  AND (submitter_email IS NULL OR (char_length(submitter_email) BETWEEN 3 AND 255 AND submitter_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
  AND (submitter_credential IS NULL OR char_length(submitter_credential) <= 200)
);

-- Belt-and-suspenders: table-level CHECK constraints
ALTER TABLE public.resource_submissions
  ADD CONSTRAINT resource_submissions_title_len CHECK (char_length(title) BETWEEN 1 AND 200),
  ADD CONSTRAINT resource_submissions_description_len CHECK (description IS NULL OR char_length(description) <= 1000),
  ADD CONSTRAINT resource_submissions_body_len CHECK (body IS NULL OR char_length(body) <= 20000),
  ADD CONSTRAINT resource_submissions_youtube_url_len CHECK (youtube_url IS NULL OR char_length(youtube_url) <= 500),
  ADD CONSTRAINT resource_submissions_submitter_name_len CHECK (submitter_name IS NULL OR char_length(submitter_name) BETWEEN 1 AND 120),
  ADD CONSTRAINT resource_submissions_submitter_email_len CHECK (submitter_email IS NULL OR char_length(submitter_email) BETWEEN 3 AND 255),
  ADD CONSTRAINT resource_submissions_submitter_credential_len CHECK (submitter_credential IS NULL OR char_length(submitter_credential) <= 200);
