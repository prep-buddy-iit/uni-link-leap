import { supabase } from "@/integrations/supabase/client";

export type SubmissionKind = "article" | "video" | "photo";
export type SubmissionExam = "jee" | "neet" | "both";

export type ResourceSubmission = {
  id: string;
  kind: SubmissionKind;
  title: string;
  description: string | null;
  body: string | null;
  youtube_url: string | null;
  image_url: string | null;
  exam: SubmissionExam;
  submitter_name: string;
  submitter_email?: string;
  submitter_credential: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const BUCKET = "resource-uploads";
const SIGNED_TTL = 60 * 60 * 24 * 365; // 1 year

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export async function uploadSubmissionImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `submissions/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function getSignedImageUrl(path: string): Promise<string | null> {
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_TTL);
  return data?.signedUrl ?? null;
}

export async function fetchApprovedSubmissions(): Promise<ResourceSubmission[]> {
  const { data, error } = await supabase
    .from("resource_submissions_public" as never)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[resources] fetch approved failed", error);
    return [];
  }
  return (data ?? []) as unknown as ResourceSubmission[];
}
