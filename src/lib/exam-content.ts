import type { ExamKey } from "@/components/ApplicationModal";

export type Mentor = {
  name: string; rank: string; institute: string; specialty: string;
  initials: string; g: string; exam: ExamKey;
};

export type FAQ = { q: string; a: string };
export type Post = { tag: string; title: string; body: string };
export type Testimonial = { quote: string; name: string; meta: string };

export const COMMUNITIES: Record<ExamKey, { whatsapp: string }> = {
  jee: { whatsapp: "https://chat.whatsapp.com/" },
  neet: { whatsapp: "https://chat.whatsapp.com/" },
};

export const JEE_MENTORS: Mentor[] = [
  { name: "Aarav R.",   rank: "AIR 312",  institute: "IIT Bombay",    specialty: "Physics · Rotational Mechanics", initials: "AR", g: "#ff7a45,#ff5c8a", exam: "jee" },
  { name: "Ishita P.",  rank: "AIR 512",  institute: "IIT Delhi",     specialty: "Maths · Calculus & Coordinate",  initials: "IP", g: "#2a4fe0,#8b5cf6", exam: "jee" },
  { name: "Rahul K.",   rank: "AIR 189",  institute: "IIT Madras",    specialty: "Chemistry · Physical & Organic", initials: "RK", g: "#8b5cf6,#5b7cff", exam: "jee" },
  { name: "Meera S.",   rank: "AIR 640",  institute: "IIT Kanpur",    specialty: "Full-stack JEE · Dropper strategy", initials: "MS", g: "#ff5c8a,#8b5cf6", exam: "jee" },
  { name: "Karthik V.", rank: "AIR 428",  institute: "IIT Kharagpur", specialty: "Physics · Mechanics & E&M",      initials: "KV", g: "#2a4fe0,#5b7cff", exam: "jee" },
];

export const NEET_MENTORS: Mentor[] = [
  { name: "Ananya M.",  rank: "NEET AIR 145", institute: "AIIMS Delhi",    specialty: "Biology · Human Physiology",    initials: "AM", g: "#22c35e,#12a04a", exam: "neet" },
  { name: "Rohan T.",   rank: "NEET AIR 289", institute: "AIIMS Bhopal",   specialty: "Chemistry · Organic mechanisms", initials: "RT", g: "#2a4fe0,#22c35e", exam: "neet" },
  { name: "Sara J.",    rank: "NEET AIR 92",  institute: "MAMC, Delhi",    specialty: "Biology · Genetics & Evolution", initials: "SJ", g: "#ff7a45,#22c35e", exam: "neet" },
  { name: "Vikram L.",  rank: "NEET AIR 512", institute: "JIPMER",         specialty: "Physics · Modern Physics",       initials: "VL", g: "#8b5cf6,#22c35e", exam: "neet" },
  { name: "Priya G.",   rank: "NEET AIR 340", institute: "AIIMS Rishikesh", specialty: "Biology · Botany · Dropper strategy", initials: "PG", g: "#ff5c8a,#22c35e", exam: "neet" },
];

export const ALL_MENTORS: Mentor[] = [...JEE_MENTORS, ...NEET_MENTORS];

export const JEE_FAQS: FAQ[] = [
  { q: "Does having a mentor actually help in JEE preparation?", a: "Yes - the biggest predictor of JEE consistency is not content access, it's whether someone is actually checking on your work. A mentor gives you weekly plans built from your real mock data, holds you to daily study hours, and reviews the errors that keep repeating." },
  { q: "What is the difference between a JEE mentor and a coaching institute?", a: "A coaching institute teaches syllabus content to a batch of hundreds. A PrepBuddy mentor is one IITian working with you 1:1 - they don't teach chapters, they build the plan, watch the mocks, catch the gaps, and keep you accountable. Most students use mentorship alongside their existing coaching or self-study." },
  { q: "How many hours should a JEE dropper study every day?", a: "Most serious droppers work in the 8–10 focused hour range across Physics, Chemistry and Maths, with one full weekly mock. But raw hours are the wrong metric - what matters is whether those hours are structured against your weak areas." },
  { q: "How do I stop making the same mistakes in JEE mock tests?", a: "You need an error log, not more mocks. After every mock, tag each wrong question as concept gap, silly mistake, misread, or time pressure - and revisit the recurring categories weekly. Your mentor runs this analysis with you." },
  { q: "What exactly happens in PrepBuddy's ₹99, 3-day trial?", a: "You get one call with an IITian mentor, a personalized 3-day plan built from your last mock score, and daily check-ins for those 3 days. It's priced low on purpose - to filter for students who are serious about actually doing the work." },
  { q: "Can I cancel my PrepBuddy plan anytime?", a: "Yes. You can stop your plan whenever you want. If the mentor fit isn't right, we'll match you with another one first - cancellation is only if you decide mentorship isn't for you." },
  { q: "Is coaching necessary for a JEE dropper?", a: "No - many droppers crack JEE with only self-study and a strong mentor. Coaching is useful if you need someone to structure content delivery; mentorship is what makes sure you actually execute." },
  { q: "What makes a JEE mentorship program the best fit for a student?", a: "Look for three things: mentors who cleared JEE recently themselves, a plan rebuilt weekly from your real mock scores rather than a fixed syllabus schedule, and daily accountability - not just a weekly call." },
];

export const NEET_FAQS: FAQ[] = [
  { q: "Does having a mentor actually help in NEET preparation?", a: "Yes - NEET rewards consistent Biology revision and disciplined error-tracking across all three subjects. A mentor makes sure the daily revision loop actually happens, and rebuilds your plan from your real mock scores." },
  { q: "What is the difference between a NEET mentor and a coaching institute?", a: "A coaching institute teaches syllabus content in a batch. A PrepBuddy mentor is one AIIMS/medical student working with you 1:1 - they don't teach NCERT chapters, they build your plan, watch your mocks, and catch the recurring gaps." },
  { q: "How many hours should a NEET dropper study every day?", a: "Most serious NEET droppers work 8–10 focused hours a day with a Biology-heavy weekly split and one full-length mock a week. Structure matters far more than raw hour count." },
  { q: "How do I stop making the same mistakes in NEET mock tests?", a: "Keep a tagged error log for every mock - concept gap vs. silly mistake vs. NCERT-line miss vs. time pressure - and revisit recurring categories weekly. Your mentor runs this analysis with you." },
  { q: "What exactly happens in PrepBuddy's ₹99, 3-day NEET trial?", a: "You get one call with an AIIMS/medical mentor, a personalized 3-day plan built from your last mock score, and daily check-ins for those 3 days. Priced low on purpose - to filter for students who are serious." },
  { q: "Can I cancel my PrepBuddy plan anytime?", a: "Yes. You can stop your plan whenever you want. If the mentor fit isn't right, we'll match you with another one first - cancellation is only if you decide mentorship isn't for you." },
  { q: "Is coaching necessary for a NEET dropper?", a: "No - many droppers crack NEET with only self-study, NCERT-first Biology revision, and a strong mentor. Coaching is useful if you need someone to structure content delivery; mentorship is what makes sure you execute." },
  { q: "What makes a NEET mentorship program the best fit for a student?", a: "Mentors who cleared NEET recently themselves, a Biology-weighted plan rebuilt weekly from your real mock scores, and daily accountability - not just a weekly call." },
];

export const JEE_TESTIMONIALS: Testimonial[] = [
  { quote: "The daily check-ins are what changed things. I've never studied this consistently in my life.", name: "Priya M.", meta: "Class 12" },
  { quote: "My mentor rebuilt my week from a single bad mock. That plan alone was worth the whole plan fee.", name: "Aditya S.", meta: "Dropper" },
  { quote: "Someone finally explained what to do after checking my mock score - instead of just telling me to give more.", name: "Sneha K.", meta: "Class 11" },
];

export const NEET_TESTIMONIALS: Testimonial[] = [
  { quote: "Biology revision was chaos before. My mentor made a rotation plan that I've actually stuck to for months.", name: "Ritika V.", meta: "Class 12" },
  { quote: "The weekly mock analysis is the reason I stopped losing marks to the same silly Chemistry mistakes.", name: "Aman P.", meta: "Dropper" },
  { quote: "Having a real medical student to talk to about the exam pressure made a bigger difference than I expected.", name: "Nikhil R.", meta: "Class 11" },
];

export const JEE_HUB: Post[] = [
  { tag: "Dropper strategy",   title: "How many hours should a Class 12 JEE dropper actually study daily?", body: "The honest answer isn't a number - it's a structure. Here's how to build yours." },
  { tag: "Mentorship",         title: "What makes a JEE mentorship program actually work?",                 body: "Three components separate real mentorship from glorified progress-tracking." },
  { tag: "Coaching vs Mentor", title: "Is coaching necessary for a JEE dropper, or is mentorship enough?", body: "When each one helps, and how to combine them without burning out." },
  { tag: "Mock analysis",      title: "How to actually analyze a JEE mock test instead of just checking your score", body: "The 4-tag error log system every top scorer uses." },
  { tag: "Study plan",         title: "The 90-day Physics revision plan our mentors use",                  body: "Chapter weightage, PYQ mapping, and the weekly review structure." },
  { tag: "JEE Main 2027",      title: "JEE Main 2027 Session 1 - dates, syllabus changes, key updates",    body: "Everything you need to plan the next months of prep." },
];

export const NEET_HUB: Post[] = [
  { tag: "Biology revision", title: "The NCERT-first NEET Biology revision loop that actually sticks",   body: "How to cycle through NCERT lines, PYQs and MCQs without losing retention." },
  { tag: "Mock analysis",    title: "How to analyze a NEET mock test instead of just checking your score", body: "The 4-tag error log system every AIR-under-1000 scorer uses." },
  { tag: "Dropper strategy", title: "How many hours should a NEET dropper actually study daily?",         body: "Structure over raw hours - a weekly template you can adapt." },
  { tag: "Study plan",       title: "A 60-day Biology weightage plan our AIIMS mentors use",              body: "Chapter-wise NCERT + PYQ mapping with a weekly review structure." },
  { tag: "NEET UG 2027",     title: "NEET UG 2027 - exam dates, syllabus updates, key changes",          body: "Everything you need to plan the next months of prep." },
  { tag: "Mentorship",       title: "What makes a NEET mentorship program actually work?",                body: "Three components separate real mentorship from glorified progress-tracking." },
];

export type ExamContent = {
  key: ExamKey;
  label: string;
  urlPath: "/jee" | "/neet";
  mentorNoun: string; // "IITians", "AIIMS/medical-college students"
  mentorNounShort: string; // "IITian", "AIIMS/medical student"
  examName: string; // "JEE Main + Advanced", "NEET UG"
  subjects: string; // "Physics, Chemistry, Maths"
  pyqLine: string;
  heroEyebrow: string;
  heroTitleHighlight: string;
  heroSubhead: string;
  sessionCopy: string;
  mentors: Mentor[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  hub: Post[];
  keywords: string;
  metaTitle: string;
  metaDesc: string;
};

export const EXAM: Record<ExamKey, ExamContent> = {
  jee: {
    key: "jee",
    label: "JEE",
    urlPath: "/jee",
    mentorNoun: "IITians",
    mentorNounShort: "IITian",
    examName: "JEE Main + Advanced",
    subjects: "Physics, Chemistry, Maths",
    pyqLine: "Chapter-wise Problems + PYQs (Mains + Adv.)",
    heroEyebrow: "IIT JEE Mentorship, not another coaching batch",
    heroTitleHighlight: "every single day.",
    heroSubhead: "Not videos. Not a batch of 400. One dedicated IITian mentor, a study plan built around your actual JEE mock scores, and a daily accountability check-in - for Class 11, Class 12, and Droppers.",
    sessionCopy: "Book a 1-hour session with a selected IIT student.",
    mentors: JEE_MENTORS,
    faqs: JEE_FAQS,
    testimonials: JEE_TESTIMONIALS,
    hub: JEE_HUB,
    keywords: "best JEE mentorship, JEE mentorship, JEE guidance, JEE strategies, JEE preparation strategy, JEE Main strategy, JEE Advanced strategy, JEE dropper strategy, JEE mentor online, JEE mock test analysis, best JEE mentor India, is coaching necessary for JEE dropper",
    metaTitle: "PrepBuddy - Best JEE Mentorship, Guidance & Strategy for Class 11, 12 & Droppers",
    metaDesc: "1:1 JEE mentorship from IITians. A personalized study plan built from your real mock scores, daily accountability and weekly review calls. Start your 3-day trial for ₹99.",
  },
  neet: {
    key: "neet",
    label: "NEET",
    urlPath: "/neet",
    mentorNoun: "AIIMS/medical-college students",
    mentorNounShort: "AIIMS/medical student",
    examName: "NEET UG",
    subjects: "Physics, Chemistry, Biology",
    pyqLine: "Chapter-wise Problems + PYQs (NEET UG)",
    heroEyebrow: "NEET UG Mentorship, not another coaching batch",
    heroTitleHighlight: "every single day.",
    heroSubhead: "Not videos. Not a batch of 400. One dedicated AIIMS/medical-college mentor, a Biology-weighted plan built around your real NEET mock scores, and a daily accountability check-in - for Class 11, Class 12, and Droppers.",
    sessionCopy: "Book a 1-hour session with a selected AIIMS/medical student.",
    mentors: NEET_MENTORS,
    faqs: NEET_FAQS,
    testimonials: NEET_TESTIMONIALS,
    hub: NEET_HUB,
    keywords: "best NEET mentorship, NEET mentorship, NEET guidance, NEET strategies, NEET preparation strategy, NEET Biology strategy, NEET mentor online, NEET study plan, NEET dropper strategy, NEET mock test analysis, best NEET mentor India, is coaching necessary for NEET dropper",
    metaTitle: "PrepBuddy - Best NEET Mentorship, Guidance & Strategy for Class 11, 12 & Droppers",
    metaDesc: "1:1 NEET UG mentorship from AIIMS and top medical-college students. A Biology-weighted plan built from your real mocks, daily accountability, weekly review calls. Start your 3-day trial for ₹99.",
  },
};
