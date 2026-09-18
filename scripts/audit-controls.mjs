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
  "/skills", "/design-system", "/quick"];

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
  /* the footer's Get in touch: the one footer primary, except on
     /contact, where it steps down to secondary beside "Send message" */
  const onContact = r.split("?")[0] === "/contact";
  if (onContact && res.footerPrimaries !== 0) fail(`${r} footer Get in touch`, `${res.footerPrimaries} footer primaries`, "secondary on /contact (0 footer primaries)");
  if (!onContact && res.footerPrimaries !== 1) fail(`${r} footer Get in touch`, `${res.footerPrimaries} footer primaries`, "exactly 1 footer primary");
  if (res.chipsNoAria) fail(`${r} .filter-chip`, `${res.chipsNoAria} chips without aria-pressed`, "aria-pressed on every filter chip");
  if (res.segBad) fail(`${r} .seg-control`, `${res.segBad} controls without exactly one aria-current`, "exactly one aria-current per control");
}

/* ONE theme toggle (18 Sep 2026): exactly one in the document (the
   mobile menu carries none), and in the header it sits directly left of
   the last control: the CTA at lg+, the menu button below lg. */
for (const [w, lastSel, lastName] of [
  [1440, ".get-in-touch__trigger", "the Get in touch CTA"],
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
    if (!t.lastOk || !t.toggleOk) fail(`${r} @${w} ThemeToggle`, "not directly left of " + lastName, `ThemeToggle, then ${lastName}, at the end of the header`);
  }
}
await browser.close();
console.log(fails === 0 ? "controls gate: PASS" : `controls gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
