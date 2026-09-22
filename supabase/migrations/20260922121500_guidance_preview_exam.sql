-- The preview now opens by asking which exam the student is preparing for, and
-- the rest of the questions are worded for it. Storing the answer matters for
-- the mentor side: the same item id reads differently for JEE and NEET, so the
-- responses cannot be rendered back correctly without knowing which was asked.

ALTER TABLE public.guidance_preview_responses
  ADD COLUMN exam TEXT NOT NULL DEFAULT 'jee';

ALTER TABLE public.guidance_preview_responses
  ADD CONSTRAINT guidance_preview_responses_exam_check CHECK (exam IN ('jee', 'neet'));
