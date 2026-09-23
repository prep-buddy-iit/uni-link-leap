import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { SITE_URL } from "@/lib/site";

// Sitemap <loc> values have to be absolute URLs.
const BASE_URL = SITE_URL;

type Entry = { path: string; changefreq?: string; priority?: string };

import { ARTICLES } from "@/lib/resources-content";

const ENTRIES: Entry[] = [
  { path: "/",                 changefreq: "weekly",  priority: "1.0" },
  { path: "/jee",              changefreq: "weekly",  priority: "0.9" },
  { path: "/neet",             changefreq: "weekly",  priority: "0.9" },
  { path: "/resources",        changefreq: "weekly",  priority: "0.8" },
  { path: "/find-a-mentor",    changefreq: "weekly",  priority: "0.7" },
  { path: "/become-a-mentor",  changefreq: "monthly", priority: "0.6" },
  { path: "/contact",          changefreq: "monthly", priority: "0.5" },
  { path: "/guidance-preview", changefreq: "monthly", priority: "0.5" },
  { path: "/trust-and-safety", changefreq: "yearly",  priority: "0.3" },
  { path: "/privacy-policy",   changefreq: "yearly",  priority: "0.3" },
  { path: "/terms",            changefreq: "yearly",  priority: "0.3" },
  ...ARTICLES.map((a) => ({ path: `/resources/${a.slug}`, changefreq: "monthly", priority: "0.6" })),
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = ENTRIES.map((e) =>
          [
            "  <url>",
            `    <loc>${BASE_URL}${e.path}</loc>`,
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
