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
