import { NextResponse } from "next/server";
import caseStudies from "@/lib/content";
import { SKILLS, WORK_ITEMS } from "@/lib/workLibrary";
import componentContract from "@/lib/bella/component-contract.json";
import { readTokens } from "@/lib/bella/tokens";

/* FOR AI (2026-07-17): the machine-readable BELLA manifest. Everything
 * here is read from the SAME sources the site renders from (the live
 * stylesheets and the content registry), never a hand-maintained copy,
 * so it cannot drift. Read-only, no auth. audit:agents checks the slugs
 * against the live registry. */

export const dynamic = "force-static";

/* readTokens lives in lib/bella/tokens.ts (2026-07-27, spec
 * system-page-redesign) so the endpoint, the page counts, and the
 * pipeline instrument all run ONE reader. Output unchanged by the move,
 * verified byte-identical. */

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
