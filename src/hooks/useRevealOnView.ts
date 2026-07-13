import { useEffect, useRef, useState } from 'react';

// Same fade/slide-down entrance as the intro arrow's fixed page-load delay, but triggered
// by actually scrolling the element into view instead. A fixed delay only works for
// content within the first viewport (there's a scroll-lock for the first few seconds,
// so it's guaranteed to be seen); anything further down the page would have its delay
// elapse long before a user actually scrolls to it, so it'd just appear already-settled.
export function useRevealOnView<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
