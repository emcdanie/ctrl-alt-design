"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Visibility threshold (0–1). Default 0.08 */
  threshold?: number;
  /** Only trigger once, then disconnect. Default true */
  once?: boolean;
}

/**
 * Lightweight IntersectionObserver hook.
 * Returns a ref to attach and a boolean for visibility.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.08, once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
