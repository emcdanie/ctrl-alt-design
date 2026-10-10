import { test, expect } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/* First-screen baselines (RG guard, LD6b, Elleta 10 Oct 2026).
 * Captures the viewport-sized first screen (not full page — full-page
 * shots are unstable; first screen is the visual contract).
 *
 * Baselines must be generated on Linux CI via the "update-baselines"
 * workflow_dispatch job, never locally on a Mac. A diff in CI means
 * Elleta looks at expected/actual/diff before OK'ing the PR.
 *
 * maxDiffPixelRatio 0.01: up to 1% of pixels may differ (for sub-pixel
 * rendering differences across platforms), anything above is a fail.
 *
 * Fonts and images are awaited via networkidle; carousel and video are
 * masked to avoid non-deterministic content. */

/* If the __snapshots__ dir has no .png files, baselines have not been seeded
 * yet. Skip all tests with a loud warning rather than failing CI — baselines
 * must be generated via the "update-baselines" workflow_dispatch after the PR
 * merges. Track in debt: see scripts/lib/debt-allowlist.json entry. */
const SNAPSHOTS_DIR = join(__dirname, "__snapshots__");
const BASELINES_EXIST =
  existsSync(SNAPSHOTS_DIR) &&
  readdirSync(SNAPSHOTS_DIR).some((f) => f.endsWith(".png"));

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/work", name: "work" },
  { path: "/about", name: "about" },
  { path: "/design-system", name: "design-system" },
  { path: "/learning", name: "learning" },
  { path: "/case-studies/chip", name: "case-chip" },
  { path: "/case-studies/federated", name: "case-federated" },
  { path: "/case-studies/theming", name: "case-theming" },
];

/* Elements that contain non-deterministic content (video, carousels, auto-play) */
const MASK_SELECTORS = [
  "video",
  "[data-carousel]",
  ".carousel",
  "[aria-roledescription='carousel']",
];

async function openPage(page: import("@playwright/test").Page, path: string) {
  await page.addInitScript(() => {
    try { localStorage.setItem("theme", "light"); } catch {}
    document.documentElement.dataset.theme = "light";
  });
  await page.goto(path, { waitUntil: "networkidle" });
  /* freeze animations */
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation-delay: -1ms !important;
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      transition: none !important;
    }`,
  });
  /* wait for fonts and layout-shift to settle */
  await page.waitForTimeout(300);
}

for (const { path, name } of ROUTES) {
  test.describe(name, () => {
    test.beforeEach(async ({ page }) => {
      await openPage(page, path);
    });

    test(`first screen ${name}`, async ({ page }) => {
      test.skip(!BASELINES_EXIST, "No baselines seeded — run update-baselines workflow after PR merge");
      const mask = await Promise.all(
        MASK_SELECTORS.flatMap((sel) => page.locator(sel).all()),
      ).then((arrs) => arrs.flat());

      await expect(page).toHaveScreenshot(`${name}-${test.info().project.name}.png`, {
        maxDiffPixelRatio: 0.01,
        clip: { x: 0, y: 0, width: test.info().project.use?.viewport?.width ?? 1440, height: test.info().project.use?.viewport?.height ?? 900 },
        mask,
      });
    });
  });
}
