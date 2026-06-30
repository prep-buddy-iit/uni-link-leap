
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_name_len CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT leads_phone_len CHECK (char_length(phone) BETWEEN 7 AND 20),
  ADD CONSTRAINT leads_email_len CHECK (char_length(email) BETWEEN 3 AND 255),
  ADD CONSTRAINT leads_notes_len CHECK (notes IS NULL OR char_length(notes) <= 1000);
