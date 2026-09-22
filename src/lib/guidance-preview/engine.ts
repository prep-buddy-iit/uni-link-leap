import type { ExamKey } from "@/components/ApplicationModal";
import { CLUSTERS, CLUSTER_KEYS, type ClusterKey } from "./clusters";
import { CATEGORY_KEYS, getItem, getWeights, type CategoryKey } from "./questions";

/** What the student ticked, keyed by category. */
export type Responses = Partial<Record<CategoryKey, string[]>>;

export type Scored = {
  primary: ClusterKey;
  secondary: ClusterKey | null;
  /** Item ids that contributed most to `primary`, strongest first. Internal. */
  drivers: string[];
};

/**
 * A secondary pattern is only worth naming when it carries real weight of its
 * own - otherwise every note ends up hedged across two things.
 */
const SECONDARY_MIN_RATIO = 0.45;

export function scoreResponses(responses: Responses): Scored {
  const checked = CATEGORY_KEYS.flatMap((key) => responses[key] ?? []);

  const totals = Object.fromEntries(CLUSTER_KEYS.map((k) => [k, 0])) as Record<ClusterKey, number>;

  for (const id of checked) {
    for (const [cluster, weight] of Object.entries(getWeights(id))) {
      totals[cluster as ClusterKey] += weight ?? 0;
    }
  }

  // Ties resolve by CLUSTER_KEYS order so the same answers always produce the
  // same note - a student who retakes the preview should not get a new pattern.
  const ranked = [...CLUSTER_KEYS].sort((a, b) => totals[b] - totals[a]);
  const primary = ranked[0];
  const runnerUp = ranked[1];

  const secondary =
    totals[primary] > 0 && totals[runnerUp] >= totals[primary] * SECONDARY_MIN_RATIO
      ? runnerUp
      : null;

  const drivers = checked
    .filter((id) => (getWeights(id)[primary] ?? 0) > 0)
    .sort((a, b) => (getWeights(b)[primary] ?? 0) - (getWeights(a)[primary] ?? 0));

  return { primary, secondary, drivers };
}

/**
 * Turns the strongest drivers into the single evidence sentence the teaser
 * leads with. Caps at two so the sentence stays readable.
 */
function evidenceSentence(drivers: string[], exam: ExamKey): string {
  const phrases = drivers
    .slice(0, 2)
    .map((id) => getItem(id, exam)?.evidence)
    .filter((p): p is string => Boolean(p));

  if (phrases.length === 0) return "";
  if (phrases.length === 1) return `You said you ${phrases[0]}.`;
  return `You said you ${phrases[0]}, and that you ${phrases[1]}.`;
}

export type Note = {
  /** Shown on the free result screen: plain-language label + one evidence sentence. */
  teaser: string;
  /** Plain-language pattern name. Part of the teaser - safe pre-trial. */
  teaserLabel: string;
  /** The gated note. Stored, handed to the mentor, never rendered pre-trial. */
  fullNote: string;
};

/**
 * Produces the two outputs of the preview.
 *
 * `teaser` is the only thing the free result screen may render. `fullNote` is
 * generated and stored at the same time, but stays behind the trial.
 */
export function generateNote(scored: Scored, exam: ExamKey, freeText?: string | null): Note {
  const primary = CLUSTERS[scored.primary];
  const evidence = evidenceSentence(scored.drivers, exam);

  const teaser = [evidence, primary.teaser].filter(Boolean).join(" ");

  const fullParts = [primary.full];
  if (scored.secondary) fullParts.push(CLUSTERS[scored.secondary].bridge);
  if (freeText?.trim()) {
    fullParts.push(`In their own words: "${freeText.trim()}"`);
  }

  return {
    teaser,
    teaserLabel: primary.label,
    fullNote: fullParts.join("\n\n"),
  };
}
