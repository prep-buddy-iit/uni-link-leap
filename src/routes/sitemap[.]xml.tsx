import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { SITE_URL } from "@/lib/site";

// Sitemap <loc> values have to be absolute URLs.
const BASE_URL = SITE_URL;

type Entry = { path: string; changefreq?: string; priority?: string; lastmod?: string };

import { ARTICLES, VIDEOS, CAMPUS_PHOTOS } from "@/lib/resources-content";

// /resources is a shell until one of these collections has something in it.
// Submitting an empty page invites a soft-404, so it stays out of the sitemap
// until there is content, then reappears automatically.
const HAS_RESOURCES = ARTICLES.length + VIDEOS.length + CAMPUS_PHOTOS.length > 0;

const ENTRIES: Entry[] = [
  { path: "/",                 changefreq: "weekly",  priority: "1.0" },
  { path: "/jee",              changefreq: "weekly",  priority: "0.9" },
  { path: "/neet",             changefreq: "weekly",  priority: "0.9" },
  ...(HAS_RESOURCES
    ? [{ path: "/resources", changefreq: "weekly", priority: "0.8" }]
    : []),
  { path: "/find-a-mentor",    changefreq: "weekly",  priority: "0.7" },
  { path: "/become-a-mentor",  changefreq: "monthly", priority: "0.6" },
  { path: "/contact",          changefreq: "monthly", priority: "0.5" },
  { path: "/guidance-preview", changefreq: "monthly", priority: "0.5" },
  { path: "/trust-and-safety", changefreq: "yearly",  priority: "0.3" },
  { path: "/privacy-policy",   changefreq: "yearly",  priority: "0.3" },
  { path: "/terms",            changefreq: "yearly",  priority: "0.3" },
  ...ARTICLES.map((a) => ({
    path: `/resources/${a.slug}`,
    changefreq: "monthly",
    priority: "0.6",
    // Real edit date from the article itself, so crawlers recrawl when it moves.
    lastmod: a.dateModified,
  })),
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = ENTRIES.map((e) =>
          [
            "  <url>",
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            "  </url>",
          ].filter(Boolean).join("\n"),
        );
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
