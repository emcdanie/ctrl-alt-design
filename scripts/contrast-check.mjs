import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

function lum([r,g,b]) {
  const f = (c) => { c/=255; return c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4; };
  return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);
}
const parse = (s) => s.match(/[\d.]+/g)?.slice(0,4).map(Number) ?? [0,0,0,1];

for (const url of ["http://localhost:3000/", "http://localhost:3000/case-studies/design-system-transformation", "http://localhost:3000/work", "http://localhost:3000/point-of-view", "http://localhost:3000/about", "http://localhost:3000/contact", "http://localhost:3000/case-studies/guardian", "http://localhost:3000/case-studies/brad-frost", "http://localhost:3000/case-studies/un-operational-dashboard", "http://localhost:3000/case-studies/filters-decision-support-system", "http://localhost:3000/work?view=skills", "http://localhost:3000/design-system", "http://localhost:3000/quick"]) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
  await page.waitForTimeout(1500);
  const fails = await page.evaluate(() => {
    const out = [];
    // every element that PAINTS text itself (has a direct text node) —
    // wrappers whose text lives in styled children are judged via those
    // children, not their own inherited colour
    const els = [...document.querySelectorAll("*")].filter((el) => {
      if (["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH"].includes(el.tagName)) return false;
      return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    });
    // Returns the surface as a LIST of candidate colours. For gradient
    // faces (keycaps, bubbles) every opaque stop is a candidate — the
    // label must pass against the WORST stop. Never skip gradients:
    // that exclusion is exactly what let white-on-periwinkle through.
    const bgOf = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        const out = [];
        if (cs.backgroundImage && cs.backgroundImage !== "none") {
          for (const m of cs.backgroundImage.matchAll(/rgba?\(\s*\d+[^)]*\)/g)) {
            const a = m[0].match(/[\d.]+/g);
            if (!a || (a.length > 3 && parseFloat(a[3]) < 1)) continue; // skip translucent stops
            out.push(m[0]);
          }
        }
        const bg = cs.backgroundColor;
        const opaque = bg && !bg.startsWith("rgba(0, 0, 0, 0)") && bg !== "transparent";
        if (opaque) out.push(bg);
        if (out.length) return out;
        if (cs.backgroundImage && cs.backgroundImage !== "none") return ["unresolvable-image"];
        n = n.parentElement;
      }
      return [getComputedStyle(document.body).backgroundColor];
    };
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      if (parseFloat(cs.fontSize) < 10) continue;
      out.push({ t: (el.textContent||"").trim().slice(0,32), c: cs.color, bg: bgOf(el), fs: cs.fontSize, tag: el.tagName });
    }
    return out;
  });
  let bad = 0;
  for (const f of fails) {
    if (f.uniqueTooSmall) {
      bad++;
      console.log(`  FAIL display-font-below-24 [${f.tag}] "${f.t}" at ${f.fs}`);
    }
    const c = parse(f.c);
    if ((c[3] ?? 1) === 0) continue;
    const l1 = lum(c);
    const surfaces = Array.isArray(f.bg) ? f.bg : [f.bg];
    let worst = Infinity, worstBg = null;
    for (const s of surfaces) {
      if (s === "unresolvable-image") { worst = Infinity; worstBg = null; break; } // photo/artwork — cannot judge
      const b = parse(s);
      if ((b[3] ?? 1) <= 0.5) continue;
      const l2 = lum(b);
      const ratio = (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
      if (ratio < worst) { worst = ratio; worstBg = s; }
    }
    if (worstBg === null) continue;
    const large = parseFloat(f.fs) >= 24;
    const min = large ? 3 : 4.5;
    if (worst < min) {
      bad++;
      if (bad <= 12) console.log(`  FAIL ${worst.toFixed(2)} [${f.tag}] "${f.t}" ${f.c} on ${worstBg}`);
    }
  }
  console.log(`${url} -> ${bad} contrast fails / ${fails.length} nodes`);
}
await browser.close();
