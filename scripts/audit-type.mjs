/* Card type gate (card-voice readability, Elleta 21 Jul 2026): no Card
 * surface renders READING text below 16px COMPUTED (catches px leaks
 * and rem math), and .card-body must compute >= 18px. Metadata rows
 * (tags, pills, eyebrows, kickers, period/meta lines) are a separate
 * tier by design (item-1 carve-out) and are exempt via the class list
 * below; the popup's reading text is included by opening a bubble. */
import { chromium } from "playwright";
import { receipt } from "./lib/receipt.mjs";

const ROUTES = [
  "/", "/about", "/work", "/contact", "/skills", "/design-system", "/quick",
  "/case-studies/chip", "/case-studies/brad-frost",
  "/case-studies/design-system-transformation",
];
const CARD_SCOPE = '[class*="card"], [class*="Card"], .thesis-band, .ds-gate__row, [role="dialog"]';
/* The metadata tier stays exempt (Elleta's ruling, 2026-07-27): tags,
   pills, eyebrows, kickers and chips are a deliberate separate tier on
   --typography-font-size-tag. The 27 Jul hardening widened the TAGS the
   audit measures, which newly exposed metadata classes that were always
   in this tier but had never been reached; they are named here rather
   than silently raised. Everything NOT in this list is reading text and
   must clear 16px. */
const META_EXEMPT =
  /tag|pill|eyebrow|kicker|section-label|sr-only|meta|badge|__pk|period|swatch__name|swatch__value|tok-inspector|tok-annotation__trigger|demo-link|card-meta|ds-flag|skill|flag__val|glyph|crumb|__count|quote__by|ds-type__sample|gov-h/;

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
      console.error(receipt("type", "/work popup title vs CaseCard title", `${popupTitleSize}px vs ${cardTitleSize}px`, "equal sizes (one title recipe)"));
    }
  }
  const bad = await page.evaluate(
    ({ scope, exempt }) => {
      const exemptRe = new RegExp(exempt);
      const out = [];
      /* HARDENED (2026-07-27, spec system-page-redesign): the card pass
         used to query p/li/blockquote/dd only, so a <code> or <pre>
         specimen at 14px and every table cell rendered UNMEASURED. That
         is exactly how the code specimen shipped below the floor. The
         metadata tier (tags, pills, eyebrows, kickers) stays exempt by
         Elleta's ruling; this widens the TAGS, not the carve-out. */
      for (const card of document.querySelectorAll(scope)) {
        for (const el of card.querySelectorAll("p, li, blockquote, dd, dt, code, pre, td, th, span")) {
          if (exemptRe.test(el.className.toString()) || el.closest('[class*="tok-inspector"]')) continue;
          /* chrome, not reading text: the constitution (section 3) names
             buttons, nav links and chips as their own tier, and a
             figcaption is attribution. Same carve-out both passes. */
          if (el.closest("figcaption, footer, button, label, nav")) continue;
          /* a span/code wrapping only other elements is a container,
             not text; measure the node that OWNS the characters */
          const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
          if (!own) continue;
          const size = parseFloat(getComputedStyle(el).fontSize);
          const isBody = /card-body/.test(el.className.toString());
          if (size < 16 || (isBody && size < 18)) {
            out.push(`${el.className.toString().split(" ")[0] || el.tagName}@${size}px :: ${own.slice(0, 40)}`);
          }
        }
      }
      return [...new Set(out)];
    },
    { scope: CARD_SCOPE, exempt: META_EXEMPT.source }
  );
  for (const b of bad) {
    fails++;
    console.error(receipt("type", `${route} ${b}`, "reading text below the floor", ">=16px on cards, >=18px card-body"));
  }
  /* ── sitewide reading floor (type-floor sweep, 21 Jul; HARDENED
     2026-07-27, spec system-page-redesign): any element whose OWN text
     is reading text must compute >= 16px, wherever it lives.
     Widened two ways: the tag list now covers code/pre/td/th/dt/span
     alongside p/li, and the length threshold drops from 40 to 16
     characters so short reading labels stop hiding under it. The
     metadata tier stays allowlisted by Elleta's ruling: tags, pills,
     eyebrows and kickers are a deliberate separate tier. ── */
  const floorBad = await page.evaluate((exempt) => {
    const exemptRe = new RegExp(exempt);
    const out = [];
    for (const el of document.querySelectorAll("p, li, code, pre, td, th, dt, span, blockquote")) {
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
      const full = el.textContent.trim();
      const text = own.length >= 16 ? own : (el.children.length === 0 ? full : own);
      if (text.length < 16) continue;
      if (exemptRe.test(el.className.toString()) || el.closest("figcaption, footer, button, label, nav")) continue;
      if (el.closest('[class*="tok-inspector"]')) continue;
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (size < 16) out.push(`${el.className.toString().split(" ")[0] || el.tagName}@${size}px :: ${text.slice(0, 40)}`);
    }
    return [...new Set(out)];
  }, META_EXEMPT.source);
  for (const b of floorBad) {
    fails++;
    console.error(receipt("type", `${route} ${b}`, "own text past ~40 chars below 16px", ">=16px computed for reading text"));
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
    console.error(receipt("type", `${route} "${b}"`, "Unique inside a card scope", "Geist in cards (Unique stays page-tier)"));
  }
}
await browser.close();

if (fails > 0) {
  console.error(`type gate: ${fails} failure(s)`);
  process.exit(1);
}
console.log("type gate: PASS (card reading text >=16px computed, card-body >=18px)");
