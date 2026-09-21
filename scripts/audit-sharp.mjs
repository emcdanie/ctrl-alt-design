/* The sharpness gate (Part W5, 21 Sep 2026: Elleta saw a soft checkout
 * screen). A raster image stretched past its pixels goes soft on a retina
 * screen, so every image must have at least twice the pixels of the widest
 * CSS width it is shown at. Every route, and every same-origin demo iframe
 * inside it, at 1440 and 390: fail when an image renders wider than its
 * natural width ÷ 2. Vector images (SVG) are skipped: they have no pixels
 * to run out of. Browser audit: reads AUDIT_URL like the others. */
import { readdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";
import { receipt } from "./lib/receipt.mjs";
import { BASE } from "./lib/base-url.mjs";

const slugs = readdirSync("content/case-studies")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .map((f) => f.replace(/\.ts$/, ""));
const studies = [...readFileSync("content/studies.ts", "utf8").matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
const ROUTES = [
  "/", "/work", "/learning", "/about", "/design-system", "/quick", "/contact", "/privacy", "/accessibility",
  ...studies.map((s) => `/work/studies/${s}`),
  ...slugs.map((s) => `/case-studies/${s}`),
];

let fails = 0;
let checked = 0;
const browser = await chromium.launch();
for (const width of [1440, 390]) {
  /* a retina screen: the browser picks the 2x candidate of a srcset, as a
     real one would */
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
  for (const route of ROUTES) {
    const res = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
    if (!res || res.status() >= 400) continue; /* a study without a brief page */
    /* load everything lazy: walk the page, then wait for the pictures */
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 700) {
      await page.evaluate((v) => scrollTo(0, v), y);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(600);
    const found = [];
    for (const frame of page.frames()) {
      if (!frame.url().startsWith(BASE)) continue;
      const where = frame === page.mainFrame() ? "" : ` (in ${new URL(frame.url()).pathname})`;
      const imgs = await frame
        .evaluate(async () => {
          /* tabbed demos keep their other views [hidden] (a Before, an
             After): show each while measuring, so a soft view cannot hide
             behind the default one. Hidden copies marked aria-hidden are
             never shown to anyone, so they are left alone. */
          const hiddenViews = [...document.querySelectorAll("[hidden]")].filter(
            (e) => e.querySelector("img") && !e.closest('[aria-hidden="true"]'),
          );
          const measure = () => [...document.images]
            .filter((i) => i.complete && i.naturalWidth > 0 && !/\.svg(\?|$)/i.test(i.currentSrc || i.src))
            .map((i) => {
              const r = i.getBoundingClientRect();
              const c = getComputedStyle(i);
              return {
                src: (i.currentSrc || i.src).replace(location.origin, ""),
                shown: r.width,
                natural: i.naturalWidth,
                srcset: !!i.srcset,
                visible: r.width > 0 && r.height > 0 && c.visibility !== "hidden" && !i.closest("[hidden]"),
              };
            })
            .filter((x) => x.visible);
          /* a srcset image reports naturalWidth divided by the density the
             browser picked (640px shown for 13rem reads as 208): decode the
             chosen file on its own to read its true pixels */
          const truePx = new Map();
          const truthOf = async (src) => {
            if (!truePx.has(src)) {
              const im = new Image();
              im.src = src;
              try { await im.decode(); } catch { /* keep what we have */ }
              truePx.set(src, im.naturalWidth);
            }
            return truePx.get(src);
          };
          const fix = async (list) => {
            for (const x of list) if (x.srcset) x.natural = (await truthOf(x.src)) || x.natural;
            return list;
          };
          const out = await fix(measure());
          for (const v of hiddenViews) {
            v.hidden = false;
            await new Promise((r) => setTimeout(r, 50));
            for (const i of await fix(measure())) if (!out.some((x) => x.src === i.src && Math.abs(x.shown - i.shown) < 1)) out.push(i);
            v.hidden = true;
          }
          return out;
        })
        .catch(() => []);
      for (const i of imgs) found.push({ ...i, where });
    }
    for (const i of found) {
      checked++;
      if (i.shown > i.natural / 2 + 1) {
        fails++;
        console.error(
          receipt("sharp", `(${width} ${route}) ${i.src}${i.where}`, `shown ${Math.round(i.shown)}px from ${i.natural}px (${(i.natural / i.shown).toFixed(2)}x)`, `at most ${Math.floor(i.natural / 2)}px (2x)`),
        );
      }
    }
  }
  await page.close();
}
await browser.close();
console.log(fails === 0 ? `sharp gate: PASS (${checked} image renders at 2x or better)` : `sharp gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
