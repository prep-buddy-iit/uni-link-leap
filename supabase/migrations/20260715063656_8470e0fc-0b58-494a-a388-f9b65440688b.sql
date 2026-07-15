
-- 1. Restrict SECURITY DEFINER function to authenticated only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- 2. Replace permissive WITH CHECK (true) INSERT policies with validated checks

-- contact_submissions
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(message) BETWEEN 1 AND 5000
    AND (email IS NULL OR char_length(email) BETWEEN 3 AND 255)
    AND (phone IS NULL OR char_length(phone) BETWEEN 5 AND 20)
    AND status = 'new'
  );

-- leads
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(phone) BETWEEN 7 AND 20
    AND (email IS NULL OR char_length(email) BETWEEN 3 AND 255)
    AND char_length(current_class) BETWEEN 1 AND 50
    AND status = 'new'
  );

-- mentor_applications
DROP POLICY IF EXISTS "Anyone can submit a mentor application" ON public.mentor_applications;
CREATE POLICY "Anyone can submit a mentor application"
  ON public.mentor_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(phone) BETWEEN 7 AND 20
    AND jee_rank > 0
    AND status = 'new'
  );

-- 3. Tighten storage policies on resource-uploads bucket
DROP POLICY IF EXISTS "Anyone can read resource-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to resource-uploads" ON storage.objects;

-- Only admins can read directly; public reads go through a server function
CREATE POLICY "Admins can read resource-uploads"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'resource-uploads'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- Uploads restricted to the submissions/ prefix so path is scoped
CREATE POLICY "Anyone can upload submission files"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'resource-uploads'
    AND name LIKE 'submissions/%'
    AND octet_length(name) < 512
  );
