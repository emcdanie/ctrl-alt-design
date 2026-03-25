/**
 * Web Vitals — Lightweight performance monitoring.
 *
 * Reports Core Web Vitals (LCP, CLS, INP) to the console in development.
 * Uses the native PerformanceObserver API — zero dependencies.
 *
 * Usage: call initWebVitals() once in layout.tsx (dev only).
 */

interface VitalEntry {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
}

const thresholds = {
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
} as const;

function rate(name: string, value: number): VitalEntry["rating"] {
  const t = thresholds[name as keyof typeof thresholds];
  if (!t) return "good";
  if (value <= t[0]) return "good";
  if (value <= t[1]) return "needs-improvement";
  return "poor";
}

function log(entry: VitalEntry) {
  const colors = {
    good: "color: #22c55e",
    "needs-improvement": "color: #f59e0b",
    poor: "color: #ef4444",
  };
  const unit = entry.name === "CLS" ? "" : "ms";
  const val = entry.name === "CLS" ? entry.value.toFixed(3) : Math.round(entry.value);
  console.log(
    `%c[Web Vitals] ${entry.name}: ${val}${unit} (${entry.rating})`,
    colors[entry.rating]
  );
}

/** Observe Largest Contentful Paint */
function observeLCP() {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        log({ name: "LCP", value: last.startTime, rating: rate("LCP", last.startTime) });
      }
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // Not supported
  }
}

/** Observe Cumulative Layout Shift */
function observeCLS() {
  try {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!layoutShift.hadRecentInput && layoutShift.value) {
          clsValue += layoutShift.value;
        }
      }
    });
    observer.observe({ type: "layout-shift", buffered: true });

    // Report final CLS when page is hidden
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.visibilityState === "hidden") {
          log({ name: "CLS", value: clsValue, rating: rate("CLS", clsValue) });
          observer.disconnect();
        }
      },
      { once: true }
    );
  } catch {
    // Not supported
  }
}

/** Observe Interaction to Next Paint */
function observeINP() {
  try {
    let maxDuration = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const eventEntry = entry as PerformanceEntry & { duration: number };
        if (eventEntry.duration > maxDuration) {
          maxDuration = eventEntry.duration;
        }
      }
    });
    observer.observe({ type: "event", buffered: true });

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.visibilityState === "hidden" && maxDuration > 0) {
          log({ name: "INP", value: maxDuration, rating: rate("INP", maxDuration) });
          observer.disconnect();
        }
      },
      { once: true }
    );
  } catch {
    // Not supported
  }
}

/** Observe First Contentful Paint */
function observeFCP() {
  try {
    const observer = new PerformanceObserver((list) => {
      const entry = list.getEntries().find((e) => e.name === "first-contentful-paint");
      if (entry) {
        log({ name: "FCP", value: entry.startTime, rating: rate("FCP", entry.startTime) });
        observer.disconnect();
      }
    });
    observer.observe({ type: "paint", buffered: true });
  } catch {
    // Not supported
  }
}

/**
 * Initialize Web Vitals monitoring.
 * Only runs in development. Call once from a client component.
 */
export function initWebVitals() {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "development") return;

  observeLCP();
  observeCLS();
  observeINP();
  observeFCP();

  console.log(
    "%c[Web Vitals] Monitoring active (dev only)",
    "color: #8C8CA0; font-style: italic"
  );
}
