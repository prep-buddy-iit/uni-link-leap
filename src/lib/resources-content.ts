import type { ExamKey } from "@/components/ApplicationModal";

export type Author = {
  slug: string;
  name: string;
  rank: string;
  institute: string;
  bio: string;
  initials: string;
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
  },
  "ishita-p": {
    slug: "ishita-p",
    name: "Ishita P.",
    rank: "AIR 512",
    institute: "IIT Delhi",
    bio: "Computer Science at IIT Delhi. Focus on Maths - calculus, coordinate geometry, and building a PYQ-driven revision loop.",
    initials: "IP",
  },
  "rahul-k": {
    slug: "rahul-k",
    name: "Rahul K.",
    rank: "AIR 189",
    institute: "IIT Madras",
    bio: "Chemical Engineering at IIT Madras. Two years of 1:1 mentorship on Physical and Organic Chemistry for droppers.",
    initials: "RK",
  },
  "ananya-m": {
    slug: "ananya-m",
    name: "Ananya M.",
    rank: "NEET AIR 145",
    institute: "AIIMS Delhi",
    bio: "2nd-year MBBS at AIIMS Delhi. Coaches PrepBuddy NEET students on Human Physiology and NCERT-first revision.",
    initials: "AM",
  },
  "sara-j": {
    slug: "sara-j",
    name: "Sara J.",
    rank: "NEET AIR 92",
    institute: "MAMC, Delhi",
    bio: "MBBS at Maulana Azad Medical College. Focus on Biology - genetics, evolution, and mock-error tagging.",
    initials: "SJ",
  },
  "rohan-t": {
    slug: "rohan-t",
    name: "Rohan T.",
    rank: "NEET AIR 289",
    institute: "AIIMS Bhopal",
    bio: "MBBS at AIIMS Bhopal. Guest contributor - writes on Organic Chemistry mechanisms and dropper-year mental resilience.",
    initials: "RT",
  },
};

export const ARTICLES: Article[] = [];

export const VIDEOS: Video[] = [];

export const CAMPUS_PHOTOS: CampusPhoto[] = [];


export function articleBySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
