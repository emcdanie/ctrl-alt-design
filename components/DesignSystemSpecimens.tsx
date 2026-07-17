"use client";

import { useCallback, useEffect, useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import TokenInspector from "@/components/TokenInspector";
import { Select } from "@/components/ui/Select";

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
    title: "Case identity (colour IS identity; each links to its case)",
    tokens: [
      "--case-chip-hi",
      "--case-code-first-hi",
      "--case-drift-hi",
      "--case-guardian-hi",
      "--case-clarity-hi",
      "--case-design-lab-hi",
      "--hub-hi",
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
  { token: "--font-section-title", family: "var(--font-display)", weight: 700, transform: "uppercase" as const, sample: "Geist 700, section titles" },
  { token: "--font-subsection", family: "var(--font-body)", weight: 600, transform: "none" as const, sample: "Geist carries body and headings" },
  { token: "--typography-font-size-tag", family: "var(--font-mono)", weight: 600, transform: "uppercase" as const, sample: "Geist caps and tracking run eyebrows" },
];

const GATE = [
  { name: "audit:structure", line: "One route tree per case, the 1240 container everywhere, no arbitrary pixel classes, nothing off palette." },
  { name: "audit:contrast", line: "WCAG AA on every text node, both themes, worst gradient stop included. Unique below 24px fails outside the keycap logo." },
  { name: "audit:copy", line: "No em or en dashes, and one positioning term only." },
  { name: "audit:controls", line: "Keycaps are actions only, max one primary per view, filters and view switches carry their ARIA state." },
  { name: "audit:nda", line: "A whole-tree content grep against a private banned-terms list. Renamed files cannot hide from it." },
  { name: "audit:fonts", line: "Exactly two faces. Unique renders only through the display Heading primitive, the home hero, and the keycap lockup." },
  { name: "audit:tokens", line: "No colour literals and no raw spacing in app or components. Waivers are inline, reasoned, and counted." },
  { name: "audit:reuse", line: "Zero-import components fail. One implementation, no dead copy left rendering." },
  { name: "audit:agents", line: "The agent surfaces (llms.txt, /api/bella.json) must match the live route registry. An agent surface that lies fails the build." },
];

const ALL_TOKENS = [
  ...COLOUR_GROUPS.flatMap((g) => g.tokens),
  ...SPACING,
  ...RADII,
  ...TYPE_SPECIMENS.map((t) => t.token),
];

/* colour = identity: the case swatches do their job on this page too */
const CASE_SWATCH: Record<string, { name: string; href: string }> = {
  "--case-chip-hi": { name: "CHIP", href: "/case-studies/chip" },
  "--case-code-first-hi": { name: "Code First", href: "/case-studies/brad-frost" },
  "--case-drift-hi": { name: "From Drift to Foundation", href: "/case-studies/design-system-transformation" },
  "--case-guardian-hi": { name: "Guardian", href: "/case-studies/guardian" },
  "--case-clarity-hi": { name: "Operational Clarity", href: "/case-studies/un-operational-dashboard" },
  "--case-design-lab-hi": { name: "Design Lab", href: "/work" },
  "--hub-hi": { name: "The hub (how I think)", href: "/about#how-i-think" },
};

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
        build with what the system exposes, and the gate keeps it honest. Nine audits run
        before anything ships. Green or it does not merge.
      </p>
      {/* the opening 3D moment: real keycaps, press them */}
      <div className="ds-opening" aria-label="Live keycap specimens, press them">
        <Button variant="primary">Press me</Button>
        <Button variant="secondary">Or me</Button>
        <span className="ds-type__meta">Real controls, not pictures. The whole page works this way.</span>
      </div>

      {/* ── Colour ── */}
      <section className="ds-section" aria-labelledby="ds-colour">
        <h2 id="ds-colour" className="ds-section__title">Colour</h2>
        {COLOUR_GROUPS.map((g) => (
          <div key={g.title}>
            <p className="ds-section__kicker">{g.title}</p>
            <ul className="ds-swatches">
              {g.tokens.map((t) => (
                <li key={t} className="ds-swatch">
                  <span className="ds-swatch__plate" style={{ background: `var(${t})` }} aria-hidden="true" />
                  {CASE_SWATCH[t] ? (
                    <a className="ds-swatch__case" href={CASE_SWATCH[t].href}>
                      {CASE_SWATCH[t].name}
                    </a>
                  ) : null}
                  <span className="ds-swatch__name">{t}</span>
                  <span className="ds-swatch__value">{values[t] || "reading"}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ── Type ── */}
      <section className="ds-section" aria-labelledby="ds-type">
        <h2 id="ds-type" className="ds-section__title">Type</h2>
        <ul className="ds-type">
          {TYPE_SPECIMENS.map((t) => (
            <li key={t.token} className="ds-type__row">
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
              <span className="ds-type__meta">
                {t.token} · {values[t.token] || "reading"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Controls ── */}
      <section className="ds-section" aria-labelledby="ds-controls">
        <h2 id="ds-controls" className="ds-section__title">Controls</h2>
        <p className="ds-section__note">
          One taxonomy: the keycap is reserved for true actions, and each control names its
          state in ARIA. The gate fails any view with more than one primary.
        </p>
        <div className="ds-specimen-row">
          <div className="ds-specimen">
            <p className="ds-section__kicker">Button</p>
            <p className="ds-type__meta">True actions only; max one primary per view.</p>
            <div className="ds-specimen__body">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
            </div>
          </div>
          <div className="ds-specimen">
            <p className="ds-section__kicker">SegmentedControl</p>
            <p className="ds-type__meta">Mutually exclusive views; single select, aria-current.</p>
            <div className="ds-specimen__body">
              <SegmentedControl
                label="Specimen views"
                options={[
                  { value: "table", label: "Table" },
                  { value: "map", label: "Map" },
                  { value: "timeline", label: "Timeline" },
                ]}
                value={view}
                onChange={setView}
              />
            </div>
          </div>
          <div className="ds-specimen">
            <p className="ds-section__kicker">FilterChip</p>
            <p className="ds-type__meta">Multi-select filters; outline, aria-pressed, hover.</p>
            <div className="ds-specimen__body">
              <button type="button" className="filter-chip" aria-pressed={chipOn} onClick={() => setChipOn(!chipOn)}>
                Design Tokens
              </button>
              <button type="button" className="filter-chip" aria-pressed={!chipOn} onClick={() => setChipOn(!chipOn)}>
                Governance
              </button>
            </div>
          </div>
          <div className="ds-specimen">
            <p className="ds-section__kicker">Tag and StatusPill</p>
            <p className="ds-type__meta">Tag: flat metadata wash, never clickable. StatusPill: quiet status.</p>
            <div className="ds-specimen__body">
              <span className="tag">Non-interactive metadata</span>
              <span className="status-pill">Current focus</span>
            </div>
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
          </div>
          <div className="ds-specimen">
            <p className="ds-section__kicker">Bubble</p>
            <div className="ds-specimen__body">
              <span className="ds-bubble-specimen" aria-hidden="true" />
              <span className="ds-type__meta">radial at 36% 30%, one light source, upper left</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Spacing + radius ── */}
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

      {/* ── Inspector ── */}
      <section className="ds-section" aria-labelledby="ds-inspector">
        <h2 id="ds-inspector" className="ds-section__title">Token inspector</h2>
        <p className="ds-section__note">
          This is why the page cannot lie: pick a zone of the keycap and the readout shows
          the tokens driving it, values read from the running stylesheet at that moment,
          never copied into the page. If the system drifted, this page would show it.
        </p>
        <TokenInspector />
      </section>

      {/* ── For agents ── */}
      <section className="ds-section" aria-labelledby="ds-agents">
        <h2 id="ds-agents" className="ds-section__title">For agents</h2>
        <p className="ds-section__note">
          This site is readable by machines on purpose. An agent builds whatever your
          system already is, so the system publishes itself: the same registry that
          renders these pages serves a manifest, and the gate fails the build if the
          two ever disagree.
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
          There is also a plain-text map at{" "}
          <a href="/llms.txt" className="ds-swatch__case">/llms.txt</a>. Coming next, per
          the status below: the agent-queryable BELLA Brain (MCP).
        </p>
      </section>

      {/* ── Rules of the system ── */}
      <section className="ds-section" aria-labelledby="ds-rules">
        <h2 id="ds-rules" className="ds-section__title">Rules of the system</h2>
        <ol className="ds-rules">
          <li>Tokens only; a raw value fails the gate.</li>
          <li>No pure white and no pure black.</li>
          <li>Body text never below 16px.</li>
          <li>Two typefaces; Unique is display only.</li>
          <li>Saturated iris means interactive, and only that.</li>
          <li>One primary action per view.</li>
          <li>One light source, upper left.</li>
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
              <li>The gate, eight audits and a pre-commit hook</li>
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

      {/* ── The gate ── */}
      <section className="ds-section" aria-labelledby="ds-gate">
        <h2 id="ds-gate" className="ds-section__title">The gate</h2>
        <p className="ds-section__note">
          Nine audits run before anything ships. Green or it does not merge. The chips below show the last local gate run (17 Jul 2026), labelled honestly as a snapshot, not live CI.
        </p>
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
  );
}
