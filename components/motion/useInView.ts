"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Visibility threshold (0–1). Default 0.08 */
  threshold?: number;
  /** Only trigger once, then disconnect. Default true */
  once?: boolean;
}

/**
 * Lightweight IntersectionObserver hook, first-paint safe (Pass B
 * 2026-07-18): the initial state is VISIBLE, so SSR HTML, no-JS, and
 * anything in the viewport at load never renders invisible. After
 * mount, only elements still below the viewport are hidden and handed
 * to the observer to animate in on scroll.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.08, once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* in (or above) the first paint: stay visible, never animate */
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setInView(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, inView };
}
