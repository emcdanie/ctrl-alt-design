"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import TokenAnnotation, { FlagLeaders } from "@/components/TokenAnnotation";
import { Select } from "@/components/ui/Select";
import Heading from "@/components/ui/Heading";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";

/**
 * /design-system2: the SECOND System page (Elleta's brief, 22 Jul 2026,
 * via Cowork; spec specs/system2-modeless). Same content as
 * /design-system, recomposed on the modeless grammar
 * (docs/briefs/modeless-system-page-audit.md): one ground, the Card as
 * the only structural device, one metadata register, rules as numbered
 * law, the gate told as "how things slip", status as two honest card
 * columns. BELLA's look is untouched; only the grammar transfers.
 *
 * DELIBERATE PARALLEL IMPLEMENTATION: content data below is duplicated
 * from DesignSystemSpecimens.tsx because the brief forbids touching
 * page 1 while both render for her A/B. Exactly one of the two pages
 * survives the follow-up; the loser is deleted, never left rendering.
 */

/* ── content data (verbatim from DesignSystemSpecimens.tsx) ── */

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
  { token: "--font-section-display", display: true, sample: "Unique 700, section titles" },
  { token: "--font-subsection", family: "var(--font-body)", weight: 600, transform: "none" as const, sample: "Geist carries body and headings" },
  { token: "--typography-font-size-tag", family: "var(--font-mono)", weight: 600, transform: "uppercase" as const, sample: "Geist caps and tracking run eyebrows" },
] as const;

/* Slip receipts: every prose field is TODO(elleta) except the one line
   her spec supplied verbatim. The factual bones for her voice pass
   live beside the twin slots in DesignSystemSpecimens.tsx (parity
   miss, the axe/ink-soft story, CI run #1 and the Resend catch). */
const GATE_INTRO = "" /* TODO(elleta) */;
const GATE_CLOSER = "" /* TODO(elleta) */;
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

/* PR 40 amendment 4 (Elleta, 22 Jul): note text capped at two lines
   per card at 1440. Each line below is the sharpest trim of the page-1
   copy, nothing invented; page 1 keeps the long versions. */
const GATE = [
  { name: "audit:structure", line: "One route tree per case, one container, nothing off palette." },
  { name: "audit:contrast", line: "WCAG AA on every text node, both themes, gradients included." },
  { name: "audit:copy", line: "No em or en dashes, and one positioning term only." },
  { name: "audit:controls", line: "Keycaps are actions only, max one primary per view." },
  { name: "audit:nda", line: "A whole-tree grep against a private banned-terms list." },
  { name: "audit:fonts", line: "Exactly two faces, and Unique renders display only." },
  { name: "audit:tokens", line: "No colour literals and no raw spacing; waivers counted." },
  { name: "audit:reuse", line: "One implementation, no dead copy left rendering." },
  { name: "audit:parity", line: "A case can never be routable but invisible." },
  { name: "audit:agents", line: "An agent surface that lies fails the build." },
  { name: "audit:axe", line: "axe-core on every route, both themes, zero violations." },
  { name: "audit:type", line: "No reading text below 16px computed on a card surface." },
  { name: "audit:visual", line: "One ground, equal card rows, covers clearing 3:1." },
  { name: "the CI run", line: "Every audit on every pull request; merge only on green." },
];

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

const ORB_TOKENS = CASE_ORBS.map((o) => [o.hi, o.lo] as const);

const ANN = {
  button: ["--btn-key-radius", "--color-accent-ink", "--spacing-touch-target"],
  seg: ["--radius-lg", "--color-border-medium", "--color-semantic-accent-subtle"],
  chip: ["--radius-full", "--color-border-medium", "--color-semantic-background-inverse"],
  tagPill: ["--color-supporting-linen", "--color-accent-ink", "--color-semantic-accent-border"],
  select: ["--radius-md", "--color-border-medium", "--spacing-touch-target"],
  bubble: ["--hub-hi", "--hub-lo", "--shadow-orb"],
  typeDisplay: ["--font-hero"],
} as const;

const ALL_TOKENS = [...COLOUR_GROUPS.flatMap((g) => g.tokens), ...SPACING, ...RADII];
const TYPE_FLAGS = TYPE_SPECIMENS.map((t) => [t.token] as const);

/* Rules of the system: BELLA's published constitution has EIGHT, so
   the law runs 01-08 (the brief's 01-07 is Modeless's count, flagged
   in the PR). Wording verbatim from page 1. */
const RULES = [
  "No hardcoded hex or px in components. Reference tokens only.",
  "One implementation: edit the live component and delete the old one. Never leave old and new both rendering.",
  "The primary is the one 3D moment per view, max one.",
  "Body min 16px. Never smaller for reading text.",
  'No em or en dashes anywhere. Use a period, a comma, or "that".',
  "Unique is display only: never below 24px outside the keycap logo, never in body, UI, or chrome.",
  "WCAG AA on every text node, both themes.",
  "The gate must pass before any work is done. Green or it isn't done.",
];

const STATUS_NOW = [
  "The token layer, both themes",
  "The control taxonomy, live on every page",
  "The gate, thirteen audits and a pre-commit hook",
  "The dark-mode contract, AA on every route",
];
const STATUS_NEXT = [
  "Storybook, the full component set",
  "The Figma leg",
  "Agent-queryable BELLA Brain (MCP)",
  "npx bella init distribution",
  "BFW inspection baseline, pending",
];

/* ── the ONE specimen card (same recipe as page 1) ── */
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
      {tokens && <TokenAnnotation tokens={tokens} ariaHidden={flagsAriaHidden} />}
      <div className={center ? "ds-card__demo ds-card__demo--center" : "ds-card__demo"}>
        {tokens && <FlagLeaders />}
        {children}
      </div>
    </Card>
  );
}

/* ── the inspector, fixed recipe (brief item 10) ── */

const ZONES: { id: string; label: string; drives: string; flags: readonly string[] }[] = [
  {
    id: "face",
    label: "Face",
    drives: "The filled key face, a two-stop gradient. Fixed in both themes so the white label always clears AA.",
    flags: ["--key-fill-hi", "--key-fill-lo"],
  },
  {
    id: "label",
    label: "Label",
    drives: "Label colour, and the mono face all UI labels share.",
    flags: ["--key-face-hi", "--font-mono"],
  },
  {
    id: "radius",
    label: "Radius",
    drives: "Corner rounding, one alias deep: the key radius points at the scale.",
    flags: ["--btn-key-radius", "--radius-lg"],
  },
  {
    id: "edge",
    label: "Edge and shadow",
    drives: "The down-right plate edge and the resting cast shadow. Pressing the key swaps to the pressed pair.",
    flags: ["--key-fill-edge", "--shadow-key-resting"],
  },
  {
    id: "size",
    label: "Hit area",
    drives: "Minimum touch target on every interactive control.",
    flags: ["--spacing-touch-target"],
  },
];

/* the keycap's 3D plate overhang (mirrors the recorded key shadow,
   2px right / 5px down); the leader anchors and the ringwrap geometry
   in globals.css both derive from it */
const PLATE_X = 2;
const PLATE_Y = 5;

/** referent anchor per token (brief item 10): fill-hi upper face,
    fill-lo lower face, label tokens on the text, radius tokens on a
    corner arc, edge tokens below the key, hit area on the outline */
function anchorFor(token: string, k: DOMRect, radius: number, flagCx: number) {
  const cx = k.left + k.width / 2;
  const cy = k.top + k.height / 2;
  const arc = radius * 0.29; // point on the corner arc at 45 degrees
  switch (token) {
    case "--key-fill-hi":
      return { x: cx, y: k.top + k.height * 0.28 };
    case "--key-fill-lo":
      return { x: cx, y: k.top + k.height * 0.72 };
    case "--key-face-hi":
      return { x: k.left + k.width * 0.38, y: cy };
    case "--font-mono":
      return { x: k.left + k.width * 0.62, y: cy };
    case "--btn-key-radius":
      return { x: k.left + arc, y: k.top + arc };
    case "--radius-lg":
      return { x: k.right - arc, y: k.top + arc };
    case "--key-fill-edge":
      return { x: k.left + k.width * 0.4 + PLATE_X, y: k.bottom + PLATE_Y };
    case "--shadow-key-resting":
      return { x: k.left + k.width * 0.65 + PLATE_X, y: k.bottom + PLATE_Y };
    case "--spacing-touch-target":
      /* the hit-area outline is the key's own border box (its height
         rides the touch-target token); nearest point on the top edge */
      return { x: Math.max(k.left + 8, Math.min(flagCx, k.right - 8)), y: k.top };
    default:
      return { x: Math.max(k.left + 8, Math.min(flagCx, k.right - 8)), y: k.top };
  }
}

/** leader layer with per-referent anchors; same containment and
    redraw model as FlagLeaders, different anchor geometry */
function AnchoredLeaders({ zone }: { zone: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const host = svg.parentElement;
    const root = svg.closest(".tok-inspector");
    if (!host || !root) return;
    let raf = 0;

    const draw = () => {
      raf = 0;
      const lane = root.querySelector(".ds-flaglane");
      const key = root.querySelector(".tok-inspector__key");
      const dr = host.getBoundingClientRect();
      if (!lane || !key || dr.width < 1) {
        svg.replaceChildren();
        return;
      }
      svg.setAttribute("viewBox", `0 0 ${dr.width} ${dr.height}`);
      const k = key.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(key).borderTopLeftRadius) || 0;
      const lines: SVGLineElement[] = [];
      for (const f of lane.querySelectorAll(".ds-flag")) {
        const token = f.getAttribute("data-flag-token") ?? "";
        const fr = f.getBoundingClientRect();
        const x1 = fr.left + fr.width / 2 - dr.left;
        const y1 = Math.max(0, fr.bottom - dr.top);
        const a = anchorFor(token, k, radius, fr.left + fr.width / 2);
        const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l.setAttribute("x1", String(x1));
        l.setAttribute("y1", String(y1));
        l.setAttribute("x2", String(a.x - dr.left));
        l.setAttribute("y2", String(a.y - dr.top));
        lines.push(l);
      }
      svg.replaceChildren(...lines);
    };

    const queue = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    draw();
    const ro = new ResizeObserver(queue);
    ro.observe(root);
    const mo = new MutationObserver((muts) => {
      if (muts.some((m) => !svg.contains(m.target))) queue();
    });
    mo.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-pressed", "data-zone", "style"],
    });
    window.addEventListener("resize", queue);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", queue);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [zone]);

  return <svg ref={ref} className="ds-leaders" aria-hidden="true" />;
}

function Inspector2() {
  const [zone, setZone] = useState("face");
  const active = ZONES.find((z) => z.id === zone)!;

  return (
    /* grammar item 2: the inspector renders through the ONE ui/Card;
       the .ds2 scope strips .tok-inspector's own chrome so there is
       exactly one surface */
    <Card className="h-full" innerClassName="ds-card__inner">
      <div className="tok-inspector">
        <TokenAnnotation key={zone} tokens={active.flags} />
        <div className="tok-inspector__stage">
          <AnchoredLeaders zone={zone} />
          <span className="tok-inspector__ringwrap" data-zone={zone}>
            {/* fixed recipe: the ring keeps a uniform 2px VISUAL gap
                around the visible key including the 3D plate; the
                asymmetric ringwrap padding in the .ds2 scope reserves
                the space in flow (audit:visual asserts the gap) */}
            <span className="tok-inspector__ring" aria-hidden="true" />
            <span className="tok-inspector__key" aria-hidden="true">
              design
            </span>
          </span>
        </div>
        <div className="tok-inspector__zones" role="group" aria-label="Keycap anatomy zones">
          {ZONES.map((z) => (
            <button
              key={z.id}
              type="button"
              className="tok-inspector__zone"
              aria-pressed={zone === z.id}
              onClick={() => setZone(z.id)}
              onFocus={() => setZone(z.id)}
              onMouseEnter={() => setZone(z.id)}
            >
              {z.label}
            </button>
          ))}
        </div>
        <p className="tok-inspector__drives">{active.drives}</p>
      </div>
    </Card>
  );
}

/* ── the page composition ── */

export default function DesignSystem2() {
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
    <div className="ds2">
      {/* ── Tight opening (grammar item 3): head stacks straight into
          the intro; inspector beside it at equal column width ── */}
      <header className="ds2-head">
        <p className="ds-section__kicker" style={{ margin: 0 }}>BELLA, the system behind the site</p>
        <Heading tier="page" as="h1">
          Design system
        </Heading>
        <p className="ds-section__note" style={{ margin: 0 }}>
          The design system behind elleta.design: tokens, type, controls, and the governance
          gate, with every value read live from the running stylesheet.
        </p>
      </header>
      <div className="ds-opening-grid">
        <div className="ds-opening-grid__intro">
          <p className="ds-page__intro" style={{ marginTop: 0 }}>
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
          {/* two demo keycaps + ONE text link (grammar item 3) */}
          <div className="ds-opening" aria-label="Live keycap specimens, press them">
            <Button variant="primary">Press me</Button>
            <Button variant="secondary">Or me</Button>
            <a className="ds-swatch__case" href="#ds-rules">
              Rules of the system
            </a>
          </div>
        </div>
        <div className="ds-opening-grid__specimen">
          <Inspector2 />
          <p className="ds-section__note" style={{ margin: 0 }}>
            This is why the page cannot lie: pick a zone of the keycap and the readout shows
            the tokens driving it, values read from the running stylesheet at that moment,
            never copied into the page. If the system drifted, this page would show it.
          </p>
        </div>
      </div>

      {/* ── Case identity: inside cards only (grammar item 6), no band
          wash, no section background ── */}
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

      {/* ── Type: the ONE non-card unit, recorded deviation from
          grammar item 2 (Unique never renders inside a Card,
          constitution section 3, runtime-enforced) ── */}
      <section className="ds-section" aria-labelledby="ds-type">
        <SectionHeader id="ds-type" title="Type" className="ds-section__header" />
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

      {/* ── Spacing + radius ── */}
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

      {/* ── Controls ── */}
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

      {/* ── For agents ── */}
      <section className="ds-section" aria-labelledby="ds-agents">
        <SectionHeader id="ds-agents" title="What agents read" className="ds-section__header" />
        {/* TODO(elleta): voice-pass this copy (carried from page 1) */}
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

      {/* ── Rules as numbered law (grammar item 7), through cards ── */}
      <section className="ds-section" aria-labelledby="ds-rules">
        <SectionHeader id="ds-rules" title="Rules of the system" className="ds-section__header" />
        <p className="ds-section__note">
          From the repo constitution, wording verbatim or minimally trimmed. These are the
          eight that define the system.
        </p>
        <ol className="ds2-rules">
          {RULES.map((rule, i) => (
            <li key={rule}>
              <Card className="h-full" innerClassName="ds-card__inner ds2-rule">
                <span className="ds-section__kicker" style={{ margin: 0 }} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="ds-section__note" style={{ margin: 0 }}>{rule}</span>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Current status: two equal honest columns, rows through
          cards (grammar item 9) ── */}
      <section className="ds-section" aria-labelledby="ds-status">
        <SectionHeader id="ds-status" title="Current status" className="ds-section__header" />
        <div className="ds2-status">
          <div className="ds2-status__col">
            <p className="ds-section__kicker" style={{ margin: 0 }}>Available now</p>
            {STATUS_NOW.map((item) => (
              <Card key={item} innerClassName="ds-card__inner ds2-statusrow">
                <span className="ds-section__note" style={{ margin: 0 }}>{item}</span>
              </Card>
            ))}
          </div>
          <div className="ds2-status__col">
            <p className="ds-section__kicker" style={{ margin: 0 }}>Coming next</p>
            {STATUS_NEXT.map((item) => (
              <Card key={item} innerClassName="ds-card__inner ds2-statusrow">
                <span className="ds-section__note" style={{ margin: 0 }}>{item}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How things slip: the gate merged with the misses ledger
          (grammar item 8) ── */}
      <section className="ds-section" aria-labelledby="ds-gate">
        <SectionHeader id="ds-gate" title="How things slip" className="ds-section__header" />
        <p className="ds-section__note">
          Thirteen audits run before anything ships, locally and on every pull request.
          Green or it does not merge, and green only means something next to the reds it
          survived. Last local run: 22 Jul 2026.
        </p>
        {GATE_INTRO.trim() !== "" && <p className="ds-section__note">{GATE_INTRO}</p>}
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
  );
}
