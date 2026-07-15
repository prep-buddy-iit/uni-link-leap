import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageBackdrop } from "@/components/site/PageBackdrop";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { articleBySlug, AUTHORS, ARTICLES } from "@/lib/resources-content";

export const Route = createFileRoute("/resources/$slug")({
  loader: ({ params }) => {
    const article = articleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found - PrepBuddy" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.article;
    const author = AUTHORS[a.authorSlug];
    const url = `/resources/${a.slug}`;
    return {
      meta: [
        { title: `${a.title} - PrepBuddy` },
        { name: "description", content: a.description },
        { name: "author", content: author.name },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "article:published_time", content: a.datePublished },
        { property: "article:modified_time", content: a.dateModified },
        { property: "article:author", content: author.name },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.description,
            datePublished: a.datePublished,
            dateModified: a.dateModified,
            author: {
              "@type": "Person",
              name: author.name,
              description: author.bio,
              alumniOf: { "@type": "CollegeOrUniversity", name: author.institute },
            },
            publisher: { "@type": "Organization", name: "PrepBuddy" },
            mainEntityOfPage: url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Resources", item: "/resources" },
              { "@type": "ListItem", position: 3, name: a.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: ArticlePage,
});

function NotFound() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Article not found</h1>
        <p className="mt-3 text-ink-muted">The article you're looking for doesn't exist or has been moved.</p>
        <Link to="/resources" className="mt-6 inline-flex items-center gap-2 text-primary font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to Resources
        </Link>
      </div>
      <Footer />
    </div>
  );
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const author = AUTHORS[article.authorSlug];
  const related = ARTICLES.filter((a) => a.slug !== article.slug && (a.exam === article.exam || article.exam === "both")).slice(0, 3);
  const examLink = article.exam === "neet" ? "/neet" : "/jee";
  const examLabel = article.exam === "neet" ? "NEET" : "JEE";

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main>
        <Breadcrumbs items={[{ label: "Resources", to: "/resources" }, { label: article.title }]} />

        <section className="relative">
          <PageBackdrop />
          <div className="mx-auto max-w-3xl px-5 pt-10 sm:pt-14 pb-6">
            <div className="flex items-center gap-2">
              <span className="mono text-[10px] uppercase tracking-wider text-primary">{article.category}</span>
              <span className="text-ink-muted">·</span>
              <span className="mono text-[10px] uppercase tracking-wider text-ink-muted inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {article.readMinutes} min read
              </span>
            </div>
            <h1 className="mt-4 font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1]">
              {article.title}
            </h1>
            <p className="mt-5 text-lg text-ink-muted">{article.description}</p>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-11 w-11 rounded-full grid place-items-center text-white text-sm font-bold shrink-0"
                style={{ backgroundImage: `linear-gradient(135deg, ${author.g})` }}>
                {author.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">By {author.name}</p>
                <p className="mono text-[11px] text-ink-muted">{author.rank} · {author.institute}</p>
              </div>
            </div>
          </div>
        </section>

        <article className="mx-auto max-w-3xl px-5 pb-16">
          <div className="prose-custom">
            {article.body.map((s: { heading: string; paragraphs: string[] }) => (
              <section key={s.heading} className="mt-10">
                <h2 className="font-display text-2xl font-bold text-ink">{s.heading}</h2>
                {s.paragraphs.map((p: string, i: number) => (
                  <p key={i} className="mt-4 text-ink leading-relaxed">{p}</p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-3xl gradient-primary text-white p-8 text-center">
            <h3 className="font-display text-xl font-bold">
              Want a mentor to walk this plan through with you?
            </h3>
            <p className="mt-2 text-white/90 text-sm">
              Start your ₹99, 3-day {examLabel} trial and get a plan built from your last mock score.
            </p>
            <Link to={examLink} hash="plans" className="mt-5 inline-flex items-center pill-btn bg-white text-primary hover:opacity-90">
              Start your {examLabel} trial →
            </Link>
          </div>

          {/* Author bio */}
          <div className="mt-10 glass-strong rounded-3xl p-6 flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl grid place-items-center text-white text-lg font-bold shrink-0"
              style={{ backgroundImage: `linear-gradient(135deg, ${author.g})` }}>
              {author.initials}
            </div>
            <div>
              <p className="mono text-[10px] uppercase tracking-wider text-ink-muted">About the author</p>
              <p className="mt-1 font-display font-bold text-lg text-ink">{author.name}</p>
              <p className="mono text-[11px] text-ink-muted">{author.rank} · {author.institute}</p>
              <p className="mt-2 text-sm text-ink-muted">{author.bio}</p>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-14">
              <h3 className="font-display text-xl font-bold mb-5">More from Resources</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.slug} to="/resources/$slug" params={{ slug: r.slug }}
                    className="glass-strong card-lift rounded-2xl p-5 block">
                    <span className="mono text-[10px] uppercase tracking-wider text-primary">{r.category}</span>
                    <h4 className="mt-2 font-display text-sm font-bold text-ink">{r.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
