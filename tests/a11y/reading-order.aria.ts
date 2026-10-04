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
    // every experience row open, so its bullets are part of the read
    const closed = page.locator('#track-record button[aria-expanded="false"]');
    while ((await closed.count()) > 0) await closed.first().click();
  });
  test("hero", async ({ page }) => {
    await expect(page.locator("#about-hero")).toMatchAriaSnapshot(snap("about-hero"));
  });
  test("experience", async ({ page }) => {
    await expect(page.locator("#track-record")).toMatchAriaSnapshot(snap("about-experience"));
  });
  test("logo grid", async ({ page }) => {
    await expect(page.locator("#the-pack")).toMatchAriaSnapshot(snap("about-logos"));
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

/* The experience accordion without JavaScript: the server renders every
   panel open, so the content is all there. With JavaScript only the
   current role stays open. */
test.describe("About experience without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("every panel is visible", async ({ page }) => {
    await page.goto("/about");
    const panels = page.locator("#track-record .accordion__panel");
    await expect(panels).toHaveCount(5);
    for (const p of await panels.all()) await expect(p).toBeVisible();
  });
});

test("About experience with JavaScript: only the current role is open", async ({ page }) => {
  await open(page, "/about");
  const triggers = page.locator("#track-record .accordion__trigger");
  await expect(triggers.first()).toHaveAttribute("aria-expanded", "true");
  for (let i = 1; i < (await triggers.count()); i++) await expect(triggers.nth(i)).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#track-record .accordion__panel").nth(1)).toBeHidden();
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
   zoom story, whose tabs and pins left with the rebuild). Every figure's
   Enlarge (below 768px) opens the full-screen viewer; Escape closes it and
   focus goes back to Enlarge (Site/Figure button 323:138). A figure with
   motion has Replay at every width. */
test.describe("Case study: figures", () => {
  test.beforeEach(async ({ page }) => {
    await open(page, "/case-studies/design-system-transformation");
  });

  test("Enlarge opens the figure, Escape closes it and returns focus", async ({ page }) => {
    /* Enlarge shows below 768px only (Site v3 rules, 4 Oct late) */
    test.skip(test.info().project.name !== "390", "Enlarge is a phone control");
    const enlarge = page.getByRole("button", { name: "Enlarge Figure 2" });
    await enlarge.click();
    const viewer = page.getByRole("dialog", { name: "Figure 2, enlarged" });
    await expect(viewer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
    await expect(enlarge).toBeFocused();
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
