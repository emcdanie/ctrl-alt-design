"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AI-readiness explainer (rebuilt from
 * _review/protos/ai-readiness-explainer-v2.html, Elleta 22 Jul 2026):
 * an agent either goes INTO the system (reads it, output grounded) or
 * AROUND it (skips it, output drifts). Real BELLA tokens replace the
 * proto's raw hex (ok = the clarity case pair, warn = the writing
 * case pair, both AA and theme-flipping); the head renders through
 * SectionHeader/Heading like every other System band. The diagram is
 * ONE inline SVG so it scales without the proto's fixed-pixel
 * offset-path dots (the route draw-in carries the motion; the dots
 * were recording decoration). Draw-in fires once on scroll-into-view;
 * reduced motion renders the settled state.
 *
 * The 5-point audit framework tying this to the zeroheight
 * AI-Readiness model is HER voice: the slots below render nothing
 * until her words land. Do not invent it.
 */

/* TODO(elleta): the 5-point audit framework, one line per point,
   your voice; each empty slot renders nothing */
const AUDIT_POINTS: string[] = ["", "", "", "", ""];

/* TODO(elleta): the one-line intro tying the framework to the
   zeroheight AI-Readiness model; renders nothing while empty */
const FRAMEWORK_INTRO = "";

export default function AiReadinessExplainer() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const points = AUDIT_POINTS.filter((p) => p.trim() !== "");

  return (
    /* SUBSECTION, not a landmark (27 Jul): the explainer now lives
       inside the maturity section as its framework caption. Two nested
       named <section> landmarks fail axe landmark-unique, and a second
       display heading would compete with the parent. A div plus the
       shared .heading-item sub-head is the right tier here. */
    <div className="ds-subsection">
      <h3 id="ds-ai-readiness" className="heading-item ds-shelf__subhead">
        Into your system, or around it?
      </h3>
      <div ref={ref} className={`air${inView ? " in" : ""}`}>
        <svg
          className="air-stage"
          viewBox="0 0 900 360"
          role="img"
          aria-label="Two paths from an agent: into the design system, reading tokens, gate, and machine-readable docs, arriving grounded; or around the system, skipping it, arriving as drift."
        >
          {/* routes: INTO draws through the system, AROUND skips it */}
          <path className="air-route air-route--in" d="M 168 180 L 360 180 L 612 180 L 772 108" />
          <path className="air-route air-route--around" d="M 168 180 C 330 340, 560 340, 772 300" />
          {/* label on the OPEN segment (the proto's x=430 sat under
              the system node) */}
          <text className="air-plabel air-plabel--in" x="222" y="166">reads it</text>
          <text className="air-plabel air-plabel--around" x="400" y="330">skips it</text>

          {/* the agent */}
          <g className="air-node air-node--agent">
            <rect x="48" y="152" width="120" height="56" rx="12" />
            <text x="108" y="177" textAnchor="middle" className="air-node__title">Agent</text>
            <text x="108" y="196" textAnchor="middle" className="air-node__sub">reads or guesses</text>
          </g>

          {/* the system */}
          <g className="air-node air-node--system">
            <rect x="352" y="148" width="200" height="64" rx="12" />
            <text x="452" y="176" textAnchor="middle" className="air-node__title">Your design system</text>
            <text x="452" y="196" textAnchor="middle" className="air-node__sub">tokens · gate · machine-readable</text>
          </g>

          {/* the outcomes */}
          <g className="air-node air-node--ok">
            <rect x="772" y="84" width="112" height="48" rx="12" />
            <text x="828" y="113" textAnchor="middle" className="air-node__title air-res">✓ grounded</text>
          </g>
          <g className="air-node air-node--warn">
            <rect x="772" y="276" width="112" height="48" rx="12" />
            <text x="828" y="305" textAnchor="middle" className="air-node__title air-res">✕ drift</text>
          </g>
        </svg>

        {/* the takeaway + foot, straight from the approved proto */}
        <p className="air-takeaway">
          A mature system makes going <strong>through</strong> it the easy path. Then the output is
          grounded, not guessed.
        </p>
        <p className="ds-section__note" style={{ margin: 0 }}>
          The newest test of a design system isn&apos;t how well humans read it. It&apos;s the path
          an AI takes.
        </p>

        {/* the 5-point audit framework, hers; renders only when her
            words land */}
        {(FRAMEWORK_INTRO.trim() !== "" || points.length > 0) && (
          <div className="air-framework">
            {FRAMEWORK_INTRO.trim() !== "" && <p className="ds-section__note">{FRAMEWORK_INTRO}</p>}
            {points.length > 0 && (
              <ol className="air-framework__list">
                {points.map((p) => (
                  <li key={p.slice(0, 24)} className="air-framework__point">{p}</li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
