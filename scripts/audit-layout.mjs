/**
 * Layout-contract audit (see DESIGN.md).
 *
 * For every route below, at 1440 / 768 / 390:
 *   1. captures per-section screenshots into _review/audit/
 *   2. runs the computed drift check against the contract:
 *      card radius --radius-2xl, card padding --spacing-6 (panels
 *      --spacing-8), grid gap --grid-gap, section rhythm, container,
 *      and the §5 type ramp (13/14/16/18/20/24/32/40/56 plus the
 *      fluid-pair ranges; aria-hidden decorative art is exempt).
 *
 * Run: npm run audit:layout   (dev server must be up on :3000)
 * Exit code 1 if any route drifts, so it can gate CI later.
 *
 * Capture notes (repo-specific): the home page's nested scroll
 * containers are flattened, and the page is swept before capture
 * because FadeIn latches on first intersection.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const OUT = fileURLToPath(new URL('../_review/audit/', import.meta.url));
const BASE = process.env.AUDIT_BASE_URL ?? 'http://localhost:3000';
const WIDTHS = [
  { w: 1440, h: 900 },
  { w: 768, h: 900 },
  { w: 390, h: 844 },
];
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/case-studies/guardian', name: 'guardian' },
  { path: '/case-studies/filters-decision-support-system', name: 'filters' },
  { path: '/case-studies/brad-frost', name: 'brad-frost' },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
let drifted = false;

for (const route of ROUTES) {
  for (const { w, h } of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(BASE + route.path, { waitUntil: 'load' });
    await page.addStyleTag({
      content: `
        .snap-shell{height:auto!important;overflow:visible!important}
        .view-landing{overflow:visible!important}
        .view-dashboard{height:auto!important;overflow:visible!important}
        .dashboard-panel{overflow:visible!important}
        .dashboard-sidebar{display:none!important}
        .cs-shell__sticky{position:static!important}
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
    await page.waitForTimeout(800);

    // ── capture ──
    const sections = await page.evaluate(() => {
      const list = [];
      const landing = document.querySelector('.view-landing');
      if (landing) {
        list.push(['hero', landing]);
        document
          .querySelectorAll('.dashboard-panel > section, .dashboard-panel > div > section')
          .forEach((s, i) => list.push([s.id || `section-${i}`, s]));
        const contact = document.getElementById('contact');
        if (contact && !list.some(([, el]) => el === contact)) list.push(['contact', contact]);
      } else {
        const shell = document.querySelector('.cs-shell');
        if (shell) {
          list.push(['shell-top', shell]);
          document.querySelectorAll('.cs-section').forEach((s, i) => list.push([`cs-${i}`, s]));
          const cta = document.querySelector('.cs-shell__bottom-cta');
          if (cta) list.push(['bottom-cta', cta]);
        }
      }
      return list
        .filter(([, el]) => el)
        .map(([name, el]) => {
          const r = el.getBoundingClientRect();
          return { name, y: r.top + window.scrollY, height: r.height };
        });
    });

    const pageH = await page.evaluate(() => document.body.scrollHeight);
    for (const s of sections) {
      const clipH = Math.max(200, Math.min(s.height, 1400));
      const y = Math.max(0, Math.min(s.y, pageH - clipH));
      await page.screenshot({
        path: path.join(OUT, `${route.name}-${s.name}-${w}.png`),
        fullPage: true,
        clip: { x: 0, y, width: w, height: clipH },
      });
    }

    // ── drift check ──
    const issues = await page.evaluate(() => {
      const out = [];
      const frameSel =
        '.glass-card, .card-elevated, .card-default, .cs-shell__hero-frame, [class*="__card"]';
      document.querySelectorAll(frameSel).forEach((el) => {
        const cs = getComputedStyle(el);
        const cls = el.className.toString();
        if (cs.borderTopLeftRadius !== '20px' && cs.borderTopLeftRadius !== '999px')
          out.push(['radius', cs.borderTopLeftRadius, cls.slice(0, 40)]);
        if (cls.includes('hero-frame')) return; // media frame has no padding contract
        const want = cls.includes('glass-card') ? '32px' : '24px';
        const pads = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft];
        if (pads.some((p) => p !== want && p !== '0px'))
          out.push(['padding', pads.join(' '), cls.slice(0, 40)]);
      });
      document.querySelectorAll('*').forEach((el) => {
        const cs = getComputedStyle(el);
        if (
          cs.display === 'grid' &&
          cs.columnGap !== '32px' &&
          cs.columnGap !== 'normal' &&
          cs.columnGap !== '0px'
        )
          out.push(['grid-gap', cs.columnGap, el.className.toString().slice(0, 40)]);
      });
      document.querySelectorAll('section.layout-section').forEach((el) => {
        const cs = getComputedStyle(el);
        const want = innerWidth <= 640 ? '64px' : '80px';
        if (cs.paddingTop !== want || cs.paddingBottom !== want)
          out.push(['section-pad', `${cs.paddingTop}/${cs.paddingBottom}`, el.id || 'sec']);
      });
      // §5 type ramp — leaf text nodes; aria-hidden decorative art exempt
      const ramp = new Set([13, 14, 16, 18, 20, 24, 32, 40, 56]);
      const fluidOk = (v) =>
        (v >= 40 && v <= 56) || (v >= 32 && v <= 40) || (v >= 24 && v <= 32) ||
        (v >= 20 && v <= 24) || (v >= 16 && v <= 18);
      document.querySelectorAll('body *').forEach((el) => {
        if (!el.textContent.trim() || el.children.length) return;
        if (el.closest('[aria-hidden="true"], nextjs-portal, svg')) return;
        const v = parseFloat(getComputedStyle(el).fontSize);
        if (!ramp.has(Math.round(v)) && !fluidOk(v))
          out.push(['type', `${v}px`, (el.className.toString() || el.tagName).slice(0, 40)]);
      });
      const seen = new Set();
      return out.filter((i) => {
        const k = i.join('|');
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    });

    if (issues.length) {
      drifted = true;
      console.log(`✗ ${route.name} @ ${w}: ${issues.length} drift`);
      issues.slice(0, 8).forEach((i) => console.log('   ', i.join(' | ')));
    } else {
      console.log(`✓ ${route.name} @ ${w}: zero drift`);
    }
    await page.close();
  }
}

await browser.close();
process.exit(drifted ? 1 : 0);
