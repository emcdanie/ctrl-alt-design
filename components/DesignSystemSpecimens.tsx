"use client";

import { useCallback, useEffect, useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import TokenInspector from "@/components/TokenInspector";
import TokenAnnotation, { FlagLeaders, TokenName } from "@/components/TokenAnnotation";
import { Select } from "@/components/ui/Select";
import Heading from "@/components/ui/Heading";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import AiReadinessExplainer from "@/components/AiReadinessExplainer";
import BellaMaturityMap from "@/components/BellaMaturityMap";
import ContractPipeline from "@/components/ContractPipeline";

/**
 * §8 /design-system: the site inspecting itself. Every value on this
 * page is read at runtime from computed styles, so the page cannot
 * drift from the stylesheet it documents. Not a 5th nav item; entry
 * point is the footer colophon.
 */

const COLOUR_GROUPS: { title: string; tokens: string[] }[] = [
  {
    title: "Core",
    tokens: [
      "--color-semantic-background",
      "--color-card",
      "--color-ink",
      "--color-ink-soft",
      "--color-ink-muted",
      "--color-accent-ink",
    ],
  },
  {
    title: "Keycap",
    tokens: ["--key-face-hi", "--key-face-lo", "--key-fill-hi", "--key-fill-lo", "--key-fill-edge"],
  },
];

const SPACING = ["--spacing-2", "--spacing-3", "--spacing-4", "--spacing-6", "--spacing-8", "--spacing-12", "--spacing-16"];
const RADII = ["--radius-md", "--radius-lg", "--radius-xl", "--radius-2xl", "--radius-full"];

const TYPE_SPECIMENS = [
  /* the section tier is Unique 700 through the Heading primitive; the
     specimen renders the real primitive so the page cannot drift from it */
  { token: "--font-section-display", display: true, sample: "Unique 700, section titles" },
  { token: "--font-subsection", family: "var(--font-body)", weight: 600, transform: "none" as const, sample: "Geist carries body and headings" },
  { token: "--typography-font-size-tag", family: "var(--font-mono)", weight: 600, transform: "uppercase" as const, sample: "Geist caps and tracking run eyebrows" },
] as const;

/* Slip receipts (v3 T4, moved from the retired dark receipts section;
   her structure spec 21 Jul): what the check said / what it missed or
   caught / what changed. EVERY prose field is TODO(elleta) except the
   one line her spec supplied verbatim. Facts for her voice pass:
   - audit:parity: Travel Booking had no WORK_ITEMS row; /work showed
     5 of 6 cases and related rows never recommended it while every
     page-level check stayed green; the parity audit now fails
     registry/library divergence in both directions.
   - audit:axe: an external audit reported 8 ink-soft AA failures on
     the System page in dark; manual measurement cleared all 8
     (needs-review over gradients, worst 5.72:1) while the REAL miss
     was 3 readiness-map cells failing AA in dark that the page-level
     contrast sweep never sampled; axe on every node in both themes
     became the tripwire.
   - the CI run: run #1 came back red, the contact route built its
     Resend client at module scope and broke any build without the
     secret; fixed to lazy init before merge. The red run is history,
     told honestly.
   Section intro + closer are also her slots (from the same spec). */
const GATE_INTRO = "" /* TODO(elleta) ~2 sentences: why an external audit can be right in method and still wrong in verdict; what a page-level check can't see */;
const GATE_CLOSER = "" /* TODO(elleta) 1 line: checks moved from page level to component level in Storybook */;
const RECEIPT_LABELS = ["What the check said", "What it missed, or caught", "What changed"] as const;
type Receipt = { said: string; missedOrCaught: string; changed: string };
const GATE_RECEIPTS: Record<string, Receipt> = {
  "audit:parity": {
    said: "" /* TODO(elleta) */,
    missedOrCaught: "" /* TODO(elleta): the receipt in your words */,
    changed: "" /* TODO(elleta) */,
  },
  "audit:axe": {
    said: "" /* TODO(elleta) */,
    missedOrCaught: "" /* TODO(elleta): what the gate couldn't see and how the tripwire came from it */,
    changed: "" /* TODO(elleta) */,
  },
  "the CI run": {
    said: "" /* TODO(elleta) */,
    missedOrCaught: "Caught the Resend bug before merge." /* from her spec verbatim */,
    changed: "" /* TODO(elleta): one line on why a red first run is the system working, not failing */,
  },
};

const GATE = [
  { name: "audit:structure", line: "One route tree per case, the 1240 container everywhere, no arbitrary pixel classes, nothing off palette." },
  { name: "audit:contrast", line: "WCAG AA on every text node, both themes, worst gradient stop included. Unique below 24px fails outside the keycap logo." },
  { name: "audit:copy", line: "No em or en dashes, and one positioning term only." },
  { name: "audit:controls", line: "Keycaps are actions only, max one primary per view, filters and view switches carry their ARIA state." },
  { name: "audit:nda", line: "A whole-tree content grep against a private banned-terms list. Renamed files cannot hide from it." },
  { name: "audit:fonts", line: "Exactly two faces. Unique renders only through the display Heading primitive, the home hero, and the keycap lockup." },
  { name: "audit:tokens", line: "No colour literals and no raw spacing in app or components. Waivers are inline, reasoned, and counted." },
  { name: "audit:reuse", line: "Zero-import components fail. One implementation, no dead copy left rendering." },
  { name: "audit:parity", line: "Every case-study slug has exactly one library row and every case row resolves back to a slug. A case can never be routable but invisible." },
  { name: "audit:agents", line: "The agent surfaces (llms.txt, /api/bella.json) must match the live route registry. An agent surface that lies fails the build." },
  /* both of these ran in the gate but were missing from this list, so
     the page under-reported its own governance (27 Jul) */
  { name: "audit:contract", line: "Every component in the contract exists, every token reference resolves, and every prop and variant appears in the source. A contract that describes code that is not there fails the build." },
  { name: "audit:dark", line: "Every embedded surface adapts to the dark contract. An iframe that ships one skin fails the build." },
  { name: "audit:axe", line: "axe-core against every route in both themes; zero violations to pass. Needs-review nodes are counted and verified by hand." },
  { name: "audit:type", line: "No card surface renders reading text below 16px computed; the shared card body never below 18. Metadata rows are their own tier." },
  { name: "audit:visual", line: "One ground on the System page, sibling specimen cards render equal heights, cover placeholders clear 3:1." },
  /* the harness itself is part of how the gate works */
  { name: "the CI run", line: "tsc, the production build, and every audit run on each pull request and push to main; merge only on green." },
];

/* case identities render as the orb band; their tokens still feed the
   live readouts below each orb. ONE sphere size, one grid, aligned
   readouts (Elleta, 21 Jul, spec system-page-v2): eight items, the
   six cases + Design Lab + hub; the small modifier is retired. */
/* Curation (Elleta, 22 Jul 2026): archived-case identities keep their
   orbs (the tokens are real and live) but lose their links; only
   routable surfaces carry an href. */
const CASE_ORBS: readonly { hi: string; lo: string; name: string; href?: string }[] = [
  { hi: "--case-chip-hi", lo: "--case-chip-lo", name: "CHIP", href: "/case-studies/chip" },
  { hi: "--case-code-first-hi", lo: "--case-code-first-lo", name: "Code First", href: "/case-studies/brad-frost" },
  { hi: "--case-drift-hi", lo: "--case-drift-lo", name: "From Drift to Foundation", href: "/case-studies/design-system-transformation" },
  { hi: "--case-guardian-hi", lo: "--case-guardian-lo", name: "Guardian" },
  { hi: "--case-clarity-hi", lo: "--case-clarity-lo", name: "Operational Clarity" },
  { hi: "--case-filters-hi", lo: "--case-filters-lo", name: "Travel Booking" },
  { hi: "--case-design-lab-hi", lo: "--case-design-lab-lo", name: "Design Lab", href: "/work" },
  { hi: "--hub-hi", lo: "--hub-lo", name: "The hub (how I think)", href: "/about#how-i-think" },
] as const;

/* per-specimen attached tokens for the shared annotation (stable
   module-level arrays; every list verified against the recipe it
   names in globals.css). ONE flat list per card, one lane (Phase 2,
   audit section 5: FlagSpec.at collapsed away). */
const ORB_TOKENS = CASE_ORBS.map((o) => [o.hi, o.lo] as const);

const ANN = {
  button: ["--btn-key-radius", "--color-accent-ink", "--spacing-touch-target"],
  seg: ["--radius-lg", "--color-border-medium", "--color-semantic-accent-subtle"],
  chip: ["--radius-full", "--color-border-medium", "--color-semantic-background-inverse"],
  tagPill: ["--color-supporting-linen", "--color-accent-ink", "--color-semantic-accent-border"],
  select: ["--radius-md", "--color-border-medium", "--spacing-touch-target"],
  bubble: ["--hub-hi", "--hub-lo", "--shadow-orb"],
  /* the display face token itself is off-limits outside the Heading
     primitive (audit:structure); the size token is the annotation */
  typeDisplay: ["--font-hero"],
} as const;

/* only the swatch and scale readouts read here now; the flags and the
   Type band read their own values inside TokenAnnotation */
const ALL_TOKENS = [...COLOUR_GROUPS.flatMap((g) => g.tokens), ...SPACING, ...RADII];

/* stable per-row flag lists for the Type band ramp */
const TYPE_FLAGS = TYPE_SPECIMENS.map((t) => [t.token] as const);

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);



/* DEFECT 2 (27 Jul): computed colour values came back in whatever form
   the engine chose, so an 8-digit alpha hex rendered raw and ragged beside a plain
   6-digit one. ONE display form for every value: hex
   uppercased, alpha split off and shown as a percentage, so the value
   column reads as a column instead of a jumble. */
function formatTokenValue(raw: string): string {
  const v = raw.trim();
  if (!v) return "reading";
  const hex8 = v.match(/^#([0-9a-f]{6})([0-9a-f]{2})$/i);
  if (hex8) {
    const alpha = Math.round((parseInt(hex8[2], 16) / 255) * 100);
    return `#${hex8[1].toUpperCase()} ${alpha}%`;
  }
  const hex4 = v.match(/^#([0-9a-f]{3})([0-9a-f])$/i);
  if (hex4) {
    const alpha = Math.round((parseInt(hex4[2] + hex4[2], 16) / 255) * 100);
    return `#${hex4[1].toUpperCase()} ${alpha}%`;
  }
  if (/^#[0-9a-f]{3,6}$/i.test(v)) return v.toUpperCase();
  const rgba = v.match(/^rgba?\(([^)]+)\)$/i);
  if (rgba) {
    const parts = rgba[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (parts.length >= 3 && parts.slice(0, 3).every((n) => Number.isFinite(n))) {
      const hex = parts.slice(0, 3).map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");
      const a = parts[3];
      return a !== undefined && a < 1
        ? `#${hex.toUpperCase()} ${Math.round(a * 100)}%`
        : `#${hex.toUpperCase()}`;
    }
  }
  return v;
}

/* The ONE specimen card (v3 T2+T5): ui/Card carries every content
   unit; fixed-height head slot so demo areas start level, demo centred
   in the shared body recipe, annotation control pinned to the bottom.
   TYPE display specimens are the recorded exception (Unique never
   renders inside a Card) and stay on the ground. */
function SpecimenCard({
  kicker,
  note,
  tokens,
  center = true,
  flagsAriaHidden = false,
  children,
}: {
  kicker?: React.ReactNode;
  note?: React.ReactNode;
  tokens?: readonly string[];
  center?: boolean;
  /** flags duplicate visible inline text on this card */
  flagsAriaHidden?: boolean;
  children: React.ReactNode;
}) {
  /* proto slot order: head / lane / demo; ONE lane per card, tokens
     appear once; leaders live inside the demo and touch the specimen */
  return (
    <Card className="h-full" innerClassName="ds-card__inner">
      {(kicker || note) && (
        <div className="ds-card__head">
          {kicker && <p className="ds-section__kicker" style={{ margin: 0 }}>{kicker}</p>}
          {note && <p className="ds-section__note" style={{ margin: 0 }}>{note}</p>}
        </div>
      )}
      {tokens && <TokenAnnotation tokens={tokens} ariaHidden={flagsAriaHidden} />}
      <div className={center ? "ds-card__demo ds-card__demo--center" : "ds-card__demo"}>
        {tokens && <FlagLeaders />}
        {children}
      </div>
    </Card>
  );
}

export default function DesignSystemSpecimens({
  auditCount,
  auditCountWord,
}: {
  /* derived from the gate script at build (lib/bella/gate.ts); the
     page never types the number (defect 6) */
  auditCount: number;
  auditCountWord: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [view, setView] = useState("table");
  const [chipOn, setChipOn] = useState(true);
  const [sortSpec, setSortSpec] = useState("year");

  const read = useCallback(() => {
    const cs = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const t of ALL_TOKENS) next[t] = cs.getPropertyValue(t).trim();
    setValues(next);
  }, []);

  useEffect(() => {
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, [read]);

  return (
    <div className="ds-page">
      {/* D1 (Pass D): full-width specimen bands; text stays in the
         1240 container inside each band. */}
      <div className="ds-band">
        <div className="layout-container">
          <span id="ds-open" className="ds-anchor" aria-hidden="true" />
      {/* ── Two-column opening (v3 review, 22 Jul): [intro | specimen]
          at >=1024, stacked below, intro first. The specimen is THE
          keycap inspector, moved here (its band is gone), live and
          interactive, wearing static redline flags. ── */}
      <div className="ds-opening-grid">
        <div className="ds-opening-grid__intro">
          <p className="ds-page__intro">
            BELLA is the design system behind this site, small on purpose: a token layer every
            surface resolves from, one control taxonomy with one job per control, and two
            typefaces with locked roles. This page is the system inspecting itself. Every value
            below is read live from computed styles, not copied into the page, so it cannot
            drift from the stylesheet. Flip the theme and watch the values follow.
          </p>
          <p className="ds-page__intro">
            It is also how I work with AI: the tokens rein the agent in, an agent can only
            build with what the system exposes, and the gate keeps it honest. {capitalise(auditCountWord)} audits run
            before anything ships. Green or it does not merge.
          </p>
          {/* the opening 3D moment: real keycaps, press them */}
          <div className="ds-opening" aria-label="Live keycap specimens, press them">
            {/* DEMOTED to secondary (27 Jul): the pipeline instrument is
                this view's ONE primary, because it is the page's real
                action. This pair is a picture of the taxonomy, not an
                action, so it must not spend the primary budget
                (audit:controls fails on more than one per view). */}
            <Button variant="secondary">Press me</Button>
            <Button variant="secondary">Or me</Button>
            <span className="ds-section__note" style={{ margin: 0 }}>Real controls, not pictures. The whole page works this way.</span>
          </div>
        </div>
        <div className="ds-opening-grid__specimen">
          {/* the inspector's own lane is the annotation, inside the
              card (Phase 2: the outer lane is gone) */}
          <TokenInspector />
          <p className="ds-section__note" style={{ margin: 0 }}>
            This is why the page cannot lie: pick a zone of the keycap and the readout shows
            the tokens driving it, values read from the running stylesheet at that moment,
            never copied into the page. If the system drifted, this page would show it.
          </p>
        </div>
      </div>

        </div>
      </div>

      {/* ── THE LEAD PROOF (spec system-page-redesign, 27 Jul): the
          governed pipeline comes FIRST, not 60% down the page. Inverted
          pyramid: the strongest proof leads, the specimen shelf below
          recedes. This band replaces the retired ds-contract text
          columns from spec/system-contract-visible; that branch is
          closed unmerged, so the two never ship together. ── */}
      <div className="ds-band">
        <div className="layout-container">
          <span id="ds-agents" className="ds-anchor" aria-hidden="true" />
          <ContractPipeline />
        </div>
      </div>

      {/* ── The gate ── */}
      <div className="ds-band">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-gate">
        <SectionHeader id="ds-gate" title="How the gate works" className="ds-section__header" />
        <p className="ds-section__note">
          {capitalise(auditCountWord)} audits run before anything ships, locally and on every pull request.
          Green or it does not merge.
        </p>
        {GATE_INTRO.trim() !== "" && <p className="ds-section__note">{GATE_INTRO}</p>}
        {/* TABULAR DATA RENDERS AS A TABLE (spec system-page-redesign,
            27 Jul): this was a mosaic of card-per-audit, which made a
            scannable list of checks into fourteen competing surfaces.
            NO status column: the gate runs locally and in CI, not in
            this tab, so the page says what each check REFUSES and never
            asserts a green it cannot evidence. */}
        <div className="ds-gate-table-wrap">
          <table className="ds-gate-table">
            <caption className="sr-only">
              The checks that run before anything ships, and what each one refuses
            </caption>
            <thead>
              <tr>
                <th scope="col">Check</th>
                <th scope="col">What it refuses</th>
              </tr>
            </thead>
            <tbody>
              {GATE.map((g) => {
                const r = GATE_RECEIPTS[g.name];
                const lines = r ? [r.said, r.missedOrCaught, r.changed] : [];
                return (
                  <tr key={g.name}>
                    <th scope="row">{g.name}</th>
                    <td>
                      {g.line}
                      {lines.some((l) => l.trim() !== "") && (
                        <span className="ds-gate__receipt">
                          {lines.map(
                            (line, i) =>
                              line.trim() !== "" && (
                                <span key={RECEIPT_LABELS[i]} style={{ display: "block" }}>
                                  <strong>{RECEIPT_LABELS[i]}:</strong> {line}
                                </span>
                              )
                          )}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="ds-section__note" style={{ marginTop: "var(--spacing-6)" }}>
          Not covered yet, honestly: hover states are not pixel-snapshotted, and CI skips
          pixel comparison; the local gate enforces those.
        </p>
        {GATE_CLOSER.trim() !== "" && <p className="ds-section__note">{GATE_CLOSER}</p>}
      </section>
        </div>
      </div>
      {/* ── MATURITY (spec section J + item 4): the explainer is the
          framework, the map is the honest self-score. ONE band, not two.
          The map renders on the open ground, not in a card, and is the
          largest visual on the page. ── */}
      <div className="ds-band">
        <div className="layout-container">
          {/* ONE landmark for this band: BellaMaturityMap owns the
              <section aria-labelledby="ds-maturity">. The explainer is
              its framework caption and renders as a plain subsection,
              so axe sees one named region, not two identical ones. */}
          <AiReadinessExplainer />
          <BellaMaturityMap auditCount={auditCount} />
        </div>
      </div>

      {/* ── THE SPECIMEN SHELF (spec system-page-redesign section J):
          Identity, Type, Colour, Spacing and Controls collapse from five
          full bands into ONE recessive section. They are the parts, and
          the parts recede so the pipeline, the gate and the maturity map
          can lead. Each former band keeps its id as a live anchor, so
          every deep link that ever pointed here still resolves. ── */}
      <div className="ds-band">
        <div className="layout-container">
          <section className="ds-section ds-shelf" aria-labelledby="ds-specimens">
            <SectionHeader id="ds-specimens" title="The parts" className="ds-section__header" />
            <p className="ds-section__note">
              Every specimen below is live: the values are read from the running stylesheet, so
              this shelf cannot drift from the system it documents.
            </p>
{/* ── Case identity: colour IS identity. The one signature 3D
          moment: glossy orbs from the keycap-and-orb world, five case
          identities named, live token readouts beneath. Cards only,
          NO band wash: the DS2 modeless treatment ported from PR 40
          (the one part kept; the wash and its audit exception are
          deleted, so every band sits on the one ground). ── */}
          <section className="ds-section" aria-labelledby="ds-identity">
            <h3 id="ds-identity" className="heading-item ds-shelf__subhead">Case identity</h3>
            <p className="ds-section__note">
              Colour is identity: each case owns a hue, and the hue does the wayfinding.
            </p>
            <ul className="ds-caseband">
              {CASE_ORBS.map((o, i) => (
                <li key={o.hi} className="ds-caseband__item">
                  <SpecimenCard
                    kicker={
                      o.href ? (
                        <a className="ds-swatch__case" href={o.href}>{o.name}</a>
                      ) : (
                        /* same type treatment as the linked titles; only
                           the colour and underline mark a real link */
                        <span className="ds-casetitle">{o.name}</span>
                      )
                    }
                    tokens={ORB_TOKENS[i]}
                  >
                    <span
                      className="ds-orb"
                      style={{ "--orb-hi": `var(${o.hi})`, "--orb-lo": `var(${o.lo})` } as React.CSSProperties}
                      aria-hidden="true"
                    />
                  </SpecimenCard>
                </li>
              ))}
            </ul>
          </section>

{/* ── Type ── */}
      <section className="ds-section" aria-labelledby="ds-type">
        <h3 id="ds-type" className="heading-item ds-shelf__subhead">Type</h3>
        {/* the oversized specimen: Unique at display scale, hero tier,
            accent-word treatment, live token readout */}
        {/* fix 3 (22 Jul): the ramp uses its right column. Sample left,
            baseline leader, aligned annotation flag right; below
            1024px the flag returns under the sample. */}
        <ul className="ds-type">
          <li className="ds-type__row">
            <div className="ds-type__cell">
              <Heading tier="hero" as="h3" accent="display.">
                Unique 700 carries the
              </Heading>
            </div>
            <span className="ds-type__leader" aria-hidden="true" />
            <TokenAnnotation tokens={ANN.typeDisplay} />
          </li>
          {TYPE_SPECIMENS.map((t, i) => (
            <li key={t.token} className="ds-type__row">
              <div className="ds-type__cell">
                {"display" in t ? (
                  <Heading tier="section" as="h3" className="ds-type__sample" style={{ margin: 0 }}>
                    {t.sample}
                  </Heading>
                ) : (
                  <span
                    className="ds-type__sample"
                    style={{
                      fontFamily: t.family,
                      fontWeight: t.weight,
                      fontSize: `var(${t.token})`,
                      textTransform: t.transform,
                      letterSpacing: t.transform === "uppercase" && t.family.includes("mono") ? "0.12em" : undefined,
                    }}
                  >
                    {t.sample}
                  </span>
                )}
              </div>
              <span className="ds-type__leader" aria-hidden="true" />
              <TokenAnnotation tokens={TYPE_FLAGS[i]} />
            </li>
          ))}
        </ul>
      </section>

{/* ── Colour ── */}
      <section className="ds-section" aria-labelledby="ds-colour">
        <h3 id="ds-colour" className="heading-item ds-shelf__subhead">Colour</h3>
        <div className="ds-specimen-row">
          {COLOUR_GROUPS.map((g) => (
            <SpecimenCard key={g.title} kicker={g.title} center={false}>
              <ul className="ds-swatches">
                {g.tokens.map((t) => (
                  <li key={t} className="ds-swatch">
                    <span className="ds-swatch__plate" style={{ background: `var(${t})` }} aria-hidden="true" />
                    <span className="ds-swatch__name"><TokenName name={t} /></span>
                    <span className="ds-swatch__value">{formatTokenValue(values[t] || "")}</span>
                  </li>
                ))}
              </ul>
            </SpecimenCard>
          ))}
        </div>
      </section>

{/* ── Spacing + radius ── */}
      <section className="ds-section" aria-labelledby="ds-scales">
        <h3 id="ds-scales" className="heading-item ds-shelf__subhead">Spacing and radius</h3>
        <div className="ds-specimen-row">
          <SpecimenCard kicker="Spacing" center={false}>
            <ul className="ds-scale">
              {SPACING.map((t) => (
                <li key={t} className="ds-scale__row">
                  <span className="ds-scale__bar" style={{ width: `var(${t})` }} aria-hidden="true" />
                  <span className="ds-swatch__name"><TokenName name={t} /></span>
                  <span className="ds-swatch__value">{formatTokenValue(values[t] || "")}</span>
                </li>
              ))}
            </ul>
          </SpecimenCard>
          <SpecimenCard kicker="Radius" center={false}>
            <ul className="ds-scale">
              {RADII.map((t) => (
                <li key={t} className="ds-scale__row">
                  <span className="ds-scale__box" style={{ borderRadius: `var(${t})` }} aria-hidden="true" />
                  <span className="ds-swatch__name"><TokenName name={t} /></span>
                  <span className="ds-swatch__value">{formatTokenValue(values[t] || "")}</span>
                </li>
              ))}
            </ul>
          </SpecimenCard>
        </div>
      </section>

{/* ── Controls ── */}
      <section className="ds-section" aria-labelledby="ds-controls">
        <h3 id="ds-controls" className="heading-item ds-shelf__subhead">Controls</h3>
        <p className="ds-section__note">
          One taxonomy: the keycap is reserved for true actions, and each control names its
          state in ARIA. The gate fails any view with more than one primary.
        </p>
        <div className="ds-specimen-row">
          <SpecimenCard kicker="Button" note="True actions only; max one primary per view. The page's ONE primary is the opening keycap above." tokens={ANN.button}>
            <Button variant="secondary">Secondary</Button>
          </SpecimenCard>
          <SpecimenCard kicker="SegmentedControl" note="Mutually exclusive views; single select, aria-current." tokens={ANN.seg}>
            <SegmentedControl
              label="Specimen views"
              options={[
                { value: "table", label: "Table", icon: "Table" },
                { value: "map", label: "Map", icon: "Map" },
              ]}
              value={view}
              onChange={setView}
            />
          </SpecimenCard>
          <SpecimenCard kicker="FilterChip" note="Multi-select filters; outline, aria-pressed, hover." tokens={ANN.chip}>
            <FilterChip pressed={chipOn} onClick={() => setChipOn(!chipOn)}>
              Design Tokens
            </FilterChip>
            <FilterChip pressed={!chipOn} onClick={() => setChipOn(!chipOn)}>
              Governance
            </FilterChip>
          </SpecimenCard>
          <SpecimenCard kicker="Tag and StatusPill" note="Tag: flat metadata wash, never clickable. StatusPill: quiet status." tokens={ANN.tagPill}>
            <Tag>Non-interactive metadata</Tag>
            <StatusPill>Current focus</StatusPill>
          </SpecimenCard>
          <SpecimenCard kicker="Select" note="Dropdowns like sort; native, styled, never a keycap." tokens={ANN.select}>
            <Select
              label="Sort specimen"
              value={sortSpec}
              onChange={setSortSpec}
              options={[
                { value: "year", label: "Year, newest first" },
                { value: "title", label: "Title A-Z" },
              ]}
            />
          </SpecimenCard>
          <SpecimenCard kicker="Bubble" tokens={ANN.bubble}>
            <span
              className="ds-orb ds-orb--small"
              style={{ "--orb-hi": "var(--hub-hi)", "--orb-lo": "var(--hub-lo)" } as React.CSSProperties}
              aria-hidden="true"
            />
            <span className="ds-type__meta">radial at 36% 30%, one light source, upper left</span>
          </SpecimenCard>
        </div>
      </section>

          </section>
        </div>
      </div>

{/* ── THE QUIET CLOSE (spec section J): the constitution these came
          from, and what is next. Terminal, unstyled, recessive. ── */}
      <div className="ds-band">
        <div className="layout-container">
      <span id="ds-close" className="ds-anchor" aria-hidden="true" />
      <section className="ds-section" aria-labelledby="ds-rules">
        <SectionHeader id="ds-rules" title="Rules of the system" className="ds-section__header" />
        {/* Published constitution rules (Elleta, 21 Jul): wording
            verbatim or minimally trimmed from CLAUDE.md / DESIGN.md,
            never invented. */}
        <p className="ds-section__note">
          From the repo constitution, wording verbatim or minimally trimmed. These are the
          eight that define the system.
        </p>
        <ol className="ds-rules">
          <li>No hardcoded hex or px in components. Reference tokens only.</li>
          <li>One implementation: edit the live component and delete the old one. Never leave old and new both rendering.</li>
          <li>The primary is the one 3D moment per view, max one.</li>
          <li>Body min 16px. Never smaller for reading text.</li>
          <li>No em or en dashes anywhere. Use a period, a comma, or &quot;that&quot;.</li>
          <li>Unique is display only: never below 24px outside the keycap logo, never in body, UI, or chrome.</li>
          <li>WCAG AA on every text node, both themes.</li>
          <li>The gate must pass before any work is done. Green or it isn&apos;t done.</li>
        </ol>
      </section>

      {/* ── Current status ── */}
      <section className="ds-section" aria-labelledby="ds-status">
        <SectionHeader id="ds-status" title="Current status" className="ds-section__header" />
        <div className="ds-status">
          {/* ON THE GROUND (spec item 3): a list of facts is prose, not
              an inspectable specimen, so it loses the card. */}
          <div className="ds-statusgroup">
            <p className="ds-section__kicker" style={{ margin: 0 }}>Available now</p>
            <ul className="ds-status__list">
              <li>The token layer, both themes</li>
              <li>The control taxonomy, live on every page</li>
              <li>The gate, {auditCountWord} audits and a pre-commit hook</li>
              <li>The dark-mode contract, AA on every route</li>
            </ul>
          </div>
          {/* the coming list from the real plan docs (v3 T4): the
              Storybook extraction kickoff + standing status entries */}
          <div className="ds-statusgroup">
            <p className="ds-section__kicker" style={{ margin: 0 }}>Coming next</p>
            <ul className="ds-status__list">
              <li>Storybook, the full component set</li>
              <li>The Figma leg</li>
              <li>Agent-queryable BELLA Brain (MCP)</li>
              <li>npx bella init distribution</li>
              <li>BFW inspection baseline, pending</li>
            </ul>
          </div>
        </div>
      </section>

        </div>
      </div>

      
    </div>
  );
}
