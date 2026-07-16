import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

function lum([r,g,b]) {
  const f = (c) => { c/=255; return c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)**2.4; };
  return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);
}
const parse = (s) => s.match(/[\d.]+/g)?.slice(0,4).map(Number) ?? [0,0,0,1];

for (const url of ["http://localhost:3000/", "http://localhost:3000/case-studies/design-system-transformation", "http://localhost:3000/work", "http://localhost:3000/point-of-view", "http://localhost:3000/about", "http://localhost:3000/case-studies/guardian", "http://localhost:3000/case-studies/brad-frost", "http://localhost:3000/case-studies/un-operational-dashboard", "http://localhost:3000/case-studies/filters-decision-support-system"]) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
  await page.waitForTimeout(1500);
  const fails = await page.evaluate(() => {
    const out = [];
    const els = document.querySelectorAll("h1,h2,h3,p,a,td,th,li,span.eyebrow,button");
    const bgOf = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage && cs.backgroundImage !== "none") return "gradient";
        const bg = cs.backgroundColor;
        if (bg && !bg.startsWith("rgba(0, 0, 0, 0)") && bg !== "transparent") return bg;
        n = n.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
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
    if (f.bg === "gradient") continue;
    const c = parse(f.c), b = parse(f.bg);
    if ((c[3] ?? 1) === 0) continue;
    const l1 = lum(c), l2 = lum(b);
    const ratio = (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
    const large = parseFloat(f.fs) >= 24;
    const min = large ? 3 : 4.5;
    if (ratio < min && (b[3] ?? 1) > 0.5) {
      bad++;
      if (bad <= 12) console.log(`  FAIL ${ratio.toFixed(2)} [${f.tag}] "${f.t}" ${f.c} on ${f.bg}`);
    }
  }
  console.log(`${url} -> ${bad} contrast fails / ${fails.length} nodes`);
}
await browser.close();
