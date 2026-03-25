"use client";

import { useSyncExternalStore } from "react";

function getSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Returns true when the user has enabled "Reduce motion" in their OS settings.
 * Uses useSyncExternalStore for safe, tear-free reads.
 * Returns false during SSR.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    getSnapshot,
    getServerSnapshot
  );
}
