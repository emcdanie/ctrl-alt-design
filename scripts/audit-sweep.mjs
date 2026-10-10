/* audit:sweep (RG guard, LD4–LD6, Elleta 10 Oct 2026).
 * Width sweep: every route, every 40px from 320 to 1440, light only.
 * Three checks per width:
 *   1. overflow   – document wider than viewport (scrollWidth > clientWidth)
 *   2. card-leak  – any child whose bounding box leaves its nearest
 *                   .card / [data-card] ancestor (2px tolerance)
 *   3. balance    – any [data-balance] must be centred within 5% of its
 *                   container width OR span >= 90% of it
 *
 * Performance: navigate ONCE per route, then resize and check at each width.
 * ~13 routes × ~37 widths = ~480 checks, but only ~13 navigations.
 *
 * RATCHET: existing failures in scripts/lib/sweep-debt.json are allowed;
 * any NEW failure (not in the debt set) is exit(1). The list may only shrink.
 *
 * UPDATE_SWEEP_DEBT=1  – rewrite the debt file with today's findings (run
 *                         once on install, again after a deliberate cleanup).
 * STRICT=1             – fail on ANY finding (bypass ratchet; proves guard). */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { chromium } from "playwright";
import { BASE } from "./lib/base-url.mjs";
import { receipt } from "./lib/receipt.mjs";

const STRICT = process.env.STRICT === "1";
const UPDATE = process.env.UPDATE_SWEEP_DEBT === "1";
const DEBT_PATH = "scripts/lib/sweep-debt.json";

const slugs = readdirSync("content/case-studies")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts" && !f.startsWith("_"))
  .map((f) => f.replace(/\.ts$/, ""));

const ROUTES = process.env.ROUTES?.split(",") ?? [
  "/", "/work", "/learning", "/about", "/design-system",
  ...slugs.map((s) => `/case-studies/${s}`),
];

/* Every 40px from 320 to 1440, plus 1px either side of BELLA breakpoints */
const WIDTHS = (() => {
  const set = new Set();
  for (let w = 320; w <= 1440; w += 40) set.add(w);
  for (const bp of [640, 768, 1024, 1440]) {
    set.add(bp - 1);
    set.add(bp);
    set.add(bp + 1);
  }
  return [...set].sort((a, b) => a - b);
})();

const END_STATE = `*, *::before, *::after {
  animation-delay: 0s !important;
  animation-duration: 0s !important;
  animation-iteration-count: 1 !important;
  transition: none !important;
}`;

const debtKey = (route, check, el) => `${route}|${check}|${el}`;

const debt = existsSync(DEBT_PATH)
  ? JSON.parse(readFileSync(DEBT_PATH, "utf8"))
  : { entries: [] };
const debtSet = new Set((debt.entries ?? []).map((e) => debtKey(e.route, e.check, e.el)));

/* ── in-page measure function (runs in browser context) ── */
function measure() {
  const results = [];

  /* helpers */
  const label = (el) => {
    const tag = el.tagName.toLowerCase();
    const cls = typeof el.className === "string" && el.className
      ? "." + el.className.trim().split(/\s+/)[0].replace(/^.*?__/, "").slice(0, 24)
      : "";
    const name = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28);
    return `${tag}${cls} "${name}"`;
  };
  const visible = (el) => {
    if (el.closest(".sr-only")) return false;
    const cs = window.getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none" && parseFloat(cs.opacity) > 0;
  };

  /* 1. overflow */
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) {
    results.push({ check: "overflow", el: "html", detail: `scrollWidth ${de.scrollWidth} > clientWidth ${de.clientWidth}` });
  }

  /* 2. card-leak */
  for (const card of document.querySelectorAll(".card, [data-card]")) {
    const cr = card.getBoundingClientRect();
    if (cr.width < 1 || cr.height < 1) continue;
    let reported = false;
    for (const child of card.querySelectorAll("*")) {
      if (reported) break;
      if (!visible(child)) continue;
      const r = child.getBoundingClientRect();
      if (r.left < cr.left - 2 || r.right > cr.right + 2 ||
          r.top < cr.top - 2 || r.bottom > cr.bottom + 2) {
        results.push({ check: "card-leak", el: label(child), detail: `overflows ${label(card)}` });
        reported = true;
      }
    }
  }

  /* 3. balance */
  for (const el of document.querySelectorAll("[data-balance]")) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    const parent = el.parentElement;
    if (!parent) continue;
    const pr = parent.getBoundingClientRect();
    if (pr.width < 1) continue;
    const spans = r.width / pr.width;
    if (spans >= 0.9) continue;
    const elMid = r.left + r.width / 2;
    const pMid = pr.left + pr.width / 2;
    const drift = Math.abs(elMid - pMid);
    const threshold = pr.width * 0.05;
    if (drift > threshold) {
      results.push({
        check: "balance",
        el: label(el),
        detail: `drift ${Math.round(drift)}px > threshold ${Math.round(threshold)}px; spans ${Math.round(spans * 100)}%`,
      });
    }
  }

  return results;
}

/* ── main loop ── */
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: "light",
  reducedMotion: "reduce",
});
await ctx.addInitScript(() => {
  try { localStorage.setItem("theme", "light"); } catch {}
  document.documentElement.dataset.theme = "light";
});
const page = await ctx.newPage();

/* keyed by debtKey → {route, check, el, detail, widths:[]} */
const byKey = {};

for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: END_STATE });

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    const findings = await page.evaluate(measure);
    for (const { check, el, detail } of findings) {
      const key = debtKey(route, check, el);
      if (!byKey[key]) byKey[key] = { route, check, el, detail, widths: [] };
      byKey[key].widths.push(width);
    }
  }
}

await ctx.close();
await browser.close();

/* ── output ── */
const allKeys = Object.keys(byKey);
const newKeys = allKeys.filter((k) => !debtSet.has(k));
const knownKeys = allKeys.filter((k) => debtSet.has(k));

if (allKeys.length === 0) {
  console.log("audit:sweep — clean (0 findings)");
} else {
  const newCount = newKeys.length;
  const knownCount = knownKeys.length;
  console.log(`\naudit:sweep — ${allKeys.length} finding(s): ${newCount} new, ${knownCount} known debt (${debt.entries?.length ?? 0} debt entries)\n`);

  if (newCount > 0) {
    console.error("NEW (not in debt list):");
    for (const k of newKeys) {
      const { route, check, el, detail, widths } = byKey[k];
      const wrange = widths.length === 1 ? `${widths[0]}px` : `${widths[0]}–${widths[widths.length - 1]}px`;
      console.error(receipt("sweep", `${route} @${wrange}`, `${check} — ${el}: ${detail}`, "none"));
    }
  }
  if (knownCount > 0) {
    console.log("Known debt:");
    for (const k of knownKeys) {
      const { route, check, el, widths } = byKey[k];
      const wrange = widths.length === 1 ? `${widths[0]}px` : `${widths[0]}–${widths[widths.length - 1]}px`;
      console.log(`  [debt] ${route} ${check}: ${el} @${wrange}`);
    }
  }
}

if (UPDATE) {
  const entries = allKeys.map((k) => {
    const { route, check, el, detail } = byKey[k];
    return { route, check, el, detail };
  });
  writeFileSync(DEBT_PATH, JSON.stringify({
    "$description": "audit:sweep failures recorded on guard install day (RG guard, 10 Oct 2026). May only shrink. Regenerate: UPDATE_SWEEP_DEBT=1 npm run audit:sweep",
    updatedAt: new Date().toISOString().slice(0, 10),
    entries,
  }, null, 2) + "\n");
  console.log(`\nDebt file updated: ${entries.length} entries → ${DEBT_PATH}`);
  process.exit(0);
}

if (STRICT) process.exit(allKeys.length > 0 ? 1 : 0);
else process.exit(newKeys.length > 0 ? 1 : 0);
