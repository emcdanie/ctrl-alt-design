import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import caseStudies from "@/lib/content";
import { SKILLS, WORK_ITEMS } from "@/lib/workLibrary";
import componentContract from "@/lib/bella/component-contract.json";

/* FOR AI (2026-07-17): the machine-readable BELLA manifest. Everything
 * here is read from the SAME sources the site renders from (the live
 * stylesheets and the content registry), never a hand-maintained copy,
 * so it cannot drift. Read-only, no auth. audit:agents checks the slugs
 * against the live registry. */

export const dynamic = "force-static";

/* DTCG-shaped tokens (A3, bella-component-contract spec): three
 * tiers read from the SAME stylesheets the site renders from.
 * primitive = BELLA foundations (neutral/alpha scales, typography,
 * spacing, radius), semantic = --color-semantic-*, component =
 * --component-* plus the app layer (globals.css). A value that is
 * exactly var(--x) becomes the DTCG alias "{--x}"; $type is derived
 * where unambiguous. */
type DtcgToken = { $value: string; $type?: string };
type DtcgGroup = Record<string, DtcgToken>;

function dtcgToken(raw: string): DtcgToken {
  const aliasMatch = raw.match(/^var\((--[a-z0-9-]+)\)$/i);
  const $value = aliasMatch ? `{${aliasMatch[1]}}` : raw;
  let $type: string | undefined;
  if (!aliasMatch) {
    if (/^#[0-9a-f]{3,8}$|^(rgba?|hsla?|color-mix)\(/i.test(raw)) $type = "color";
    else if (/^-?\d*\.?\d+(px|rem|em)$/.test(raw)) $type = "dimension";
    else if (/gradient|shadow/i.test(raw)) $type = undefined;
  }
  return $type ? { $value, $type } : { $value };
}

function readTokens(): { primitive: DtcgGroup; semantic: DtcgGroup; component: DtcgGroup } {
  const primitive: DtcgGroup = {};
  const semantic: DtcgGroup = {};
  const component: DtcgGroup = {};
  const place = (file: string, name: string, value: string) => {
    /* Tailwind @theme passthroughs (--x: var(--x)) are plumbing, not
       definitions; the unlayered :root value is the real one */
    if (value === `var(${name})`) return;
    const t = dtcgToken(value);
    if (name.startsWith("--color-semantic-")) semantic[name] ??= t;
    else if (name.startsWith("--component-") || file === "app/globals.css") component[name] ??= t;
    else primitive[name] ??= t;
  };
  for (const file of ["lib/bella/bella.css", "app/globals.css"]) {
    const css = readFileSync(join(process.cwd(), file), "utf8");
    for (const m of css.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gim)) {
      place(file, m[1], m[2].trim());
    }
  }
  return { primitive, semantic, component };
}

export async function GET() {
  const body = {
    name: "BELLA",
    owner: "Elleta McDaniel",
    site: "elleta.design",
    positioning: "AI-enabled design systems",
    generatedFrom: ["app/globals.css", "lib/bella/bella.css", "lib/bella/component-contract.json", "lib/content.ts", "lib/workLibrary.ts"],
    tokens: readTokens(),
    /* the component contract (lean): real components only, variants
       as deltas, token $refs; audit:contract refuses a lying entry */
    components: componentContract.components,
    controlTaxonomy: [
      { control: "Button", use: "True actions only; max one primary per view." },
      { control: "SegmentedControl", use: "Mutually exclusive views; single select, aria-current." },
      { control: "FilterChip", use: "Multi-select filters; outline, aria-pressed, hover." },
      { control: "Select", use: "Dropdowns like sort; native, styled, never a keycap." },
      { control: "Tag", use: "Flat metadata wash, never clickable." },
      { control: "StatusPill", use: "Quiet status, non-interactive." },
    ],
    rules: [
      "Tokens only; a raw value fails the gate.",
      "No pure white and no pure black.",
      "Body text never below 16px.",
      "Two typefaces; Unique is display only.",
      "Saturated iris means interactive, and only that.",
      "One primary action per view.",
      "One light source, upper left.",
    ],
    cases: caseStudies.map((c) => ({
      slug: c.slug,
      title: c.title,
      route: `/case-studies/${c.slug}`,
    })),
    library: WORK_ITEMS.map((i) => ({
      id: i.id,
      title: i.title,
      medium: i.medium,
      skills: i.skills,
      colourTokens: { hi: i.hi, lo: i.lo, deep: i.deep, text: i.text },
      href: i.href,
    })),
    skills: SKILLS,
  };
  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
