/* Structural gate — fails the build when per-page drift patterns return.
 * Runs alongside audit:contrast (npm run audit:structure). */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { receipt } from "./lib/receipt.mjs";

let fails = 0;
/* the receipt (A1): every failure names the offender, the actual,
   and the expected — one format across all 13 audits */
const fail = (offender, got, expected) => { fails++; console.error(receipt("structure", offender, got, expected)); };

/* 1. ONE case-study render path — no per-case route dirs */
for (const entry of readdirSync("app/case-studies")) {
  if (entry !== "[slug]" && statSync(join("app/case-studies", entry)).isDirectory()) {
    fail(`app/case-studies/${entry}`, "a per-case route dir", "cases render via [slug] only");
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
  if (/amber/i.test(s)) fail(f, "an amber reference", "zero amber (constitution)");
  if (/#(C4956A|F2A25C|F59E0B|D97706)\b/i.test(s) && !f.includes("globals.css")) {
    fail(f, "a warm amber hex", "no amber anywhere");
  }
}

/* 3. every page sits in the container/rhythm system */
/* hero-landing: the home hero carries its own recorded container
   (Hero.module.css .hero, max-width var(--container-max)) */
const pageOk = /className="[^"]*(?<![\w-])(container|section)(?![\w-])|<Section\b|layout-container|page-container|layout-section|CaseShellV2|<Hero/;
for (const f of appFiles.filter((f) => f.endsWith("page.tsx"))) {
  const s = readFileSync(f, "utf8");
  if (!pageOk.test(s)) fail(f, "no container/section marker", "container / section / Section / CaseShellV2 / Hero (layout-container, page-container, layout-section are aliases)");
}

/* 4. no arbitrary px type in components (recorded proto exceptions excluded) */
const EXEMPT = ["Hero.module.css", "WorkSidebar", "CaseCard.module.css", "WorkLibrary.module.css"];
for (const f of [...appFiles, ...componentFiles]) {
  if (EXEMPT.some((e) => f.includes(e))) continue;
  const s = readFileSync(f, "utf8");
  const m = s.match(/text-\[[0-9.]+px\]/);
  if (m) fail(f, `arbitrary type size ${m[0]}`, "the ramp tokens, no text-[Npx]");
}

/* A BELLA component font token (var(--component-*-font-family)) passes only
   when lib/bella/bella.css resolves it to a Geist stack; any other value
   still fails (Elleta, 22 Sep 2026: the vendored Button). */
const BELLA_FONT_TOKENS = new Map(
  [...readFileSync("lib/bella/bella.css", "utf8").matchAll(/(--component-[a-z0-9-]+-font-family):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()])
);
const isBellaGeistToken = (v) => {
  const t = v.match(/^var\((--component-[a-z0-9-]+-font-family)\)$/)?.[1];
  return !!t && /^Geist\b/.test(BELLA_FONT_TOKENS.get(t) ?? "");
};
/* 5. one type system — no literal font-family in app/components; every
 * fontFamily/font-family must resolve through var(--font-*). Exemptions:
 * globals.css + layout.tsx define the tokens. */
const FONT_EXEMPT = ["app/globals.css", "app/layout.tsx"];
for (const f of [...appFiles, ...componentFiles]) {
  if (FONT_EXEMPT.some((e) => f.includes(e))) continue;
  const s = readFileSync(f, "utf8");
  /* TSX: quoted string values (variables holding token strings pass) */
  for (const m of s.matchAll(/fontFamily\s*:\s*["']([^"']+)["']/g)) {
    if (!m[1].startsWith("var(--font-")) {
      fail(`${f} fontFamily`, `"${m[1]}"`, "a var(--font-*) token");
    }
  }
  /* CSS: declaration values */
  for (const m of s.matchAll(/font-family\s*:\s*([^;}]+)/g)) {
    const v = m[1].trim();
    if (!v.startsWith("var(--font-") && v !== "inherit" && !isBellaGeistToken(v)) {
      fail(`${f} font-family`, `"${v}"`, "a var(--font-*) token");
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
      fail(`${f}:${i + 1} eyebrow/kicker`, "accent iris", "--color-eyebrow (iris at body scale means interactive)");
    }
  });
}

/* 6. Unique stays a display face — its tokens only appear in the
 * sanctioned hero/logo/display files. (Runtime <24px use is caught by
 * audit:contrast; this stops the drift at the source.) */
const UNIQUE_OK = ["app/globals.css", "app/layout.tsx", "components/Hero.module.css"];
for (const f of [...appFiles, ...componentFiles]) {
  if (UNIQUE_OK.some((e) => f.includes(e))) continue;
  const s = readFileSync(f, "utf8");
  if (/--font-hero-display|--font-unique/.test(s)) {
    fail(f, "a Unique font token", "the Heading primitive classes, home hero, or keycap logo only");
  }
}

/* 7. NUMERIC ALIGNMENT (Elleta, 2026-07-28, readability audit).
 *
 * A figure that sits in a column beside other figures is right-aligned
 * and tabular, so the values share a right edge and the digits share a
 * width. A column of numbers starting wherever the previous word ended
 * is not a column.
 *
 * This is a SOURCE check, not a rendered one: it reads the rules that
 * declare a numeric column and asserts each carries both properties.
 * The marker is the class name, because that is the only thing static
 * analysis can honestly recognise as "this cell holds a figure": rules
 * whose selector ends in a numeric noun (score, count, ratio, figure,
 * total, num, qty, pct). Naming one of those and then aligning it left
 * is the drift this catches. */
{
  const NUMERIC_RULE = /^\s*\.([a-z0-9_-]*(?:score|count|ratio|figure|total|num|qty|pct))\b[^{]*\{([^}]*)\}/gim;
  for (const f of [...appFiles, ...componentFiles]) {
    if (!f.endsWith(".css")) continue;
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(NUMERIC_RULE)) {
      const [, cls, body] = m;
      /* a rule that only sets colour or spacing is not laying the column
         out; require alignment only where the rule positions its text */
      if (!/text-align|font-variant-numeric|display\s*:\s*(grid|flex|table)/.test(body)) continue;
      const line = src.slice(0, m.index).split("\n").length;
      if (!/text-align\s*:\s*right/.test(body)) {
        fail(`${f}:${line} .${cls}`, "a numeric column that is not right-aligned", "text-align: right");
      }
      if (!/font-variant-numeric\s*:\s*[^;]*tabular-nums/.test(body)) {
        fail(`${f}:${line} .${cls}`, "a numeric column with proportional digits", "font-variant-numeric: tabular-nums");
      }
    }
  }
}

/* N. no ghost module classes: every `x.name` / `x["name"]` read off a CSS
 * module import must exist in that module. An undefined class renders as
 * no class at all, silently (the Learning table's stack list, 21 Sep). */
{
  const { dirname, resolve } = await import("node:path");
  const { existsSync } = await import("node:fs");
  const IMPORT = /import\s+(\w+)\s+from\s+["']([^"']+\.module\.css)["']/g;
  for (const f of [...appFiles, ...componentFiles]) {
    if (!f.endsWith(".tsx")) continue;
    const src = readFileSync(f, "utf8");
    for (const [, name, spec] of src.matchAll(IMPORT)) {
      const cssPath = spec.startsWith("@/") ? spec.slice(2) : resolve(dirname(f), spec);
      if (!existsSync(cssPath)) { fail(`${f} ${spec}`, "a missing CSS module", "an existing file"); continue; }
      const css = readFileSync(cssPath, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      const defined = new Set([...css.matchAll(/\.(-?[A-Za-z_][\w-]*)/g)].map((m) => m[1]));
      const USE = new RegExp(`\\b${name}(?:\\.([A-Za-z_]\\w*)|\\[["']([\\w-]+)["']\\])`, "g");
      for (const m of src.matchAll(USE)) {
        const cls = m[1] ?? m[2];
        if (!defined.has(cls)) {
          const line = src.slice(0, m.index).split("\n").length;
          fail(`${f}:${line} ${name}.${cls}`, "a class not defined in " + spec, "a class the module defines");
        }
      }
    }
  }
}

console.log(fails === 0 ? "structure gate: PASS" : `structure gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
