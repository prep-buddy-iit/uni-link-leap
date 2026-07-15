import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Clock, Upload, X, Users } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageBackdrop } from "@/components/site/PageBackdrop";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { VideoLightbox } from "@/components/VideoLightbox";
import { PhotoLightbox } from "@/components/site/PhotoLightbox";
import { ARTICLES, AUTHORS, VIDEOS, CAMPUS_PHOTOS } from "@/lib/resources-content";
import type { ExamKey } from "@/components/ApplicationModal";
import { ResourceSubmissionForm } from "@/components/site/ResourceSubmissionForm";
import {
  fetchApprovedSubmissions,
  extractYouTubeId,
  type ResourceSubmission,
} from "@/lib/resource-submissions";
import { getApprovedSubmissionPhotoUrl } from "@/lib/resource-images.functions";


const TITLE = "Resources - JEE & NEET Strategy, Motivation & Campus Life | PrepBuddy";
const DESC = "Articles, videos and a look inside IIT, NIT and AIIMS campuses - written by IITians and AIIMS students. Real strategy and motivation for Class 11, 12 and Droppers.";

type ContentTab = "all" | "articles" | "videos" | "gallery";
type ExamFilter = "all" | ExamKey;

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/resources" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Resources", item: "/resources" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: ARTICLES.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `/resources/${a.slug}`,
            name: a.title,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          VIDEOS.map((v) => ({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: v.title,
            description: v.description,
            thumbnailUrl: v.thumbnail,
            uploadDate: v.uploadDate,
            embedUrl: `https://www.youtube.com/embed/${v.videoId}`,
          })),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          CAMPUS_PHOTOS.map((p) => ({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            contentUrl: p.src,
            caption: p.caption,
            name: p.institute,
          })),
        ),
      },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const [tab, setTab] = useState<ContentTab>("all");
  const [exam, setExam] = useState<ExamFilter>("all");
  const [videoOpen, setVideoOpen] = useState<string | null>(null);
  const [photoIdx, setPhotoIdx] = useState<number | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [openArticle, setOpenArticle] = useState<ResourceSubmission | null>(null);
  const [subs, setSubs] = useState<ResourceSubmission[]>([]);
  const [photoUrlMap, setPhotoUrlMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetchApprovedSubmissions().then(async (rows) => {
      if (cancelled) return;
      setSubs(rows);
      const photos = rows.filter((r) => r.kind === "photo" && r.image_url);
      const entries = await Promise.all(
        photos.map(async (r) => {
          try {
            const res = await getApprovedSubmissionPhotoUrl({ data: { path: r.image_url! } });
            return [r.id, res.url] as const;
          } catch {
            return [r.id, null] as const;
          }
        }),
      );

      if (cancelled) return;
      const map: Record<string, string> = {};
      for (const [id, url] of entries) if (url) map[id] = url;
      setPhotoUrlMap(map);
    });
    return () => { cancelled = true; };
  }, []);

  const examFilter = <T extends { exam: ExamKey | "both" }>(items: T[]) =>
    exam === "all" ? items : items.filter((i) => i.exam === exam || i.exam === "both");

  const articles = useMemo(() => examFilter(ARTICLES), [exam]);
  const videos = useMemo(() => examFilter(VIDEOS), [exam]);
  const photos = useMemo(() => examFilter(CAMPUS_PHOTOS), [exam]);

  const communityArticles = useMemo(
    () => subs.filter((s) => s.kind === "article" && (exam === "all" || s.exam === exam || s.exam === "both")),
    [subs, exam],
  );
  const communityVideos = useMemo(
    () => subs
      .filter((s) => s.kind === "video" && (exam === "all" || s.exam === exam || s.exam === "both"))
      .map((s) => ({ ...s, videoId: s.youtube_url ? extractYouTubeId(s.youtube_url) : null }))
      .filter((s) => !!s.videoId),
    [subs, exam],
  );
  const communityPhotos = useMemo(
    () => subs
      .filter((s) => s.kind === "photo" && s.image_url && (exam === "all" || s.exam === exam || s.exam === "both"))
      .map((s) => ({
        id: s.id,
        src: photoUrlMap[s.id] ?? "",
        caption: s.description || s.title,
        institute: s.submitter_credential || "Community submission",
        exam: s.exam as ExamKey | "both",
      }))
      .filter((p) => !!p.src),
    [subs, photoUrlMap, exam],
  );

  const allGalleryPhotos = useMemo(
    () => [...photos, ...communityPhotos.map((p) => ({ ...p, span: "regular" as const }))],
    [photos, communityPhotos],
  );

  const showArticles = tab === "all" || tab === "articles";
  const showVideos = tab === "all" || tab === "videos";
  const showGallery = tab === "all" || tab === "gallery";

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main>
        <Breadcrumbs items={[{ label: "Resources" }]} />

        <section className="relative">
          <PageBackdrop />
          <div className="mx-auto max-w-4xl px-5 pt-14 sm:pt-20 pb-8 text-center">
            <p className="eyebrow">Resources & Motivation</p>
            <h1 className="mt-4 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Strategy, motivation, and a look at{" "}
              <span className="text-gradient-primary">where you're headed.</span>
            </h1>
            <p className="mt-5 text-lg text-ink-muted max-w-2xl mx-auto">
              Written by our mentors and IITians from campuses across the country - plus a look inside the colleges you're working toward.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button onClick={() => setSubmitOpen(true)}
                className="pill-btn pill-btn-primary pill-btn-primary-hover">
                <Upload className="h-4 w-4" /> Submit your own
              </button>
              <span className="text-xs text-ink-muted self-center">Articles, videos or campus photos - reviewed before going live.</span>
            </div>
          </div>
        </section>

        {/* Sticky filter bar */}
        <div className="sticky top-[57px] z-30 border-y border-border/60 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {([
                ["all", "All"],
                ["articles", "Articles"],
                ["videos", "Videos"],
                ["gallery", "Campus Gallery"],
              ] as const).map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)}
                  className={
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition " +
                    (tab === k ? "gradient-primary text-white shadow-glass" : "text-ink-muted hover:text-ink")
                  }>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="mono text-[10px] uppercase tracking-wider text-ink-muted mr-1">Exam</span>
              {(["all", "jee", "neet"] as const).map((k) => (
                <button key={k} onClick={() => setExam(k)}
                  className={
                    "rounded-full px-3 py-1 text-xs font-semibold transition " +
                    (exam === k ? "bg-ink text-white" : "bg-white border border-input text-ink-muted hover:text-ink")
                  }>
                  {k === "all" ? "All" : k.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles */}
        {showArticles && (
          <section className="mx-auto max-w-7xl px-5 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="eyebrow">Articles</p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold">Real questions, straight answers.</h2>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((a) => {
                const author = AUTHORS[a.authorSlug];
                return (
                  <Link key={a.slug} to="/resources/$slug" params={{ slug: a.slug }}
                    className="glass-strong card-lift rounded-3xl p-6 flex flex-col group">
                    <div className="flex items-center gap-2">
                      <span className="mono text-[10px] uppercase tracking-wider text-primary">{a.category}</span>
                      <span className="mono text-[10px] uppercase tracking-wider text-ink-muted">·</span>
                      <span className="mono text-[10px] uppercase tracking-wider text-ink-muted inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {a.readMinutes} min
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold text-ink group-hover:text-primary transition">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-muted flex-1">{a.description}</p>
                    <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border/60">
                      <div className="h-9 w-9 rounded-full grid place-items-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundImage: `linear-gradient(135deg, ${author.g})` }}>
                        {author.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-ink truncate">By {author.name}</p>
                        <p className="mono text-[10px] text-ink-muted truncate">{author.rank} · {author.institute}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {communityArticles.length > 0 && (
              <div className="mt-14">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="h-4 w-4 text-primary" />
                  <p className="mono text-[10px] uppercase tracking-wider text-primary">From the community</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {communityArticles.map((a) => (
                    <button key={a.id} onClick={() => setOpenArticle(a)}
                      className="glass-strong card-lift rounded-3xl p-6 flex flex-col text-left group">
                      <span className="mono text-[10px] uppercase tracking-wider text-ink-muted">Community · Article</span>
                      <h3 className="mt-3 font-display text-lg font-bold text-ink group-hover:text-primary transition">{a.title}</h3>
                      {a.description && <p className="mt-2 text-sm text-ink-muted flex-1">{a.description}</p>}
                      <p className="mt-4 pt-4 border-t border-border/60 text-xs text-ink-muted">
                        By <span className="font-semibold text-ink">{a.submitter_name}</span>
                        {a.submitter_credential && <span className="mono text-[10px]"> · {a.submitter_credential}</span>}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Videos */}
        {showVideos && (
          <section className="border-y border-border/60 bg-white/50">
            <div className="mx-auto max-w-7xl px-5 py-16">
              <div className="mb-8">
                <p className="eyebrow">Video library</p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold">Mentor talks, campus walks, strategy walkthroughs.</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((v) => (
                  <button key={v.id} onClick={() => setVideoOpen(v.videoId)}
                    className="glass-strong card-lift rounded-3xl p-3 text-left group">
                    <div className="relative overflow-hidden rounded-2xl aspect-video">
                      <img src={v.thumbnail} alt={v.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                      <span className="absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-transparent" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-lift transition group-hover:scale-110">
                          <Play className="h-5 w-5 translate-x-0.5 text-primary" fill="currentColor" />
                        </span>
                      </span>
                      <span className="absolute right-2 bottom-2 mono text-[10px] font-semibold rounded-full bg-ink/80 text-white px-2 py-1">
                        {v.duration}
                      </span>
                      <span className="absolute left-2 top-2 mono text-[10px] uppercase tracking-wider rounded-full bg-white/90 text-ink px-2 py-1">
                        {v.kind}
                      </span>
                    </div>
                    <div className="px-3 pt-4 pb-2">
                      <h3 className="font-display text-base font-bold text-ink">{v.title}</h3>
                      <p className="mt-1 text-xs text-ink-muted">{v.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {communityVideos.length > 0 && (
                <div className="mt-14">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="h-4 w-4 text-primary" />
                    <p className="mono text-[10px] uppercase tracking-wider text-primary">From the community</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {communityVideos.map((v) => (
                      <button key={v.id} onClick={() => setVideoOpen(v.videoId!)}
                        className="glass-strong card-lift rounded-3xl p-3 text-left group">
                        <div className="relative overflow-hidden rounded-2xl aspect-video">
                          <img src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`} alt={v.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                          <span className="absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-transparent" />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-lift transition group-hover:scale-110">
                              <Play className="h-5 w-5 translate-x-0.5 text-primary" fill="currentColor" />
                            </span>
                          </span>
                          <span className="absolute left-2 top-2 mono text-[10px] uppercase tracking-wider rounded-full bg-white/90 text-ink px-2 py-1">
                            Community
                          </span>
                        </div>
                        <div className="px-3 pt-4 pb-2">
                          <h3 className="font-display text-base font-bold text-ink">{v.title}</h3>
                          {v.description && <p className="mt-1 text-xs text-ink-muted">{v.description}</p>}
                          <p className="mt-2 mono text-[10px] text-ink-muted">By {v.submitter_name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Campus Gallery */}
        {showGallery && (
          <section className="mx-auto max-w-7xl px-5 py-16">
            <div className="mb-8">
              <p className="eyebrow">Campus gallery</p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold">Where you're headed.</h2>
              <p className="mt-2 text-sm text-ink-muted max-w-2xl">
                A look inside IIT, NIT and AIIMS campuses - libraries, hostels, labs, convocation halls. Click any photo to open.
              </p>
            </div>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
              {allGalleryPhotos.map((p, i) => (
                <button key={p.id} onClick={() => setPhotoIdx(i)}
                  className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl group relative">
                  <img src={p.src} alt={`${p.institute} - ${p.caption}`} loading="lazy"
                    className={
                      "w-full object-cover transition duration-500 group-hover:scale-[1.05] " +
                      (p.span === "tall" ? "aspect-[3/4]" : p.span === "wide" ? "aspect-[4/3]" : "aspect-square")
                    } />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-3 opacity-0 group-hover:opacity-100 transition">
                    <span className="mono text-[10px] uppercase tracking-wider text-white/70 block">{p.institute}</span>
                    <span className="text-xs text-white font-medium">{p.caption}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Closing CTA */}
        <section className="mx-auto max-w-7xl px-5 pb-24">
          <div className="relative overflow-hidden rounded-3xl gradient-dark text-white p-10 sm:p-14 text-center">
            <div className="blob right-[-10%] top-[-40%] h-[420px] w-[420px]" style={{ background: "radial-gradient(circle, #8b5cf6, transparent 60%)" }} />
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Want a mentor who's been where you're headed?
            </h2>
            <p className="mt-3 text-white/85 max-w-xl mx-auto">
              Start with the ₹99, 3-day trial - we'll match you to a topper who's cleared the same exam.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/jee" hash="plans" className="pill-btn bg-white text-primary hover:opacity-90">
                Start with JEE →
              </Link>
              <Link to="/neet" hash="plans" className="pill-btn bg-white text-primary hover:opacity-90">
                Start with NEET →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <VideoLightbox open={videoOpen !== null} onClose={() => setVideoOpen(null)} videoId={videoOpen ?? ""} />
      <PhotoLightbox photos={allGalleryPhotos} index={photoIdx} onClose={() => setPhotoIdx(null)} onIndex={setPhotoIdx} />
      {submitOpen && <ResourceSubmissionForm onClose={() => setSubmitOpen(false)} />}
      {openArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm" onClick={() => setOpenArticle(null)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl bg-white shadow-lift p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenArticle(null)} className="absolute right-4 top-4 rounded-full p-2 hover:bg-black/5" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <span className="mono text-[10px] uppercase tracking-wider text-primary">Community · Article</span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold break-words">{openArticle.title}</h2>
            <p className="mt-2 text-sm text-ink-muted break-words">
              By <span className="font-semibold text-ink">{openArticle.submitter_name}</span>
              {openArticle.submitter_credential && <> · {openArticle.submitter_credential}</>}
            </p>
            {openArticle.description && <p className="mt-4 text-base text-ink-muted italic break-words">{openArticle.description}</p>}
            <div className="mt-6 text-ink leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere]">
              {openArticle.body}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
