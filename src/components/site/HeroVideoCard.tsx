import { useState } from "react";
import { Play } from "lucide-react";
import { VideoLightbox } from "@/components/VideoLightbox";
import heroImage from "@/assets/hero-mentor.jpg";

export function HeroVideoCard({ videoId = "dQw4w9WgXcQ", caption = "See how a real mentorship week works →" }: {
  videoId?: string; caption?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className="absolute -inset-4 gradient-primary opacity-25 blur-3xl rounded-[2.5rem]" />
      <div className="relative glass-strong rounded-[1.75rem] p-3 sm:p-4">
        <button
          onClick={() => setOpen(true)}
          className="group relative block w-full overflow-hidden rounded-2xl aspect-video"
          aria-label="Watch: See how a real mentorship week works"
        >
          <img src={heroImage} alt="A PrepBuddy mentor on a video call with a student"
            width={1280} height={800} loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-lift transition group-hover:scale-110">
              <Play className="h-6 w-6 translate-x-0.5 text-primary" fill="currentColor" />
            </span>
          </span>
          <span className="float-slow absolute right-3 top-3 glass-card rounded-full px-3 py-1.5 text-xs font-semibold text-ink flex items-center gap-1">
            <Play className="h-3 w-3 text-primary" /> 2 min watch
          </span>
        </button>
        <p className="mt-3 px-2 pb-1 text-sm text-ink-muted">{caption}</p>
      </div>
      <VideoLightbox open={open} onClose={() => setOpen(false)} videoId={videoId} />
    </div>
  );
}
