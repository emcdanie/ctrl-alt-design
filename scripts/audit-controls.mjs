/* Control-taxonomy gate (§7): runtime checks per route, plus the
   demo-register ban (simplification pass, 22 Jul 2026): the black
   .demo-btn / --demo-* register is retired; any comeback fails. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const routes = ["/", "/work", "/work?view=map", "/work?view=timeline", "/about", "/contact",
  "/point-of-view", "/case-studies/brad-frost", "/case-studies/chip",
  "/case-studies/design-system-transformation",
  "/skills", "/work?view=cards", "/design-system", "/quick", "/case-template"];

/* ── source scan: the retired demo register must not return.
   Matches DECLARATIONS and USAGES (definitions, var() reads, CSS
   selectors, className references), not prose mentions in comments. */
const DEMO_REGISTER = [
  /--demo-[a-z-]+\s*:/, // token definition
  /var\(--demo-/, // token usage
  /^\s*\.demo-btn\b/, // CSS selector
  /className=["'`][^"'`]*\bdemo-btn\b/, // TSX usage
];
const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|css)$/.test(e)) out.push(p);
  }
  return out;
};
let srcFails = 0;
for (const root of ["app", "components"]) {
  for (const file of walk(root)) {
    readFileSync(file, "utf8").split("\n").forEach((l, i) => {
      if (DEMO_REGISTER.some((re) => re.test(l))) {
        srcFails++;
        console.error(`CONTROLS FAIL: ${file}:${i + 1} retired demo register: ${l.trim().slice(0, 60)}`);
      }
    });
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let fails = srcFails;
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
