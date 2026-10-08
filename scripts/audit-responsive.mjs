/* Responsive baseline (LD6, Elleta 8 Oct 2026, plan #136). REPORT-ONLY until
 * the LD5 / LD6b fixes land; then it turns blocking (STRICT=1). Every route
 * at 320, 375, 768, 1024 and 1440, both themes, animations at their end
 * state. Reads AUDIT_URL.
 * 1. Overflow: the document is wider than the viewport (scrollWidth over
 *    clientWidth). A scroller the page makes on purpose (overflow auto or
 *    scroll on an ancestor) does not count.
 * 2. Text under the floor: rendered text under 16px effective (font-size
 *    times every scale to the screen). Body 20, small 18 are audit:type's.
 * 3. Targets: a link or control under 24px either way fails; under 44px is
 *    counted as "small" for primary and secondary buttons (.btn, button).
 * No per-element opt-out. */
import { readdirSync } from "node:fs";
import { chromium } from "playwright";
import { BASE } from "./lib/base-url.mjs";

const WIDTHS = (process.env.WIDTHS ?? "320,375,768,1024,1440").split(",").map(Number);
const THEMES = ["light", "dark"];
const STRICT = process.env.STRICT === "1";
const slugs = readdirSync("content/case-studies").filter((f) => f.endsWith(".ts") && f !== "index.ts").map((f) => f.replace(/\.ts$/, ""));
const studies = ["stock-screener", "race-day", "insurance-forms", "legal-search"];
const ROUTES = process.env.ROUTES?.split(",") ?? [
  "/", "/work", "/learning", "/about", "/design-system", "/quick", "/contact", "/privacy",
  "/accessibility", "/no-such-page", "/design-system/inspector",
  ...studies.map((id) => `/work/studies/${id}`), ...slugs.map((s) => `/case-studies/${s}`),
];
const END_STATE = `*, *::before, *::after { animation-delay: 0s !important; animation-duration: 0s !important; animation-iteration-count: 1 !important; transition: none !important; }`;

const measure = () => {
  const out = [];
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) out.push(["overflow", "html", `${de.scrollWidth}px wide in ${de.clientWidth}px`]);
  const label = (el) => `${el.tagName.toLowerCase()}${typeof el.className === "string" && el.className ? "." + el.className.split(" ")[0].replace(/^.*?__/, "").slice(0, 24) : ""} "${(el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28)}"`;
  const shown = (el) => {
    if (el.closest(".sr-only")) return false;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none" && parseFloat(cs.opacity) > 0;
  };
  const scaleOf = (el) => {
    let k = 1;
    for (let a = el; a; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.transform && cs.transform !== "none") k *= Math.hypot(...[new DOMMatrix(cs.transform)].map((m) => [m.a, m.b])[0]);
      const z = parseFloat(cs.zoom);
      if (z && z !== 1) k *= z;
    }
    return k;
  };
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest("svg") || !shown(el)) continue;
    if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
      const px = parseFloat(getComputedStyle(el).fontSize) * scaleOf(el);
      if (px < 15.95) out.push(["text under 16px", label(el), `${px.toFixed(1)}px`]);
    }
    if (el.matches("a[href], button, [role=button], [role=tab], input, select, textarea")) {
      const r = el.getBoundingClientRect();
      const inline = el.matches("a[href]") && getComputedStyle(el).display === "inline" && el.closest("p, li");
      if (inline) continue; /* WCAG 2.2 2.5.8: inline links in a sentence are exempt */
      const w = Math.round(r.width), h = Math.round(r.height);
      if (w < 24 || h < 24) out.push(["target under 24px", label(el), `${w}x${h}`]);
      else if (el.matches("button, .btn, [class*=btn], [class*=button]") && (w < 44 || h < 44)) out.push(["target under 44px", label(el), `${w}x${h}`]);
    }
  }
  return out;
};

const browser = await chromium.launch();
const rows = [];
for (const theme of THEMES) for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, colorScheme: theme, reducedMotion: "reduce" });
  await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch {} document.documentElement.dataset.theme = t; }, theme);
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: END_STATE });
    await page.evaluate(() => { document.documentElement.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; });
    for (const [kind, el, detail] of await page.evaluate(measure)) rows.push({ route, width, theme, kind, el, detail });
  }
  await ctx.close();
}
await browser.close();

const by = {};
for (const r of rows) (by[r.kind] ??= {}), (by[r.kind][r.route] ??= []).push(r);
for (const [kind, routes] of Object.entries(by)) {
  console.log(`\n${kind}: ${Object.values(routes).flat().length}`);
  for (const [route, rs] of Object.entries(routes)) {
    const widths = [...new Set(rs.map((r) => r.width))].join("/");
    console.log(`  ${route}  (${rs.length}; at ${widths})  e.g. ${rs[0].el} ${rs[0].detail}`);
  }
}
const hard = rows.filter((r) => r.kind !== "target under 44px");
console.log(`\nresponsive baseline: ${rows.length} finding(s), ${hard.length} hard (${ROUTES.length} routes x ${WIDTHS.length} widths x 2 themes)`);
process.exit(STRICT && hard.length ? 1 : 0);
