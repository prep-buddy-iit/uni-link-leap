import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CLUSTERS, CLUSTER_KEYS } from "./clusters";
import { CATEGORY_KEYS, EXAMS, SUBJECTS_BY_EXAM, getCategories } from "./questions";
import { generateNote, rebuildFullNote, scoreResponses, type Responses } from "./engine";
import { TRIAL_CTA_COPY } from "./copy";
import {
  formatLeadNote,
  isGuidancePreviewLead,
  parseLeadNote,
  NOTES_MAX,
  type GuidancePreviewPayload,
} from "./lead-note";
import type { GuidancePreviewLead } from "./store";
import type { ExamKey } from "@/components/ApplicationModal";

// The questionnaire writes straight to `leads` on finish; stub that so the test
// never touches the network.
const saveGuidancePreviewLead = vi.fn(async (_lead: GuidancePreviewLead) => true);
vi.mock("@/lib/guidance-preview/store", () => ({
  saveGuidancePreviewLead: (lead: GuidancePreviewLead) => saveGuidancePreviewLead(lead),
}));

const open = vi.fn<(plan: string, exam: ExamKey, opts: { name: string; phone: string }) => void>();
vi.mock("@/lib/application-modal", () => ({
  useApplicationModal: () => ({ open }),
}));

// Imported after the mocks so the component picks them up.
const { GuidancePreviewChat } = await import("@/components/site/GuidancePreviewChat");

/** Walks the whole questionnaire, ticking one item per category, to the result. */
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

  await user.click(screen.getByRole("button", { name: /Almost there/i }));

  await user.type(screen.getByLabelText("Your name"), "Aarav Sharma");
  await user.type(screen.getByLabelText("Phone number"), "9876543210");
  await user.click(screen.getByRole("button", { name: /See what this points at/i }));

  await waitFor(() => expect(screen.getByRole("button", { name: /trial/i })).toBeTruthy());
  return user;
}

/** What the questionnaire wrote to `leads`. */
function saved(): GuidancePreviewLead {
  return saveGuidancePreviewLead.mock.calls[0][0];
}

beforeEach(() => {
  saveGuidancePreviewLead.mockClear();
  open.mockClear();
});
afterEach(cleanup);

describe("free result screen", () => {
  it("never renders fullNote content", async () => {
    await completePreview();

    const rendered = document.body.textContent ?? "";

    // The note the mentor gets is stored, but must not reach the pre-trial DOM.
    const { note } = saved();
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
    await completePreview();

    const { note } = saved();
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

  it("prefills the trial form with the contact already collected", async () => {
    const user = await completePreview();
    await user.click(screen.getByRole("button", { name: /trial/i }));

    expect(open.mock.calls[0][0]).toBe("trial");
    expect(open.mock.calls[0][1]).toBe("jee");
    expect(open.mock.calls[0][2]).toEqual({ name: "Aarav Sharma", phone: "9876543210" });
  });
});

describe("contact step", () => {
  it("stores the questionnaire without any signup", async () => {
    await completePreview("neet");

    const lead = saved();
    expect(lead.name).toBe("Aarav Sharma");
    expect(lead.phone).toBe("9876543210");
    expect(lead.exam).toBe("neet");
    expect(lead.subject).toBe("Physics");
    expect(lead.note.fullNote.length).toBeGreaterThan(0);
  });

  it("refuses to submit without a valid name and phone", async () => {
    const user = userEvent.setup();
    render(<GuidancePreviewChat initialExam="jee" />);

    await user.click(screen.getByRole("button", { name: /Physics/i }));
    await user.click(screen.getByRole("button", { name: /^Start/i }));
    for (const category of getCategories("jee")) {
      await user.click(screen.getByLabelText(category.items[0].label));
      await user.click(screen.getByRole("button", { name: /Next|Almost done/i }));
    }
    await user.click(screen.getByRole("button", { name: /Almost there/i }));

    // Nothing filled in.
    await user.click(screen.getByRole("button", { name: /See what this points at/i }));
    expect(saveGuidancePreviewLead).not.toHaveBeenCalled();
    expect(screen.getByText("Please enter your name.")).toBeTruthy();

    // A name, but a phone number that is too short.
    await user.type(screen.getByLabelText("Your name"), "Aarav Sharma");
    await user.type(screen.getByLabelText("Phone number"), "12345");
    await user.click(screen.getByRole("button", { name: /See what this points at/i }));
    expect(saveGuidancePreviewLead).not.toHaveBeenCalled();
    expect(screen.getByText("Please enter a valid phone number.")).toBeTruthy();
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

  it("builds the teaser evidence from the exam's own wording", async () => {
    await completePreview("neet");

    const lead = saved();
    expect(lead.note.teaser).toMatch(/^You said you /);
    expect(EXAMS.map((e) => e.key)).toContain(lead.exam);
  });
});

describe("lead note", () => {
  const idsOf = (lead: GuidancePreviewPayload) =>
    CATEGORY_KEYS.flatMap((k) => lead.responses[k] ?? []);

  it("is detectable as a preview and round-trips what it stored", async () => {
    await completePreview("neet");

    const lead = saved();
    const ids = idsOf(lead);
    const notes = formatLeadNote(lead, ids);

    expect(isGuidancePreviewLead(notes)).toBe(true);
    expect(isGuidancePreviewLead("Called twice, no answer")).toBe(false);
    expect(isGuidancePreviewLead(null)).toBe(false);

    expect(parseLeadNote(notes).ids).toEqual(ids);
  });

  it("rebuilds the exact full note the questionnaire generated", async () => {
    await completePreview("neet");

    const lead = saved();
    const notes = formatLeadNote(lead, idsOf(lead));
    const { ids, freeText } = parseLeadNote(notes);

    expect(rebuildFullNote(ids, "neet", freeText)).toBe(lead.note.fullNote);
  });

  it("stays inside the leads.notes constraint even when everything is ticked", () => {
    // The column is capped at 1000 chars; an over-long note is rejected outright
    // by Postgres, which is what silently lost the first submissions.
    const responses: Responses = {};
    for (const c of getCategories("neet")) responses[c.key] = c.items.map((i) => i.id);
    const ids = CATEGORY_KEYS.flatMap((k) => responses[k] ?? []);
    const scored = scoreResponses(responses);
    const freeText = "x".repeat(2000);

    const notes = formatLeadNote(
      {
        exam: "neet",
        subject: "All of them, honestly",
        responses,
        freeText,
        note: generateNote(scored, "neet", freeText),
      },
      ids,
    );

    expect(notes.length).toBeLessThanOrEqual(NOTES_MAX);
    expect(parseLeadNote(notes).ids).toEqual(ids);
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

    const notes = formatLeadNote(payload, ["rev_forget_weeks"]);
    expect(parseLeadNote(notes).freeText).toBe("I dropped a year.");
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
