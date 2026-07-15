import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SIGNED_TTL = 60 * 60 * 24 * 7; // 7 days

/**
 * Return a signed URL for an approved resource submission photo.
 *
 * The public /resources page can no longer read the private `resource-uploads`
 * bucket directly (locked down to admins for security), so we mint a
 * short-lived signed URL server-side after verifying the path belongs to an
 * approved submission.
 */
export const getApprovedSubmissionPhotoUrl = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ path: z.string().min(1).max(512) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Verify the requested path is attached to a currently approved photo submission.
    const { data: match, error: lookupError } = await supabaseAdmin
      .from("resource_submissions")
      .select("id")
      .eq("image_url", data.path)
      .eq("status", "approved")
      .eq("kind", "photo")
      .maybeSingle();

    if (lookupError) throw lookupError;
    if (!match) return { url: null as string | null };

    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("resource-uploads")
      .createSignedUrl(data.path, SIGNED_TTL);
    if (signError) throw signError;

    return { url: signed?.signedUrl ?? null };
  });
