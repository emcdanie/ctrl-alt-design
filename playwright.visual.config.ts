import { defineConfig } from "@playwright/test";

/* Visual baseline config (RG guard, Elleta 10 Oct 2026).
 * Separate from playwright.config.ts (which handles a11y/aria snapshots).
 * Baselines live in tests/visual/__snapshots__/ and must be generated on
 * Linux CI (workflow_dispatch "update-baselines" job) to be platform-stable.
 * On Mac: run with SKIP_VISUAL_BASELINE_CHECK=1 to avoid false diffs. */

export default defineConfig({
  testDir: "tests/visual",
  testMatch: "**/*.visual.ts",
  snapshotPathTemplate: "{testDir}/__snapshots__/{arg}{ext}",
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "line",
  workers: 2,
  use: {
    baseURL: process.env.AUDIT_URL ?? "http://localhost:3000",
    colorScheme: "light",
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [
    { name: "390", use: { viewport: { width: 390, height: 844 } } },
    { name: "768", use: { viewport: { width: 768, height: 1024 } } },
    { name: "1024", use: { viewport: { width: 1024, height: 768 } } },
    { name: "1440", use: { viewport: { width: 1440, height: 900 } } },
  ],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
});
