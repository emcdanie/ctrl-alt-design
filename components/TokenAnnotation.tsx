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
 * (The short-lived stage mode from the amendment-2 pass is gone: the
 * proto-contract rebuild moved stage flags into the CaseSpecimen
 * device, so the lane is again the one annotation shape here.)
 *
 * FlagLeaders is the companion leader layer. Lane mode: one straight
 * line per flag to the specimen. ANCHORED mode (the case-specimen
 * contract, _proto/specimen.html): one measured curved path per flag
 * to the exact part its token names, terminating ON the part with a
 * dot, or with a RING around round/corner parts; anchor points are
 * computed from the rendered geometry, never hand-tuned, and the
 * leader layer renders IN FRONT of the specimen (Elleta's review
 * fix). One annotation implementation, one leader implementation.
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

export interface LeaderAnchor {
  /** selector of the [data-part] element the token names */
  sel: string;
  /** terminate with a ring around the part instead of a dot */
  ring?: boolean;
}

/**
 * The in-card leader layer: absolutely inset inside the demo area
 * (contained by construction). Lane mode: one straight line per flag
 * from the lane edge to the specimen's near edge, x clamped into the
 * specimen's width so every leader TOUCHES what it measures.
 * Anchored mode (`anchors`): one curved measured path per flag to the
 * computed geometry of the element its token drives, ending in a dot
 * ON the part or a ring AROUND it; the stroke-dash draw-in animates
 * when the stage gains .in (CSS transition only; reduced motion shows
 * everything immediately). Redrawn on resize, content change, and
 * theme flip; mutations inside the SVG itself are ignored so the draw
 * never feeds itself.
 */
export function FlagLeaders({ anchors }: { anchors?: Record<string, string | LeaderAnchor> } = {}) {
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
      const lane = root.querySelector(".ds-flaglane, .csp-flags");
      const dr = host.getBoundingClientRect();
      if (!lane || dr.width < 1) {
        svg.replaceChildren();
        return;
      }
      svg.setAttribute("viewBox", `0 0 ${dr.width} ${dr.height}`);

      if (anchors) {
        /* anchored mode: measured curved paths, dot or ring landings */
        const nodes: SVGElement[] = [];
        for (const f of lane.querySelectorAll(".ds-flag, .csp-flag")) {
          const spec = anchors[f.getAttribute("data-flag-token") ?? ""];
          if (!spec) continue;
          const sel = typeof spec === "string" ? spec : spec.sel;
          const ring = typeof spec === "string" ? false : !!spec.ring;
          const target = root.querySelector(sel);
          if (!target) continue;
          const fr = f.getBoundingClientRect();
          const tr = target.getBoundingClientRect();
          const tcx = tr.left + tr.width / 2;
          const tcy = tr.top + tr.height / 2;
          const below = fr.top > tcy;
          const x1 = fr.left + fr.width / 2 - dr.left;
          const y1 = (below ? fr.top : fr.bottom) - dr.top;
          /* the landing point: the ring circles the part; the dot
             lands on the part's near edge, computed from geometry */
          const rad = ring ? Math.max(tr.width, tr.height) / 2 + 6 : 0;
          const x2 = ring
            ? tcx - dr.left + (x1 < tcx - dr.left ? -rad : rad) * 0.7071
            : Math.max(tr.left - dr.left + 6, Math.min(x1, tr.right - dr.left - 6));
          const y2 = ring
            ? tcy - dr.top + (below ? rad : -rad) * 0.7071
            : (below ? tr.bottom : tr.top) - dr.top;
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          const bend = (y2 - y1) * 0.6;
          path.setAttribute("d", `M${x1},${y1} C${x1},${y1 + bend} ${x2},${y2 - bend} ${x2},${y2}`);
          /* tag the path with its flag so the geometry assertion can
             except a path's OWN flag box */
          path.setAttribute("data-for", f.getAttribute("data-flag-token") ?? "");
          const len = path.getTotalLength();
          path.style.setProperty("--len", String(Math.ceil(len)));
          nodes.push(path);
          if (ring) {
            const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            c.setAttribute("cx", String(tcx - dr.left));
            c.setAttribute("cy", String(tcy - dr.top));
            c.setAttribute("r", String(rad));
            c.setAttribute("class", "ring");
            nodes.push(c);
          } else {
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot.setAttribute("cx", String(x2));
            dot.setAttribute("cy", String(y2));
            dot.setAttribute("r", "3.5");
            dot.setAttribute("class", "dot");
            nodes.push(dot);
          }
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
