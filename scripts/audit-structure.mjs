/* Structural gate — fails the build when per-page drift patterns return.
 * Runs alongside audit:contrast (npm run audit:structure). */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

let fails = 0;
const fail = (msg) => { fails++; console.error("STRUCTURE FAIL:", msg); };

/* 1. ONE case-study render path — no per-case route dirs */
for (const entry of readdirSync("app/case-studies")) {
  if (entry !== "[slug]" && statSync(join("app/case-studies", entry)).isDirectory()) {
    fail(`per-case route dir exists: app/case-studies/${entry} — cases render via [slug] only`);
  }
}

/* helpers */
const walk = (dir, exts) => {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p, exts));
    else if (exts.some((x) => p.endsWith(x))) out.push(p);
  }
  return out;
};
const appFiles = walk("app", [".tsx", ".css"]);
const componentFiles = walk("components", [".tsx", ".css"]);

/* 2. zero amber — no amber-named token or warm-amber hex in app/components */
for (const f of [...appFiles, ...componentFiles]) {
  const s = readFileSync(f, "utf8");
  if (/amber/i.test(s)) fail(`amber reference in ${f}`);
  if (/#(C4956A|F2A25C|F59E0B|D97706)\b/i.test(s) && !f.includes("globals.css")) {
    fail(`warm amber hex in ${f}`);
  }
}

/* 3. every page sits in the container/rhythm system */
/* hero-landing: the home hero carries its own recorded container
   (Hero.module.css .hero, max-width var(--container-width)) */
const pageOk = /layout-container|page-container|layout-section|CaseStudyShell|<Hero/;
for (const f of appFiles.filter((f) => f.endsWith("page.tsx"))) {
  const s = readFileSync(f, "utf8");
  if (!pageOk.test(s)) fail(`${f} lacks the container/section system (layout-*/page-container/CaseStudyShell)`);
}

/* 4. no arbitrary px type in components (recorded proto exceptions excluded) */
const EXEMPT = ["Hero.module.css", "BubbleCluster.module.css", "ThemeSwitch.module.css",
  "WorkSidebar", "VinylPlayer.tsx", "CaseCard.module.css", "WorkLibrary.module.css"];
for (const f of [...appFiles, ...componentFiles]) {
  if (EXEMPT.some((e) => f.includes(e))) continue;
  const s = readFileSync(f, "utf8");
  const m = s.match(/text-\[[0-9.]+px\]/);
  if (m) fail(`arbitrary type size ${m[0]} in ${f} — use the ramp tokens`);
}

/* 5. one type system — no literal font-family in app/components; every
 * fontFamily/font-family must resolve through var(--font-*). Exemptions:
 * globals.css + layout.tsx define the tokens; VinylPlayer is frozen. */
const FONT_EXEMPT = ["app/globals.css", "app/layout.tsx", "VinylPlayer.tsx"];
for (const f of [...appFiles, ...componentFiles]) {
  if (FONT_EXEMPT.some((e) => f.includes(e))) continue;
  const s = readFileSync(f, "utf8");
  /* TSX: quoted string values (variables holding token strings pass) */
  for (const m of s.matchAll(/fontFamily\s*:\s*["']([^"']+)["']/g)) {
    if (!m[1].startsWith("var(--font-")) {
      fail(`literal font-family "${m[1]}" in ${f} — use the var(--font-*) tokens`);
    }
  }
  /* CSS: declaration values */
  for (const m of s.matchAll(/font-family\s*:\s*([^;}]+)/g)) {
    const v = m[1].trim();
    if (!v.startsWith("var(--font-") && v !== "inherit") {
      fail(`literal font-family "${v}" in ${f} — use the var(--font-*) tokens`);
    }
  }
}

/* 5b. Colour affordance (2026-07-17): saturated iris at body scale means
 * INTERACTIVE, only. Eyebrow/kicker styles must use --color-eyebrow
 * (muted ink), never the accent iris. Window scan: an accent-iris token
 * within 3 lines of an eyebrow/section-label/kicker marker fails. */
for (const f of [...appFiles, ...componentFiles]) {
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((l, i) => {
    /* --tracking-eyebrow is a typography token, not an eyebrow element:
       v5 secondary buttons legitimately pair it with iris text. Eyebrow
       selectors/classes still match. */
    if (!/eyebrow|section-label|kicker/i.test(l.replace(/--tracking-eyebrow/g, ""))) return;
    const windowText = lines.slice(i, i + 4).join("\n");
    if (/--color-accent-(ink|iris)\b/.test(windowText)) {
      fail(`iris on an eyebrow/kicker in ${f}:${i + 1} — eyebrows are wayfinding (use --color-eyebrow); iris at body scale means interactive`);
    }
  });
}

/* 6. Unique stays a display face — its tokens only appear in the
 * sanctioned hero/logo/display files. (Runtime <24px use is caught by
 * audit:contrast; this stops the drift at the source.) */
const UNIQUE_OK = ["app/globals.css", "app/layout.tsx", "components/Hero.module.css",
  "components/TestimonialSection.tsx"]; // quote glyph, recorded exception
for (const f of [...appFiles, ...componentFiles]) {
  if (UNIQUE_OK.some((e) => f.includes(e))) continue;
  const s = readFileSync(f, "utf8");
  if (/--font-hero-display|--font-unique/.test(s)) {
    fail(`Unique font token in ${f} — Unique renders only via the Heading primitive classes, home hero, or keycap logo (sanctioned files: ${UNIQUE_OK.join(", ")})`);
  }
}

console.log(fails === 0 ? "structure gate: PASS" : `structure gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
