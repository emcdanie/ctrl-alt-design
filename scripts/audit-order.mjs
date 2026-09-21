/* Visual-reorder review (reading order, 18 Sep 2026). Lists, never
   fails: CSS that can make what you see disagree with what a screen
   reader reads. The accessibility-tree snapshots (tests/a11y, run by
   the same npm script) are the failing half.
   1. Static: the `order` property, *-reverse flex/grid directions, and
      Tailwind order-* / *-reverse classes in globals + components.
   2. Runtime: on each route at 1440 and 390, every grid/flex container
      whose children appear on screen in a different order from the DOM
      (a later sibling placed above, or left of, an earlier one). */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { BASE } from "./lib/base-url.mjs";

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(css|tsx)$/.test(e)) out.push(p);
  }
  return out;
};

const STATIC = [
  [/(^|[\s;{])order\s*:\s*-?\d/, "order property"],
  [/(row|column)-reverse/, "reversed flex/grid direction"],
  [/\border-(first|last|none|\d+)\b/, "Tailwind order class"],
  [/\bflex-(row|col)-reverse\b/, "Tailwind reverse class"],
];
const staticHits = [];
for (const f of ["app/globals.css", ...walk("components"), ...walk("app").filter((p) => p.endsWith(".tsx"))]) {
  readFileSync(f, "utf8").split("\n").forEach((l, i) => {
    for (const [re, what] of STATIC) if (re.test(l)) staticHits.push(`${f}:${i + 1}  ${what}  ${l.trim().slice(0, 70)}`);
  });
}

const routes = ["/", "/about", "/work", "/learning", "/design-system", "/case-studies/chip"];
const runtimeHits = new Set();
const browser = await chromium.launch();
for (const w of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    const hits = await page.evaluate(() => {
      const out = [];
      const vis = (el) => {
        const cs = getComputedStyle(el), b = el.getBoundingClientRect();
        return b.width > 0 && b.height > 0 && cs.visibility !== "hidden" && !/absolute|fixed/.test(cs.position) && !el.closest("[aria-hidden=true]");
      };
      for (const c of document.querySelectorAll("body *")) {
        const d = getComputedStyle(c).display;
        if (!/grid|flex/.test(d) || c.closest("[aria-hidden=true], #overlay-menu")) continue;
        const kids = [...c.children].filter(vis).filter((k) => k.textContent.trim());
        for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
          const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect();
          // j (later in the DOM) reads before i on screen: clearly above, or same row and to the left
          const above = b.bottom <= a.top + 2;
          const leftSameRow = Math.abs(b.top - a.top) < 4 && b.right <= a.left + 2;
          if (above || leftSameRow) {
            const name = (el) => (el.className?.toString() || el.tagName).split(" ")[0].slice(0, 36);
            out.push(`${name(c)}: "${kids[j].textContent.trim().slice(0, 24)}" (${name(kids[j])}) shows before "${kids[i].textContent.trim().slice(0, 24)}"`);
          }
        }
      }
      return out;
    });
    hits.forEach((h) => runtimeHits.add(`${r} @${w}  ${h}`));
  }
  await page.close();
}
await browser.close();

console.log(`order review: ${staticHits.length} static, ${runtimeHits.size} runtime (listed for review, not failures)`);
for (const h of staticHits) console.log("  static   " + h);
for (const h of runtimeHits) console.log("  runtime  " + h);
