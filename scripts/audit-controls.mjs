/* Control-taxonomy gate (§7): runtime checks per route, plus the
   demo-register ban (simplification pass, 22 Jul 2026): the black
   .demo-btn / --demo-* register is retired; any comeback fails. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { receipt } from "./lib/receipt.mjs";
import { BASE } from "./lib/base-url.mjs";

const routes = ["/", "/work", "/about", "/contact",
  "/point-of-view", "/case-studies/brad-frost", "/case-studies/chip",
  "/case-studies/design-system-transformation",
  "/case-studies/federated",
  "/learning", "/design-system", "/quick"];

/* ── source scan: the retired demo register must not return.
   Matches DECLARATIONS and USAGES (definitions, var() reads, CSS
   selectors, className references), not prose mentions in comments. */
const DEMO_REGISTER = [
  /--demo-[a-z-]+\s*:/, // token definition
  /var\(--demo-/, // token usage
  /^\s*\.demo-btn\b/, // CSS selector
  /className=["'`][^"'`]*\bdemo-btn\b/, // TSX usage
];
const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|css)$/.test(e)) out.push(p);
  }
  return out;
};
let srcFails = 0;
for (const root of ["app", "components"]) {
  for (const file of walk(root)) {
    readFileSync(file, "utf8").split("\n").forEach((l, i) => {
      if (DEMO_REGISTER.some((re) => re.test(l))) {
        srcFails++;
        console.error(receipt("controls", `${file}:${i + 1}`, `the retired demo register (${l.trim().slice(0, 40)})`, "BELLA iris grammar (no .demo-btn / --demo-*)"));
      }
    });
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let fails = srcFails;
/* the receipt (A1): offender, actual, expected — one format */
const fail = (offender, got, expected) => { fails++; console.error(receipt("controls", offender, got, expected)); };

for (const r of routes) {
  await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const res = await page.evaluate(() => {
    const visible = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== "hidden";
    };
    /* the nav and footer are global landmarks: they don't count */
    const primaries = [...document.querySelectorAll(".btn-key--primary")].filter(visible).filter((el) => !el.closest("nav, .site-footer"));
    const footerPrimaries = [...document.querySelectorAll(".site-footer .btn-key--primary")].filter(visible).length;
    const chipsNoAria = [...document.querySelectorAll(".filter-chip")].filter(
      (c) => !c.hasAttribute("aria-pressed"));
    const segs = [...document.querySelectorAll(".seg-control")];
    const segBad = segs.filter(
      (s) => s.querySelectorAll('button[aria-current="true"]').length !== 1);
    return { primaries: primaries.length, footerPrimaries, chipsNoAria: chipsNoAria.length, segBad: segBad.length };
  });
  if (res.primaries > 1) fail(`${r} .btn-key--primary`, `${res.primaries} visible primaries`, "max 1 per view");
  /* the footer has no primary: its Get in touch was cut in the footer
     lock (Elleta, 4 Oct 2026; job E1, 5 Oct) */
  if (res.footerPrimaries !== 0) fail(`${r} footer`, `${res.footerPrimaries} footer primaries`, "no footer primary (footer lock, 4 Oct 2026)");
  if (res.chipsNoAria) fail(`${r} .filter-chip`, `${res.chipsNoAria} chips without aria-pressed`, "aria-pressed on every filter chip");
  if (res.segBad) fail(`${r} .seg-control`, `${res.segBad} controls without exactly one aria-current`, "exactly one aria-current per control");
}

/* ONE theme toggle (18 Sep 2026): exactly one in the document (the
   mobile menu carries none). In the header it is the last control at
   lg+ (the Get in touch CTA retired, hero v3 lock, 4 Oct 2026) and sits
   directly left of the menu button below lg. */
for (const [w, lastSel, lastName] of [
  [1440, '[data-component="ThemeToggle"]', null],
  [390, '[aria-controls="overlay-menu"]', "the menu button"],
]) {
  await page.setViewportSize({ width: w, height: 900 });
  for (const r of ["/", "/about", "/work"]) {
    await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const t = await page.evaluate((lastSel) => {
      const visible = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== "hidden";
      };
      const toggles = document.querySelectorAll('[data-component="ThemeToggle"]');
      const bar = document.querySelector(".nav-wordmark")?.parentElement;
      const controls = bar ? [...bar.querySelectorAll("button, a[href]")].filter(visible) : [];
      const last = controls[controls.length - 1];
      const beforeLast = controls[controls.length - 2];
      return {
        count: toggles.length,
        lastOk: !!last && last.matches(lastSel),
        toggleOk: !!beforeLast && beforeLast.matches('[data-component="ThemeToggle"]'),
      };
    }, lastSel);
    if (t.count !== 1) fail(`${r} @${w} ThemeToggle`, `${t.count} toggles in the document`, "exactly one");
    if (lastName === null) {
      if (!t.lastOk) fail(`${r} @${w} ThemeToggle`, "not the last header control", "ThemeToggle at the end of the header");
    } else if (!t.lastOk || !t.toggleOk) fail(`${r} @${w} ThemeToggle`, "not directly left of " + lastName, `ThemeToggle, then ${lastName}, at the end of the header`);
  }
}
/* ONE header height (18f, 4 Oct 2026): the bar never wraps. At 360,
   390 and 1024 it measures the same; below 380px LinkedIn and Copy
   email leave the header and the menu sheet carries them. */
{
  const heights = {};
  for (const w of [360, 390, 1024]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const h = await page.evaluate(() => {
      const bar = document.querySelector(".nav-row")?.parentElement;
      const contact = document.querySelector(".nav-contact");
      const menu = document.getElementById("overlay-menu");
      return {
        bar: bar ? Math.round(bar.getBoundingClientRect().height) : 0,
        headerIcons: contact ? getComputedStyle(contact).display !== "none" : false,
        menuHas: !!menu && /LinkedIn/.test(menu.textContent) && /Copy email/.test(menu.textContent),
      };
    });
    heights[w] = h.bar;
    if (w < 380 && h.headerIcons) fail(`/ @${w} header`, "LinkedIn and Copy email in the header", "in the menu sheet only, below 380px");
    if (w < 1024 && !h.menuHas) fail(`/ @${w} menu`, "no LinkedIn / Copy email in the menu sheet", "both, as labelled rows");
  }
  const vals = Object.values(heights);
  if (new Set(vals).size !== 1) fail("/ header height", JSON.stringify(heights), "one height at 360, 390 and 1024");
}
await browser.close();
console.log(fails === 0 ? "controls gate: PASS" : `controls gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
