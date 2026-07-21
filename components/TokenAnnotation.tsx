"use client";

import { useCallback, useEffect, useId, useState } from "react";

/**
 * The ONE specimen annotation (spec system-page-v2; redlines added in
 * v3 T6): tokens attached to a specimen, values resolved LIVE from
 * computed styles (re-read on theme flip). Three modes, ONE
 * implementation:
 * - default: a disclosure ("Tokens" trigger, aria-expanded).
 * - alwaysOpen: the readout alone (the keycap TokenInspector's mode).
 * - flags: redline-style measurement flags with leader lines, the
 *   annotation grammar of a design spec; radius at the corner, size on
 *   the edge, colour by the fill. Controlled by a per-band annotate
 *   toggle (the `open` prop); flags are aria-hidden METADATA (recorded
 *   exempt from the reading floor), pointer-events none, never focus.
 */
export type FlagSpec = {
  token: string;
  /** what the flag measures; styles the leader grammar */
  kind: "radius" | "size" | "color" | "shadow" | "font";
  /** which gutter lane the flag occupies (lanes, never mid-edge, so
      flags cannot collide with centred demo content) */
  at: "top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right";
};
export default function TokenAnnotation({
  tokens,
  note,
  alwaysOpen = false,
  variant = "list",
  ariaHidden = false,
}: {
  tokens: readonly (string | FlagSpec)[];
  /** one line on what the tokens drive (inspector zones use this) */
  note?: string;
  alwaysOpen?: boolean;
  /** "flags" renders the redline overlay (v3 T6) */
  variant?: "list" | "flags";
  /** flags duplicate visible inline text: hide from the tree */
  ariaHidden?: boolean;
}) {
  const [open, setOpen] = useState(alwaysOpen);
  const names = tokens.map((t) => (typeof t === "string" ? t : t.token));
  const [values, setValues] = useState<Record<string, string>>({});
  const panelId = useId();

  const read = useCallback(() => {
    const cs = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const t of names) next[t] = cs.getPropertyValue(t).trim();
    setValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  useEffect(() => {
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, [read]);

  const isColour = (v: string) => /^#|^rgb|^hsl|^oklch|^color\(/.test(v.trim());

  if (variant === "flags") {
    /* v3 review (22 Jul): flags are ALWAYS ON, never a mode; they are
       non-interactive metadata. aria-hidden only where the flag
       duplicates visible inline text (the caller decides). */
    return (
      <span className="ds-flags" aria-hidden={ariaHidden || undefined}>
        {tokens.map((t) => {
          const f = typeof t === "string" ? ({ token: t, kind: "size", at: "bottom" } as FlagSpec) : t;
          const v = values[f.token] || "reading";
          return (
            <span key={f.token} className={`ds-flag ds-flag--${f.at} ds-flag--k-${f.kind}`}>
              {isColour(v) && <span className="ds-flag__chip" style={{ background: v }} />}
              <span className="ds-flag__value">{v}</span>
              <span className="ds-flag__token">{f.token}</span>
            </span>
          );
        })}
      </span>
    );
  }

  const showPanel = alwaysOpen || open;

  return (
    <div className="tok-annotation">
      {!alwaysOpen && (
        <button
          type="button"
          className="tok-annotation__trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
        >
          Tokens
        </button>
      )}
      {showPanel && (
        <div className="tok-annotation__panel" id={panelId} aria-live="polite">
          {note && <p className="tok-inspector__drives">{note}</p>}
          <dl className="tok-inspector__tokens">
            {names.map((t) => (
              <div key={t} className="tok-inspector__row">
                <dt>{t}</dt>
                <dd>
                  {isColour(values[t] ?? "") && (
                    <span
                      className="tok-inspector__chip"
                      style={{ background: values[t] }}
                      aria-hidden="true"
                    />
                  )}
                  {values[t] || "reading"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
