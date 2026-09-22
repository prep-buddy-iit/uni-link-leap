/**
 * The six preparation patterns the Free Guidance Preview can land on.
 *
 * These keys are INTERNAL. They are never rendered anywhere in the pre-trial UI -
 * students only ever see `label` (plain language) and the teaser sentence.
 * See `generateNote()` in ./engine for how the two outputs are split.
 */
export const CLUSTER_KEYS = [
  "foundation",
  "retention",
  "application",
  "timing",
  "consistency",
  "pressure",
] as const;

export type ClusterKey = (typeof CLUSTER_KEYS)[number];

type Cluster = {
  /** Plain-language pattern name. Safe to show pre-trial (it is part of the teaser). */
  label: string;
  /** One-sentence teaser body. Shown pre-trial, after the evidence sentence. */
  teaser: string;
  /** The full diagnostic note. Gated - never rendered before trial signup. */
  full: string;
  /** Bridging line appended to `full` when this cluster comes up as the secondary pattern. */
  bridge: string;
};

export const CLUSTERS: Record<ClusterKey, Cluster> = {
  foundation: {
    label: "The basics underneath are shaky",
    teaser:
      "You are working hard on top of concepts that were never fully closed, so the effort keeps leaking out the bottom.",
    full: `The pattern here is a foundation problem, not an effort problem. What you described is someone who can follow a chapter while it is being taught and then lose the thread the moment a question comes at it from a different angle. That is what an unclosed concept feels like from the inside - it does not feel like not knowing the topic, it feels like having known it yesterday.

Practically, this shows up as a widening gap between your class performance and your test performance. You keep up in the lecture, you follow the derivation, and then the paper asks you to combine two ideas and there is nothing to combine, because neither idea is fully yours yet.

The fix is not more chapters. It is going back through a short list - usually six to ten topics, not the whole syllabus - and rebuilding them to the point where you could teach them out loud without notes. Most students resist this because it feels like going backwards while everyone else moves forward. It is not. Everything above those topics is currently being built on sand, so the rebuild pays for itself within weeks.

A mentor's first job with this pattern is to work out which six to ten topics actually matter for your exam and your current level, because doing this for the whole syllabus is neither possible nor necessary.`,
    bridge:
      "Underneath all of this, some of the core concepts have never been fully closed - which is why the same fix has to be applied twice before it holds.",
  },

  retention: {
    label: "What you study isn't sticking",
    teaser:
      "You are covering material properly the first time, but nothing is bringing it back before it fades, so you keep re-learning what you already paid for.",
    full: `The pattern here is retention, and it is one of the most demoralising ones to be inside, because the work is genuinely being done. You study a chapter, you understand it, you move on - and six weeks later it is functionally gone. That is not a memory defect. That is what happens to any material that is studied once and never deliberately retrieved.

What is missing is a revision system that runs on a schedule instead of on guilt. Right now revision probably happens when you happen to feel behind on something, which means the topics you feel worst about get revised repeatedly and the topics you quietly forgot get revised never.

The change is mechanical rather than motivational: every topic you close gets scheduled for active recall - closed book, question first - at widening intervals. The point is to meet each topic again just as it starts to slip, because that is the repetition that actually holds. Re-reading notes feels productive and does very little here.

Done properly this costs about thirty to forty minutes a day, and it is the single highest-leverage habit change available to you. A mentor's job with this pattern is to hold the schedule for the first few weeks, because the early days feel like wasted time and almost nobody sustains it alone.`,
    bridge:
      "On top of that, the material that does go in is not being brought back before it fades, so some of this ground is being covered more than once.",
  },

  application: {
    label: "Theory is fine, questions are the wall",
    teaser:
      "You can follow the theory and still stall at the start of a problem, which points at how you translate concepts into moves rather than at what you know.",
    full: `The pattern here is application. You understand the material - that part is real, and you should stop doubting it. What is missing is the layer between knowing a concept and knowing what to do with it when it turns up inside a question dressed as something else.

This is why solutions feel obvious in hindsight and invisible in the moment. When you read a worked solution you are checking each step against knowledge you already have, and each step checks out, so it feels like you could have done it. You could not have, because the hard part was never the steps - it was choosing the first one.

The work is deliberate and specific: practice sessions built around recognising problem types, not around finishing a question count. For every problem you get wrong, the question to answer is not what the correct solution was, but what in the question should have told you to reach for that method. That second question is where the actual learning lives, and it is the one almost everyone skips.

Expect this to feel slower than your current practice. You will do fewer problems and get considerably more out of each one. A mentor's job here is to sit on the pace, because the instinct to chase volume is strong and it is exactly what has kept this gap open.`,
    bridge:
      "The same gap shows up in how questions are approached - the theory is there, but the step from concept to first move is not yet automatic.",
  },

  timing: {
    label: "The clock is costing you more than the syllabus",
    teaser:
      "You are losing marks you had already earned, which points at pacing and question selection under time rather than at preparation.",
    full: `The pattern here is timing, and it is worth saying plainly: you are losing marks on questions you can actually do. That is a different problem from not knowing the material, and it responds much faster.

What is almost certainly happening is that you have no exit rule. A question that should take two minutes gets four, then six, because you are already invested and stopping feels like wasting the time you have spent. By the time you surface, the paper has moved on without you and the last section gets rushed - which is where the cheap marks were sitting.

Two things change this. First, a hard exit rule you rehearse until it is reflex: if a question has not opened up by a set point, it gets marked and left, and you come back only if there is time. Second, a fixed order of attack across the paper, decided before you sit down rather than improvised while the clock runs.

Neither of these is learned by reading about them. They are learned by taking sectional papers under strict time specifically to practise abandoning questions, which feels awful and is the entire point. A mentor's job with this pattern is to review your attempt order after each mock - not your score - because the score moves on its own once the order is right.`,
    bridge:
      "Time management compounds it - some of these marks are being lost on the clock rather than on the content.",
  },

  consistency: {
    label: "The plan is fine, the follow-through isn't",
    teaser:
      "The pattern is not about capability - it is about a routine that collapses and restarts, so progress keeps resetting instead of accumulating.",
    full: `The pattern here is consistency, and the honest framing is that your ceiling is not the problem. Your average is. You have good days that would be enough if they were ordinary days, and the gap between your best week and your typical week is where the marks are going.

The usual shape of this is a cycle: a bad stretch produces guilt, guilt produces an ambitious new plan, the plan is unsustainable, it breaks within a week, and the break produces the next bad stretch. Each restart feels like a fresh beginning and is actually the same loop. The plans are not failing because they are wrong. They are failing because they were built for your best day and then asked to survive an ordinary one.

The change is to build the floor instead of the ceiling: a minimum daily block small enough that you will hit it on your worst day, and then protecting that number obsessively rather than exceeding it. Consistency at a modest number beats brilliance three days a week by a distance, and it compounds.

The second half is accountability that is external rather than internal, because the entire problem is that internal accountability has already been tried and has not held. Someone who notices on day two - not week three - is what closes this pattern. That is most of what daily mentor check-ins are actually for.`,
    bridge:
      "Underneath it all, the routine breaks and restarts often enough that fixes do not get long enough to hold.",
  },

  pressure: {
    label: "You prepare well and then the exam takes it back",
    teaser:
      "What you described is a gap between what you can do calmly and what survives the exam hall, which is a pressure pattern rather than a preparation one.",
    full: `The pattern here is pressure, and the tell is the gap between your practice and your papers. You can do this material at your desk. Something in the exam hall takes it away from you, and then the memory of that happening makes the next paper worse.

This is not a character flaw and it is not rare. Under pressure, working memory narrows. The specific consequence is that the flexible, improvised problem-solving you rely on at home stops being available, because it was never automatic - it was being held together by having enough headroom to think. Remove the headroom and it falls apart.

So the fix is not calming down, which is advice nobody has ever been able to follow. The fix is making more of your process automatic, so that less of it needs headroom. That means rehearsing the mechanical parts - the first ninety seconds of a paper, the order you attack sections in, what you do when you hit the first question you cannot start - until they run without deliberation. It also means taking mocks under genuinely uncomfortable conditions rather than gentle ones, so the exam hall stops being a novel environment.

Alongside that, the post-mock review has to change. Right now a bad mock is probably a day of dread; it needs to become twenty minutes of specific, unemotional analysis. A mentor's job with this pattern is largely to hold that line, because the review is the part that gets avoided precisely when it matters most.`,
    bridge:
      "Exam-hall pressure sits on top of it, which is why the gap between practice and papers keeps widening.",
  },
};
