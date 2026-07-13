import { useEffect, useRef } from 'react';

// Approximates the old react-spring/parallax "speed" feel (an element lingering/drifting
// relative to normal scroll) using a plain scroll-linked transform. Scoped to small,
// purely decorative elements only (e.g. the scroll-cue arrows) — applying this to whole
// page sections previously caused them to visibly detach from their natural document
// position, which is why it's not used for layout-bearing content anymore.
export function useDrift<T extends HTMLElement>(speed: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (speed === 0) return;

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        // getBoundingClientRect() reflects our own previous transform, so measuring it
        // directly would feed that offset back into the next frame's calculation and
        // compound over scroll distance. Clear the transform first so this always reads
        // the element's true (untransformed) layout position.
        el.style.transform = '';
        const rect = el.getBoundingClientRect();
        const travelled = window.innerHeight - rect.top;
        // speed is the fraction of scroll the element lags/leads by -- 0.05 == 5% slower
        // than the page, same semantics as a react-spring ParallaxLayer's speed prop -- so
        // it's applied directly, with no extra damping folded in on top of it.
        el.style.transform = `translate3d(0, ${-(travelled * speed)}px, 0)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return ref;
}
