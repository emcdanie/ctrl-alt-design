"use client";

import { useCallback, useEffect, useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import TokenInspector from "@/components/TokenInspector";
import TokenAnnotation from "@/components/TokenAnnotation";
import { Select } from "@/components/ui/Select";
import Heading from "@/components/ui/Heading";

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
const ORB_TOKENS = CASE_ORBS.map((o) => [o.hi, o.lo] as const);
const ANN = {
  opening: ["--key-fill-hi", "--key-fill-lo", "--key-fill-edge", "--btn-key-radius", "--shadow-key-resting"],
  button: ["--color-accent-ink", "--btn-key-radius", "--spacing-touch-target"],
  seg: ["--color-glass", "--color-border-medium", "--radius-lg", "--color-semantic-accent-subtle", "--color-accent-ink"],
  chip: ["--color-border-medium", "--radius-full", "--color-semantic-background-inverse", "--color-semantic-text-inverse"],
  tagPill: ["--color-supporting-linen", "--color-accent-ink", "--color-semantic-accent-border"],
  select: ["--color-card", "--color-border-medium", "--radius-md", "--spacing-touch-target"],
  bubble: ["--hub-hi", "--hub-lo", "--shadow-orb"],
  /* the display face token itself is off-limits outside the Heading
     primitive (audit:structure); the size token is the annotation */
  typeDisplay: ["--font-hero"],
} as const;

const TYPE_ANN = TYPE_SPECIMENS.map((t) => [t.token] as const);

const ALL_TOKENS = [
  "--font-hero",
  ...CASE_ORBS.map((o) => o.hi),
  ...COLOUR_GROUPS.flatMap((g) => g.tokens),
  ...SPACING,
  ...RADII,
  ...TYPE_SPECIMENS.map((t) => t.token),
];

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
      {/* ── Overview ── */}
      <p className="ds-page__intro">
        BELLA is the design system behind this site, small on purpose: a token layer every
        surface resolves from, one control taxonomy with one job per control, and two
        typefaces with locked roles. This page is the system inspecting itself. Every value
        below is read live from computed styles, not copied into the page, so it cannot
        drift from the stylesheet. Flip the theme and watch the values follow.
      </p>
      <p className="ds-page__intro">
        It is also how I work with AI: the tokens rein the agent in, an agent can only
        build with what the system exposes, and the gate keeps it honest. Eleven audits run
        before anything ships. Green or it does not merge.
      </p>
      {/* the opening 3D moment: real keycaps, press them */}
      <div className="ds-opening" aria-label="Live keycap specimens, press them">
        <Button variant="primary">Press me</Button>
        <Button variant="secondary">Or me</Button>
        <span className="ds-type__meta">Real controls, not pictures. The whole page works this way.</span>
      </div>
      <TokenAnnotation tokens={ANN.opening} />

        </div>
      </div>

      {/* ── Case identity: colour IS identity. The one signature 3D
          moment: glossy orbs from the keycap-and-orb world, five case
          identities named, live token readouts beneath. ── */}
      <div className="ds-band ds-band--identity">
        <div className="layout-container">
          <section className="ds-section" aria-labelledby="ds-identity">
            <h2 id="ds-identity" className="ds-section__title">Case identity</h2>
            <p className="ds-section__note">
              Colour is identity: each case owns a hue, and the hue does the wayfinding.
            </p>
            <ul className="ds-caseband">
              {CASE_ORBS.map((o, i) => (
                <li key={o.hi} className="ds-caseband__item">
                  <span
                    className="ds-orb"
                    style={{ "--orb-hi": `var(${o.hi})`, "--orb-lo": `var(${o.lo})` } as React.CSSProperties}
                    aria-hidden="true"
                  />
                  <a className="ds-swatch__case" href={o.href}>{o.name}</a>
                  <span className="ds-swatch__name">{o.hi}</span>
                  <span className="ds-swatch__value">{values[o.hi] || "reading"}</span>
                  <TokenAnnotation tokens={ORB_TOKENS[i]} />
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
        <h2 id="ds-type" className="ds-section__title">Type</h2>
        {/* the oversized specimen: Unique at display scale, hero tier,
            accent-word treatment, live token readout */}
        <div className="ds-type__display">
          <Heading tier="hero" as="h3" accent="display.">
            Unique 700 carries the
          </Heading>
          <span className="ds-type__meta">--font-hero · {values["--font-hero"] || "reading"}</span>
          <TokenAnnotation tokens={ANN.typeDisplay} />
        </div>
        <ul className="ds-type">
          {TYPE_SPECIMENS.map((t, i) => (
            <li key={t.token} className="ds-type__row">
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
              <span className="ds-type__meta">
                {t.token} · {values[t.token] || "reading"}
              </span>
              <TokenAnnotation tokens={TYPE_ANN[i]} />
            </li>
          ))}
        </ul>
      </section>

        </div>
      </div>

      {/* ── Colour ── */}
      <div className="ds-band ds-band--card">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-colour">
        <h2 id="ds-colour" className="ds-section__title">Colour</h2>
        {COLOUR_GROUPS.map((g) => (
          <div key={g.title}>
            <p className="ds-section__kicker">{g.title}</p>
            <ul className="ds-swatches">
              {g.tokens.map((t) => (
                <li key={t} className="ds-swatch">
                  <span className="ds-swatch__plate" style={{ background: `var(${t})` }} aria-hidden="true" />
                  <span className="ds-swatch__name">{t}</span>
                  <span className="ds-swatch__value">{values[t] || "reading"}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

        </div>
      </div>

      {/* ── Spacing + radius ── */}
      <div className="ds-band">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-scales">
        <h2 id="ds-scales" className="ds-section__title">Spacing and radius</h2>
        <div className="ds-specimen-row">
          <div className="ds-specimen">
            <p className="ds-section__kicker">Spacing</p>
            <ul className="ds-scale">
              {SPACING.map((t) => (
                <li key={t} className="ds-scale__row">
                  <span className="ds-scale__bar" style={{ width: `var(${t})` }} aria-hidden="true" />
                  <span className="ds-swatch__name">{t}</span>
                  <span className="ds-swatch__value">{values[t] || "reading"}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ds-specimen">
            <p className="ds-section__kicker">Radius</p>
            <ul className="ds-scale">
              {RADII.map((t) => (
                <li key={t} className="ds-scale__row">
                  <span className="ds-scale__box" style={{ borderRadius: `var(${t})` }} aria-hidden="true" />
                  <span className="ds-swatch__name">{t}</span>
                  <span className="ds-swatch__value">{values[t] || "reading"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

        </div>
      </div>

      {/* ── Controls ── */}
      <div className="ds-band ds-band--card">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-controls">
        <h2 id="ds-controls" className="ds-section__title">Controls</h2>
        <p className="ds-section__note">
          One taxonomy: the keycap is reserved for true actions, and each control names its
          state in ARIA. The gate fails any view with more than one primary.
        </p>
        <div className="ds-specimen-row">
          <div className="ds-specimen">
            <p className="ds-section__kicker">Button</p>
            <p className="ds-type__meta">True actions only; max one primary per view. The page's ONE primary is the opening keycap above.</p>
            <div className="ds-specimen__body">
              <Button variant="secondary">Secondary</Button>
            </div>
            <TokenAnnotation tokens={ANN.button} />
          </div>
          <div className="ds-specimen">
            <p className="ds-section__kicker">SegmentedControl</p>
            <p className="ds-type__meta">Mutually exclusive views; single select, aria-current.</p>
            <div className="ds-specimen__body">
              <SegmentedControl
                label="Specimen views"
                options={[
                  { value: "table", label: "Table", icon: "Table" },
                  { value: "map", label: "Map", icon: "Map" },
                ]}
                value={view}
                onChange={setView}
              />
            </div>
            <TokenAnnotation tokens={ANN.seg} />
          </div>
          <div className="ds-specimen">
            <p className="ds-section__kicker">FilterChip</p>
            <p className="ds-type__meta">Multi-select filters; outline, aria-pressed, hover.</p>
            <div className="ds-specimen__body">
              {/* the REAL ui/FilterChip (21 Jul: redrawn copies replaced) */}
              <FilterChip pressed={chipOn} onClick={() => setChipOn(!chipOn)}>
                Design Tokens
              </FilterChip>
              <FilterChip pressed={!chipOn} onClick={() => setChipOn(!chipOn)}>
                Governance
              </FilterChip>
            </div>
            <TokenAnnotation tokens={ANN.chip} />
          </div>
          <div className="ds-specimen">
            <p className="ds-section__kicker">Tag and StatusPill</p>
            <p className="ds-type__meta">Tag: flat metadata wash, never clickable. StatusPill: quiet status.</p>
            <div className="ds-specimen__body">
              <Tag>Non-interactive metadata</Tag>
              <StatusPill>Current focus</StatusPill>
            </div>
            <TokenAnnotation tokens={ANN.tagPill} />
          </div>
          <div className="ds-specimen">
            <p className="ds-section__kicker">Select</p>
            <p className="ds-type__meta">Dropdowns like sort; native, styled, never a keycap.</p>
            <div className="ds-specimen__body">
              <Select
                label="Sort specimen"
                value={sortSpec}
                onChange={setSortSpec}
                options={[
                  { value: "year", label: "Year, newest first" },
                  { value: "title", label: "Title A-Z" },
                ]}
              />
            </div>
            <TokenAnnotation tokens={ANN.select} />
          </div>
          <div className="ds-specimen">
            <p className="ds-section__kicker">Bubble</p>
            <div className="ds-specimen__body">
              <span
                className="ds-orb ds-orb--small"
                style={{ "--orb-hi": "var(--hub-hi)", "--orb-lo": "var(--hub-lo)" } as React.CSSProperties}
                aria-hidden="true"
              />
              <span className="ds-type__meta">radial at 36% 30%, one light source, upper left</span>
            </div>
            <TokenAnnotation tokens={ANN.bubble} />
          </div>
        </div>
      </section>

        </div>
      </div>

      {/* ── Inspector ── */}
      <div className="ds-band">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-inspector">
        <h2 id="ds-inspector" className="ds-section__title">Token inspector</h2>
        <p className="ds-section__note">
          This is why the page cannot lie: pick a zone of the keycap and the readout shows
          the tokens driving it, values read from the running stylesheet at that moment,
          never copied into the page. If the system drifted, this page would show it.
        </p>
        <TokenInspector />
      </section>

        </div>
      </div>

      {/* ── For agents ── */}
      <div className="ds-band ds-band--card">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-agents">
        <h2 id="ds-agents" className="ds-section__title">What agents read</h2>
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
        <pre className="ds-agents__code">
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
        <h2 id="ds-rules" className="ds-section__title">Rules of the system</h2>
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
        <h2 id="ds-status" className="ds-section__title">Current status</h2>
        <div className="ds-status">
          <div>
            <p className="ds-section__kicker">Available now</p>
            <ul className="ds-status__list">
              <li>The token layer, both themes</li>
              <li>The control taxonomy, live on every page</li>
              <li>The gate, eleven audits and a pre-commit hook</li>
              <li>The dark-mode contract, AA on every route</li>
            </ul>
          </div>
          <div>
            <p className="ds-section__kicker">Coming next</p>
            <ul className="ds-status__list">
              <li>The Figma leg</li>
              <li>A Storybook workshop</li>
              <li>Agent-queryable BELLA Brain</li>
              <li>npx bella init distribution</li>
            </ul>
          </div>
        </div>
      </section>

        </div>
      </div>

      {/* ── The gate ── */}
      <div className="ds-band ds-band--card">
        <div className="layout-container">
      <section className="ds-section" aria-labelledby="ds-gate">
        <h2 id="ds-gate" className="ds-section__title">The gate</h2>
        <p className="ds-section__note">
          Eleven audits run before anything ships. Green or it does not merge. The cards below show the last local gate run (21 Jul 2026), labelled honestly as a snapshot, not live CI.
        </p>
        {/* scannable status-card grid (Elleta, 21 Jul, spec system-page-v2) */}
        <dl className="ds-gate">
          {GATE.map((g) => (
            <div key={g.name} className="ds-gate__row">
              <dt>
                {g.name} <span className="ds-gate__pass">PASS</span>
              </dt>
              <dd>{g.line}</dd>
            </div>
          ))}
        </dl>
      </section>
        </div>
      </div>
    </div>
  );
}
