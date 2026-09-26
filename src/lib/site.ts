/**
 * Canonical site constants.
 *
 * Everything that needs an absolute URL (Open Graph tags, sitemap entries,
 * JSON-LD) reads from here, so the production origin is declared in exactly one
 * place.
 */
export const SITE_URL = "https://yourprepbuddy.com";

export const SITE_NAME = "PrepBuddy";

/** 1200x630 Open Graph card, served from our own domain (public/og-image.png). */
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const OG_IMAGE_ALT =
  "PrepBuddy - 1-on-1 JEE and NEET mentorship from IITians and AIIMS students";

/** Turn a site-relative path into an absolute URL for crawlers and social cards. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * External social profiles, used for schema.org `sameAs`.
 *
 * `sameAs` means "the same entity, elsewhere on the web" — it is for profiles
 * we control on other domains, never for our own internal pages. Leave this
 * empty until the profiles genuinely exist; the Organization schema omits
 * `sameAs` entirely when there is nothing to put in it.
 */
export const SOCIAL_PROFILES: string[] = [
  "https://www.instagram.com/prepbuddy_mentorship/",
  "https://www.youtube.com/@PrepBuddy_iitjee",
  "https://www.linkedin.com/company/prepbuddy-mentorship/",
];

/**
 * The explainer video embedded by HeroVideoCard.
 *
 * VideoObject JSON-LD has to describe a video that is actually on the page, so
 * both the component and the schema read the id from here.
 *
 * `uploadDate` is deliberately optional: Google requires it for video rich
 * results, but guessing it would be fabricating data, so the schema omits the
 * property until the real publish date is filled in below.
 */
export const HERO_VIDEO = {
  videoId: "GYszmNT-ks4",
  /** Exact title as published on the channel — schema must match the real video. */
  name: "How PrepBuddy Mentorship Helped JEE Aspirants Crack IIT | Real Stories Every Parent Should Hear",
  description:
    "Real stories from JEE aspirants and their parents on how 1-on-1 PrepBuddy mentorship changed their preparation.",
  /** ISO 8601 date, e.g. "2026-02-14". Fill in to unlock video rich results. */
  uploadDate: undefined as string | undefined,
} as const;

/** VideoObject JSON-LD for the hero explainer, with real URLs throughout. */
export function heroVideoSchema(pageDescription?: string) {
  const { videoId, name, description, uploadDate } = HERO_VIDEO;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description: pageDescription ?? description,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(uploadDate ? { uploadDate } : {}),
  };
}

/**
 * BreadcrumbList JSON-LD.
 *
 * schema.org `item` values must be absolute URLs — a relative "/jee" is
 * silently dropped by validators — so every crumb goes through absoluteUrl().
 * "Home" is prepended automatically; pass the trail below it.
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
