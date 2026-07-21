"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

/**
 * The ONE specimen annotation (spec system-page-v2; redlines added in
 * v3 T6): tokens attached to a specimen, values resolved LIVE from
 * computed styles (re-read on theme flip). Three modes, ONE
 * implementation:
 * - default: a disclosure ("Tokens" trigger, aria-expanded).
 * - alwaysOpen: the readout alone (the keycap TokenInspector's mode).
 * - flags: MEASURED redline flags (v3 polish, 22 Jul). Flags hug the
 *   annotated element (never the card edges) in fixed lanes; every
 *   leader line starts on its flag and ENDS on the target boundary
 *   (within 2px, asserted by audit:visual); the touch-target flag
 *   draws the actual hit area as a dashed rect and annotates THAT.
 *   Geometry re-measures on resize; flags are non-interactive
 *   metadata (recorded exempt from the reading floor), pointer-events
 *   none, never focusable.
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
  targetSelector,
}: {
  tokens: readonly (string | FlagSpec)[];
  /** one line on what the tokens drive (inspector zones use this) */
  note?: string;
  alwaysOpen?: boolean;
  /** "flags" renders the redline overlay (v3 T6) */
  variant?: "list" | "flags";
  /** flags duplicate visible inline text: hide from the tree */
  ariaHidden?: boolean;
  /** flags mode: the annotated element inside the flagwrap (defaults
      to the demo slot's first element) */
  targetSelector?: string;
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
    return (
      <MeasuredFlags
        tokens={tokens}
        values={values}
        ariaHidden={ariaHidden}
        targetSelector={targetSelector}
        isColour={isColour}
      />
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

type Geo = {
  flags: Record<string, { left: number; top: number }>;
  leaders: Array<{ key: string; left: number; top: number; width: number; height: number }>;
  hitRect: { left: number; top: number; width: number; height: number } | null;
};

/* the measured redline overlay: positions hug the target, leaders
   touch it (v3 polish, 22 Jul). Coordinates are relative to the
   .ds-flagwrap; audit:visual asserts leader-touch geometry live. */
function MeasuredFlags({
  tokens,
  values,
  ariaHidden,
  targetSelector,
  isColour,
}: {
  tokens: readonly (string | FlagSpec)[];
  values: Record<string, string>;
  ariaHidden: boolean;
  targetSelector?: string;
  isColour: (v: string) => boolean;
}) {
  const overlayRef = useRef<HTMLSpanElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);

  const specs: FlagSpec[] = tokens.map((t) =>
    typeof t === "string" ? ({ token: t, kind: "size", at: "bottom" } as FlagSpec) : t
  );

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const wrap = overlay.closest(".ds-flagwrap") as HTMLElement | null;
    if (!wrap) return;

    const measure = () => {
      /* the anchor is the WHOLE demo group (union of its children),
         never just the first child: bottom flags must clear the second
         chip/pill in multi-item demos (v3 polish fix) */
      const explicit = targetSelector ? (wrap.querySelector(targetSelector) as HTMLElement | null) : null;
      const demo = wrap.querySelector(".ds-card__demo") as HTMLElement | null;
      const target = explicit ?? demo;
      if (!target) return;
      target.setAttribute("data-annotated", "true");
      const wr = wrap.getBoundingClientRect();
      const rel = (r: { left: number; top: number; width: number; height: number }) => ({
        left: r.left - wr.left, top: r.top - wr.top, width: r.width, height: r.height });
      let tr: { left: number; top: number; width: number; height: number };
      if (explicit) {
        tr = explicit.getBoundingClientRect();
      } else {
        const kids = [...(demo as HTMLElement).children].filter(
          (c) => !c.classList.contains("ds-flags") && c.getBoundingClientRect().width > 0
        );
        if (!kids.length) return;
        const u = kids.reduce(
          (a, c) => {
            const r = c.getBoundingClientRect();
            return { l: Math.min(a.l, r.left), r: Math.max(a.r, r.right), t: Math.min(a.t, r.top), b: Math.max(a.b, r.bottom) };
          },
          { l: Infinity, r: -Infinity, t: Infinity, b: -Infinity }
        );
        tr = { left: u.l, top: u.t, width: u.r - u.l, height: u.b - u.t };
      }
      const t = rel(tr);
      const rootCs = getComputedStyle(document.documentElement);
      const px = (tok: string, fallback: number) => {
        const v = parseFloat(rootCs.getPropertyValue(tok));
        return Number.isFinite(v) ? v : fallback;
      };
      const gap = px("--spacing-2", 8);
      const leaderLen = px("--spacing-3", 12);
      const flagH = 26;

      /* the touch-target flag annotates the ACTUAL hit area */
      let hitRect: Geo["hitRect"] = null;
      const sizeSpec = specs.find((f) => f.kind === "size" && /touch-target/.test(f.token));
      if (sizeSpec) {
        const min = parseFloat(values[sizeSpec.token]) || 44;
        const w = Math.max(t.width, min);
        const h = Math.max(t.height, min);
        hitRect = { left: t.left + t.width / 2 - w / 2, top: t.top + t.height / 2 - h / 2, width: w, height: h };
      }

      const flags: Geo["flags"] = {};
      const flagEls = new Map<string, HTMLElement>();
      overlay.querySelectorAll<HTMLElement>("[data-flag-token]").forEach((el) => {
        flagEls.set(el.dataset.flagToken as string, el);
      });

      /* pass 1: placement hugging the anchor */
      for (const f of specs) {
        const el = flagEls.get(f.token);
        if (!el) continue;
        const fw = el.offsetWidth;
        const anchor = f.kind === "size" && hitRect ? hitRect : t;
        const topLane = anchor.top - gap - leaderLen - flagH;
        const bottomLane = anchor.top + anchor.height + gap + leaderLen;
        let left = anchor.left;
        if (f.at === "top-right" || f.at === "bottom-right") left = anchor.left + anchor.width - fw;
        else if (f.at === "top" || f.at === "bottom") left = anchor.left + anchor.width / 2 - fw / 2;
        left = Math.max(0, Math.min(left, wr.width - fw));
        flags[f.token] = { left, top: f.at.startsWith("top") ? topLane : bottomLane };
      }

      /* pass 2: same-lane collision pushes the later flag one row outward */
      const placed: Array<{ left: number; top: number; width: number }> = [];
      for (const f of specs) {
        const el = flagEls.get(f.token);
        const g = flags[f.token];
        if (!el || !g) continue;
        for (const p of placed) {
          const sameRow = Math.abs(p.top - g.top) < flagH;
          const xOverlap = !(g.left + el.offsetWidth <= p.left || g.left >= p.left + p.width);
          if (sameRow && xOverlap) g.top += f.at.startsWith("top") ? -(flagH + gap) : flagH + gap;
        }
        placed.push({ left: g.left, top: g.top, width: el.offsetWidth });
      }

      /* pass 3: leaders AFTER final placement; every leader starts on
         its flag and ends on the target boundary. If the flag had to
         clamp away from its ideal x, the leader is an L (vertical off
         the flag + horizontal along the target edge). */
      const leaders: Geo["leaders"] = [];
      for (const f of specs) {
        const el = flagEls.get(f.token);
        const g = flags[f.token];
        if (!el || !g) continue;
        const fw = el.offsetWidth;
        const anchor = f.kind === "size" && hitRect ? hitRect : t;
        const isTop = f.at.startsWith("top");
        const flagEdgeY = isTop ? g.top + flagH : g.top;
        const anchorEdgeY = isTop ? anchor.top : anchor.top + anchor.height;
        let idealX = anchor.left + 1;
        if (f.at === "top-right" || f.at === "bottom-right") idealX = anchor.left + anchor.width - 1;
        else if (f.at === "top" || f.at === "bottom") idealX = anchor.left + anchor.width / 2;
        const within = idealX >= g.left + 2 && idealX <= g.left + fw - 2;
        const vx = within ? idealX : Math.max(g.left + 2, Math.min(g.left + fw / 2, g.left + fw - 2));
        const y0 = Math.min(flagEdgeY, anchorEdgeY);
        const vh = Math.abs(anchorEdgeY - flagEdgeY);
        leaders.push({ key: f.token, left: Math.round(vx), top: Math.round(y0), width: 1, height: Math.max(vh, 1) });
        if (!within) {
          const hx0 = Math.min(vx, Math.max(anchor.left + 1, Math.min(idealX, anchor.left + anchor.width - 1)));
          const hx1 = Math.max(vx, Math.max(anchor.left + 1, Math.min(idealX, anchor.left + anchor.width - 1)));
          leaders.push({ key: f.token, left: Math.round(hx0), top: Math.round(anchorEdgeY), width: Math.max(hx1 - hx0, 1), height: 1 });
        }
      }

      setGeo({ flags, leaders, hitRect });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetSelector, JSON.stringify(values)]);

  return (
    <span className="ds-flags" aria-hidden={ariaHidden || undefined} ref={overlayRef}>
      {geo?.hitRect && (
        <span
          className="ds-hitrect"
          style={{ left: geo.hitRect.left, top: geo.hitRect.top, width: geo.hitRect.width, height: geo.hitRect.height }}
        />
      )}
      {geo?.leaders.map((l) => (
        <span
          key={l.key}
          className="ds-flag-leader"
          data-for={l.key}
          style={{ left: l.left, top: l.top, width: l.width, height: l.height }}
        />
      ))}
      {specs.map((f) => {
        const v = values[f.token] || "reading";
        const pos = geo?.flags[f.token];
        return (
          <span
            key={f.token}
            data-flag-token={f.token}
            className={`ds-flag ds-flag--k-${f.kind}`}
            style={pos ? { left: pos.left, top: pos.top } : { visibility: "hidden", left: 0, top: 0 }}
          >
            {isColour(v) && <span className="ds-flag__chip" style={{ background: v }} />}
            <span className="ds-flag__value">{v}</span>
            <span className="ds-flag__token">{f.token}</span>
          </span>
        );
      })}
    </span>
  );
}
