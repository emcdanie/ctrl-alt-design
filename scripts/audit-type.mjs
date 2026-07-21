/* Card type gate (card-voice readability, Elleta 21 Jul 2026): no Card
 * surface renders READING text below 16px COMPUTED (catches px leaks
 * and rem math), and .card-body must compute >= 18px. Metadata rows
 * (tags, pills, eyebrows, kickers, period/meta lines) are a separate
 * tier by design (item-1 carve-out) and are exempt via the class list
 * below; the popup's reading text is included by opening a bubble. */
import { chromium } from "playwright";

const ROUTES = [
  "/", "/about", "/work", "/contact", "/skills", "/design-system", "/quick",
  "/case-studies/chip", "/case-studies/brad-frost", "/case-studies/guardian",
  "/case-studies/design-system-transformation", "/case-studies/un-operational-dashboard",
  "/case-studies/filters-decision-support-system",
];
const CARD_SCOPE = '[class*="card"], [class*="Card"], .thesis-band, .ds-gate__row, [role="dialog"]';
const META_EXEMPT =
  /tag|pill|eyebrow|kicker|section-label|sr-only|meta|badge|__pk|period|swatch__name|swatch__value|tok-inspector|tok-annotation__trigger|demo-link|card-meta/;

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
let fails = 0;

for (const route of ROUTES) {
  await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle", timeout: 30000 });
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 800) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(30);
  }
  if (route === "/work") {
    /* computed-equality assertion (card-voice item 1, 21 Jul): the
       popup title must compute the SAME size as CaseCard titles on
       Work — no page-tier sizes inside any card or popup */
    const cardTitleSize = await page.evaluate(() => {
      const t = document.querySelector('[class*="caseCard"] .heading-item, [class*="CaseCard"] .heading-item');
      return t ? parseFloat(getComputedStyle(t).fontSize) : null;
    });
    /* the map popup is a card too */
    await page.goto("http://localhost:3000/work?view=map", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.evaluate(() => document.querySelector("button[data-bubble]")?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    await page.waitForTimeout(600);
    const popupTitleSize = await page.evaluate(() => {
      const t = document.querySelector('[role="dialog"] .heading-item');
      return t ? parseFloat(getComputedStyle(t).fontSize) : null;
    });
    if (cardTitleSize === null || popupTitleSize === null || cardTitleSize !== popupTitleSize) {
      fails++;
      console.error(`TYPE FAIL /work: popup title (${popupTitleSize}px) must equal CaseCard title (${cardTitleSize}px)`);
    }
  }
  const bad = await page.evaluate(
    ({ scope, exempt }) => {
      const exemptRe = new RegExp(exempt);
      const out = [];
      for (const card of document.querySelectorAll(scope)) {
        for (const el of card.querySelectorAll("p, li, blockquote, dd")) {
          if (exemptRe.test(el.className.toString()) || el.closest('[class*="tok-inspector"]')) continue;
          if (!el.textContent.trim()) continue;
          const size = parseFloat(getComputedStyle(el).fontSize);
          const isBody = /card-body/.test(el.className.toString());
          if (size < 16 || (isBody && size < 18)) {
            out.push(`${el.className.toString().split(" ")[0] || el.tagName}@${size}px :: ${el.textContent.trim().slice(0, 40)}`);
          }
        }
      }
      return [...new Set(out)];
    },
    { scope: CARD_SCOPE, exempt: META_EXEMPT.source }
  );
  for (const b of bad) {
    fails++;
    console.error(`TYPE FAIL ${route}: ${b}`);
  }
  /* ── sitewide reading floor (type-floor sweep, 21 Jul): any P or LI
     whose OWN text runs past ~40 chars is reading text and must
     compute >= 16px, wherever it lives. Meta tiers allowlisted. ── */
  const floorBad = await page.evaluate((exempt) => {
    const exemptRe = new RegExp(exempt);
    const out = [];
    for (const el of document.querySelectorAll("p, li")) {
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
      const full = el.textContent.trim();
      const text = own.length >= 40 ? own : (el.children.length === 0 ? full : own);
      if (text.length < 40) continue;
      if (exemptRe.test(el.className.toString()) || el.closest("figcaption, footer, dt, dd")) continue;
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (size < 16) out.push(`${el.className.toString().split(" ")[0] || el.tagName}@${size}px :: ${text.slice(0, 40)}`);
    }
    return [...new Set(out)];
  }, META_EXEMPT.source);
  for (const b of floorBad) {
    fails++;
    console.error(`TYPE FLOOR FAIL ${route}: ${b}`);
  }
  /* Unique never renders inside a Card (runtime leg of the card-voice
     rule; the static file-level check exempts the System page whose
     type specimens are Unique ON THE GROUND by recorded exception) */
  const uniqueBad = await page.evaluate(() => {
    const out = [];
    for (const card of document.querySelectorAll('[class*="card"], [class*="Card"], .thesis-band')) {
      for (const el of card.querySelectorAll("*")) {
        if (!el.textContent.trim() || el.children.length > 0) continue;
        /* single-glyph decorative marks (the testimonial drop-quote)
           are ornament, not type; flagged for Elleta's ruling in the
           v3 PR, exempted here pending her word */
        if (el.textContent.trim().length <= 2) continue;
        if (/unique/i.test(getComputedStyle(el).fontFamily)) {
          out.push(el.textContent.trim().slice(0, 40));
        }
      }
    }
    return [...new Set(out)].slice(0, 5);
  });
  for (const b of uniqueBad) {
    fails++;
    console.error(`TYPE FAIL ${route}: Unique inside a card scope :: ${b}`);
  }
}
await browser.close();

if (fails > 0) {
  console.error(`type gate: ${fails} failure(s)`);
  process.exit(1);
}
console.log("type gate: PASS (card reading text >=16px computed, card-body >=18px)");
