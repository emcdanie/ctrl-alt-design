"use client";

import { useCallback, useEffect, useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import TokenInspector from "@/components/TokenInspector";

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
    title: "Case identity",
    tokens: [
      "--case-code-first-hi",
      "--case-drift-hi",
      "--case-guardian-hi",
      "--case-clarity-hi",
      "--case-design-lab-hi",
      "--case-writing-hi",
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
];

const ALL_TOKENS = [
  ...COLOUR_GROUPS.flatMap((g) => g.tokens),
  ...SPACING,
  ...RADII,
  ...TYPE_SPECIMENS.map((t) => t.token),
];

export default function DesignSystemSpecimens() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [view, setView] = useState("table");
  const [chipOn, setChipOn] = useState(true);

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
      <p className="ds-page__intro">
        This site is its own small design system, and this page is it inspecting itself.
        Every value below is read live from computed styles, not copied into the page,
        so it cannot drift from the stylesheet. Flip the theme and watch the values follow.
      </p>

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
            <div className="ds-specimen__body">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
            </div>
          </div>
          <div className="ds-specimen">
            <p className="ds-section__kicker">SegmentedControl</p>
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
            <div className="ds-specimen__body">
              <span className="tag">Non-interactive metadata</span>
              <span className="status-pill">Current focus</span>
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
          Pick a zone of the keycap. The readout shows the tokens driving it, values
          straight from the running stylesheet.
        </p>
        <TokenInspector />
      </section>

      {/* ── The gate ── */}
      <section className="ds-section" aria-labelledby="ds-gate">
        <h2 id="ds-gate" className="ds-section__title">The gate</h2>
        <p className="ds-section__note">
          Five audits run before anything ships. Green or it does not merge.
        </p>
        <dl className="ds-gate">
          {GATE.map((g) => (
            <div key={g.name} className="ds-gate__row">
              <dt>{g.name}</dt>
              <dd>{g.line}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
