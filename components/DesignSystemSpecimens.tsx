"use client";

import { useCallback, useEffect, useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import TokenInspector from "@/components/TokenInspector";
import TokenAnnotation, { type FlagSpec } from "@/components/TokenAnnotation";
import { Select } from "@/components/ui/Select";
import Heading from "@/components/ui/Heading";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";

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
  { name: "audit:axe", line: "axe-core against every route in both themes; zero violations to pass. Needs-review nodes are counted and verified by hand." },
  { name: "audit:type", line: "No card surface renders reading text below 16px computed; the shared card body never below 18. Metadata rows are their own tier." },
  { name: "audit:visual", line: "One ground on the System page (identity wash excepted), sibling specimen cards render equal heights, cover placeholders clear 3:1." },
  /* the harness itself is part of how the gate works */
  { name: "the CI run", line: "tsc, the production build, and every audit run on each pull request and push to main; merge only on green." },
];

/* case identities render as the orb band; their tokens still feed the
   live readouts below each orb. ONE sphere size, one grid, aligned
   readouts (Elleta, 21 Jul, spec system-page-v2): eight items, the
   six cases + Design Lab + hub; the small modifier is retired. */
const CASE_ORBS = [
  { hi: "--case-chip-hi", lo: "--case-chip-lo", name: "CHIP", href: "/case-studies/chip" },
  { hi: "--case-code-first-hi", lo: "--case-code-first-lo", name: "Code First", href: "/case-studies/brad-frost" },
  { hi: "--case-drift-hi", lo: "--case-drift-lo", name: "From Drift to Foundation", href: "/case-studies/design-system-transformation" },
  { hi: "--case-guardian-hi", lo: "--case-guardian-lo", name: "Guardian", href: "/case-studies/guardian" },
  { hi: "--case-clarity-hi", lo: "--case-clarity-lo", name: "Operational Clarity", href: "/case-studies/un-operational-dashboard" },
  { hi: "--case-filters-hi", lo: "--case-filters-lo", name: "Travel Booking", href: "/case-studies/filters-decision-support-system" },
  { hi: "--case-design-lab-hi", lo: "--case-design-lab-lo", name: "Design Lab", href: "/work" },
  { hi: "--hub-hi", lo: "--hub-lo", name: "The hub (how I think)", href: "/about#how-i-think" },
] as const;

/* per-specimen attached tokens for the shared annotation (stable
   module-level arrays; every list verified against the recipe it
   names in globals.css) */
const ORB_TOKENS = CASE_ORBS.map(
  (o) =>
    [
      { token: o.hi, kind: "color", at: "top-left" },
      { token: o.lo, kind: "color", at: "bottom-right" },
    ] as const satisfies readonly FlagSpec[]
);
/* redline flag specs (v3 T6): radius at the corner, size on the edge,
   colour by the fill; <=4 flags per specimen so nothing overlaps */
const OPENING_FLAGS = [
  { token: "--btn-key-radius", kind: "radius", at: "top-left" },
  { token: "--key-fill-hi", kind: "color", at: "top-right" },
  /* all three ride the TOP lanes: the zone buttons own the space
     under the keycap (v3 polish overlap fix) */
  { token: "--key-fill-lo", kind: "color", at: "top" },
  /* no shadow flag here: the inspector's own Edge-and-shadow zone IS
     that annotation (no double display), and the zone row occupies the
     bottom-right lane */
] as const satisfies readonly FlagSpec[];

const ANN = {
  button: [
    { token: "--btn-key-radius", kind: "radius", at: "top-left" },
    { token: "--color-accent-ink", kind: "color", at: "bottom-left" },
    { token: "--spacing-touch-target", kind: "size", at: "bottom-right" },
  ] as const satisfies readonly FlagSpec[],
  seg: [
    { token: "--radius-lg", kind: "radius", at: "top-left" },
    { token: "--color-border-medium", kind: "color", at: "top-right" },
    { token: "--color-semantic-accent-subtle", kind: "color", at: "bottom-left" },
  ] as const satisfies readonly FlagSpec[],
  chip: [
    { token: "--radius-full", kind: "radius", at: "top-left" },
    { token: "--color-border-medium", kind: "color", at: "bottom-left" },
    { token: "--color-semantic-background-inverse", kind: "color", at: "bottom-right" },
  ] as const satisfies readonly FlagSpec[],
  tagPill: [
    { token: "--color-supporting-linen", kind: "color", at: "top-left" },
    { token: "--color-accent-ink", kind: "color", at: "bottom-left" },
    { token: "--color-semantic-accent-border", kind: "color", at: "bottom-right" },
  ] as const satisfies readonly FlagSpec[],
  select: [
    { token: "--radius-md", kind: "radius", at: "top-left" },
    { token: "--color-border-medium", kind: "color", at: "bottom-left" },
    { token: "--spacing-touch-target", kind: "size", at: "bottom-right" },
  ] as const satisfies readonly FlagSpec[],
  bubble: [
    { token: "--hub-hi", kind: "color", at: "top-left" },
    { token: "--hub-lo", kind: "color", at: "bottom-left" },
    { token: "--shadow-orb", kind: "shadow", at: "bottom-right" },
  ] as const satisfies readonly FlagSpec[],
  /* the display face token itself is off-limits outside the Heading
     primitive (audit:structure); the size token is the annotation */
  typeDisplay: ["--font-hero"],
} as const;

const ALL_TOKENS = [
  "--font-hero",
  ...CASE_ORBS.map((o) => o.hi),
  ...COLOUR_GROUPS.flatMap((g) => g.tokens),
  ...SPACING,
  ...RADII,
  ...TYPE_SPECIMENS.map((t) => t.token),
];

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
  tokens?: readonly (string | FlagSpec)[];
  center?: boolean;
  /** flags duplicate visible inline text on this card */
  flagsAriaHidden?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-full" innerClassName="ds-card__inner">
      {(kicker || note) && (
        <div className="ds-card__head">
          {kicker && <p className="ds-section__kicker" style={{ margin: 0 }}>{kicker}</p>}
          {note && <p className="ds-section__note" style={{ margin: 0 }}>{note}</p>}
        </div>
      )}
      {tokens && <TokenAnnotation tokens={tokens} variant="flags" lane="top" ariaHidden={flagsAriaHidden} />}
      <div className={center ? "ds-card__demo ds-card__demo--center" : "ds-card__demo"}>{children}</div>
      {tokens && <TokenAnnotation tokens={tokens} variant="flags" lane="bottom" ariaHidden={flagsAriaHidden} />}
    </Card>
  );
}

export default function DesignSystemSpecimens() {
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
            build with what the system exposes, and the gate keeps it honest. Thirteen audits run
            before anything ships. Green or it does not merge.
          </p>
          {/* the opening 3D moment: real keycaps, press them */}
          <div className="ds-opening" aria-label="Live keycap specimens, press them">
            <Button variant="primary">Press me</Button>
            <Button variant="secondary">Or me</Button>
            <span className="ds-section__note" style={{ margin: 0 }}>Real controls, not pictures. The whole page works this way.</span>
          </div>
        </div>
        <div className="ds-opening-grid__specimen">
          {/* containment law (22 Jul): the flag lane is IN-FLOW above
              the inspector, inside this column */}
          <TokenAnnotation tokens={OPENING_FLAGS} variant="flags" lane="top" />
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

      {/* ── Case identity: colour IS identity. The one signature 3D
          moment: glossy orbs from the keycap-and-orb world, five case
          identities named, live token readouts beneath. ── */}
      <div className="ds-band ds-band--identity">
        <div className="layout-container">
          <section className="ds-section" aria-labelledby="ds-identity">
            <SectionHeader id="ds-identity" title="Case identity" className="ds-section__header" />
            <p className="ds-section__note">
              Colour is identity: each case owns a hue, and the hue does the wayfinding.
            </p>
            <ul className="ds-caseband">
              {CASE_ORBS.map((o, i) => (
                <li key={o.hi} className="ds-caseband__item">
                  <SpecimenCard
                    kicker={<a className="ds-swatch__case" href={o.href}>{o.name}</a>}
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
        </div>
      </div>

      {/* ── Type ── */}
      <div className="ds-band">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-type">
        <SectionHeader id="ds-type" title="Type" className="ds-section__header" />
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
            <span className="ds-flag ds-flag--ramp">
              <span className="ds-flag__value">{values["--font-hero"] || "reading"}</span>
              <span className="ds-flag__token">--font-hero</span>
            </span>
          </li>
          {TYPE_SPECIMENS.map((t) => (
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
              <span className="ds-flag ds-flag--ramp">
                <span className="ds-flag__value">{values[t.token] || "reading"}</span>
                <span className="ds-flag__token">{t.token}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

        </div>
      </div>

      {/* ── Colour ── */}
      <div className="ds-band">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-colour">
        <SectionHeader id="ds-colour" title="Colour" className="ds-section__header" />
        <div className="ds-specimen-row">
          {COLOUR_GROUPS.map((g) => (
            <SpecimenCard key={g.title} kicker={g.title} center={false}>
              <ul className="ds-swatches">
                {g.tokens.map((t) => (
                  <li key={t} className="ds-swatch">
                    <span className="ds-swatch__plate" style={{ background: `var(${t})` }} aria-hidden="true" />
                    <span className="ds-swatch__name">{t}</span>
                    <span className="ds-swatch__value">{values[t] || "reading"}</span>
                  </li>
                ))}
              </ul>
            </SpecimenCard>
          ))}
        </div>
      </section>

        </div>
      </div>

      {/* ── Spacing + radius ── */}
      <div className="ds-band">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-scales">
        <SectionHeader id="ds-scales" title="Spacing and radius" className="ds-section__header" />
        <div className="ds-specimen-row">
          <SpecimenCard kicker="Spacing" center={false}>
            <ul className="ds-scale">
              {SPACING.map((t) => (
                <li key={t} className="ds-scale__row">
                  <span className="ds-scale__bar" style={{ width: `var(${t})` }} aria-hidden="true" />
                  <span className="ds-swatch__name">{t}</span>
                  <span className="ds-swatch__value">{values[t] || "reading"}</span>
                </li>
              ))}
            </ul>
          </SpecimenCard>
          <SpecimenCard kicker="Radius" center={false}>
            <ul className="ds-scale">
              {RADII.map((t) => (
                <li key={t} className="ds-scale__row">
                  <span className="ds-scale__box" style={{ borderRadius: `var(${t})` }} aria-hidden="true" />
                  <span className="ds-swatch__name">{t}</span>
                  <span className="ds-swatch__value">{values[t] || "reading"}</span>
                </li>
              ))}
            </ul>
          </SpecimenCard>
        </div>
      </section>

        </div>
      </div>

      {/* ── Controls ── */}
      <div className="ds-band">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-controls">
        <SectionHeader id="ds-controls" title="Controls" className="ds-section__header" />
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

        </div>
      </div>

      {/* ── For agents ── */}
      <div className="ds-band">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-agents">
        <SectionHeader id="ds-agents" title="What agents read" className="ds-section__header" />
        {/* TODO(elleta): voice-pass this copy; content is mechanical
            on purpose (21 Jul brief: no hype claims) */}
        <p className="ds-section__note">
          Two machine-readable surfaces ship with the site, generated from the same
          registry that renders these pages.{" "}
          <a href="/llms.txt" className="ds-swatch__case">/llms.txt</a> is a plain-text
          map of the routes, case studies, and their headlines.{" "}
          <a href="/api/bella.json" className="ds-swatch__case">/api/bella.json</a> is a
          JSON endpoint serving the token layer, the control taxonomy, the rules, and
          the case registry. The audit:agents gate fails the build if either surface
          disagrees with the live route registry.
        </p>
        <Card innerClassName="ds-card__inner">
        <pre className="ds-agents__code" style={{ margin: 0 }}>
          <code>{`curl https://elleta.design/api/bella.json

{
  "name": "BELLA",
  "owner": "Elleta McDaniel",
  "positioning": "AI-enabled design systems",
  "tokens": { "--color-page": "...", "--color-card": "...", 300+ more },
  "controlTaxonomy": [{ "control": "Button", "use": "True actions only; ..." }],
  "rules": ["Tokens only; a raw value fails the gate.", ...],
  "cases": [{ "slug": "chip", "route": "/case-studies/chip" }, ...]
}`}</code>
        </pre>
        </Card>
        <p className="ds-section__note">
          Coming next, per the status below: the agent-queryable BELLA Brain (MCP).
        </p>
      </section>

        </div>
      </div>

      {/* ── Rules of the system ── */}
      <div className="ds-band">
        <div className="layout-container">
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
          <SpecimenCard kicker="Available now" center={false}>
            <ul className="ds-status__list">
              <li>The token layer, both themes</li>
              <li>The control taxonomy, live on every page</li>
              <li>The gate, thirteen audits and a pre-commit hook</li>
              <li>The dark-mode contract, AA on every route</li>
            </ul>
          </SpecimenCard>
          {/* the coming list from the real plan docs (v3 T4): the
              Storybook extraction kickoff + standing status entries */}
          <SpecimenCard kicker="Coming next" center={false}>
            <ul className="ds-status__list">
              <li>Storybook, the full component set</li>
              <li>The Figma leg</li>
              <li>Agent-queryable BELLA Brain (MCP)</li>
              <li>npx bella init distribution</li>
              <li>BFW inspection baseline, pending</li>
            </ul>
          </SpecimenCard>
        </div>
      </section>

        </div>
      </div>

      {/* ── The gate ── */}
      <div className="ds-band">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-gate">
        <SectionHeader id="ds-gate" title="How the gate works" className="ds-section__header" />
        <p className="ds-section__note">
          Thirteen audits run before anything ships, locally and on every pull request.
          Green or it does not merge. Last local run: 21 Jul 2026.
        </p>
        {GATE_INTRO.trim() !== "" && <p className="ds-section__note">{GATE_INTRO}</p>}
        {/* one card per audit: what it catches, and where real, the
            receipt of a slip (v3 T4; no bare grid of green chips) */}
        <div className="ds-gate">
          {GATE.map((g) => {
            const r = GATE_RECEIPTS[g.name];
            const lines = r ? [r.said, r.missedOrCaught, r.changed] : [];
            return (
              <SpecimenCard key={g.name} kicker={g.name} center={false}>
                <p className="ds-section__note" style={{ margin: 0 }}>{g.line}</p>
                {lines.some((l) => l.trim() !== "") && (
                  <div className="ds-gate__receipt">
                    {lines.map(
                      (line, i) =>
                        line.trim() !== "" && (
                          <p key={RECEIPT_LABELS[i]} className="ds-section__note" style={{ margin: 0 }}>
                            <strong>{RECEIPT_LABELS[i]}:</strong> {line}
                          </p>
                        )
                    )}
                  </div>
                )}
              </SpecimenCard>
            );
          })}
        </div>
        <p className="ds-section__note" style={{ marginTop: "var(--spacing-6)" }}>
          Not covered yet, honestly: hover states are not pixel-snapshotted, and CI skips
          pixel comparison; the local gate enforces those.
        </p>
        {GATE_CLOSER.trim() !== "" && <p className="ds-section__note">{GATE_CLOSER}</p>}
      </section>
        </div>
      </div>

    </div>
  );
}
