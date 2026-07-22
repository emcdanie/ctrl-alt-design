/* Control-taxonomy gate (§7): runtime checks per route. */
import { chromium } from "playwright";

const routes = ["/", "/work", "/work?view=map", "/work?view=timeline", "/about", "/contact",
  "/point-of-view", "/case-studies/brad-frost", "/case-studies/guardian",
  "/case-studies/design-system-transformation", "/case-studies/un-operational-dashboard",
  "/case-studies/filters-decision-support-system", "/skills", "/work?view=cards", "/design-system",
  "/design-system2", "/quick"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let fails = 0;
const fail = (m) => { fails++; console.error("CONTROLS FAIL:", m); };

for (const r of routes) {
  await page.goto("http://localhost:3000" + r, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const res = await page.evaluate(() => {
    const visible = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== "hidden";
    };
    const primaries = [...document.querySelectorAll(".btn-key--primary")].filter(visible);
    const chipsNoAria = [...document.querySelectorAll(".filter-chip")].filter(
      (c) => !c.hasAttribute("aria-pressed"));
    const segs = [...document.querySelectorAll(".seg-control")];
    const segBad = segs.filter(
      (s) => s.querySelectorAll('button[aria-current="true"]').length !== 1);
    return { primaries: primaries.length, chipsNoAria: chipsNoAria.length, segBad: segBad.length };
  });
  if (res.primaries > 1) fail(`${r}: ${res.primaries} primary keycaps visible (max 1)`);
  if (res.chipsNoAria) fail(`${r}: ${res.chipsNoAria} filter chips missing aria-pressed`);
  if (res.segBad) fail(`${r}: segmented control without exactly one aria-current`);
}
await browser.close();
console.log(fails === 0 ? "controls gate: PASS" : `controls gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
