import type { ExamKey } from "@/components/ApplicationModal";

export type Author = {
  slug: string;
  name: string;
  rank: string;
  institute: string;
  bio: string;
  initials: string;
  g: string;
};

export type ArticleCategory = "Motivation" | "Strategy" | "Mock Analysis" | "Exam Updates";

export type Article = {
  slug: string;
  category: ArticleCategory;
  exam: ExamKey | "both";
  title: string;
  description: string;
  authorSlug: string;
  datePublished: string;
  dateModified: string;
  readMinutes: number;
  body: { heading: string; paragraphs: string[] }[];
};

export type Video = {
  id: string;
  videoId: string; // YouTube ID
  exam: ExamKey | "both";
  kind: "Motivation" | "Campus Life" | "Strategy";
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  uploadDate: string;
};

export type CampusPhoto = {
  id: string;
  src: string;
  caption: string;
  institute: string;
  exam: ExamKey | "both";
  span?: "tall" | "wide" | "regular";
};

export const AUTHORS: Record<string, Author> = {
  "aarav-r": {
    slug: "aarav-r",
    name: "Aarav R.",
    rank: "AIR 312",
    institute: "IIT Bombay",
    bio: "3rd-year Mechanical at IIT Bombay. Coaches PrepBuddy Physics students on rotational mechanics and problem-decomposition strategy.",
    initials: "AR",
    g: "#ff7a45,#ff5c8a",
  },
  "ishita-p": {
    slug: "ishita-p",
    name: "Ishita P.",
    rank: "AIR 512",
    institute: "IIT Delhi",
    bio: "Computer Science at IIT Delhi. Focus on Maths - calculus, coordinate geometry, and building a PYQ-driven revision loop.",
    initials: "IP",
    g: "#2a4fe0,#8b5cf6",
  },
  "rahul-k": {
    slug: "rahul-k",
    name: "Rahul K.",
    rank: "AIR 189",
    institute: "IIT Madras",
    bio: "Chemical Engineering at IIT Madras. Two years of 1:1 mentorship on Physical and Organic Chemistry for droppers.",
    initials: "RK",
    g: "#8b5cf6,#5b7cff",
  },
  "ananya-m": {
    slug: "ananya-m",
    name: "Ananya M.",
    rank: "NEET AIR 145",
    institute: "AIIMS Delhi",
    bio: "2nd-year MBBS at AIIMS Delhi. Coaches PrepBuddy NEET students on Human Physiology and NCERT-first revision.",
    initials: "AM",
    g: "#22c35e,#12a04a",
  },
  "sara-j": {
    slug: "sara-j",
    name: "Sara J.",
    rank: "NEET AIR 92",
    institute: "MAMC, Delhi",
    bio: "MBBS at Maulana Azad Medical College. Focus on Biology - genetics, evolution, and mock-error tagging.",
    initials: "SJ",
    g: "#ff7a45,#22c35e",
  },
  "rohan-t": {
    slug: "rohan-t",
    name: "Rohan T.",
    rank: "NEET AIR 289",
    institute: "AIIMS Bhopal",
    bio: "MBBS at AIIMS Bhopal. Guest contributor - writes on Organic Chemistry mechanisms and dropper-year mental resilience.",
    initials: "RT",
    g: "#2a4fe0,#22c35e",
  },
};

export const ARTICLES: Article[] = [
  {
    slug: "jee-dropper-daily-hours",
    category: "Strategy",
    exam: "jee",
    title: "How many hours should a JEE dropper actually study each day?",
    description: "The honest answer isn't a single number - it's the structure that turns those hours into rank movement.",
    authorSlug: "aarav-r",
    datePublished: "2026-05-14",
    dateModified: "2026-05-14",
    readMinutes: 6,
    body: [
      { heading: "The short answer", paragraphs: ["Most serious droppers land in the 8–10 focused hour range across Physics, Chemistry and Maths, with one full-length mock every week. But raw hours are the wrong metric - what matters is whether those hours are structured against your weak areas and reviewed the next day."] },
      { heading: "How to actually schedule those hours", paragraphs: ["Break the day into three subject blocks of roughly 2.5 hours each - one theory + PYQ, one problem set, one revision - with a 45-minute mock error review at the end. Rotate which subject leads the day each week so you're not always fresh on the same one."] },
      { heading: "The revision loop that actually works", paragraphs: ["Every chapter you touch this week gets revisited in week two as a PYQ set, in week four as a short quiz, and in week eight inside a full mock section. If a chapter never resurfaces, you'll forget it - no matter how many hours you spent the first time."] },
      { heading: "What to do when you can't hit 10 hours", paragraphs: ["Cut problem sets before you cut revision. A day of only 6 well-reviewed hours beats a day of 11 hours where you never look back at your mistakes. Your mentor's job is to help you protect the review time when the schedule slips."] },
    ],
  },
  {
    slug: "jee-mock-analysis-error-log",
    category: "Mock Analysis",
    exam: "jee",
    title: "How to analyze a JEE mock test instead of just checking your score",
    description: "The 4-tag error log system every top scorer uses to stop losing the same 20 marks every week.",
    authorSlug: "ishita-p",
    datePublished: "2026-04-28",
    dateModified: "2026-05-10",
    readMinutes: 5,
    body: [
      { heading: "Why the score isn't the signal", paragraphs: ["Two students with the same 180/300 can have wildly different diagnoses. One is losing marks to silly Maths mistakes; the other doesn't understand rotational mechanics. Same score, opposite fixes."] },
      { heading: "The 4-tag error log", paragraphs: ["After every mock, tag each wrong question as one of: concept gap, silly mistake, misread question, or time pressure. Keep the log in a single spreadsheet across all mocks so the pattern surfaces after 3–4 weeks."] },
      { heading: "What to do with each tag", paragraphs: ["Concept gaps go back to theory + PYQs. Silly mistakes go into a checklist you run before submitting each section. Misread questions become a reading-speed drill. Time pressure means your section strategy needs re-sequencing, not more speed."] },
    ],
  },
  {
    slug: "jee-mentorship-vs-coaching",
    category: "Strategy",
    exam: "jee",
    title: "Is coaching necessary for a JEE dropper, or is mentorship enough?",
    description: "When each one helps, and how to combine them without burning out on 6 hours of daily lectures.",
    authorSlug: "rahul-k",
    datePublished: "2026-03-12",
    dateModified: "2026-03-12",
    readMinutes: 7,
    body: [
      { heading: "They solve different problems", paragraphs: ["Coaching teaches syllabus content to a batch. Mentorship makes sure you actually execute against a plan built from your mocks. Many droppers crack JEE with only self-study + mentorship; many others need coaching for one weak subject and self-study for the rest."] },
      { heading: "The lecture-hours trap", paragraphs: ["Six hours of daily lectures + eight hours of self-study is not a plan - it's a way to burn out by August. If you're already in coaching, cap lectures at what you can revise the same day."] },
    ],
  },
  {
    slug: "neet-biology-revision-loop",
    category: "Strategy",
    exam: "neet",
    title: "The NCERT-first NEET Biology revision loop that actually sticks",
    description: "How to cycle through NCERT lines, PYQs and MCQs weekly without losing retention by exam day.",
    authorSlug: "ananya-m",
    datePublished: "2026-05-02",
    dateModified: "2026-05-02",
    readMinutes: 6,
    body: [
      { heading: "Why NCERT-first is non-negotiable for NEET", paragraphs: ["Over 80% of NEET Biology questions map directly to NCERT lines. Any revision loop that starts with a coaching module instead of the NCERT paragraph is optimizing for the wrong text."] },
      { heading: "The weekly loop", paragraphs: ["Monday: read the NCERT chapter, highlight lines that answer past questions. Wednesday: 40 PYQs on that chapter. Friday: 60 mixed MCQs. Sunday: 20-minute recall test - no book, just write down what you remember."] },
    ],
  },
  {
    slug: "neet-dropper-hours",
    category: "Strategy",
    exam: "neet",
    title: "How many hours should a NEET dropper actually study each day?",
    description: "A weekly template you can adapt - Biology-heavy, revision-first, one full-length mock every Sunday.",
    authorSlug: "sara-j",
    datePublished: "2026-04-08",
    dateModified: "2026-04-08",
    readMinutes: 5,
    body: [
      { heading: "The realistic range", paragraphs: ["Most serious NEET droppers work 8–10 focused hours with a Biology-heavy split - roughly 4 hours Biology, 2.5 hours Chemistry, 2 hours Physics on a typical weekday. Weekends collapse into mock + review."] },
      { heading: "Protect the mock review", paragraphs: ["Sunday's mock is only useful if Monday morning is spent tagging errors, not starting a new chapter. If you're cutting anything, don't cut the review."] },
    ],
  },
  {
    slug: "dropper-year-mental-resilience",
    category: "Motivation",
    exam: "both",
    title: "The one mindset shift that gets droppers through the last 90 days",
    description: "A guest note from an AIIMS student on why the last three months are less about content and more about staying in the chair.",
    authorSlug: "rohan-t",
    datePublished: "2026-02-20",
    dateModified: "2026-02-20",
    readMinutes: 4,
    body: [
      { heading: "You already know enough", paragraphs: ["By the last 90 days, most droppers have already covered the syllabus at least twice. What separates a rank inside 1000 from a rank outside 10000 isn't new content - it's whether you keep showing up to the desk on the bad days."] },
      { heading: "The one shift", paragraphs: ["Stop measuring the day by how much you learnt. Start measuring it by whether you sat in the chair for the hours you'd planned. Retention follows consistency, not the other way around."] },
    ],
  },
  {
    slug: "jee-main-2027-updates",
    category: "Exam Updates",
    exam: "jee",
    title: "JEE Main 2027 Session 1 - dates, syllabus notes, and how to plan the next months",
    description: "What's confirmed, what's rumored, and how droppers should sequence the next 16 weeks around Session 1.",
    authorSlug: "aarav-r",
    datePublished: "2026-06-01",
    dateModified: "2026-06-15",
    readMinutes: 5,
    body: [
      { heading: "What's confirmed for Session 1", paragraphs: ["JEE Main Session 1 is expected in late January 2027, with the official window and syllabus notification from NTA. Track the official NTA site - do not rely on unofficial WhatsApp forwards."] },
      { heading: "The 16-week plan", paragraphs: ["Weeks 1–8: chapter-wise PYQ sweep across the syllabus, one subject deep every fortnight. Weeks 9–13: full-length mocks every 5 days with tagged error review. Weeks 14–16: revision-only, no new chapters."] },
    ],
  },
  {
    slug: "why-most-students-plateau",
    category: "Motivation",
    exam: "both",
    title: "Why most students plateau at the same rank for months - and how to break out",
    description: "A plateau is almost never a hours problem. It's usually a review-loop problem or a fear problem.",
    authorSlug: "ishita-p",
    datePublished: "2026-01-18",
    dateModified: "2026-01-18",
    readMinutes: 5,
    body: [
      { heading: "The plateau isn't your effort", paragraphs: ["If your mocks have hovered in the same 30-mark range for two months, adding two more hours to your day almost never fixes it. The fix is either a broken review loop or an unspoken fear about one specific section you keep avoiding."] },
      { heading: "The diagnostic", paragraphs: ["Look at your last four mocks and count how many marks came from the top-scoring section versus the bottom. If one section is consistently 15+ marks behind, that's not lack of practice - that's avoidance. A mentor's first job is to make that section un-avoidable for two weeks straight."] },
    ],
  },
];

export const VIDEOS: Video[] = [
  { id: "v1", videoId: "dQw4w9WgXcQ", exam: "jee", kind: "Motivation", title: "From AIR 40,000 in mocks to a real IIT seat", description: "A 4-minute talk from an IIT Bombay mentor on the six weeks that turned his prep around.", duration: "4:12", thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=70", uploadDate: "2026-05-20" },
  { id: "v2", videoId: "dQw4w9WgXcQ", exam: "jee", kind: "Campus Life", title: "A day in the life at IIT Bombay", description: "Sunrise at Powai lake to a late-night lab session - a walk through campus with a 3rd-year student.", duration: "6:48", thumbnail: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=70", uploadDate: "2026-04-12" },
  { id: "v3", videoId: "dQw4w9WgXcQ", exam: "jee", kind: "Strategy", title: "How to break down a JEE Advanced problem in 4 steps", description: "A walkthrough of the decomposition method our mentors use on rotational-mechanics questions.", duration: "9:20", thumbnail: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&auto=format&fit=crop&q=70", uploadDate: "2026-03-30" },
  { id: "v4", videoId: "dQw4w9WgXcQ", exam: "neet", kind: "Motivation", title: "The AIIMS student who wrote NEET three times", description: "Ananya on what changed in her third attempt - and what she wishes someone had told her earlier.", duration: "5:32", thumbnail: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?w=800&auto=format&fit=crop&q=70", uploadDate: "2026-05-06" },
  { id: "v5", videoId: "dQw4w9WgXcQ", exam: "neet", kind: "Campus Life", title: "Inside AIIMS Delhi - hostel to anatomy hall", description: "A first-year MBBS student's morning walk from her hostel to the anatomy hall and back.", duration: "7:04", thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=70", uploadDate: "2026-04-22" },
  { id: "v6", videoId: "dQw4w9WgXcQ", exam: "neet", kind: "Strategy", title: "The NCERT-first Biology revision loop, on video", description: "Ananya walks through her weekly revision loop chapter by chapter, using her own notes.", duration: "11:15", thumbnail: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=800&auto=format&fit=crop&q=70", uploadDate: "2026-03-14" },
];

export const CAMPUS_PHOTOS: CampusPhoto[] = [
  { id: "p1", src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=70", caption: "IIT Bombay - Main building at Powai", institute: "IIT Bombay", exam: "jee", span: "wide" },
  { id: "p2", src: "https://images.unsplash.com/photo-1568667256549-094345857637?w=900&auto=format&fit=crop&q=70", caption: "IIT Delhi - Central Library reading hall", institute: "IIT Delhi", exam: "jee" },
  { id: "p3", src: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=900&auto=format&fit=crop&q=70", caption: "IIT Madras - Gajendra Circle at dusk", institute: "IIT Madras", exam: "jee", span: "tall" },
  { id: "p4", src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=70", caption: "AIIMS Delhi - Anatomy hall entrance", institute: "AIIMS Delhi", exam: "neet", span: "wide" },
  { id: "p5", src: "https://images.unsplash.com/photo-1562774053-701939374585?w=900&auto=format&fit=crop&q=70", caption: "IIT Kanpur - Convocation Ground", institute: "IIT Kanpur", exam: "jee" },
  { id: "p6", src: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=900&auto=format&fit=crop&q=70", caption: "AIIMS Bhopal - Academic block", institute: "AIIMS Bhopal", exam: "neet", span: "tall" },
  { id: "p7", src: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=900&auto=format&fit=crop&q=70", caption: "NIT Trichy - Orion Ground on convocation day", institute: "NIT Trichy", exam: "jee" },
  { id: "p8", src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1200&auto=format&fit=crop&q=70", caption: "IIT Kharagpur - Netaji Auditorium", institute: "IIT Kharagpur", exam: "jee", span: "wide" },
  { id: "p9", src: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=900&auto=format&fit=crop&q=70", caption: "AIIMS Rishikesh - Riverside campus", institute: "AIIMS Rishikesh", exam: "neet" },
  { id: "p10", src: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=900&auto=format&fit=crop&q=70", caption: "JIPMER Puducherry - main quad", institute: "JIPMER", exam: "neet", span: "tall" },
];

export function articleBySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
