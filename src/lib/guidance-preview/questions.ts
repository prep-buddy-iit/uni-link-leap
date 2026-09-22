import type { ClusterKey } from "./clusters";

export const SUBJECTS = [
  "Physics",
  "Chemistry",
  "Maths",
  "Biology",
  "All of them, honestly",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export type CategoryKey = "study" | "practice" | "revision" | "mocks" | "headspace";

export type Item = {
  id: string;
  /** What the student reads and ticks. */
  label: string;
  /**
   * Short phrasing used to build the teaser's evidence sentence, e.g.
   * "you said you ...". Kept lower-case and verb-first so it reads inside a list.
   */
  evidence: string;
  /** Internal scoring weights. Never rendered. */
  weights: Partial<Record<ClusterKey, number>>;
};

export type Category = {
  key: CategoryKey;
  /** The chatbot's question for this step. */
  question: string;
  /** Sub-line under the question. */
  hint: string;
  items: Item[];
};

export const CATEGORIES: Category[] = [
  {
    key: "study",
    question: "When you sit down to study, which of these sound like you?",
    hint: "Tick everything that fits - there are no wrong answers here.",
    items: [
      {
        id: "study_follow_lose",
        label: "I follow the class fine, then lose it when I sit alone",
        evidence: "can follow a class but lose the thread alone",
        weights: { foundation: 3, retention: 1 },
      },
      {
        id: "study_skip_basics",
        label: "I've moved ahead with chapters I never really closed",
        evidence: "have moved ahead past chapters you never closed",
        weights: { foundation: 3 },
      },
      {
        id: "study_reread",
        label: "I mostly re-read notes rather than test myself",
        evidence: "revise by re-reading rather than testing yourself",
        weights: { retention: 3 },
      },
      {
        id: "study_hours_nothing",
        label: "I put in hours but can't point to what I actually learned",
        evidence: "put in hours without being able to point to what stuck",
        weights: { retention: 2, consistency: 2 },
      },
      {
        id: "study_start_late",
        label: "I keep pushing the start of my session later and later",
        evidence: "keep pushing the start of each session later",
        weights: { consistency: 3 },
      },
    ],
  },
  {
    key: "practice",
    question: "Now the questions themselves - what usually happens?",
    hint: "Think about your last few practice sessions.",
    items: [
      {
        id: "prac_blank_start",
        label: "I understand the theory but go blank on where to start",
        evidence: "go blank on where to start despite knowing the theory",
        weights: { application: 4 },
      },
      {
        id: "prac_solution_obvious",
        label: "The solution looks obvious the moment I read it",
        evidence: "find solutions obvious the moment you read them",
        weights: { application: 3 },
      },
      {
        id: "prac_only_easy",
        label: "I can do the standard ones, but anything twisted stops me",
        evidence: "stall on anything that twists the standard question",
        weights: { application: 3, foundation: 1 },
      },
      {
        id: "prac_silly_mistakes",
        label: "I lose marks to careless slips more than to not knowing",
        evidence: "lose more marks to careless slips than to gaps",
        weights: { timing: 2, pressure: 2 },
      },
      {
        id: "prac_one_question_long",
        label: "I'll spend 15 minutes on one question rather than move on",
        evidence: "spend fifteen minutes on one question rather than move on",
        weights: { timing: 4 },
      },
    ],
  },
  {
    key: "revision",
    question: "And revision - be honest, this one's common.",
    hint: "Most students tick at least two of these.",
    items: [
      {
        id: "rev_forget_weeks",
        label: "Chapters I did a month ago feel completely gone",
        evidence: "find month-old chapters completely gone",
        weights: { retention: 4 },
      },
      {
        id: "rev_no_schedule",
        label: "I revise whenever I feel guilty, not on any schedule",
        evidence: "revise on guilt rather than on a schedule",
        weights: { retention: 3, consistency: 2 },
      },
      {
        id: "rev_formulae_slip",
        label: "Formulae slip away unless I've used them very recently",
        evidence: "lose formulae unless you have used them recently",
        weights: { retention: 3 },
      },
      {
        id: "rev_redo_from_scratch",
        label: "Re-learning old chapters takes almost as long as the first time",
        evidence: "need almost as long to re-learn a chapter as the first time",
        weights: { retention: 3, foundation: 2 },
      },
    ],
  },
  {
    key: "mocks",
    question: "What happens in mocks and school tests?",
    hint: "Skip any that don't apply yet.",
    items: [
      {
        id: "mock_run_out_time",
        label: "I run out of time with questions left that I could have done",
        evidence: "run out of time with doable questions left",
        weights: { timing: 4 },
      },
      {
        id: "mock_score_below_practice",
        label: "I score well below what my practice suggests I should",
        evidence: "score below what your practice suggests",
        weights: { pressure: 3, timing: 2 },
      },
      {
        id: "mock_no_analysis",
        label: "I check the score and don't really analyse the paper",
        evidence: "check the score without analysing the paper",
        weights: { application: 2, pressure: 2 },
      },
      {
        id: "mock_panic_first_hard",
        label: "One hard question early and the rest of the paper goes badly",
        evidence: "let one early hard question unsettle the whole paper",
        weights: { pressure: 4 },
      },
      {
        id: "mock_skip_mocks",
        label: "I avoid taking mocks because I'm not ready yet",
        evidence: "avoid mocks because you do not feel ready",
        weights: { pressure: 3, consistency: 2 },
      },
    ],
  },
  {
    key: "headspace",
    question: "Last one - how's the head, outside of the studying?",
    hint: "This shapes the plan more than most students expect.",
    items: [
      {
        id: "head_restart_mondays",
        label: "I make a new plan every week and break it by Wednesday",
        evidence: "rebuild the plan weekly and break it by midweek",
        weights: { consistency: 4 },
      },
      {
        id: "head_compare",
        label: "Comparing myself to others eats a lot of my energy",
        evidence: "spend energy comparing yourself to others",
        weights: { pressure: 3, consistency: 1 },
      },
      {
        id: "head_anxious_before",
        label: "I get genuinely anxious the night before a test",
        evidence: "get genuinely anxious the night before a test",
        weights: { pressure: 4 },
      },
      {
        id: "head_motivated_bursts",
        label: "I'm either fully on it or completely off it - no middle",
        evidence: "swing between fully on it and completely off it",
        weights: { consistency: 4 },
      },
      {
        id: "head_alone",
        label: "Nobody's really checking whether I did what I planned",
        evidence: "have nobody checking whether the plan was followed",
        weights: { consistency: 3 },
      },
    ],
  },
];

const ITEM_INDEX: Record<string, Item> = Object.fromEntries(
  CATEGORIES.flatMap((c) => c.items).map((i) => [i.id, i]),
);

export function getItem(id: string): Item | undefined {
  return ITEM_INDEX[id];
}
