import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { ApplicationModalProvider } from "@/lib/application-modal";
import { FloatingWhatsAppButton } from "@/components/site/FloatingWhatsAppButton";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Try one of these:
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/" className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white gradient-primary">Home</Link>
          <Link to="/jee" className="inline-flex items-center justify-center rounded-full border border-input bg-white px-5 py-2.5 text-sm font-semibold text-ink">JEE Mentorship</Link>
          <Link to="/neet" className="inline-flex items-center justify-center rounded-full border border-input bg-white px-5 py-2.5 text-sm font-semibold text-ink">NEET Mentorship</Link>
          <Link to="/find-a-mentor" className="inline-flex items-center justify-center rounded-full border border-input bg-white px-5 py-2.5 text-sm font-semibold text-ink">Meet Mentors</Link>
          <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-input bg-white px-5 py-2.5 text-sm font-semibold text-ink">Contact</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white gradient-primary"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PrepBuddy - 1-on-1 Mentorship for JEE & NEET | Class 11, 12 & Droppers" },
      {
        name: "description",
        content:
          "PrepBuddy pairs Class 11, 12 and Droppers with a dedicated topper-mentor - IITians for JEE, AIIMS/medical students for NEET. Personalized plans, daily accountability, weekly review calls.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "PrepBuddy" },
      { property: "og:title", content: "PrepBuddy - 1-on-1 Mentorship for JEE & NEET | Class 11, 12 & Droppers" },
      {
        property: "og:description",
        content:
          "PrepBuddy pairs Class 11, 12 and Droppers with a dedicated topper-mentor - IITians for JEE, AIIMS/medical students for NEET. Personalized plans, daily accountability, weekly review calls.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PrepBuddy - 1-on-1 Mentorship for JEE & NEET | Class 11, 12 & Droppers" },
      { name: "twitter:description", content: "PrepBuddy pairs Class 11, 12 and Droppers with a dedicated topper-mentor - IITians for JEE, AIIMS/medical students for NEET. Personalized plans, daily accountability, weekly review calls." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/727af470-17da-43e0-ac5e-50105ceb5a9c/id-preview-3bdbcaef--d1b86c75-1143-4960-a5b1-06dee2b4648a.lovable.app-1784099037468.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/727af470-17da-43e0-ac5e-50105ceb5a9c/id-preview-3bdbcaef--d1b86c75-1143-4960-a5b1-06dee2b4648a.lovable.app-1784099037468.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "PrepBuddy",
          url: "/",
          logo: "/favicon.ico",
          description:
            "1-on-1 mentorship for JEE and NEET aspirants - IITians for JEE, AIIMS/medical students for NEET. Personalized plans, daily accountability, weekly review calls.",
          areaServed: "IN",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Hyderabad",
            addressRegion: "Telangana",
            addressCountry: "IN",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "PrepBuddy",
          url: "/",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationModalProvider>
        <Outlet />
      </ApplicationModalProvider>
      <Toaster richColors position="top-center" />
      <FloatingWhatsAppButton />
    </QueryClientProvider>
  );
}
