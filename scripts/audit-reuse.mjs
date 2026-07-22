/* Reuse gate: one implementation, no orphans. Every component under
 * components/ must be imported somewhere in app/ or components/.
 * A dead copy that nothing renders is exactly how two implementations
 * drift apart, so it fails the build. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, basename } from "node:path";

/* VinylPlayer: frozen (pre-commit hook false-positive, see docs/fixes).
 * components/motion/*: a barrel library re-exported via motion/index.ts;
 * its members are legitimately consumed through the barrel. */
const EXEMPT = ["components/VinylPlayer.tsx", "components/motion/"];

const walk = (dir, exts) => {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p, exts));
    else if (exts.some((x) => p.endsWith(x))) out.push(p);
  }
  return out;
};

const components = walk("components", [".tsx"]);
const sources = [...walk("app", [".tsx", ".ts"]), ...walk("components", [".tsx", ".ts"])]
  .map((f) => ({ f, s: readFileSync(f, "utf8") }));

let fails = 0;
for (const c of components) {
  if (EXEMPT.some((e) => c.includes(e))) continue;
  const name = basename(c, ".tsx");
  const used = sources.some(
    ({ f, s }) => f !== c && new RegExp(`from ["'][^"']*\\b${name}["']`).test(s)
  );
  if (!used) {
    fails++;
    console.error(`REUSE FAIL: ${c} is imported nowhere — delete it or wire it in (one implementation, no orphans)`);
  }
}

/* ── Card-surface conformance (Elleta, 21 Jul 2026): ONE title
   implementation on content cards. Every raw <h3>/<h4> in app/ or
   components/ must carry the shared .heading-item recipe (the Heading
   primitive renders through <Heading>, unaffected), and the
   local-title fingerprint (an inline ramp-size + bold/semibold combo
   on a heading element) fails. Recorded exception: CaseCard's module
   .title on the recorded --font-card-title token (two-tier call
   pending, see _review/component-conformance.md). ── */
const CARD_TITLE_EXEMPT = [];
for (const { f, s: src } of sources) {
  if (CARD_TITLE_EXEMPT.some((e) => f.endsWith(e))) continue;
  const rawHeadings = src.match(/<h[34][^>]*>/g) ?? [];
  for (const tag of rawHeadings) {
    if (!/heading-item|card-statement|sr-only|ds-section__title/.test(tag)) {
      fails++;
      console.error(`REUSE FAIL: ${f} raw ${tag.slice(0, 60)}... without .heading-item — card titles share ONE recipe`);
    }
  }
  const fingerprint = /<(?:h[34]|span)[^>]*font-size-(?:base|lg|xl)\)\][^>]*font-(?:bold|semibold)/g;
  for (const m of src.match(fingerprint) ?? []) {
    fails++;
    console.error(`REUSE FAIL: ${f} local title recipe "${m.slice(0, 70)}" — use .heading-item`);
  }
  /* Unique never renders inside a Card (Elleta, 21 Jul, card-voice):
     a file that renders card surfaces (direct ui/Card or DisclosureCard
     import, or the .thesis-band statement surface) must not render the
     display Heading primitive; Unique stays page-tier. SectionHeader
     is fine: it renders outside the cards it introduces. */
  /* DesignSystemSpecimens: recorded exception (v3 T2) — the TYPE
     display specimens are Unique BY DEFINITION and render on the
     ground, outside every card; the runtime check in audit:type
     asserts no Unique computes inside a card scope. */
  /* DesignSystem2: the take-2 composition carries the same recorded
     exception (its Type ramp is the one on-ground unit); the runtime
     audit:type probe covers /design-system2 too. */
  const UNIQUE_IN_CARD_EXEMPT = ["components/DesignSystemSpecimens.tsx", "components/DesignSystem2.tsx"];
  const rendersCards = /from "@\/components\/ui\/(?:Card|DisclosureCard)"|className="thesis-band/.test(src);
  if (!UNIQUE_IN_CARD_EXEMPT.some((e) => f.endsWith(e)) && rendersCards && /<Heading[\s>]/.test(src)) {
    fails++;
    console.error(`REUSE FAIL: ${f} renders <Heading> in a file with Card surfaces — Unique never renders inside a Card (card-voice rule)`);
  }
}

console.log(fails === 0 ? "reuse gate: PASS" : `reuse gate: ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
