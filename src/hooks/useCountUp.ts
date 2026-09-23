import { useEffect, useRef, useState } from "react";

function format(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
}

/**
 * Count-up as progressive enhancement.
 *
 * The real value is what renders — on the server, during hydration, and any
 * time the animation doesn't run. The number is never left sitting at zero
 * waiting for something to happen: it is only zeroed at the instant the
 * animation starts, in the same callback, so every path that doesn't animate
 * shows the true figure.
 *
 * It animates in exactly one case: the element was off screen when the page
 * loaded, and the reader then scrolled it into view. If it was already visible,
 * if the reader never scrolls, if motion is reduced, or if there's no JS at
 * all, the real value simply stays put.
 *
 * Returns [ref, displayValue].
 */
export function useCountUp(target: number, durationMs = 1000, decimals = 0) {
  const ref = useRef<HTMLElement | null>(null);
  // null = "show the real value"; a number = mid-animation.
  const [animated, setAnimated] = useState<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen at load? Leave the real number alone — counting it
    // down to zero first would be a worse experience than not animating.
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || started.current) continue;
          started.current = true;
          io.disconnect();

          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - t, 3);
            if (t < 1) {
              setAnimated(target * eased);
              requestAnimationFrame(tick);
            } else {
              setAnimated(null); // hand the number back to the real value
            }
          };
          // Zeroed and animated in the same frame the element comes into view,
          // never before it.
          setAnimated(0);
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.35 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, durationMs]);

  return { ref, display: format(animated ?? target, decimals) };
}
