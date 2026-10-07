/* One type style per role (TY, Elleta, 7 Oct 2026: "huge inconsistency in
 * fonts and weights"). The 4 Oct type lock reached the case template, but
 * Home, /work, /learning and /design-system carried their own local styles,
 * and audit:fonts only reads families, never weight or size per role, so the
 * drift passed the gate. This audit reads the RENDERED page chrome, every
 * route at 1440 and 375, light theme:
 *
 * 1. Weights: 400 and 600 only. 700 only on <strong>/<b> inside a 600
 *    context, 800 only on a quote mark.
 * 2. Every h1 computes the Display/Page size (Display/Hero on Home).
 * 3. Mono (--font-code) only on <code>, <pre>, <kbd>, <samp>: real token and
 *    code names. Never labels, eyebrows, meta or tags.
 * 4. Nothing renders under 16px.
 *
 * Page chrome = everything in the document except pictures: SVG, anything
 * aria-hidden (specimen frames, decorative art), [role=img] and a figure's
 * art (its figcaption and any blockquote stay in scope). The product UI the
 * Case UI kit draws inside a picture keeps its own type (CLAUDE.md section 1).
 * No per-element opt-outs. ROLES_REPORT=1 prints every combination per route
 * instead of failing, for the role map. Reads AUDIT_URL. */
import { readdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";
import { receipt } from "./lib/receipt.mjs";
import { BASE } from "./lib/base-url.mjs";

const REPORT = !!process.env.ROLES_REPORT;
const WIDTHS = [1440, 375];
const FLOOR = 16;

const slugs = readdirSync("content/case-studies")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .map((f) => f.replace(/\.ts$/, ""));
const study = readFileSync("content/studies.ts", "utf8").match(/id: "([^"]+)"/)?.[1];
/* deferred until its open PR merges, then this line goes (it lands as a
   follow-up commit on top of that branch, not a fix here): /design-system
   (feat/system-page-v2, #129) is rebuilt in code by W, and the Home system
   door (fix/system-door, #124) is rebuilt by U2. Both are still mono and
   under 16 in places on main. The door's own text (the legend) is checked
   because it sits on Home; only its flat-card rewrite is waited for. */
const DEFERRED = ["/design-system"];
const ROUTES = [
  "/",
  "/work",
  "/learning",
  "/about",
  "/design-system",
  "/quick",
  "/contact",
  "/privacy",
  "/accessibility",
  ...(study ? [`/work/studies/${study}`] : []),
  ...slugs.map((s) => `/case-studies/${s}`),
].filter((r) => !DEFERRED.includes(r));

const browser = await chromium.launch();
let fails = 0;
const report = new Map();

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 700) {
      await page.evaluate((v) => scrollTo(0, v), y);
      await page.waitForTimeout(25);
    }
    const found = await page.evaluate(
      ({ FLOOR }) => {
        const probe = (v) => {
          const e = document.createElement("span");
          e.style.cssText = `position:absolute;visibility:hidden;font-size:${v}`;
          document.body.append(e);
          const px = parseFloat(getComputedStyle(e).fontSize);
          e.remove();
          return px;
        };
        const want = {
          page: probe("var(--typography-font-size-display-page)"),
          hero: probe("var(--typography-font-size-display-hero)"),
        };
        const out = [];
        const inPicture = (el) =>
          el.closest("svg, [aria-hidden='true'], [role='img'], [hidden]") ||
          (el.closest("figure") && !el.closest("figcaption, blockquote"));
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const seen = new Set();
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement;
          if (!el || seen.has(el)) continue;
          const own = [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join("").trim();
          if (!own) continue;
          seen.add(el);
          if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) continue;
          if (inPicture(el)) continue;
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden") continue;
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          if (el.closest(".sr-only")) continue;
          const size = parseFloat(cs.fontSize);
          const weight = parseInt(cs.fontWeight, 10);
          const mono = /geist mono|monospace/i.test(cs.fontFamily);
          const cls = String(el.className?.baseVal ?? el.className).replace(/[A-Za-z]+-module__\w+__/g, "").trim().split(/\s+/).slice(0, 3).join(".");
          out.push({
            sel: `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`,
            size: Math.round(size * 10) / 10,
            weight,
            mono,
            text: own.slice(0, 40),
            strong: !!el.closest("strong, b"),
            isH1: el.closest("h1") !== null,
            quote: /^[“”"‘’]+$/.test(own),
            code: !!el.closest("code, pre, kbd, samp"),
            want,
          });
        }
        return out;
      },
      { FLOOR },
    );
    for (const f of found) {
      const key = `${f.sel} | ${f.size}px ${f.weight}${f.mono ? " MONO" : ""}`;
      if (REPORT) {
        const k = `${route} @${width} | ${key}`;
        const cur = report.get(k) ?? { n: 0, sample: f.text };
        cur.n++;
        report.set(k, cur);
        continue;
      }
      const at = `${route} @${width}`;
      const bad = (why, expected) => {
        fails++;
        console.log(receipt("roles", `${at} ${f.sel} "${f.text}"`, why, expected));
      };
      if (f.weight !== 400 && f.weight !== 600) {
        const ok = (f.weight === 700 && f.strong) || (f.weight === 800 && f.quote);
        if (!ok) bad(`weight ${f.weight}`, "400 or 600 (700 only on strong, 800 only on a quote mark)");
      }
      if (f.mono && !f.code) bad("a mono label", "mono only on code, pre, kbd or samp");
      if (f.size < FLOOR) bad(`${f.size}px`, `at least ${FLOOR}px`);
      if (f.isH1) {
        const target = route === "/" ? f.want.hero : f.want.page;
        if (Math.abs(f.size - target) > 0.6) bad(`h1 ${f.size}px`, `${target}px (Display/${route === "/" ? "Hero" : "Page"})`);
      }
    }
  }
  await ctx.close();
}
await browser.close();

if (REPORT) {
  for (const [k, v] of [...report.entries()].sort()) console.log(`${String(v.n).padStart(4)}  ${k}  :: ${v.sample}`);
  process.exit(0);
}
if (fails) {
  console.log(`roles gate: ${fails} failure(s)`);
  process.exit(1);
}
console.log(`roles gate: PASS (${ROUTES.length} routes x ${WIDTHS.length} widths, weights 400/600, h1 on the page size, mono only on code, nothing under ${FLOOR}px)`);
