/* Card type gate (card-voice readability, Elleta 21 Jul 2026): no Card
 * surface renders READING text below 16px COMPUTED (catches px leaks
 * and rem math), and .card-body must compute >= 18px. Metadata rows
 * (tags, pills, eyebrows, kickers, period/meta lines) are a separate
 * tier by design (item-1 carve-out) and are exempt via the class list
 * below. */
import { chromium } from "playwright";
import { receipt } from "./lib/receipt.mjs";
import { BASE } from "./lib/base-url.mjs";

/* Declared for audit:debt's dead-selector check (27 Jul 2026). */
export const TRACKED_SELECTORS = [
  '[class*="card"]', ".thesis-band", '[role="dialog"]', ".heading-item",
  "h2.display-heading",
];

const ROUTES = [
  "/", "/about", "/work", "/work/studies/stock-screener", "/contact", "/learning", "/design-system", "/quick", "/privacy", "/accessibility",
  "/case-studies/chip", "/case-studies/brad-frost",
  "/case-studies/design-system-transformation",
];
const CARD_SCOPE = '[class*="card"], [class*="Card"], .thesis-band, .ds-gate__row, [role="dialog"]';
/* The metadata tier stays exempt (Elleta's ruling, 2026-07-27): tags,
   pills, eyebrows, kickers and chips are a deliberate separate tier on
   --typography-font-size-tag. The 27 Jul hardening widened the TAGS the
   audit measures, which newly exposed metadata classes that were always
   in this tier but had never been reached; they are named here rather
   than silently raised. .text-code (the code role, 19 Sep 2026) is
   metadata by definition: 14px, never reading text. l-section__label is
   the layout Section's paw label (specs/layout-system), the same section
   index tier as .section-label. Everything NOT in this list is reading
   text and must clear 16px. */
const META_EXEMPT =
  /tag|pill|eyebrow|kicker|section-label|l-section__label|sr-only|meta|badge|__pk|period|swatch__name|swatch__value|tok-inspector|tok-annotation__trigger|demo-link|card-meta|ds-flag|skill|flag__val|glyph|crumb|__count|quote__by|ds-type__sample|gov-h|text-code/;

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
let fails = 0;

for (const route of ROUTES) {
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 30000 });
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 800) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(30);
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
  /* ── display type scale (display-type-scale fix, 18 Sep 2026): every
     Unique heading tracks at >= --tracking-display and leads at >= 1.0,
     and every section-tier head on a page computes ONE size (the /about
     72 vs 50.4 split is the counter-example). Read from computed style,
     so a consumer override fails the same as a bad token. ── */
  const scaleBad = await page.evaluate(() => {
    const out = [];
    const floorEm = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--tracking-display"));
    if (!Number.isFinite(floorEm)) return [[":root --tracking-display", "undefined", "a number in em"]];
    for (const el of document.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
      const cs = getComputedStyle(el);
      if (!/unique/i.test(cs.fontFamily) || !el.textContent.trim()) continue;
      const size = parseFloat(cs.fontSize);
      const trackEm = cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing) / size;
      const lead = cs.lineHeight === "normal" ? 1.2 : parseFloat(cs.lineHeight) / size;
      const label = el.textContent.trim().slice(0, 40);
      if (trackEm < floorEm - 0.001) out.push([`"${label}" letter-spacing`, `${trackEm.toFixed(3)}em`, `>= ${floorEm}em (--tracking-display)`]);
      if (lead < 1 - 0.001) out.push([`"${label}" line-height`, lead.toFixed(2), ">= 1.0"]);
    }
    /* every h2 display head is a section head, whatever tier a consumer
       passed: the /about split was an h2 on tier page, which a
       tier-class selector would never see */
    const sizes = new Map();
    for (const el of document.querySelectorAll("h2.display-heading:not(.display-heading--sub)")) {
      if (!el.getClientRects().length) continue;
      const fs = getComputedStyle(el).fontSize;
      if (!sizes.has(fs)) sizes.set(fs, el.textContent.trim().slice(0, 30));
    }
    if (sizes.size > 1) out.push(["section heads", [...sizes].map(([fs, t]) => `${fs} ("${t}")`).join(" vs "), "one size per page"]);
    return out;
  });
  for (const [what, got, expected] of scaleBad) {
    fails++;
    console.error(receipt("type", `${route} ${what}`, got, expected));
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
console.log("type gate: PASS (card reading text >=16px computed, card-body >=18px, display tracking/leading floors, one section-head size per page)");
