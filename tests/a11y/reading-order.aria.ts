import { test, expect, type Page } from "@playwright/test";

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
  test("case studies", async ({ page }) => {
    await expect(page.locator("#case-studies")).toMatchAriaSnapshot(snap("work-grid"));
  });
  test("pattern studies", async ({ page }) => {
    await expect(page.locator("#studies")).toMatchAriaSnapshot(snap("work-studies"));
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
