/* The clip sweep (Elleta, 5 Oct 2026, job 34: "clipping on buttons, all
 * the same problems, please do better"). audit:contain skips content an
 * ancestor hides on purpose; this checks exactly that content. Every
 * route, at 1440, 1280, 1110, 1024 and 390, both themes, with every
 * animation forced to its end state:
 *
 * 1. Partly visible: a text holder (an element with its own text) or a
 *    control (a, button, input, select, textarea, [role=button], [role=tab])
 *    whose box is cut by an ancestor that hides it: overflow hidden or
 *    clip, a clip-path, or a mask (fades included). Visible share between
 *    1% and 99% fails. Fully hidden (0%) is a window onto a bigger
 *    drawing; fully visible is fine. The walk stops at a scroller
 *    (overflow auto or scroll): what a reader can scroll to is not cut.
 * 2. Self-clipped: a text holder that hides its own overflow while its
 *    text is wider or taller than its box (an ellipsis counts).
 * 3. Silent scroller: a horizontal scroller that holds text but cannot be
 *    reached by keyboard (no tabindex) or has no name (aria-label or
 *    aria-labelledby). A swipe track of links is reachable through them
 *    and passes.
 * .sr-only and invisible elements are skipped. Reads AUDIT_URL. */
import { readdirSync } from "node:fs";
import { chromium } from "playwright";
import { BASE } from "./lib/base-url.mjs";

const WIDTHS = [1440, 1280, 1110, 1024, 390];
const THEMES = ["light", "dark"];
const slugs = readdirSync("content/case-studies")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .map((f) => f.replace(/\.ts$/, ""));
const studies = ["stock-screener", "race-day", "insurance-forms", "legal-search"];
const ROUTES = (process.env.ROUTES?.split(",") ?? [
  "/",
  "/work",
  "/learning",
  "/about",
  "/design-system",
  "/quick",
  "/contact",
  "/privacy",
  "/accessibility",
  "/no-such-page",
  "/design-system/inspector",
  ...studies.map((id) => `/work/studies/${id}`),
  ...slugs.map((s) => `/case-studies/${s}`),
]);

const END_STATE = `*, *::before, *::after {
  animation-delay: 0s !important; animation-duration: 0s !important;
  animation-iteration-count: 1 !important; transition: none !important; }`;

const browser = await chromium.launch();
const fails = [];
for (const theme of THEMES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: "reduce" });
    await page.addInitScript((t) => {
      try {
        localStorage.setItem("theme", t);
      } catch {}
    }, theme);
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
      await page.addStyleTag({ content: END_STATE });
      /* scroll through so in-view effects reach their final frame */
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        scrollTo(0, 0);
      });
      await page.waitForTimeout(300);
      const found = await page.evaluate(() => {
        const out = [];
        const CONTROL = "a[href], button, input, select, textarea, [role=button], [role=tab]";
        const shown = (el) => {
          if (el.closest(".sr-only, details:not([open]) > :not(summary)")) return false;
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0;
        };
        const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        const name = (el) =>
          `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0].replace(/^.*?__/, "").slice(0, 28) : ""} "${(el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 32)}"`;
        const scroller = (cs) => /(auto|scroll)/.test(cs.overflowX) || /(auto|scroll)/.test(cs.overflowY);
        const hides = (cs) =>
          /(hidden|clip)/.test(cs.overflowX) ||
          /(hidden|clip)/.test(cs.overflowY) ||
          cs.clipPath !== "none" ||
          (cs.maskImage && cs.maskImage !== "none") ||
          (cs.webkitMaskImage && cs.webkitMaskImage !== "none");
        for (const el of document.querySelectorAll("body *")) {
          const isText = ownText(el);
          const isControl = el.matches(CONTROL);
          if ((!isText && !isControl) || el.closest("svg") || !shown(el)) continue;
          const r = el.getBoundingClientRect();
          let box = { l: r.left, t: r.top, r: r.right, b: r.bottom };
          let cutBy = null;
          for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
            const cs = getComputedStyle(a);
            if (scroller(cs)) break;
            if (cs.position === "fixed") break;
            if (!hides(cs)) continue;
            const ar = a.getBoundingClientRect();
            const next = { l: Math.max(box.l, ar.left), t: Math.max(box.t, ar.top), r: Math.min(box.r, ar.right), b: Math.min(box.b, ar.bottom) };
            if (next.r - next.l < box.r - box.l - 0.5 || next.b - next.t < box.b - box.t - 0.5) cutBy = cutBy ?? a;
            box = next;
          }
          const area = r.width * r.height;
          const vis = Math.max(0, box.r - box.l) * Math.max(0, box.b - box.t);
          const share = vis / area;
          if (cutBy && share > 0.01 && share < 0.99)
            out.push(["partly visible", name(el), `${Math.round(share * 100)}% visible, cut by ${name(cutBy).split(" ")[0]}`]);
          if (isText) {
            const cs = getComputedStyle(el);
            if (/(hidden|clip)/.test(cs.overflowX + cs.overflowY) && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1))
              out.push(["self-clipped", name(el), `content ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`]);
          }
        }
        for (const s of document.querySelectorAll("main *")) {
          const cs = getComputedStyle(s);
          if (!/(auto|scroll)/.test(cs.overflowX) || s.scrollWidth <= s.clientWidth + 1 || !shown(s)) continue;
          if (s.querySelector("a[href], button")) continue;
          if (!s.textContent.trim()) continue;
          const reachable = s.hasAttribute("tabindex");
          const named = s.hasAttribute("aria-label") || s.hasAttribute("aria-labelledby");
          if (!reachable || !named) out.push(["silent scroller", name(s), `${reachable ? "" : "no tabindex "}${named ? "" : "no name"}`.trim()]);
        }
        return out;
      });
      for (const [kind, el, detail] of found) fails.push(`${theme} ${width} ${route} ${kind}: ${el}: ${detail}`);
    }
    await page.close();
  }
}
await browser.close();
for (const f of fails) console.log(`clip-sweep: ${f}`);
console.log(fails.length ? `clip sweep: ${fails.length} failure(s)` : `clip sweep: PASS (${ROUTES.length} routes x ${WIDTHS.length} widths x 2 themes)`);
process.exit(fails.length ? 1 : 0);
