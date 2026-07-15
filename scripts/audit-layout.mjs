/**
 * Layout-contract audit capture (see DESIGN.md).
 *
 * Screenshots every home-page section at 1440 / 768 / 390 into
 * _review/audit/ so frames can be checked against the contract:
 * one card radius (--radius-2xl), card padding --spacing-6, one
 * border+shadow tier per context, --grid-gap grids, --spacing-20/16
 * section rhythm.
 *
 * Run: npm run audit:layout   (dev server must be up on :3000)
 * Browsers: npx playwright install chromium   (first run only)
 *
 * Capture notes (repo-specific):
 * - The nested scroll containers (.snap-shell > .view-dashboard >
 *   .dashboard-panel) are flattened so the page scrolls as one document.
 * - FadeIn latches on intersection (once), so the page is swept before
 *   capture and inline opacity/transform are forced for stable frames.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const OUT = fileURLToPath(new URL('../_review/audit/', import.meta.url));
const BASE = process.env.AUDIT_BASE_URL ?? 'http://localhost:3000/';
const WIDTHS = [
  { w: 1440, h: 900 },
  { w: 768, h: 900 },
  { w: 390, h: 844 },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
for (const { w, h } of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.addStyleTag({
    content: `
      .snap-shell{height:auto!important;overflow:visible!important}
      .view-landing{overflow:visible!important}
      .view-dashboard{height:auto!important;overflow:visible!important}
      .dashboard-panel{overflow:visible!important}
      .dashboard-sidebar{display:none!important}
      nextjs-portal{display:none!important}
      html,body,*{scroll-behavior:auto!important}
      [style*="opacity"]{opacity:1!important;transform:none!important;transition:none!important}
    `,
  });

  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);

  const sections = await page.evaluate(() => {
    const list = [['hero', document.querySelector('.view-landing')]];
    document
      .querySelectorAll('.dashboard-panel > section, .dashboard-panel > div > section')
      .forEach((s, i) => list.push([s.id || `section-${i}`, s]));
    const contact = document.getElementById('contact');
    if (contact && !list.some(([, el]) => el === contact)) list.push(['contact', contact]);
    return list
      .filter(([, el]) => el)
      .map(([name, el]) => {
        const r = el.getBoundingClientRect();
        return { name, y: r.top + window.scrollY, height: r.height };
      });
  });

  const pageH = await page.evaluate(() => document.body.scrollHeight);
  for (const s of sections) {
    const clipH = Math.min(s.height, 1400);
    const y = Math.max(0, Math.min(s.y, pageH - clipH));
    await page.screenshot({
      path: path.join(OUT, `${s.name}-${w}.png`),
      fullPage: true,
      clip: { x: 0, y, width: w, height: clipH },
    });
    console.log(`${s.name}-${w}.png (${Math.round(clipH)}px)`);
  }
  await page.close();
}
await browser.close();
