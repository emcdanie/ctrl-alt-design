"use client";

import { useCallback, useEffect, useId, useState } from "react";

/**
 * The ONE specimen annotation (Elleta, 21 Jul, spec system-page-v2):
 * a list of the tokens attached to a specimen, name + value resolved
 * LIVE from computed styles (re-read on theme flip), colour chip when
 * the value is a colour. Two modes, one implementation:
 * - default: a disclosure. The "Tokens" trigger button reveals the
 *   panel on click or focus+Enter (button semantics), aria-expanded.
 * - alwaysOpen: the readout alone; the keycap TokenInspector consumes
 *   it this way, its zone buttons choosing WHICH tokens show.
 */
export default function TokenAnnotation({
  tokens,
  note,
  alwaysOpen = false,
}: {
  tokens: readonly string[];
  /** one line on what the tokens drive (inspector zones use this) */
  note?: string;
  alwaysOpen?: boolean;
}) {
  const [open, setOpen] = useState(alwaysOpen);
  const [values, setValues] = useState<Record<string, string>>({});
  const panelId = useId();

  const read = useCallback(() => {
    const cs = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const t of tokens) next[t] = cs.getPropertyValue(t).trim();
    setValues(next);
  }, [tokens]);

  useEffect(() => {
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, [read]);

  const isColour = (v: string) => /^#|^rgb|^hsl|^oklch|^color\(/.test(v.trim());
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
            {tokens.map((t) => (
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
