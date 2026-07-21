/* Visual assertions gate (system-page-v3, Elleta 21 Jul 2026). Her
 * briefs named audit:visual three times; it now exists. Three checks:
 * 1. ONE GROUND: every /design-system band's computed background
 *    equals the page ground, both themes, EXCEPT the identity band's
 *    recorded low-tint wash (Elleta's call). No band ever gains a
 *    surface again.
 * 2. SPECIMEN ALIGNMENT: sibling specimen cards in a row render equal
 *    heights (grid stretch, fixed head slots).
 * 3. COVER PLACEHOLDERS: >= 3:1 large-text against both stops of the
 *    token gradient, both themes (moved here from contrast-check; one
 *    home for visual assertions).
 */
import { chromium } from "playwright";

const browser = await chromium.launch();
let fails = 0;

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);

  /* ── 1 + 2: the System page ── */
  await page.goto("http://localhost:3000/design-system", { waitUntil: "networkidle", timeout: 30000 });
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 800) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(30);
  }

  const bandBad = await page.evaluate(() => {
    const pageBg = getComputedStyle(document.body).backgroundColor;
    const out = [];
    for (const band of document.querySelectorAll(".ds-band")) {
      if (band.classList.contains("ds-band--identity")) continue;
      const cs = getComputedStyle(band);
      const transparent = /rgba\(0, 0, 0, 0\)/.test(cs.backgroundColor);
      if ((!transparent && cs.backgroundColor !== pageBg) || cs.backgroundImage !== "none") {
        out.push(`${band.querySelector("h2")?.textContent ?? "band"}: ${cs.backgroundColor} / ${cs.backgroundImage.slice(0, 40)}`);
      }
    }
    return out;
  });
  for (const b of bandBad) {
    fails++;
    console.error(`VISUAL FAIL (${theme}) band surface off the page ground: ${b}`);
  }

  const rowBad = await page.evaluate(() => {
    const out = [];
    for (const grid of document.querySelectorAll(".ds-specimen-row, .ds-gate, .ds-caseband, .ds-status")) {
      const cards = [...grid.children].filter((c) => c.getBoundingClientRect().width > 0);
      /* group siblings by row (same top), assert equal heights */
      const rows = new Map();
      for (const c of cards) {
        const r = c.getBoundingClientRect();
        const key = Math.round(r.top);
        rows.set(key, [...(rows.get(key) ?? []), Math.round(r.height)]);
      }
      for (const [top, heights] of rows) {
        if (new Set(heights).size > 1) out.push(`row@${top}: heights ${heights.join(",")}`);
      }
    }
    return out;
  });
  for (const b of rowBad) {
    fails++;
    console.error(`VISUAL FAIL (${theme}) unequal specimen heights: ${b}`);
  }

  /* ── 3: cover placeholders on /work ── */
  await page.goto("http://localhost:3000/work", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(500);
  const worst = await page.evaluate(() => {
    const lum = (m) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
    const parse = (str) => str.match(/\d+/g).map(Number).slice(0, 3);
    let min = Infinity;
    for (const ph of document.querySelectorAll('[class*="coverPlaceholder"]')) {
      const cs = getComputedStyle(ph);
      const stops = (cs.backgroundImage.match(/rgb\([^)]+\)/g) ?? []).map(parse);
      const ink = parse(cs.color);
      for (const g of stops) {
        const l1 = lum(ink), l2 = lum(g);
        min = Math.min(min, (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
      }
    }
    return min;
  });
  if (worst < 3) {
    fails++;
    console.error(`VISUAL FAIL (${theme}) cover placeholder worst ratio ${worst.toFixed(2)} < 3:1`);
  }
  await ctx.close();
}
await browser.close();

if (fails > 0) {
  console.error(`visual gate: ${fails} failure(s)`);
  process.exit(1);
}
console.log("visual gate: PASS (one ground, equal specimen rows, cover placeholders >= 3:1)");
