import { test, expect, type Page } from "@playwright/test";
import { HOME_STORY } from "../../lib/copy";

/* Reading order as a screen reader meets it: the accessibility tree of
   each section, snapshotted per viewport. If a layout change reorders
   what is read, the snapshot diff shows it. Update deliberately with
   `npx playwright test --update-snapshots` and read the diff. */

const open = async (page: Page, path: string) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("theme", "light");
    } catch {}
  });
  await page.goto(path, { waitUntil: "networkidle" });
};
const snap = (name: string) => ({ name: `${name}-${test.info().project.name}.aria.yml` });

test.describe("About", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, "/about");
  });
  test("hero", async ({ page }) => {
    await expect(page.locator("#about-hero")).toMatchAriaSnapshot(snap("about-hero"));
  });
  test("experience", async ({ page }) => {
    await expect(page.locator("#track-record")).toMatchAriaSnapshot(snap("about-experience"));
  });
  test("house rules", async ({ page }) => {
    await expect(page.locator("#house-rules")).toMatchAriaSnapshot(snap("about-house-rules"));
  });
  test("testimonials", async ({ page }) => {
    await expect(page.locator("#word-of-mouth")).toMatchAriaSnapshot(snap("about-testimonials"));
  });
  test("footer", async ({ page }) => {
    await expect(page.getByRole("contentinfo")).toMatchAriaSnapshot(snap("footer"));
  });
});

test.describe("Work", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, "/work");
  });
  test("hero", async ({ page }) => {
    await expect(page.locator("main h1").first()).toMatchAriaSnapshot(snap("work-hero"));
  });
  /* the index rows (Geist refresh, 22 Sep 2026): the whole row is one link */
  test("case studies", async ({ page }) => {
    await expect(page.locator("#work-hero")).toMatchAriaSnapshot(snap("work-grid"));
  });
});

test.describe("Home", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, "/");
  });
  test("hero", async ({ page }) => {
    await expect(page.locator("main h1")).toHaveAccessibleName(HOME_STORY);
    await expect(page.locator('[aria-labelledby="home-hero-title"]')).toMatchAriaSnapshot(snap("home-hero"));
  });
  for (const id of ["selected-work", "how-i-work", "word-of-mouth"])
    test(id, async ({ page }) => {
      await expect(page.locator(`#${id}`)).toMatchAriaSnapshot(snap(`home-${id}`));
    });
});

test.describe("Nav", () => {
  test("desktop", async ({ page }) => {
    test.skip(test.info().project.name !== "1440", "desktop bar");
    await open(page, "/about");
    await expect(page.locator(".nav-row")).toMatchAriaSnapshot(snap("nav-desktop"));
  });
  test("mobile menu open", async ({ page }) => {
    test.skip(test.info().project.name !== "390", "mobile menu");
    await open(page, "/about");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#overlay-menu")).toMatchAriaSnapshot(snap("nav-mobile-menu"));
  });
});


test.describe("Learning", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, "/learning");
  });
  test("hero", async ({ page }) => {
    await expect(page.locator("#learning-hero")).toMatchAriaSnapshot(snap("learning-hero"));
  });
  test("library", async ({ page }) => {
    await expect(page.locator("#library")).toMatchAriaSnapshot(snap("learning-library"));
  });
  test("who I follow", async ({ page }) => {
    await expect(page.locator("#who-i-follow")).toMatchAriaSnapshot(snap("learning-voices"));
  });
  test("out in the world", async ({ page }) => {
    await expect(page.locator("#out-in-the-world")).toMatchAriaSnapshot(snap("learning-world"));
  });
});

/* The Drift case on the Site v3 template (4 Oct 2026; replaces the 22 Sep
   zoom story, whose tabs and pins left with the rebuild). A figure with
   motion has Replay at every width; no figure has Enlarge (removed 4 Oct
   late: the page's own pinch-zoom does the job). */
test.describe("Case study: figures", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, "/case-studies/design-system-transformation");
  });

  test("no figure offers Enlarge or a viewer", async ({ page }) => {
    await expect(page.getByRole("button", { name: /^Enlarge Figure/ })).toHaveCount(0);
    await expect(page.locator("main dialog")).toHaveCount(0);
  });

  test("a figure with motion offers Replay", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Replay Figure 4" })).toBeVisible();
  });
});

/* /skills became a view of /learning (19 Sep 2026): a permanent redirect
   that lands on the Skills view */
test("/skills redirects permanently to /learning?view=skills", async ({ page, request }) => {
  const res = await request.get("/skills", { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers()["location"]).toBe("/learning?view=skills");
  await open(page, "/skills");
  await expect(page).toHaveURL(/\/learning\?view=skills$/);
  await expect(page.getByRole("button", { name: "Skills", exact: true })).toHaveAttribute("aria-current", "true");
});
