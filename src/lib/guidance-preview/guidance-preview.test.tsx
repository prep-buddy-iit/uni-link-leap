import { useEffect } from "react";
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
const { PrepCheckProvider, usePrepCheck } = await import("@/lib/prep-check");
const { PrepCheckBot } = await import("@/components/site/PrepCheckBot");

/** Stands in for a page CTA that launches the bot, optionally with an exam. */
function AutoOpen({ exam }: { exam?: ExamKey }) {
  const { open } = usePrepCheck();
  useEffect(() => {
    open(exam);
  }, [open, exam]);
  return null;
}

/** Mounts the floating assistant the way the root route does. */
function renderBot(options: { autoOpenWith?: ExamKey; autoOpen?: boolean } = {}) {
  render(
    <PrepCheckProvider>
      {(options.autoOpen || options.autoOpenWith) && <AutoOpen exam={options.autoOpenWith} />}
      <PrepCheckBot />
    </PrepCheckProvider>,
  );
  return userEvent.setup();
}

/** Ticks one item per category and answers the rest, up to the result card. */
async function answerEverything(user: ReturnType<typeof userEvent.setup>, exam: ExamKey) {
  for (const category of getCategories(exam)) {
    await user.click(await screen.findByRole("button", { name: category.items[0].label }));
    await user.click(screen.getByRole("button", { name: /^Continue$/ }));
  }
  await user.click(await screen.findByRole("button", { name: /Skip this/i }));
}

/** Walks the whole questionnaire, from the closed launcher, to the result. */
async function completePreview(exam: ExamKey = "jee") {
  const user = renderBot();

  // Closed by default - the student opens it from the corner.
  await user.click(screen.getByRole("button", { name: /open the prepbuddy prep check/i }));

  await user.click(await screen.findByRole("button", { name: new RegExp(`^${exam}`, "i") }));
  await user.click(await screen.findByRole("button", { name: "Physics" }));

  await answerEverything(user, exam);

  await user.type(await screen.findByLabelText("Your name"), "Aarav Sharma");
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
  // The bot keeps a half-finished prep check in sessionStorage for the session,
  // which would otherwise leak from one test into the next.
  window.sessionStorage.clear();
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
    // ?exam=jee opens the bot straight onto the subject question.
    const user = renderBot({ autoOpenWith: "jee" });

    await user.click(await screen.findByRole("button", { name: "Physics" }));
    await answerEverything(user, "jee");

    // Nothing filled in.
    await user.click(await screen.findByRole("button", { name: /See what this points at/i }));
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

describe("floating bot", () => {
  const LAUNCHER = /open the prepbuddy prep check/i;
  const MINIMISE = /close the prep check/i;

  it("starts closed and opens from the corner launcher", async () => {
    const user = renderBot();

    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: LAUNCHER }));

    const panel = screen.getByRole("dialog", { name: "PrepBuddy Prep Check" });
    expect(panel).toBeTruthy();
    // Focus lands inside the panel rather than being left on the page behind it.
    expect(document.activeElement).toBe(panel);
  });

  it("keeps the answers already given when minimised and reopened", async () => {
    const user = renderBot({ autoOpen: true });

    await user.click(await screen.findByRole("button", { name: /^JEE/ }));
    await user.click(await screen.findByRole("button", { name: "Physics" }));
    const firstItem = getCategories("jee")[0].items[0].label;
    await user.click(await screen.findByRole("button", { name: firstItem }));

    await user.click(screen.getByRole("button", { name: MINIMISE }));
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByRole("button", { name: LAUNCHER }));

    // Same question, same tick - not back at the start.
    const reopened = screen.getByRole("button", { name: firstItem });
    expect(reopened.getAttribute("aria-pressed")).toBe("true");
    expect(screen.queryByRole("button", { name: /^NEET/ })).toBeNull();
  });

  it("minimises on Escape", async () => {
    const user = renderBot({ autoOpen: true });

    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: LAUNCHER })).toBeTruthy();
  });

  it("reopens on the result instead of restarting once it has been finished", async () => {
    const user = await completePreview();
    const { note } = saved();

    await user.click(screen.getByRole("button", { name: MINIMISE }));
    await user.click(screen.getByRole("button", { name: LAUNCHER }));

    expect(screen.getByText(note.teaserLabel)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /^JEE/ })).toBeNull();
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

  it("recovers the exact ticked options, grouped by question", async () => {
    await completePreview("neet");

    const lead = saved();
    const ids = idsOf(lead);
    const { ids: back } = parseLeadNote(formatLeadNote(lead, ids));

    // What the admin drawer does: map stored ids to this exam's wording.
    const grouped = getCategories("neet")
      .map((c) => ({ question: c.question, picked: c.items.filter((i) => back.includes(i.id)) }))
      .filter((g) => g.picked.length > 0);

    expect(grouped.flatMap((g) => g.picked.map((i) => i.id))).toEqual(ids);
    for (const g of grouped) {
      for (const item of g.picked) expect(item.label.length).toBeGreaterThan(0);
    }
    // NEET wording, not JEE, and not raw ids.
    const reread = grouped.flatMap((g) => g.picked).find((i) => i.id === "study_reread");
    if (reread) expect(reread.label).toContain("NCERT");
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
