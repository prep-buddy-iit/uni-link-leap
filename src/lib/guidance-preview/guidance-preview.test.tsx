import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CLUSTERS, CLUSTER_KEYS } from "./clusters";
import { EXAMS, SUBJECTS_BY_EXAM, getCategories } from "./questions";
import { generateNote, scoreResponses, type Responses } from "./engine";
import { TRIAL_CTA_COPY } from "./copy";
import type { PreviewRecord } from "./store";
import type { ExamKey } from "@/components/ApplicationModal";

// The chat writes to Supabase on finish; stub the store so the test never
// touches the network. Trial handoff itself is covered by the modal's own path.
const saveGuidancePreviewResponse = vi.fn(
  async (_rec: PreviewRecord): Promise<string | null> => "preview-uuid-1",
);
vi.mock("@/lib/guidance-preview/store", () => ({
  saveGuidancePreviewResponse: (rec: PreviewRecord) => saveGuidancePreviewResponse(rec),
  markGuidancePreviewHandedOff: vi.fn(async () => {}),
}));

const open = vi.fn();
vi.mock("@/lib/application-modal", () => ({
  useApplicationModal: () => ({ open }),
}));

// Imported after the mocks so the component picks them up.
const { GuidancePreviewChat } = await import("@/components/site/GuidancePreviewChat");

/** Picks the exam, then ticks one item in every category, to the result screen. */
async function completePreview(exam: ExamKey = "jee") {
  const user = userEvent.setup();
  render(<GuidancePreviewChat />);

  await user.click(screen.getByRole("button", { name: new RegExp(`^${exam}`, "i") }));
  await user.click(screen.getByRole("button", { name: /^Next/i }));

  await user.click(screen.getByRole("button", { name: /Physics/i }));
  await user.click(screen.getByRole("button", { name: /^Start/i }));

  for (const category of getCategories(exam)) {
    await user.click(screen.getByLabelText(category.items[0].label));
    await user.click(screen.getByRole("button", { name: /Next|Almost done/i }));
  }

  await user.click(screen.getByRole("button", { name: /See what this points at/i }));
  await waitFor(() => expect(screen.getByRole("button", { name: /trial/i })).toBeTruthy());
  return user;
}

beforeEach(() => {
  saveGuidancePreviewResponse.mockClear();
  open.mockClear();
});
afterEach(cleanup);

describe("free result screen", () => {
  it("never renders fullNote content", async () => {
    await completePreview();

    const rendered = document.body.textContent ?? "";

    // The note the mentor gets is stored, but must not reach the pre-trial DOM.
    const stored = saveGuidancePreviewResponse.mock.calls[0][0];
    expect(stored.note.fullNote.length).toBeGreaterThan(0);
    expect(rendered).not.toContain(stored.note.fullNote);

    // No cluster's full template or bridging line, whichever pattern it landed on.
    for (const key of CLUSTER_KEYS) {
      for (const paragraph of CLUSTERS[key].full.split("\n\n")) {
        expect(rendered).not.toContain(paragraph);
      }
      expect(rendered).not.toContain(CLUSTERS[key].bridge);
    }

    // No scoring internals either - the cluster keys are never shown.
    for (const key of CLUSTER_KEYS) {
      expect(rendered).not.toMatch(new RegExp(`\\b${key}\\b`));
    }
  });

  it("shows only the teaser for the pattern it landed on", async () => {
    await completePreview();

    const stored = saveGuidancePreviewResponse.mock.calls[0][0];
    expect(screen.getByText(stored.note.teaserLabel)).toBeTruthy();
    expect(screen.getByText(stored.note.teaser)).toBeTruthy();
  });
});

describe("trial CTA", () => {
  it("never contains the word 'free'", async () => {
    await completePreview();

    const cta = screen.getByRole("button", { name: /trial/i });
    expect(cta.textContent ?? "").not.toMatch(/\bfree\b/i);
    expect(TRIAL_CTA_COPY).not.toMatch(/\bfree\b/i);
    expect(TRIAL_CTA_COPY).toContain("₹99");
  });

  it("hands the stored preview id to the existing trial flow", async () => {
    const user = await completePreview();
    await user.click(screen.getByRole("button", { name: /trial/i }));

    expect(open).toHaveBeenCalledWith("trial", "jee", { guidancePreviewId: "preview-uuid-1" });
  });
});

describe("exam step", () => {
  it("offers only that exam's subjects", () => {
    expect(SUBJECTS_BY_EXAM.jee).toContain("Maths");
    expect(SUBJECTS_BY_EXAM.jee).not.toContain("Biology");
    expect(SUBJECTS_BY_EXAM.neet).toContain("Biology");
    expect(SUBJECTS_BY_EXAM.neet).not.toContain("Maths");
  });

  it("rephrases questions per exam while keeping item ids stable", () => {
    const jee = getCategories("jee");
    const neet = getCategories("neet");

    const ids = (cs: ReturnType<typeof getCategories>) =>
      cs.flatMap((c) => c.items.map((i) => i.id));
    expect(ids(jee)).toEqual(ids(neet));

    const jeeMocks = jee.find((c) => c.key === "mocks")!;
    const neetMocks = neet.find((c) => c.key === "mocks")!;
    expect(jeeMocks.question).toContain("JEE");
    expect(neetMocks.question).toContain("NEET");

    const jeeStudy = jee.find((c) => c.key === "study")!;
    const neetStudy = neet.find((c) => c.key === "study")!;
    const byId = (c: typeof jeeStudy, id: string) => c.items.find((i) => i.id === id)!.label;
    expect(byId(neetStudy, "study_reread")).toContain("NCERT");
    expect(byId(jeeStudy, "study_reread")).not.toContain("NCERT");
  });

  it("carries the chosen exam into the trial handoff", async () => {
    const user = await completePreview("neet");
    await user.click(screen.getByRole("button", { name: /trial/i }));

    expect(open).toHaveBeenCalledWith("trial", "neet", { guidancePreviewId: "preview-uuid-1" });
    expect(saveGuidancePreviewResponse.mock.calls[0][0].exam).toBe("neet");
  });

  it("builds the teaser evidence from the exam's own wording", async () => {
    await completePreview("neet");
    const stored = saveGuidancePreviewResponse.mock.calls[0][0];
    expect(stored.note.teaser).toMatch(/^You said you /);
    expect(EXAMS.map((e) => e.key)).toContain(stored.exam);
  });
});

describe("generateNote", () => {
  it("splits teaser and fullNote, and keeps the full template out of the teaser", () => {
    const responses: Responses = { revision: ["rev_forget_weeks", "rev_no_schedule"] };
    const scored = scoreResponses(responses);
    const note = generateNote(scored, "jee", null);

    expect(scored.primary).toBe("retention");
    expect(note.teaser).toContain(CLUSTERS.retention.teaser);
    expect(note.teaser).not.toContain(CLUSTERS.retention.full);
    expect(note.fullNote).toContain(CLUSTERS.retention.full);
  });

  it("puts the evidence sentence first, referencing what was ticked", () => {
    const scored = scoreResponses({ practice: ["prac_blank_start"] });
    const note = generateNote(scored, "jee", null);

    expect(note.teaser).toMatch(/^You said you go blank on where to start/);
  });

  it("appends the secondary bridge and the free text to fullNote only", () => {
    const scored = scoreResponses({
      revision: ["rev_forget_weeks"],
      study: ["study_reread", "study_hours_nothing"],
      headspace: ["head_restart_mondays", "head_motivated_bursts"],
    });
    const note = generateNote(scored, "jee", "I dropped a year.");

    expect(scored.secondary).not.toBeNull();
    expect(note.fullNote).toContain(CLUSTERS[scored.secondary!].bridge);
    expect(note.fullNote).toContain("I dropped a year.");
    expect(note.teaser).not.toContain("I dropped a year.");
  });

  it("gives every cluster a one-sentence teaser", () => {
    for (const key of CLUSTER_KEYS) {
      const teaser = CLUSTERS[key].teaser;
      expect(teaser.trim().length).toBeGreaterThan(0);
      expect(teaser.trimEnd().endsWith(".")).toBe(true);
      // One sentence: no internal full stop followed by another capitalised clause.
      expect(teaser.trimEnd().slice(0, -1)).not.toMatch(/\.\s+[A-Z]/);
    }
  });
});
