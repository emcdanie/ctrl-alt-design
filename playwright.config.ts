import { defineConfig } from "@playwright/test";

/* Accessibility-tree snapshots (audit:order). Runs against the dev
   server at AUDIT_URL (default :3000), light theme, at 1440 and 390.
   Files end in .aria.ts so vitest never picks them up. */
export default defineConfig({
  testDir: "tests/a11y",
  testMatch: "**/*.aria.ts",
  snapshotPathTemplate: "{testDir}/__snapshots__/{arg}{ext}",
  reporter: "line",
  workers: 2,
  use: {
    baseURL: process.env.AUDIT_URL ?? "http://localhost:3000",
    colorScheme: "light",
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [
    { name: "1440", use: { viewport: { width: 1440, height: 900 } } },
    { name: "390", use: { viewport: { width: 390, height: 844 } } },
  ],
});
