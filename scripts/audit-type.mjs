/* Card type gate (card-voice readability, Elleta 21 Jul 2026): no Card
 * surface renders READING text below 16px COMPUTED (catches px leaks
 * and rem math), and .card-body must compute >= 18px. Metadata rows
 * (tags, pills, eyebrows, kickers, period/meta lines) are a separate
 * tier by design (item-1 carve-out) and are exempt via the class list
 * below; the popup's reading text is included by opening a bubble. */
import { chromium } from "playwright";

const ROUTES = ["/about", "/work", "/case-studies/chip", "/design-system"];
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
    /* the map popup is a card too */
    await page.goto("http://localhost:3000/work?view=map", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.evaluate(() => document.querySelector("button[data-bubble]")?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    await page.waitForTimeout(600);
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
}
await browser.close();

if (fails > 0) {
  console.error(`type gate: ${fails} failure(s)`);
  process.exit(1);
}
console.log("type gate: PASS (card reading text >=16px computed, card-body >=18px)");
