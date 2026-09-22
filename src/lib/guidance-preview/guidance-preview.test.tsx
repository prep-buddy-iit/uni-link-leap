import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CLUSTERS, CLUSTER_KEYS } from "./clusters";
import { EXAMS, SUBJECTS_BY_EXAM, getCategories } from "./questions";
import { generateNote, scoreResponses, type Responses } from "./engine";
import { TRIAL_CTA_COPY } from "./copy";
import { formatLeadNote, isGuidancePreviewLead, type GuidancePreviewPayload } from "./lead-note";
import type { ExamKey } from "@/components/ApplicationModal";

// Nothing is persisted on finish any more - the preview is handed to the trial
// modal in memory, so `open` is the whole handoff surface.
const open =
  vi.fn<(plan: string, exam: ExamKey, opts: { guidancePreview: GuidancePreviewPayload }) => void>();
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

/** The payload the result screen would hand to the trial form. */
function handedOff(): GuidancePreviewPayload {
  return open.mock.calls[0][2].guidancePreview;
}

beforeEach(() => {
  open.mockClear();
});
afterEach(cleanup);

describe("free result screen", () => {
  it("never renders fullNote content", async () => {
    const user = await completePreview();

    // Snapshot the screen before the CTA hands anything over.
    const rendered = document.body.textContent ?? "";
    await user.click(screen.getByRole("button", { name: /trial/i }));

    // The note the mentor gets travels on, but must not reach the pre-trial DOM.
    const { note } = handedOff();
    expect(note.fullNote.length).toBeGreaterThan(0);
    expect(rendered).not.toContain(note.fullNote);

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
    const user = await completePreview();
    await user.click(screen.getByRole("button", { name: /trial/i }));

    const { note } = handedOff();
    expect(screen.getByText(note.teaserLabel)).toBeTruthy();
    expect(screen.getByText(note.teaser)).toBeTruthy();
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

  it("hands the preview payload to the existing trial flow", async () => {
    const user = await completePreview();
    await user.click(screen.getByRole("button", { name: /trial/i }));

    expect(open.mock.calls[0][0]).toBe("trial");
    expect(open.mock.calls[0][1]).toBe("jee");
    expect(handedOff().note.fullNote.length).toBeGreaterThan(0);
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

    expect(open.mock.calls[0][0]).toBe("trial");
    expect(open.mock.calls[0][1]).toBe("neet");
    expect(handedOff().exam).toBe("neet");
  });

  it("builds the teaser evidence from the exam's own wording", async () => {
    const user = await completePreview("neet");
    await user.click(screen.getByRole("button", { name: /trial/i }));

    const payload = handedOff();
    expect(payload.note.teaser).toMatch(/^You said you /);
    expect(EXAMS.map((e) => e.key)).toContain(payload.exam);
  });
});

describe("lead note", () => {
  it("carries the answers and full note, and is detectable as a preview", async () => {
    const user = await completePreview("neet");
    await user.click(screen.getByRole("button", { name: /trial/i }));

    const notes = formatLeadNote(handedOff());

    expect(isGuidancePreviewLead(notes)).toBe(true);
    expect(isGuidancePreviewLead("Called twice, no answer")).toBe(false);
    expect(isGuidancePreviewLead(null)).toBe(false);

    expect(notes).toContain("NEET · Physics");
    expect(notes).toContain("What they ticked:");
    expect(notes).toContain(handedOff().note.fullNote);

    // Ticked items are written as their NEET wording, not as raw ids.
    const firstTicked = getCategories("neet")[0].items[0];
    expect(notes).toContain(firstTicked.label);
    expect(notes).not.toContain(firstTicked.id);
  });

  it("includes the student's own words when given", () => {
    const scored = scoreResponses({ revision: ["rev_forget_weeks"] });
    const payload: GuidancePreviewPayload = {
      exam: "jee",
      subject: "Maths",
      responses: { revision: ["rev_forget_weeks"] },
      freeText: "I dropped a year.",
      note: generateNote(scored, "jee", "I dropped a year."),
    };

    const notes = formatLeadNote(payload);
    expect(notes).toContain("In their words:");
    expect(notes).toContain("I dropped a year.");
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
