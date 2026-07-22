"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The ONE specimen annotation (Phase 2 rebuild, 22 Jul, per the
 * committed audit docs/briefs/system-annotation-audit.md section 5):
 * flags only, ONE in-flow lane per card, rendered between the card
 * head and the demo. Values are resolved LIVE from computed styles
 * (re-read on theme flip) so the page cannot drift from the
 * stylesheet. A value that cannot fit is shortened DELIBERATELY at a
 * token boundary (comma or space), never mid-token; token names may
 * wrap at their hyphens but never ellipsize. Non-interactive metadata
 * (recorded exempt from the reading floor), never focusable.
 *
 * FlagLeaders is the companion leader layer: an SVG inside the demo
 * area drawing one line per flag from the lane to the specimen so the
 * leaders TOUCH what they measure (the proto's in-card SVG model). One
 * annotation implementation, one leader implementation.
 */

/** deliberate display shortening: cut at the last comma or space
    before the cap, never inside a value token */
const DISPLAY_CAP = 32;
function shortenValue(v: string): string {
  if (v.length <= DISPLAY_CAP) return v;
  const head = v.slice(0, DISPLAY_CAP);
  const cut = Math.max(head.lastIndexOf(","), head.lastIndexOf(" "));
  return (cut > 0 ? v.slice(0, cut) : head).trimEnd() + " …";
}

export default function TokenAnnotation({
  tokens,
  ariaHidden = false,
}: {
  tokens: readonly string[];
  /** flags duplicate visible inline text: hide from the tree */
  ariaHidden?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  /* keyed on the token NAMES, not the array identity, so an inline
     array literal at a call site cannot re-trigger the effect loop */
  const namesKey = tokens.join("|");
  const read = useCallback(() => {
    const cs = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const t of namesKey.split("|")) next[t] = cs.getPropertyValue(t).trim();
    setValues(next);
  }, [namesKey]);

  useEffect(() => {
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, [read]);

  const isColour = (v: string) => /^#|^rgb|^hsl|^oklch|^color\(/.test(v.trim());

  if (!tokens.length) return null;
  return (
    <span className="ds-flaglane" aria-hidden={ariaHidden || undefined}>
      {tokens.map((t) => {
        const v = values[t] || "reading";
        return (
          <span key={t} data-flag-token={t} className="ds-flag">
            {isColour(v) && <span className="ds-flag__chip" style={{ background: v }} />}
            <span className="ds-flag__value">{shortenValue(v)}</span>
            <span className="ds-flag__token">{t}</span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * The in-card leader layer: absolutely inset inside the demo area
 * (contained by construction), one line per flag from the lane edge to
 * the specimen's near edge, x clamped into the specimen's width so
 * every leader TOUCHES what it measures. Redrawn on resize, on any
 * content change in the card (live values arriving, zone swaps), and
 * on theme flip; mutations inside the SVG itself are ignored so the
 * draw never feeds itself.
 */
export function FlagLeaders() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const host = svg.parentElement;
    const root = svg.closest(".ds-card__inner, .tok-inspector");
    if (!host || !root) return;
    let raf = 0;

    const draw = () => {
      raf = 0;
      const lane = root.querySelector(".ds-flaglane");
      const target = [...host.children].find((c) => c !== svg);
      const dr = host.getBoundingClientRect();
      if (!lane || !target || dr.width < 1) {
        svg.replaceChildren();
        return;
      }
      svg.setAttribute("viewBox", `0 0 ${dr.width} ${dr.height}`);
      const tr = target.getBoundingClientRect();
      const lines: SVGLineElement[] = [];
      for (const f of lane.querySelectorAll(".ds-flag")) {
        const fr = f.getBoundingClientRect();
        const below = fr.top > tr.bottom;
        const x1 = fr.left + fr.width / 2 - dr.left;
        const y1 = (below ? fr.top : fr.bottom) - dr.top;
        const x2 = Math.max(tr.left - dr.left + 8, Math.min(x1, tr.right - dr.left - 8));
        const y2 = (below ? tr.bottom : tr.top) - dr.top;
        const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l.setAttribute("x1", String(x1));
        l.setAttribute("y1", String(y1));
        l.setAttribute("x2", String(x2));
        l.setAttribute("y2", String(y2));
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
  }, []);

  return <svg ref={ref} className="ds-leaders" aria-hidden="true" />;
}
