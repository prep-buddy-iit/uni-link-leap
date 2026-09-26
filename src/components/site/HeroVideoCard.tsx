import { useState } from "react";
import { Play } from "lucide-react";
import { VideoLightbox } from "@/components/VideoLightbox";
import { HERO_VIDEO } from "@/lib/site";

// Same id the VideoObject JSON-LD describes, so the schema can never drift
// from the video the page actually embeds.
const heroImage = `https://i.ytimg.com/vi/${HERO_VIDEO.videoId}/maxresdefault.jpg`;

export function HeroVideoCard({
  videoId = HERO_VIDEO.videoId,
  caption = "See how a real mentorship week works →",
}: {
  videoId?: string;
  caption?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-primary opacity-25 blur-3xl rounded-[2.5rem]" />
      <div className="relative panel-raised rounded-[1.75rem] p-3 sm:p-4">
        <button
          onClick={() => setOpen(true)}
          className="group relative block w-full overflow-hidden rounded-2xl aspect-video"
          aria-label="Watch: See how a real mentorship week works"
        >
          <img
            src={heroImage}
            alt="A PrepBuddy mentor on a video call with a student"
            width={1280}
            height={720}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-ink/25" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-lift transition group-hover:scale-105">
              <Play className="h-6 w-6 translate-x-0.5 text-primary" fill="currentColor" />
            </span>
          </span>
          <span className="absolute right-3 top-3 panel rounded-full px-3 py-1.5 text-xs font-semibold text-ink flex items-center gap-1">
            <Play className="h-3 w-3 text-primary" /> 2 min watch
          </span>
        </button>
        <p className="mt-3 px-2 pb-1 text-sm text-ink-muted">{caption}</p>
      </div>
      <VideoLightbox open={open} onClose={() => setOpen(false)} videoId={videoId} />
    </div>
  );
}
