
-- OTP verifications table for email OTP flow (not tied to auth.users)
CREATE TABLE public.email_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code_hash text NOT NULL,
  purpose text NOT NULL DEFAULT 'lead_form',
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  attempts int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX email_otps_email_purpose_idx ON public.email_otps (email, purpose, created_at DESC);

GRANT ALL ON public.email_otps TO service_role;
-- No anon/authenticated grants: only server functions (service_role) touch this.

ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;
-- No policies: table locked to service_role only.
