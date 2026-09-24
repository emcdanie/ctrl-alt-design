/* The contain gate (Elleta, 22 Sep 2026, after the Drift badge matrix,
 * the users & roles pins and the token cascade spilled out of their
 * panels). audit:frame checks the page's frame; this checks what sits
 * INSIDE a picture. Every route, one case of each slug, at 1440, 1024
 * and 390, in both themes, and in every tab state (the page as loaded,
 * then after each [role=tab]):
 *
 * 1. Contained: for every panel or figure in main (figure, .exhibit,
 *    .panel, and any class ending in "panel"), no visible descendant's
 *    box leaves the panel's content box (the border box minus its
 *    padding), by more than 1px. A panel is a visible box (background,
 *    border or shadow). SVG shapes count too, and a shape straddling its
 *    SVG's viewBox edge is cut off, which also fails; a shape wholly outside
 *    is a window onto a bigger drawing. Clipping on purpose (an HTML
 *    ancestor that hides overflow, an SVG clip-path or mask) is not counted.
 * 2. Clear of controls: no pin or badge (a class naming "pin" or "badge")
 *    overlaps a button or link it is not part of, or a control drawn in
 *    a picture (an SVG .lc group, the "looks clickable" outline).
 * 3. Text in its box (24 Sep 2026 audit, A8): every visible text node
 *    on the page, nav and footer included, stays inside its nearest
 *    bordered or backgrounded ancestor, by 1px. A background clipped to
 *    the text itself is not a box, nor is an inline span (a decoration
 *    on its line); an ancestor that hides overflow already keeps the
 *    text in, and a closed <details> shows none of its content. SVG text has no box ancestor, so its box
 *    is the smallest rect in the same drawing that holds the text's
 *    first letter, measured to the inside of its stroke with 0.25px of
 *    slack: a label never touches or crosses its frame.
 * 4. The receipt: theme, width, route, element, measured, expected.
 *
 * Browser audit: reads AUDIT_URL like the others. */
import { readdirSync } from "node:fs";
import { chromium } from "playwright";
import { receipt } from "./lib/receipt.mjs";
import { BASE } from "./lib/base-url.mjs";

const WIDTHS = [1440, 1024, 390];
const THEMES = ["light", "dark"];

const slugs = readdirSync("content/case-studies")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .map((f) => f.replace(/\.ts$/, ""));
/* the studies with a page (the same four as audit:axe; the first id in
   content/studies.ts has no page, so it used to audit a 404) */
const studies = ["stock-screener", "race-day", "insurance-forms", "legal-search"];
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
  "/no-such-page",
  "/design-system/inspector",
  ...studies.map((id) => `/work/studies/${id}`),
  ...slugs.map((s) => `/case-studies/${s}`),
];

/* runs in the page */
function check() {
  const out = [];
  const name = (el) => {
    const cls = String(el.className?.baseVal ?? el.className ?? "").trim().split(/\s+/)[0];
    const text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 24);
    return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}${text ? ` "${text}"` : ""}`;
  };
  const shown = (el) => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const c = getComputedStyle(n);
      if (c.display === "none" || c.visibility === "hidden" || +c.opacity === 0) return false;
    }
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  /* a CSS-module class without its hash and BEM block: "Foo-module__panel_x1y2z" -> "panel" */
  const base = (c) => c.replace(/_[A-Za-z0-9]{5,}$/, "").replace(/^.*__/, "");
  /* a panel is a visible box: a background, a border or a shadow */
  const boxed = (el) => {
    const c = getComputedStyle(el);
    return (
      !/rgba\(0, 0, 0, 0\)|transparent/.test(c.backgroundColor) ||
      parseFloat(c.borderTopWidth) + parseFloat(c.borderLeftWidth) > 0 ||
      c.boxShadow !== "none"
    );
  };
  const isPanel = (el) =>
    (el.tagName === "FIGURE" || [...el.classList].some((c) => c === "exhibit" || c === "panel" || /panel$/i.test(base(c)))) && boxed(el);
  const SHAPES = "rect, circle, ellipse, line, path, polygon, polyline, text";
  const past = (r, b) => Math.max(b.l - r.left, r.right - b.r, b.t - r.top, r.bottom - b.b);
  const panels = [...document.querySelectorAll("main *")].filter((el) => isPanel(el) && shown(el));

  /* 1. contained */
  for (const p of panels) {
    const pr = p.getBoundingClientRect();
    const pc = getComputedStyle(p);
    const box = {
      l: pr.left + parseFloat(pc.borderLeftWidth) + parseFloat(pc.paddingLeft),
      r: pr.right - parseFloat(pc.borderRightWidth) - parseFloat(pc.paddingRight),
      t: pr.top + parseFloat(pc.borderTopWidth) + parseFloat(pc.paddingTop),
      b: pr.bottom - parseFloat(pc.borderBottomWidth) - parseFloat(pc.paddingBottom),
    };
    for (const el of p.querySelectorAll("*")) {
      const svg = el.closest("svg");
      if (svg && el !== svg && !el.matches(SHAPES)) continue;
      if (!shown(el)) continue;
      /* a nested panel is checked on its own */
      let near = el.parentElement;
      while (near && near !== p && !isPanel(near)) near = near.parentElement;
      if (near !== p) continue;
      /* clipped on purpose by an HTML ancestor between it and the panel */
      let clipped = false;
      for (let a = (svg && el !== svg ? svg : el).parentElement; a && a !== p; a = a.parentElement) {
        const o = getComputedStyle(a);
        if (o.overflowX !== "visible" || o.overflowY !== "visible") {
          clipped = true;
          break;
        }
      }
      if (clipped) continue;
      let r = el.getBoundingClientRect();
      if (svg && el !== svg && getComputedStyle(svg).overflow !== "visible") {
        const sr = svg.getBoundingClientRect();
        /* straddling the edge is cut off; wholly outside is a window onto a bigger drawing */
        const straddles = r.right > sr.left && r.left < sr.right && r.bottom > sr.top && r.top < sr.bottom;
        if (!straddles) continue;
        const cut = past(r, { l: sr.left, r: sr.right, t: sr.top, b: sr.bottom });
        if (cut > 1 && !el.parentElement.closest("[clip-path], [mask]")) {
          out.push([`${name(el)} in ${name(p)}`, `${Math.round(cut)}px past its SVG's viewBox (cut off)`, "every shape inside its picture"]);
          break;
        }
        /* what shows is what the SVG's viewport lets through */
        r = {
          left: Math.max(r.left, sr.left),
          right: Math.min(r.right, sr.right),
          top: Math.max(r.top, sr.top),
          bottom: Math.min(r.bottom, sr.bottom),
        };
      }
      const over = past(r, box);
      if (over > 1) {
        out.push([`${name(el)} in ${name(p)}`, `${Math.round(over)}px outside the panel's content box`, "inside its panel's padding"]);
        break; /* one receipt per panel: the first offender */
      }
    }
  }

  /* 2. clear of controls */
  const marks = [...document.querySelectorAll("main *")].filter(
    (el) => shown(el) && [...el.classList].some((c) => /(^|[-_])(pin|badge)($|[-_])/i.test(base(c)))
  );
  const controls = [
    ...[...document.querySelectorAll("main a[href], main button")].filter(shown),
    /* drawn controls: the geometry counts even while the outline is hidden */
    ...[...document.querySelectorAll("main svg .lc")].filter((g) => g.getBoundingClientRect().width > 0 && shown(g.closest("svg"))),
  ];
  for (const m of marks) {
    const mr = m.getBoundingClientRect();
    for (const c of controls) {
      if (c === m || c.contains(m) || m.contains(c)) continue;
      const cr = c.getBoundingClientRect();
      const w = Math.min(mr.right, cr.right) - Math.max(mr.left, cr.left);
      const h = Math.min(mr.bottom, cr.bottom) - Math.max(mr.top, cr.top);
      if (w > 1 && h > 1) {
        out.push([`${name(m)} over ${c.closest("svg") ? "drawn control " : ""}${name(c)}`, `${Math.round(w)}x${Math.round(h)}px overlap`, "pins and badges never cover a control"]);
        break;
      }
    }
  }
  /* 3. text in its box */
  const transparent = (c) => /rgba\(0, 0, 0, 0\)|transparent/.test(c);
  const isBox = (el) => {
    const c = getComputedStyle(el);
    if (c.backgroundClip === "text" || c.webkitBackgroundClip === "text") return false;
    /* an inline span (a linked phrase, a highlight) is a decoration on
       its line, not a container: a smaller face inside it overshoots its
       line box without leaving anything */
    if (c.display === "inline") return false;
    return (
      !transparent(c.backgroundColor) ||
      c.backgroundImage !== "none" ||
      ["Top", "Right", "Bottom", "Left"].some((d) => parseFloat(c[`border${d}Width`]) > 0 && c[`border${d}Style`] !== "none")
    );
  };
  const clips = (el) => {
    const c = getComputedStyle(el);
    return c.overflowX !== "visible" || c.overflowY !== "visible";
  };
  const range = document.createRange();
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seenBox = new Set();
  while (walk.nextNode()) {
    const node = walk.currentNode;
    if (!node.textContent.trim()) continue;
    const host = node.parentElement;
    if (!host || host.closest("svg, script, style, noscript, .sr-only") || !shown(host)) continue;
    /* a closed <details> keeps a layout box for its hidden content */
    if (host.closest("details:not([open])") && !host.closest("summary")) continue;
    let box = host;
    let held = false;
    for (; box && box !== document.body && box !== document.documentElement; box = box.parentElement) {
      if (isBox(box)) break;
      if (clips(box)) {
        held = true;
        break;
      }
    }
    if (held || !box || box === document.body || box === document.documentElement || clips(box) || seenBox.has(box)) continue;
    const b = box.getBoundingClientRect();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (!r.width || !r.height) continue;
      const over = past(r, { l: b.left, r: b.right, t: b.top, b: b.bottom });
      if (over > 1) {
        seenBox.add(box);
        out.push([`"${node.textContent.trim().slice(0, 32)}" in ${name(box)}`, `${Math.round(over)}px outside its box`, "text inside its bordered or backgrounded box"]);
        break;
      }
    }
  }
  for (const t of document.querySelectorAll("svg text")) {
    if (!shown(t)) continue;
    const tr = t.getBoundingClientRect();
    if (!tr.width) continue;
    const svg = t.closest("svg");
    /* the first letter: a few px in from the start edge, mid-height */
    const px = tr.left + Math.min(4, tr.width / 2);
    const py = tr.top + tr.height / 2;
    let frame = null;
    let area = Infinity;
    for (const rect of svg.querySelectorAll("rect")) {
      if (rect.closest("clipPath, mask, defs, pattern") || !shown(rect)) continue;
      const rr = rect.getBoundingClientRect();
      if (px < rr.left || px > rr.right || py < rr.top || py > rr.bottom) continue;
      if (rr.width * rr.height < area) {
        area = rr.width * rr.height;
        const sc = getComputedStyle(rect);
        const scale = rr.width / (rect.width.baseVal.value || rr.width);
        frame = { left: rr.left, right: rr.right, top: rr.top, bottom: rr.bottom, stroke: sc.stroke === "none" ? 0 : parseFloat(sc.strokeWidth) * scale };
      }
    }
    if (!frame) continue;
    /* the inside of the frame's stroke: a label touching the line has
       already crossed it */
    const inset = frame.stroke / 2;
    const over = past(tr, { l: frame.left + inset, r: frame.right - inset, t: frame.top + inset, b: frame.bottom - inset });
    /* 0.25px, not 1: the Drift cascade label that crossed its frame
       (A7) sat 0.72px into the stroke at 1440, so 1px let it pass */
    if (over > 0.25) out.push([`svg text "${t.textContent.trim().slice(0, 32)}"`, `${Math.round(over)}px past its frame`, "every label inside the shape it sits in"]);
  }
  return out;
}

let fails = 0;
const browser = await chromium.launch();

for (const theme of THEMES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce", colorScheme: theme });
    await ctx.addInitScript((t) => {
      try {
        localStorage.setItem("theme", t);
      } catch {}
    }, theme);
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
      /* reduced motion shows every final frame; settle anything still easing */
      await page.waitForTimeout(150);
      const tabs = await page.locator("main [role='tab']").count();
      const found = [];
      for (let t = -1; t < tabs; t++) {
        if (t >= 0) {
          await page.locator("main [role='tab']").nth(t).click();
          await page.waitForTimeout(300);
        }
        const state = t >= 0 ? ` [tab ${t + 1}]` : "";
        for (const [o, g, e] of await page.evaluate(check)) found.push([o + state, g, e]);
      }
      const seen = new Set();
      for (const [offender, got, expected] of found) {
        const key = offender.replace(/ \[tab \d+\]$/, "");
        if (seen.has(key)) continue;
        seen.add(key);
        fails++;
        console.error(receipt("contain", `(${theme} ${width} ${route}) ${offender}`, got, expected));
      }
    }
    await ctx.close();
  }
}
await browser.close();

if (fails) {
  console.error(`contain gate: ${fails} failure(s)`);
  process.exit(1);
}
console.log(`contain gate: PASS (${ROUTES.length} routes x ${WIDTHS.length} widths x ${THEMES.length} themes, every tab state)`);
