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
 * STAGE MODE (PR 41 amendment, Elleta 22 Jul, proto contract
 * _proto/annotated-specimen-proto.html): the same component extends
 * to the case specimen stages. `stageFlags` places each flag at a
 * stage corner (absolute pills), entry is staggered by CSS when the
 * stage gains .in, and every flag becomes a real focusable button
 * whose hover/focus highlights the exact part its token drives
 * (keyboard parity by construction). `scoped` reads computed values
 * from the lane's own position in the tree, so a lane inside the
 * --demo-* specimen scope reports the demo register's resolved
 * values.
 *
 * FlagLeaders is the companion leader layer: an SVG inside the demo
 * area. Lane mode draws one straight line per flag to the specimen;
 * ANCHORED mode (the stage recipe) draws a curved path per flag to
 * the computed geometry of the element its token drives (the
 * `anchors` selector map), measured for the stroke-dash draw-in.
 * One annotation implementation, one leader implementation.
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

export interface StageFlag {
  token: string;
  /** stage corner the pill sits in */
  corner: "tl" | "tr" | "bl" | "br";
  /** highlight zone: matches [data-part] in the specimen and the
      anchors map given to FlagLeaders */
  zone: string;
}

export default function TokenAnnotation({
  tokens,
  ariaHidden = false,
  scoped = false,
  stageFlags,
  onZone,
}: {
  tokens: readonly string[];
  /** flags duplicate visible inline text: hide from the tree */
  ariaHidden?: boolean;
  /** resolve values at the lane's own tree position (demo scope) */
  scoped?: boolean;
  /** stage mode: corner-placed interactive flags (amendment item 2-3) */
  stageFlags?: readonly StageFlag[];
  /** stage mode: hover/focus highlight callback */
  onZone?: (zone: string | null) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const laneRef = useRef<HTMLSpanElement>(null);

  /* keyed on the token NAMES, not the array identity, so an inline
     array literal at a call site cannot re-trigger the effect loop */
  const namesKey = (stageFlags ? stageFlags.map((f) => f.token) : tokens).join("|");
  const read = useCallback(() => {
    const el = scoped && laneRef.current ? laneRef.current : document.documentElement;
    const cs = getComputedStyle(el);
    const next: Record<string, string> = {};
    for (const t of namesKey.split("|")) next[t] = cs.getPropertyValue(t).trim();
    setValues(next);
  }, [namesKey, scoped]);

  useEffect(() => {
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, [read]);

  const isColour = (v: string) => /^#|^rgb|^hsl|^oklch|^color\(/.test(v.trim());

  if (stageFlags) {
    return (
      <span ref={laneRef} className="ds-flaglane ds-flaglane--stage">
        {stageFlags.map((f) => {
          const v = values[f.token] || "reading";
          return (
            <button
              key={f.token}
              type="button"
              data-flag-token={f.token}
              className={`ds-flag ds-flag--stage ds-flag--${f.corner}`}
              onMouseEnter={() => onZone?.(f.zone)}
              onMouseLeave={() => onZone?.(null)}
              onFocus={() => onZone?.(f.zone)}
              onBlur={() => onZone?.(null)}
            >
              {isColour(v) && <span className="ds-flag__chip" style={{ background: v }} aria-hidden="true" />}
              <span className="ds-flag__value">{shortenValue(v)}</span>
              <span className="ds-flag__token">{f.token}</span>
            </button>
          );
        })}
      </span>
    );
  }

  if (!tokens.length) return null;
  return (
    <span ref={laneRef} className="ds-flaglane" aria-hidden={ariaHidden || undefined}>
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
 * (contained by construction). Lane mode: one straight line per flag
 * from the lane edge to the specimen's near edge, x clamped into the
 * specimen's width so every leader TOUCHES what it measures.
 * Anchored mode (`anchors`, the stage recipe): one curved path per
 * flag to the computed geometry of the element its token drives
 * ([data-part] selectors), each path measured so the stroke-dash
 * draw-in animates when the stage gains .in (CSS transition only;
 * reduced motion shows everything immediately). Redrawn on resize,
 * on any content change, and on theme flip; mutations inside the SVG
 * itself are ignored so the draw never feeds itself.
 */
export function FlagLeaders({ anchors }: { anchors?: Record<string, string> } = {}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const host = svg.parentElement;
    const root = svg.closest(".ds-card__inner, .tok-inspector, .spec-stage");
    if (!host || !root) return;
    let raf = 0;

    const draw = () => {
      raf = 0;
      const lane = root.querySelector(".ds-flaglane");
      const dr = host.getBoundingClientRect();
      if (!lane || dr.width < 1) {
        svg.replaceChildren();
        return;
      }
      svg.setAttribute("viewBox", `0 0 ${dr.width} ${dr.height}`);

      if (anchors) {
        /* anchored stage mode: curved measured paths + endpoint dots */
        const nodes: SVGElement[] = [];
        for (const f of lane.querySelectorAll(".ds-flag")) {
          const zoneSel = anchors[f.getAttribute("data-flag-token") ?? ""];
          const target = zoneSel ? root.querySelector(zoneSel) : null;
          if (!target) continue;
          const fr = f.getBoundingClientRect();
          const tr = target.getBoundingClientRect();
          const below = fr.top > tr.bottom;
          const x1 = fr.left + fr.width / 2 - dr.left;
          const y1 = (below ? fr.top : fr.bottom) - dr.top;
          const x2 = Math.max(tr.left - dr.left + 6, Math.min(x1, tr.right - dr.left - 6));
          const y2 = (below ? tr.bottom : tr.top) - dr.top;
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          const bend = (y2 - y1) * 0.6;
          path.setAttribute("d", `M${x1},${y1} C${x1},${y1 + bend} ${x2},${y2 - bend} ${x2},${y2}`);
          const len = path.getTotalLength();
          path.style.setProperty("--len", String(Math.ceil(len)));
          const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          dot.setAttribute("cx", String(x2));
          dot.setAttribute("cy", String(y2));
          dot.setAttribute("r", "3");
          nodes.push(path, dot);
        }
        svg.replaceChildren(...nodes);
        return;
      }

      const target = [...host.children].find((c) => c !== svg);
      if (!target) {
        svg.replaceChildren();
        return;
      }
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
  }, [anchors]);

  return <svg ref={ref} className="ds-leaders" aria-hidden="true" />;
}
