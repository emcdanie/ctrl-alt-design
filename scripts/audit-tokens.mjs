/* Token lock (2026-07-17): no colour literals and no raw spacing in
 * app/** or components/**. Everything resolves from the token layer.
 * Allowlisted: app/globals.css (the app token/theme definition file).
 * Spacing scope: padding / margin / gap / scroll-margin values >= 4px
 * (0-3px hairlines, borders, and optical nudges are design details, not
 * scale spacing). Colour scope: hex / rgb() / hsl() anywhere, with the
 * `black`/`white` keywords permitted only inside mask-image hacks.
 *
 * One ground (job 38, 5 Oct 2026: Home's body and every footer wore
 * their own colour). Rendered, AUDIT_URL, every route at 1440 in both
 * themes: the body and main grounds (each element's own fill, or the
 * first filled ancestor's) compute one colour. The footer is the one
 * deliberate second ground (Elleta, 6 Oct 2026, job G1): it computes
 * --color-semantic-surface, nothing else. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { receipt } from "./lib/receipt.mjs";
import { BASE } from "./lib/base-url.mjs";

const ROOTS = ["app", "components"];
const EXT = /\.(tsx|ts|css)$/;
const ALLOW = new Set(["app/globals.css"]);

const COLOUR = /#[0-9a-fA-F]{3,8}\b|(?<![a-zA-Z-])rgba?\(|(?<![a-zA-Z-])hsla?\(/;
const SPACING_CSS = /(?:^|[^a-zA-Z-])(padding|margin|gap|row-gap|column-gap|scroll-margin)[a-z-]*\s*:\s*([^;{}]+)/g;
const SPACING_TSX = /(padding|margin|gap|rowGap|columnGap|scrollMargin)[A-Za-z]*\s*:\s*"([^"]+)"/g;
const RAW_LEN = /\b([4-9]|\d{2,})(?:\.\d+)?px\b|\b\d*\.?\d+rem\b/;

let failures = 0;
/* the receipt (A1): offender, actual, expected — one format */
const fail = (f, line, got, expected) => {
  failures++;
  console.log(receipt("tokens", `${f}:${line}`, got, expected));
};

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(e)) out.push(p);
  }
  return out;
};

for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (ALLOW.has(file)) continue;
    const lines = readFileSync(file, "utf8").split("\n");
    const isCss = file.endsWith(".css");
    lines.forEach((l, i) => {
      const n = i + 1;
      if (/token-waiver:/.test(l)) return; // reviewed exception, reason inline
      if (COLOUR.test(l)) fail(file, n, `colour literal ${l.trim().slice(0, 60)}`, "a token (or an inline token-waiver with a reason)");
      if (isCss) {
        for (const m of l.matchAll(SPACING_CSS)) {
          if (RAW_LEN.test(m[2])) fail(file, n, `raw spacing ${m[0].trim().slice(0, 60)}`, "a --spacing-* token");
        }
      } else {
        for (const m of l.matchAll(SPACING_TSX)) {
          if (RAW_LEN.test(m[2])) fail(file, n, `raw spacing ${m[0].trim().slice(0, 60)}`, "a --spacing-* token");
        }
      }
    });
  }
}

/* one ground per route */
const slugs = readdirSync("content/case-studies")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .map((f) => f.replace(/\.ts$/, ""));
const studyIds = [...readFileSync("content/studies.ts", "utf8").matchAll(/\bid: "([^"]+)"/g)].map((m) => m[1]);
const ROUTES = ["/", "/work", "/learning", "/about", "/design-system", "/design-system/inspector", "/quick", "/contact", "/privacy", "/accessibility", "/this-page-does-not-exist",
  ...studyIds.map((id) => `/work/studies/${id}`), ...slugs.map((x) => `/case-studies/${x}`)];
const browser = await chromium.launch();
for (const theme of ["light", "dark"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme, reducedMotion: "reduce" });
  await page.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch {} }, theme);
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
    await page.waitForTimeout(150);
    // a busy page can still be mid theme transition: let it finish
    await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))).then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))));
    const g = await page.evaluate(() => {
      const cv = document.createElement("canvas").getContext("2d");
      const rgb = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = "#000"; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; return d[3] ? `rgb(${d[0]}, ${d[1]}, ${d[2]})` : null; };
      const ground = (el) => { for (; el; el = el.parentElement) { const c = rgb(getComputedStyle(el).backgroundColor); if (c) return c; } return "rgb(255, 255, 255)"; };
      const pick = (sel) => { const el = document.querySelector(sel); return el ? ground(el) : null; };
      const probe = document.createElement("div");
      probe.style.background = "var(--color-semantic-surface)";
      document.body.append(probe);
      const surface = rgb(getComputedStyle(probe).backgroundColor);
      probe.remove();
      return { body: pick("body"), main: pick("main"), footer: pick("body > footer, footer:not(main footer)"), surface };
    });
    if (g.body && g.main && g.body !== g.main)
      fail(`${route} (${theme})`, "ground", `body ${g.body}, main ${g.main}`, "one ground colour on body and main");
    if (g.footer && g.footer !== g.surface)
      fail(`${route} (${theme})`, "footer ground", `footer ${g.footer}`, `the surface token ${g.surface}`);
  }
  await page.close();
}
await browser.close();

if (failures) {
  console.log(`tokens gate: ${failures} failure(s)`);
  process.exit(1);
}
console.log("tokens gate: PASS");
