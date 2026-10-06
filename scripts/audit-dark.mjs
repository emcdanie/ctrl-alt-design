/* Dark-mode gate: every case-study embed must adapt to the site's dark
 * theme. contrast/axe check the site chrome, not the iframed artifact
 * documents, so a light-only embed passed green while glaring white in
 * dark. This closes that hole: for each /demos/*.html referenced by a
 * case (in content/ or components/, comments stripped), it (1) requires a
 * theme hook in the file (data-theme / prefers-color-scheme / .dark) and
 * (2) renders it with data-theme="dark" on the artifact root and fails on
 * a near-white computed background. A transparent embed (drift-specimen,
 * cascade) passes: it inherits the dark beat ground.
 *
 * Named panels (job 38, 5 Oct 2026): a figure caption or a short panel
 * label that names a theme ("BELLA · light", "ground · dark", "light
 * theme") promises that panel renders in that theme, whatever the page
 * theme. Every route, 1440, both page themes, reduced motion: the panel's
 * effective background must be light (luminance >= 0.5) for "light" and
 * dark (<= 0.2) for "dark". A caption naming both themes promises neither. */
import { chromium } from "playwright";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { receipt } from "./lib/receipt.mjs";
import { BASE } from "./lib/base-url.mjs";


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
    const cv = document.createElement("canvas").getContext("2d");
    cv.fillStyle = "#000"; cv.fillStyle = eff(document.body); cv.fillRect(0, 0, 1, 1);
    const d = cv.getImageData(0, 0, 1, 1).data;
    return `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${d[3] / 255})`;
  });
  /* threshold lowered 0.9 -> 0.75 so a warm parchment / cream background
     (not just near-white) FAILS in dark; a real dark surface is far below */
  const lum = bgLuminance(bg);
  if (lum !== null && lum > 0.75) {
    fail(ref, `a light background in dark (${bg}, luminance ${lum.toFixed(2)})`, "a dark background (luminance <= 0.75) or a transparent one");
  }
}

await page.close();

/* named panels */
const slugs = readdirSync("content/case-studies")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .map((f) => f.replace(/\.ts$/, ""));
const studyIds = [...readFileSync("content/studies.ts", "utf8").matchAll(/\bid: "([^"]+)"/g)].map((m) => m[1]);
const ROUTES = ["/", "/work", "/learning", "/about", "/design-system", "/design-system/inspector", "/quick", "/contact", "/privacy", "/accessibility",
  ...studyIds.map((id) => `/work/studies/${id}`), ...slugs.map((s) => `/case-studies/${s}`)];
let named = 0;
for (const theme of ["light", "dark"]) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: theme, reducedMotion: "reduce" });
  await p.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch {} }, theme);
  for (const route of ROUTES) {
    await p.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    await p.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
    await p.waitForTimeout(200);
    const found = await p.evaluate(() => {
      const NAMES = /(?:·|\(|\btheme\s*[:·]?|\bmode\s*[:·]?|\bground\s*[:·])\s*(light|dark)\b|\b(light|dark)\s+(?:theme|mode|ground)\b/gi;
      const named = (text) => {
        const got = new Set([...text.matchAll(NAMES)].map((m) => (m[1] || m[2]).toLowerCase()));
        return got.size === 1 ? [...got][0] : null;
      };
      const opaque = (c) => c && c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c);
      const groundOf = (el) => {
        for (; el; el = el.parentElement) {
          const c = getComputedStyle(el).backgroundColor;
          if (opaque(c)) return c;
        }
        return getComputedStyle(document.documentElement).backgroundColor;
      };
      /* the panel's own fill: the first filled box inside it, else its
         ground. A panel pinned with data-theme inside the figure is the
         picture the caption names, so it is measured first (job 38: the
         figure's stage grid follows the page around a pinned exhibit) */
      const fillOf = (panel, skip) => {
        const pinned = panel.querySelector("[data-theme]");
        for (const el of [...(pinned ? [pinned] : []), panel, ...panel.querySelectorAll("*")]) {
          if (skip && skip.contains(el)) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 40 || r.height < 40) continue;
          const c = getComputedStyle(el).backgroundColor;
          if (opaque(c)) return c;
        }
        return groundOf(panel);
      };
      /* any CSS colour (oklch included) -> rgba() via a canvas pixel */
      const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      const rgb = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = "#000"; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; return `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${(d[3] / 255).toFixed(3)})`; };
      const out = [];
      const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(el).visibility !== "hidden"; };
      for (const cap of document.querySelectorAll("main figcaption")) {
        const t = named(cap.textContent || "");
        const fig = cap.closest("figure");
        if (t && fig && visible(fig)) out.push([t, `figcaption "${cap.textContent.trim().replace(/\s+/g, " ").slice(0, 48)}"`, rgb(fillOf(fig, cap))]);
      }
      for (const el of document.querySelectorAll("main *")) {
        if (el.closest("figcaption, a, button, nav, [role=tab]") || el.children.length) continue;
        const text = (el.textContent || "").trim();
        if (!text || text.length > 40 || !visible(el)) continue;
        const t = named(text);
        if (t) out.push([t, `label "${text}"`, rgb(groundOf(el.parentElement))]);
      }
      return out;
    });
    for (const [want, what, bg] of found) {
      named++;
      const lum = bgLuminance(bg) ?? 0;
      const ok = want === "light" ? lum >= 0.5 : lum <= 0.2;
      if (!ok) fail(`${route} (page ${theme}) ${what}`, `a ${want === "light" ? "dark" : "light"} panel (${bg}, luminance ${lum.toFixed(2)})`, `the ${want} theme it names (${want === "light" ? ">= 0.5" : "<= 0.2"})`);
    }
  }
  await p.close();
}

await browser.close();
console.log(fails === 0 ? `dark gate: PASS (${embeds.length} embeds adapt to dark; ${named} theme-named panel checks)` : `dark gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
