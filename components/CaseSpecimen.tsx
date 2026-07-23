"use client";

import { useEffect, useState } from "react";
import SpecimenStage from "@/components/SpecimenStage";
import { FlagLeaders, type LeaderAnchor } from "@/components/TokenAnnotation";

/**
 * THE SHARED SPECIMEN (binding contract _proto/specimen.html): a
 * BELLA case card — glossy identity sphere, mono kicker, Geist bold
 * title, muted description, a case-tint tag — used by all three
 * interactive beats. The card's accent is a CASE colour (Operational
 * Clarity mint) so the iris annotation layer never collides. Token
 * flags carry a colour swatch of the ACTUAL resolved value and a
 * real BELLA token name; curved leaders run from each flag to the
 * exact part it names, terminating ON the part with a dot (or a ring
 * around the sphere and the corner), anchors computed from rendered
 * geometry. Elleta's review fix: the leader layer renders IN FRONT
 * of the card. Flags never overlap each other or the card and
 * leaders cross only empty ground (asserted in audit:visual; below
 * 720px the flags fall back to a wrapped lane above the card and the
 * leaders rest).
 *
 * Card copy is real: the Operational Clarity identity and its
 * approved one-line impact. In-card type is Geist only (the card
 * rule); Unique stays on the page ground.
 */

export interface SpecFlag {
  /** the token the flag names; also the leader key */
  token: string;
  /** the annotated part, mono uppercase */
  part: string;
  /** swatch shape: colour square, round sphere swatch, or the radius glyph */
  swatch: "square" | "round" | "radius";
  /** stage position (desktop) */
  pos: "tl" | "tr" | "t" | "bl" | "br";
  /** highlight zone = [data-part] value on the card */
  zone: string;
  /** leader landing */
  anchor: LeaderAnchor;
}

/** the five canonical flags from the specimen contract */
export const SPEC_FLAGS: readonly SpecFlag[] = [
  { token: "--case-clarity-hi", part: "identity", swatch: "round", pos: "tl", zone: "sphere", anchor: { sel: '[data-part="sphere"]', ring: true } },
  { token: "--color-ink-muted", part: "meta", swatch: "square", pos: "tr", zone: "kicker", anchor: { sel: '[data-part="kicker"]' } },
  { token: "--color-ink", part: "title", swatch: "square", pos: "t", zone: "title", anchor: { sel: '[data-part="title"]' } },
  { token: "--case-clarity-text", part: "tag", swatch: "square", pos: "bl", zone: "tag", anchor: { sel: '[data-part="tag"]' } },
  { token: "--radius-lg", part: "corner", swatch: "radius", pos: "br", zone: "corner", anchor: { sel: '[data-part="corner"]', ring: true } },
];

const ANCHORS: Record<string, LeaderAnchor> = Object.fromEntries(
  SPEC_FLAGS.map((f) => [f.token, f.anchor])
);

/** per-flag display state, driven by the beats */
export interface FlagState {
  /** the value line under the part label */
  label: string;
  tone?: "iris" | "drift" | "pass" | "fail";
}

export function useResolvedTokens(tokens: readonly string[]): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({});
  const namesKey = tokens.join("|");
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};
      for (const t of namesKey.split("|")) next[t] = cs.getPropertyValue(t).trim();
      setValues(next);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, [namesKey]);
  return values;
}

/** the card itself; parts carry [data-part] for leaders + highlights */
export function SpecimenCardBody() {
  return (
    <div className="csp-card" data-part="card">
      {/* the corner target: a zero-size point at the top-right radius */}
      <span className="csp-corner" data-part="corner" aria-hidden="true" />
      <span className="csp-sphere" data-part="sphere" aria-hidden="true" />
      <p className="csp-kicker" data-part="kicker">Data Dashboard · 2025</p>
      <p className="csp-title heading-item" data-part="title">Operational Clarity</p>
      <p className="csp-desc">One system, six operational domains, unified in an 8-week contract.</p>
      <span className="csp-tag" data-part="tag">Design Tokens</span>
    </div>
  );
}

/**
 * The full annotated specimen: stage + card + flags + leaders.
 * `flagStates` (keyed by token) overrides each flag's value line and
 * tone; absent entries default to the iris token name.
 */
export default function CaseSpecimen({
  flagStates = {},
  label = "On system",
  interactive = true,
  zone = null,
  onZone,
  children,
}: {
  flagStates?: Record<string, FlagState>;
  /** the stage state tag (the beats set it: On system / Before / …) */
  label?: string;
  /** flags are focusable buttons highlighting their part */
  interactive?: boolean;
  /** controlled highlight zone (the gate run's live pointer);
      overrides flag hover while set */
  zone?: string | null;
  onZone?: (zone: string | null) => void;
  /** extra stage content below the card (rails, consoles) */
  children?: React.ReactNode;
}) {
  return (
    <SpecimenStage label={label} zone={zone}>
      {(setZone) => {
        const zone = (z: string | null) => {
          setZone(z);
          onZone?.(z);
        };
        return (
          <div className="csp">
            <SpecimenCardBody />
            <FlagLeaders anchors={ANCHORS} />
            <div className="csp-flags">
              {SPEC_FLAGS.map((f) => {
                const st = flagStates[f.token];
                const tone = st?.tone ?? "iris";
                const label = st?.label ?? f.token;
                const Tag = interactive ? "button" : "span";
                return (
                  <Tag
                    key={f.token}
                    {...(interactive ? { type: "button" as const } : {})}
                    data-flag-token={f.token}
                    className={`csp-flag csp-flag--${f.pos} csp-flag--${tone}`}
                    onMouseEnter={interactive ? () => zone(f.zone) : undefined}
                    onMouseLeave={interactive ? () => zone(null) : undefined}
                    onFocus={interactive ? () => zone(f.zone) : undefined}
                    onBlur={interactive ? () => zone(null) : undefined}
                  >
                    {f.swatch === "radius" ? (
                      <span className="csp-flag__rad" aria-hidden="true" />
                    ) : (
                      <SwatchOf token={f.token} round={f.swatch === "round"} />
                    )}
                    <span className="csp-flag__text">
                      <span className="csp-flag__part">{f.part}</span>
                      <span className="csp-flag__val">{label}</span>
                    </span>
                  </Tag>
                );
              })}
            </div>
            {typeof children !== "undefined" && children}
          </div>
        );
      }}
    </SpecimenStage>
  );
}

/** a swatch of the token's ACTUAL resolved value */
function SwatchOf({ token, round }: { token: string; round?: boolean }) {
  const values = useResolvedTokens([token]);
  return (
    <span
      className={`csp-flag__sw${round ? " csp-flag__sw--round" : ""}`}
      style={{ background: values[token] || "transparent" }}
      aria-hidden="true"
    />
  );
}
