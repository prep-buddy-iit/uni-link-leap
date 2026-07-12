import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// TODO: replace with the project URL once a custom domain is set.
const BASE_URL = "";

type Entry = { path: string; changefreq?: string; priority?: string };

const ENTRIES: Entry[] = [
  { path: "/",                 changefreq: "weekly",  priority: "1.0" },
  { path: "/jee",              changefreq: "weekly",  priority: "0.9" },
  { path: "/neet",             changefreq: "weekly",  priority: "0.9" },
  { path: "/find-a-mentor",    changefreq: "weekly",  priority: "0.7" },
  { path: "/become-a-mentor",  changefreq: "monthly", priority: "0.6" },
  { path: "/contact",          changefreq: "monthly", priority: "0.5" },
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
