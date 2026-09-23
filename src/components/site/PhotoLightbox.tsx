import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { CampusPhoto } from "@/lib/resources-content";

export function PhotoLightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: CampusPhoto[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;

  const prev = useCallback(() => {
    if (index === null) return;
    onIndex((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onIndex]);

  const next = useCallback(() => {
    if (index === null) return;
    onIndex((index + 1) % photos.length);
  }, [index, photos.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, prev, next]);

  if (!open || index === null) return null;
  const photo = photos[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 backdrop-blur-md p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close">
        <X className="h-5 w-5" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-5 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Previous">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-5 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Next">
        <ChevronRight className="h-6 w-6" />
      </button>
      <figure className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <img src={photo.src} alt={photo.caption} className="max-h-[80vh] w-full object-contain rounded-2xl shadow-lift" />
        <figcaption className="mt-4 text-center text-sm text-white">
          <span className="mono text-xs uppercase tracking-wider text-white/60">{photo.institute}</span>
          <span className="mx-2 text-white/40">·</span>
          {photo.caption}
        </figcaption>
      </figure>
    </div>
  );
}
