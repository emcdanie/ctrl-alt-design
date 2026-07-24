/* Dark-mode gate: every case-study embed must adapt to the site's dark
 * theme. contrast/axe check the site chrome, not the iframed artifact
 * documents, so a light-only embed passed green while glaring white in
 * dark. This closes that hole: for each /demos/*.html referenced by a
 * case (in content/ or components/, comments stripped), it (1) requires a
 * theme hook in the file (data-theme / prefers-color-scheme / .dark) and
 * (2) renders it with data-theme="dark" on the artifact root and fails on
 * a near-white computed background. A transparent embed (drift-specimen,
 * cascade) passes: it inherits the dark beat ground. */
import { chromium } from "playwright";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { receipt } from "./lib/receipt.mjs";

const BASE = "http://localhost:3000";

const walk = (dir) => {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|ts)$/.test(p)) out.push(p);
  }
  return out;
};
/* strip block + line comments so retired/commented refs are not "used" */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const refs = new Set();
for (const f of [...walk("content"), ...walk("components")]) {
  const src = stripComments(readFileSync(f, "utf8"));
  for (const m of src.matchAll(/\/demos\/[\w./-]+\.html/g)) refs.add(m[0]);
}
const embeds = [...refs].sort();

/* WCAG relative luminance from an rgb() / rgba() string */
function bgLuminance(rgb) {
  const m = rgb.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((x) => parseFloat(x));
  const [r, g, b] = parts;
  const alpha = parts.length > 3 ? parts[3] : 1;
  if (alpha === 0) return null; /* transparent: inherits the ground */
  const lin = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

let fails = 0;
const fail = (offender, got, expected) => { fails++; console.error(receipt("dark", offender, got, expected)); };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 700 } });

for (const ref of embeds) {
  const file = join("public", ref);
  if (!existsSync(file)) { fail(ref, "referenced file is missing", "the /demos file exists"); continue; }
  const html = readFileSync(file, "utf8");
  const hasHook = /data-theme|prefers-color-scheme|\.dark\b/.test(html);
  if (!hasHook) {
    fail(ref, "no dark-theme handling in the file", "a data-theme / prefers-color-scheme / .dark hook");
    continue;
  }
  try {
    /* theme the artifact the way ScaledFrame now does: ?theme=dark on the
       URL (the embed reads it on first paint), then set data-theme on the
       root for embeds that only ship a data-theme / .dark hook */
    const url = BASE + ref + (ref.includes("?") ? "&" : "?") + "theme=dark";
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } catch {
    fail(ref, "did not load", "a 200 render"); continue;
  }
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.waitForTimeout(250);
  const bg = await page.evaluate(() => {
    const eff = (el) => {
      while (el) {
        const c = getComputedStyle(el).backgroundColor;
        if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
        el = el.parentElement;
      }
      return "rgba(0, 0, 0, 0)";
    };
    return eff(document.body);
  });
  /* threshold lowered 0.9 -> 0.75 so a warm parchment / cream background
     (not just near-white) FAILS in dark; a real dark surface is far below */
  const lum = bgLuminance(bg);
  if (lum !== null && lum > 0.75) {
    fail(ref, `a light background in dark (${bg}, luminance ${lum.toFixed(2)})`, "a dark background (luminance <= 0.75) or a transparent one");
  }
}

await browser.close();
console.log(fails === 0 ? `dark gate: PASS (${embeds.length} embeds adapt to dark)` : `dark gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
