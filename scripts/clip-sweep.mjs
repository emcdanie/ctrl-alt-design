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
 * 4. Too small (job 38, 5 Oct 2026): rendered text under 12px effective,
 *    font-size times every scale on the way to the screen: transform,
 *    scale and zoom on each ancestor, an SVG's viewBox (getScreenCTM), and
 *    the scale on an iframe for text inside the demo it holds. Text cut
 *    to nothing by an ancestor is not rendered and is skipped.
 * Every pass runs with reduced motion and without it (job 38): animations
 * are forced to their end state either way, so the difference is what the
 * page itself does under prefers-reduced-motion.
 * .sr-only and invisible elements are skipped. Reads AUDIT_URL. */
import { readdirSync } from "node:fs";
import { chromium } from "playwright";
import { BASE } from "./lib/base-url.mjs";

const WIDTHS = [1440, 1280, 1110, 1024, 390];
const THEMES = ["light", "dark"];
const MOTIONS = ["reduce", "no-preference"];
const MIN_PX = 12;
/* No allowlist: the Theming hero collage that needed one (job 38) is
   drawn at 1:1 since audit fix D3 (5 Oct 2026). */
const ALLOW = [];
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

/* one page (or one demo iframe, sizeOnly) -> [kind, element, detail] */
const sweep = ({ MIN, sizeOnly, allow = [] }) => {
    const allowed = (el) => allow.some((sel) => el.closest(sel));
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
    /* every scale between an element and the screen */
    const scaleOf = (el) => {
      let k = 1;
      for (let a = el; a; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.transform && cs.transform !== "none") {
          const m = new DOMMatrix(cs.transform);
          k *= Math.hypot(m.a, m.b);
        }
        if (cs.scale && cs.scale !== "none") k *= parseFloat(cs.scale);
        const z = parseFloat(cs.zoom);
        if (z && z !== 1) k *= z;
      }
      return k * (window.__frameScale ?? 1);
    };
    /* SVG text: font-size through the viewBox and every transform */
    for (const t of document.querySelectorAll("svg text")) {
      if (!t.textContent.trim() || t.closest(".sr-only")) continue;
      const r = t.getBoundingClientRect();
      const cs = getComputedStyle(t);
      if (r.width < 1 || r.height < 1 || cs.visibility === "hidden" || cs.display === "none") continue;
      const m = t.getScreenCTM(); /* includes CSS transforms on HTML ancestors */
      if (!m) continue;
      const px = parseFloat(cs.fontSize) * Math.hypot(m.a, m.b) * (window.__frameScale ?? 1);
      if (px < MIN - 0.05 && !allowed(t)) out.push(["too small", `svg ${name(t)}`, `${px.toFixed(1)}px`]);
    }
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
      if (isText && share > 0.01) {
        const px = parseFloat(getComputedStyle(el).fontSize) * scaleOf(el);
        if (px < MIN - 0.05 && !allowed(el)) out.push(["too small", name(el), `${px.toFixed(1)}px`]);
      }
      if (sizeOnly) continue;
      if (cutBy && share > 0.01 && share < 0.99)
        out.push(["partly visible", name(el), `${Math.round(share * 100)}% visible, cut by ${name(cutBy).split(" ")[0]}`]);
      if (isText) {
        const cs = getComputedStyle(el);
        if (/(hidden|clip)/.test(cs.overflowX + cs.overflowY) && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1))
          out.push(["self-clipped", name(el), `content ${el.scrollWidth}x${el.scrollHeight} in ${el.clientWidth}x${el.clientHeight}`]);
      }
    }
    for (const s of sizeOnly ? [] : document.querySelectorAll("main *")) {
      const cs = getComputedStyle(s);
      if (!/(auto|scroll)/.test(cs.overflowX) || s.scrollWidth <= s.clientWidth + 1 || !shown(s)) continue;
      if (s.querySelector("a[href], button")) continue;
      if (!s.textContent.trim()) continue;
      const reachable = s.hasAttribute("tabindex");
      const named = s.hasAttribute("aria-label") || s.hasAttribute("aria-labelledby");
      if (!reachable || !named) out.push(["silent scroller", name(s), `${reachable ? "" : "no tabindex "}${named ? "" : "no name"}`.trim()]);
    }
    return out;
};

const browser = await chromium.launch();
const fails = [];
const small = new Map(); // "route el size" -> passes it failed in (one line each)
for (const motion of MOTIONS) for (const theme of THEMES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: motion });
    const pass = `${theme} ${width}${motion === "reduce" ? "" : " motion"}`;
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
      const allow = ALLOW.filter((a) => a.route === route && a.kind === "too small").map((a) => a.selector);
      const found = await page.evaluate(sweep, { MIN: MIN_PX, sizeOnly: false, allow });
      /* text inside a demo iframe, at the scale the iframe is drawn */
      for (const frame of page.frames()) {
        if (frame === page.mainFrame()) continue;
        const host = await frame.frameElement().catch(() => null);
        if (!host) continue;
        const k = await host.evaluate((f) => {
          let k = 1;
          for (let a = f; a; a = a.parentElement) {
            const cs = getComputedStyle(a);
            if (cs.transform && cs.transform !== "none") { const m = new DOMMatrix(cs.transform); k *= Math.hypot(m.a, m.b); }
            if (cs.scale && cs.scale !== "none") k *= parseFloat(cs.scale);
            const z = parseFloat(cs.zoom); if (z && z !== 1) k *= z;
          }
          const r = f.getBoundingClientRect();
          return r.width > 1 && r.height > 1 ? k : 0;
        });
        if (!k) continue;
        const src = (await host.getAttribute("src")) ?? "iframe";
        const inner = await frame.evaluate((a) => { window.__frameScale = a.k; return 0; }, { k }).then(() => frame.evaluate(sweep, { MIN: MIN_PX, sizeOnly: true })).catch(() => []);
        for (const [kind, el, detail] of inner) found.push([kind, `${src.split("?")[0]} ${el}`, detail]);
      }
      for (const [kind, el, detail] of found) {
        if (kind !== "too small") { fails.push(`${pass} ${route} ${kind}: ${el}: ${detail}`); continue; }
        const key = `${route} too small: ${el}: ${detail}`;
        small.set(key, [...(small.get(key) ?? []), pass]);
      }
    }
    await page.close();
  }
}
await browser.close();
/* text size does not change with theme: one line per element, its passes listed */
for (const [key, passes] of small) fails.push(`${key} (under ${MIN_PX}px; ${passes.length} pass(es): ${[...new Set(passes.map((p) => p.replace(/^(light|dark) /, "")))].join(", ")})`);
for (const a of ALLOW) console.log(`clip-sweep: ALLOWLISTED (${a.date}) ${a.route} ${a.selector} ${a.kind}: ${a.reason}`);
for (const f of fails) console.log(`clip-sweep: ${f}`);
console.log(fails.length ? `clip sweep: ${fails.length} failure(s)` : `clip sweep: PASS (${ROUTES.length} routes x ${WIDTHS.length} widths x 2 themes x ${MOTIONS.length} motion settings)`);
process.exit(fails.length ? 1 : 0);
