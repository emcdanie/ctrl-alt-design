/* Visual assertions gate (system-page-v3, Elleta 21 Jul 2026). Her
 * briefs named audit:visual three times; it now exists. Three checks:
 * 1. ONE GROUND: every /design-system band's computed background
 *    equals the page ground, both themes, EXCEPT the identity band's
 *    recorded low-tint wash (Elleta's call). No band ever gains a
 *    surface again.
 * 2. SPECIMEN ALIGNMENT: sibling specimen cards in a row render equal
 *    heights (grid stretch, fixed head slots).
 * 3. COVER PLACEHOLDERS: >= 3:1 large-text against both stops of the
 *    token gradient, both themes (moved here from contrast-check; one
 *    home for visual assertions).
 * 4. CONTAINMENT (Phase 2 rebuild, 22 Jul, supersedes the border-box
 *    two-width check): card set = every .trace-host card (the .btn-key
 *    primaries are controls, not cards) AND .tok-inspector; boundary =
 *    the inner CONTENT box (padding respected), not the outer edge; NO
 *    clip-ancestor forgiveness, nothing may rely on the overflow clip.
 *    Width sweep = 1440/1200/1024/900/768/390 plus every column-count
 *    boundary of the specimen grid's auto-fit minmax(260px, 1fr),
 *    measured live, both themes. Proven red on pre-fix code (Select at
 *    1200, the agents code block at 768 and 390) before the fix.
 * 5. UNIFORMITY: all cards in one band grid share identical width and
 *    height, at every swept width.
 * 6. TRACE RING: the inspector ring keeps one equal offset from the
 *    keycap edge on all four sides (within 1px per side).
 */
import { chromium } from "playwright";

const browser = await chromium.launch();
let fails = 0;

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);

  /* ── 1 + 2: the System page ── */
  await page.goto("http://localhost:3000/design-system", { waitUntil: "networkidle", timeout: 30000 });
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 800) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(30);
  }

  const bandBad = await page.evaluate(() => {
    const pageBg = getComputedStyle(document.body).backgroundColor;
    const out = [];
    for (const band of document.querySelectorAll(".ds-band")) {
      if (band.classList.contains("ds-band--identity")) continue;
      const cs = getComputedStyle(band);
      const transparent = /rgba\(0, 0, 0, 0\)/.test(cs.backgroundColor);
      if ((!transparent && cs.backgroundColor !== pageBg) || cs.backgroundImage !== "none") {
        out.push(`${band.querySelector("h2")?.textContent ?? "band"}: ${cs.backgroundColor} / ${cs.backgroundImage.slice(0, 40)}`);
      }
    }
    return out;
  });
  for (const b of bandBad) {
    fails++;
    console.error(`VISUAL FAIL (${theme}) band surface off the page ground: ${b}`);
  }

  const rowBad = await page.evaluate(() => {
    const out = [];
    for (const grid of document.querySelectorAll(".ds-specimen-row, .ds-gate, .ds-caseband, .ds-status")) {
      const cards = [...grid.children].filter((c) => c.getBoundingClientRect().width > 0);
      /* group siblings by row (same top), assert equal heights */
      const rows = new Map();
      for (const c of cards) {
        const r = c.getBoundingClientRect();
        const key = Math.round(r.top);
        rows.set(key, [...(rows.get(key) ?? []), Math.round(r.height)]);
      }
      for (const [top, heights] of rows) {
        if (new Set(heights).size > 1) out.push(`row@${top}: heights ${heights.join(",")}`);
      }
    }
    return out;
  });
  for (const b of rowBad) {
    fails++;
    console.error(`VISUAL FAIL (${theme}) unequal specimen heights: ${b}`);
  }

  /* ── 4 + 5: containment + uniformity, width-swept ── */
  /* the sweep: six fixed widths plus every column-count boundary of
     the specimen grid (auto-fit minmax(260px, 1fr)). Card width is
     non-monotonic in viewport width: cards are at their narrowest just
     above each boundary, so the boundary and boundary+6 are the widths
     the old two-point sample never saw. Chrome (viewport minus grid)
     is measured live below the container cap, not hardcoded. */
  await page.setViewportSize({ width: 900, height: 900 });
  await page.waitForTimeout(200);
  const geom = await page.evaluate(() => {
    const grid = document.querySelector(".ds-specimen-row");
    if (!grid) return null;
    return {
      grid: grid.getBoundingClientRect().width,
      gap: parseFloat(getComputedStyle(grid).columnGap) || 0,
    };
  });
  const MINCOL = 260;
  const widths = new Set([1440, 1200, 1024, 900, 768, 390]);
  if (geom) {
    const chrome = 900 - geom.grid;
    for (let n = 2; n <= 6; n++) {
      const boundary = Math.round(n * MINCOL + (n - 1) * geom.gap + chrome);
      for (const w of [boundary, boundary + 6]) {
        if (w >= 390 && w <= 1440) widths.add(w);
      }
    }
  }
  for (const width of [...widths].sort((a, b) => b - a)) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(300);
    const results = await page.evaluate(() => {
      const out = { contain: [], uniform: [] };
      /* card set: every trace-host card AND the inspector. The btn-key
         primaries share the trace recipe but are controls, not cards. */
      const cards = [
        ...document.querySelectorAll(".trace-host:not(.btn-key)"),
        ...document.querySelectorAll(".tok-inspector"),
      ];
      for (const card of cards) {
        /* boundary = the inner CONTENT box: the glass panel for
           ui/Card (first child inside the 3px trace wrapper), the
           inspector's own box for .tok-inspector; padding respected. */
        const inner = card.classList.contains("tok-inspector") ? card : card.firstElementChild;
        if (!inner) continue;
        const cs = getComputedStyle(inner);
        const ir = inner.getBoundingClientRect();
        const box = {
          left: ir.left + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft),
          right: ir.right - parseFloat(cs.borderRightWidth) - parseFloat(cs.paddingRight),
          top: ir.top + parseFloat(cs.borderTopWidth) + parseFloat(cs.paddingTop),
          bottom: ir.bottom - parseFloat(cs.borderBottomWidth) - parseFloat(cs.paddingBottom),
        };
        for (const el of inner.querySelectorAll("*")) {
          /* raw rects, no clip-ancestor forgiveness: containment is by
             construction, nothing relies on an overflow clip. Judged on
             the PAINTED box: an element with no background, border, or
             shadow paints only its content, so its invisible padding
             (the 44px hit-area rule grows link padding) is not an
             escape; anything painted (chips, flags, fields) is judged
             on its full border box. */
          let r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          const ecs = getComputedStyle(el);
          const unpainted =
            /rgba\(0, 0, 0, 0\)/.test(ecs.backgroundColor) &&
            ecs.backgroundImage === "none" &&
            ecs.boxShadow === "none" &&
            [ecs.borderTopWidth, ecs.borderRightWidth, ecs.borderBottomWidth, ecs.borderLeftWidth].every((w) => parseFloat(w) === 0);
          if (unpainted) {
            r = {
              left: r.left + parseFloat(ecs.paddingLeft),
              right: r.right - parseFloat(ecs.paddingRight),
              top: r.top + parseFloat(ecs.paddingTop),
              bottom: r.bottom - parseFloat(ecs.paddingBottom),
            };
          }
          if (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1) {
            out.contain.push(`${(el.className.toString().split(" ")[0] || el.tagName)} escapes the content box by ${Math.round(Math.max(box.left - r.left, r.right - box.right, box.top - r.top, r.bottom - box.bottom))}px :: ${el.textContent.trim().slice(0, 24)}`);
          }
        }
      }
      for (const grid of document.querySelectorAll(".ds-specimen-row, .ds-gate, .ds-caseband, .ds-status")) {
        const dims = [...grid.querySelectorAll(":scope > * ")].filter((c) => c.getBoundingClientRect().width > 0)
          .map((c) => { const r = c.getBoundingClientRect(); return Math.round(r.width) + "x" + Math.round(r.height); });
        if (new Set(dims).size > 1) out.uniform.push(`grid dims differ: ${[...new Set(dims)].join(" vs ")}`);
      }
      return { contain: [...new Set(out.contain)].slice(0, 8), uniform: out.uniform.slice(0, 4) };
    });
    for (const b of results.contain) {
      fails++;
      console.error(`VISUAL FAIL (${theme} ${width}) containment: ${b}`);
    }
    for (const b of results.uniform) {
      fails++;
      console.error(`VISUAL FAIL (${theme} ${width}) uniformity: ${b}`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(200);

  /* ── 6: trace ring concentricity ── */
  const ringBad = await page.evaluate(() => {
    const key = document.querySelector(".tok-inspector__key");
    const ring = document.querySelector(".tok-inspector__ring");
    if (!key || !ring) return ["ring or keycap missing"];
    const k = key.getBoundingClientRect();
    const r = ring.getBoundingClientRect();
    const sides = {
      left: k.left - r.left, right: r.right - k.right,
      top: k.top - r.top, bottom: r.bottom - k.bottom,
    };
    const vals = Object.values(sides);
    const spread = Math.max(...vals) - Math.min(...vals);
    return spread > 1 ? [`ring offsets unequal: ${JSON.stringify(sides)}`] : [];
  });
  for (const b of ringBad) {
    fails++;
    console.error(`VISUAL FAIL (${theme}) trace ring: ${b}`);
  }

  /* ── 3: cover placeholders on /work ── */
  await page.goto("http://localhost:3000/work", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(500);
  const worst = await page.evaluate(() => {
    const lum = (m) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
    const parse = (str) => str.match(/\d+/g).map(Number).slice(0, 3);
    let min = Infinity;
    for (const ph of document.querySelectorAll('[class*="coverPlaceholder"]')) {
      const cs = getComputedStyle(ph);
      const stops = (cs.backgroundImage.match(/rgb\([^)]+\)/g) ?? []).map(parse);
      const ink = parse(cs.color);
      for (const g of stops) {
        const l1 = lum(ink), l2 = lum(g);
        min = Math.min(min, (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
      }
    }
    return min;
  });
  if (worst < 3) {
    fails++;
    console.error(`VISUAL FAIL (${theme}) cover placeholder worst ratio ${worst.toFixed(2)} < 3:1`);
  }
  await ctx.close();
}

/* ── DEAD-LINK SWEEP (curation, Elleta 22 Jul 2026): no dead routes,
   no dead links anywhere. On every route: (a) the archived case route
   strings must appear nowhere in the rendered DOM, (b) every internal
   <a href> must resolve below 400. Links are content, one theme
   suffices. ── */
{
  const ARCHIVED = [
    "/case-studies/guardian",
    "/case-studies/un-operational-dashboard",
    "/case-studies/filters-decision-support-system",
  ];
  const ROUTES = [
    "/", "/work", "/work?view=map", "/work?view=table", "/about", "/contact",
    "/skills", "/design-system", "/design-system/inspector", "/quick",
    "/case-studies/chip", "/case-studies/brad-frost",
    "/case-studies/design-system-transformation",
  ];
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const internal = new Map(); // path -> first route that links it
  for (const route of ROUTES) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle", timeout: 30000 });
    const found = await page.evaluate((archived) => {
      const dead = archived.filter((a) => document.documentElement.outerHTML.includes(a));
      const hrefs = [...document.querySelectorAll("a[href]")]
        .map((a) => a.getAttribute("href"))
        .filter((h) => h && (h.startsWith("/") || h.startsWith("#")));
      /* demo-register leak assertion (DESIGN.md, Elleta's ruling 22
         Jul): --demo-* may resolve ONLY inside a .spec-stage scope;
         root and body must resolve it to empty everywhere */
      const demoLeak =
        getComputedStyle(document.documentElement).getPropertyValue("--demo-ink").trim() !== "" ||
        getComputedStyle(document.body).getPropertyValue("--demo-ink").trim() !== "";
      return { dead, hrefs, demoLeak };
    }, ARCHIVED);
    if (found.demoLeak) {
      fails++;
      console.error(`VISUAL FAIL demo-register leak: --demo-ink resolves outside a specimen stage on ${route}`);
    }
    for (const d of found.dead) {
      fails++;
      console.error(`VISUAL FAIL dead-link: archived route ${d} referenced on ${route}`);
    }
    for (const h of found.hrefs) {
      const path = h.split("#")[0];
      if (path && !internal.has(path)) internal.set(path, route);
    }
  }
  for (const [path, from] of internal) {
    const res = await page.request.get(`http://localhost:3000${path}`);
    if (res.status() >= 400) {
      fails++;
      console.error(`VISUAL FAIL dead-link: ${path} -> ${res.status()} (linked from ${from})`);
    }
  }
  await ctx.close();
}
/* ── STAGE GEOMETRY LAW (PR 41 amendment 2, Elleta 22 Jul): the
   component and its flags own a reserved stage zone; readouts and
   consoles start BELOW it. Leaders may only cross empty ground: no
   leader path may intersect the bounding box of any text or table
   node (the path's own flag and its anchor target excepted). Swept
   on the case page, both themes, 1440 and 390. Proven red on the
   pre-restory parity layout (the --demo-touch leader crossed the
   readout table) before the fix landed. ── */
for (const theme of ["light", "dark"]) {
  for (const width of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width, height: width > 800 ? 900 : 844 } });
    const page = await ctx.newPage();
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    await page.goto("http://localhost:3000/case-studies/brad-frost", { waitUntil: "networkidle", timeout: 30000 });
    /* walk every stage into view so .in fires and leaders draw */
    const stageCount = await page.evaluate(() => document.querySelectorAll(".spec-stage").length);
    for (let i = 0; i < stageCount; i++) {
      await page.evaluate((idx) => {
        document.querySelectorAll(".spec-stage")[idx].scrollIntoView({ block: "center" });
      }, i);
      await page.waitForTimeout(350);
    }
    await page.waitForTimeout(600);
    /* twin equality (amendment 3 item 1): the two buttons must render
       IDENTICAL geometry and colours; only the annotation layer may
       differ between Before and On-system */
    const twinBad = await page.evaluate(() => {
      const twins = [...document.querySelectorAll("[data-twin]")];
      if (twins.length !== 2) return [`expected 2 twin specimens, found ${twins.length}`];
      const shape = (el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return [Math.round(r.width), Math.round(r.height), cs.backgroundColor, cs.color, cs.borderRadius, cs.borderTopColor, cs.fontFamily].join("|");
      };
      const a = shape(twins[0]);
      const b = shape(twins[1]);
      return a === b ? [] : [`twin specimens diverge: ${a} vs ${b}`];
    });
    for (const b of twinBad) {
      fails++;
      console.error(`VISUAL FAIL (${theme} ${width}) twin equality: ${b}`);
    }
    const geomBad = await page.evaluate(() => {
      const out = [];
      for (const stage of document.querySelectorAll(".spec-stage")) {
        const paths = [...stage.querySelectorAll(".ds-leaders path")];
        if (!paths.length) continue;
        const svg = stage.querySelector(".ds-leaders");
        const sr = svg.getBoundingClientRect();
        /* candidate obstacles: any element in the stage that paints
           its own text, or a list/table, excluding the flags, the
           state tag, and highlightable parts (leaders must TOUCH
           their target) */
        const boxes = [];
        for (const el of stage.querySelectorAll("*")) {
          if (el.closest(".ds-flag") || el.closest("svg") || el.classList.contains("spec-stage__tag")) continue;
          if (el.closest("[data-part]")) continue;
          const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
          const isTable = /^(UL|OL|TABLE|DL)$/.test(el.tagName);
          if (!ownText && !isTable) continue;
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) boxes.push({ r, label: `${el.tagName}:${(el.textContent || "").trim().slice(0, 24)}` });
        }
        for (const p of paths) {
          const len = p.getTotalLength();
          for (let t = 0.03; t <= 0.97; t += 0.05) {
            const pt = p.getPointAtLength(len * t);
            const x = sr.left + pt.x;
            const y = sr.top + pt.y;
            const hit = boxes.find((b) => x > b.r.left && x < b.r.right && y > b.r.top && y < b.r.bottom);
            if (hit) {
              out.push(`leader for ${p.parentElement ? "" : ""}${(stage.querySelector(".spec-stage__tag")?.textContent ?? "stage")} crosses ${hit.label}`);
              break;
            }
          }
        }
      }
      return [...new Set(out)];
    });
    for (const b of geomBad) {
      fails++;
      console.error(`VISUAL FAIL (${theme} ${width}) stage geometry: ${b}`);
    }
    await ctx.close();
  }
}
await browser.close();

if (fails > 0) {
  console.error(`visual gate: ${fails} failure(s)`);
  process.exit(1);
}
console.log("visual gate: PASS (one ground, containment, uniform band cards, covers >= 3:1, no dead links)");
