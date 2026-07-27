"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { dtcgToken, contrastRatio, toHex, parseRgb } from "@/lib/bella/dtcg";

/**
 * The governed pipeline (spec system-page-redesign; v2 visual pass to
 * _proto/pipeline-instrument-v2.html, 27 Jul 2026). The page's LEAD
 * PROOF: three linked stages a visitor OPERATES rather than reads.
 *
 *   SOURCE   nudge a real token, the specimen restyles immediately
 *   MANIFEST the DTCG entry recomputes through dtcgToken(), the SAME
 *            function /api/bella.json runs (lib/bella/dtcg.ts)
 *   REFUSAL  the contrast ratio is computed HERE, in the browser, with
 *            the same relative-luminance maths the gate runs, judged
 *            against AAA 7 to 1. When it fails, it really failed.
 *
 * v2 adds the glance layer the prose version lacked: a FLOW STRIP that
 * states the whole pipeline in three words plus a live verdict,
 * CHEVRONS so the three cards read as one pipeline rather than three
 * boxes, and a VALUE CHIP in steps 01 and 02 so the same hex is seen
 * travelling from source into the manifest. Each column leads with a
 * bold keyline and ONE line of prose; the ratio is the largest thing
 * in step 03.
 *
 * Honesty is unchanged: nothing here is a recording. No check that
 * needs the filesystem is shown as having run.
 *
 * Degradation: every stage renders real text before any interaction
 * and without JavaScript, so a 30-second scanner who never touches the
 * control still gets the argument. The flow strip is decorative and
 * aria-hidden; the real verdict is announced from step 03's live
 * region and always carries a text label, never colour alone.
 */

const MAX_DRIFT = 80;
const AAA_NORMAL = 7;

/* decorative stroke glyphs, matching the approved proto. aria-hidden:
   the strip duplicates text that already lives in the cards. */
const Glyph = ({ d }: { d: string }) => (
  <svg className="ds-flow__svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d={d} />
  </svg>
);
const PENCIL = "M4 20l4-1L20 7l-3-3L5 16l-1 4z";
const BRACES = "M8 4L3 12l5 8M16 4l5 8-5 8";
const SHIELD = "M12 3l7 3v5c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z";
const ARROW = "M4 12h15m-5-5l5 5-5 5";
const CHEVRON = "M8 5l7 7-7 7";

export default function ContractPipeline() {
  const sliderId = useId();
  const [drift, setDrift] = useState(0);
  const [ink, setInk] = useState<[number, number, number] | null>(null);
  const [ground, setGround] = useState<[number, number, number] | null>(null);

  const read = useCallback(() => {
    const probe = document.createElement("span");
    probe.style.display = "none";
    document.body.appendChild(probe);
    const resolve = (token: string): [number, number, number] | null => {
      probe.style.color = `var(${token})`;
      return parseRgb(getComputedStyle(probe).color);
    };
    setInk(resolve("--color-ink-soft"));
    setGround(resolve("--color-card"));
    probe.remove();
  }, []);

  useEffect(() => {
    /* deferred to the next frame: computed styles settle after paint,
       and a synchronous setState here would cascade a render */
    const raf = requestAnimationFrame(read);
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, [read]);

  const mixed: [number, number, number] | null =
    ink && ground
      ? [
          ink[0] + (ground[0] - ink[0]) * (drift / 100),
          ink[1] + (ground[1] - ink[1]) * (drift / 100),
          ink[2] + (ground[2] - ink[2]) * (drift / 100),
        ]
      : null;

  /* if parseRgb refused a colour it could not interpret, ink/ground are
     null and everything downstream stays null: the instrument shows
     "reading" rather than a computed number. A wrong ratio here is far
     worse than no ratio, because the whole beat argues the number is
     real (dtcg.ts parseRgb, 27 Jul). */
  const hex = mixed ? toHex(mixed).toUpperCase() : null;
  const ratio = mixed && ground ? contrastRatio(mixed, ground) : null;
  const passes = ratio === null ? null : ratio >= AAA_NORMAL;
  const entry = hex ? dtcgToken(hex) : null;
  const shown = hex ?? "reading";
  const state = passes === null ? "reading" : passes ? "pass" : "fail";
  const verdictWord = passes === null ? "Measuring" : passes ? "PASS" : "REFUSED";
  /* the live value rides a custom property, a token operation, never a
     literal in the markup */
  const chipStyle = hex ? ({ "--ds-live-value": hex } as React.CSSProperties) : undefined;

  return (
    <section className="ds-section" aria-labelledby="ds-pipeline">
      <SectionHeader id="ds-pipeline" title="The governed pipeline" className="ds-section__header" />
      <p className="ds-section__note ds-pipeline__dek">
        <strong>Authoring is a human decision. Enforcement is deterministic.</strong> Move the
        control and watch the value travel: the manifest reshapes, the gate recomputes, all in
        this tab.
      </p>

      {/* glance layer: the whole pipeline without reading a word */}
      <div className="ds-flow" aria-hidden="true">
        <span className="ds-flow__node">
          <span className="ds-flow__ico"><Glyph d={PENCIL} /></span>
          <span className="ds-flow__label"><b>You edit</b><span>a token</span></span>
        </span>
        <span className="ds-flow__arrow"><Glyph d={ARROW} /></span>
        <span className="ds-flow__node">
          <span className="ds-flow__ico"><Glyph d={BRACES} /></span>
          <span className="ds-flow__label"><b>Manifest</b><span>regenerates</span></span>
        </span>
        <span className="ds-flow__arrow"><Glyph d={ARROW} /></span>
        <span className="ds-flow__node">
          <span className="ds-flow__ico"><Glyph d={SHIELD} /></span>
          <span className="ds-flow__label"><b>Gate</b><span>measures</span></span>
        </span>
        <span className={`ds-flow__verdict ds-flow__verdict--${state}`}>
          <span className="ds-flow__dot" />
          {verdictWord}
        </span>
      </div>

      <div className="ds-rail">
        {/* ── 01 SOURCE ── */}
        <div className="ds-rail__cell">
          <div className="ds-stage">
            <p className="ds-section__kicker ds-stage__kick"><b>01</b> Source</p>
            <p className="ds-stage__lead">A human decision.</p>
            <p className="ds-stage__sub">
              The control writes the <strong>custom property</strong> the page already resolves
              from.
            </p>
            <span className="ds-valchip" style={chipStyle}>
              <span className="ds-valchip__sw" aria-hidden="true" />
              {shown}
            </span>
            <label className="ds-stage__ctl" htmlFor={sliderId}>
              Drift the ink toward its background
            </label>
            <input
              id={sliderId}
              className="ds-pipeline__slider"
              type="range"
              min={0}
              max={MAX_DRIFT}
              step={5}
              value={drift}
              onChange={(e) => setDrift(Number(e.target.value))}
              aria-describedby={`${sliderId}-hint`}
            />
            <p className="ds-stage__hint" id={`${sliderId}-hint`}>
              {drift === 0
                ? "Shipped value, no drift."
                : passes
                  ? "Drifting, still legible."
                  : "Too close to its background."}
            </p>
            <p className="ds-stage__code ds-stage__code--one">
              <span className="ds-stage__k">--color-ink-soft</span>
              {": "}
              <span className="ds-stage__v">{shown}</span>
            </p>
          </div>
        </div>

        <span className="ds-rail__chev" aria-hidden="true"><Glyph d={CHEVRON} /></span>

        {/* ── 02 MANIFEST ── */}
        <div className="ds-rail__cell">
          <div className="ds-stage">
            <p className="ds-section__kicker ds-stage__kick"><b>02</b> Manifest</p>
            <p className="ds-stage__lead">Generated, never typed.</p>
            <p className="ds-stage__sub">
              Shaped by the <em className="ds-stage__hl">same dtcgToken()</em> that builds
              /api/bella.json.
            </p>
            <span className="ds-valchip" style={chipStyle}>
              <span className="ds-valchip__sw" aria-hidden="true" />
              {shown}
            </span>
            <pre className="ds-stage__code">
              <code>
                {entry
                  ? `"--color-ink-soft": {\n  "$value": "${entry.$value}",\n  "$type": "${entry.$type}"\n}`
                  : `"--color-ink-soft": {\n  "$value": "reading",\n  "$type": "color"\n}`}
              </code>
            </pre>
          </div>
        </div>

        <span className="ds-rail__chev" aria-hidden="true"><Glyph d={CHEVRON} /></span>

        {/* ── 03 REFUSAL ── */}
        <div className="ds-rail__cell">
          <div className="ds-stage">
            <p className="ds-section__kicker ds-stage__kick"><b>03</b> Refusal</p>
            <p className="ds-stage__lead">Measured, not judged by taste.</p>
            <p className="ds-stage__sub">
              Real <strong>relative luminance maths</strong>, against the AAA bar of{" "}
              <strong>7 to 1</strong>.
            </p>
            <div className="ds-stage__sample">
              <p className="ds-pipeline__specimen" style={chipStyle}>
                The system inspecting itself.
              </p>
            </div>
            <p className="ds-stage__ratio">
              {ratio === null ? "reading" : ratio.toFixed(2)}
              <span className="ds-stage__unit"> to 1</span>
            </p>
            <div className={`ds-stage__verdict ds-stage__verdict--${state}`} aria-live="polite">
              <span className="ds-flow__dot" aria-hidden="true" />
              {verdictWord}
            </div>
            <p className="ds-stage__gateline">
              {passes === null
                ? "audit:contrast is reading the running stylesheet."
                : passes
                  ? `audit:contrast PASS --color-ink-soft on --color-card ${ratio?.toFixed(2)} to 1`
                  : `audit:contrast FAIL --color-ink-soft on --color-card ${ratio?.toFixed(2)} to 1, AAA needs 7 to 1`}
            </p>
          </div>
        </div>
      </div>

      <div className="ds-pipeline__foot">
        {/* the page's ONE primary: this instrument is the real action */}
        <Button variant="primary" onClick={() => setDrift(0)} disabled={drift === 0}>
          Restore the token
        </Button>
        {/* the agents narrative, demoted to its closing line (approved):
            there is ONE self-governance section on this page */}
        <p className="ds-section__note ds-pipeline__foot-note">
          Authority lives where it can refuse, not where it instructs. The same check runs on
          every pull request, against every route, in both themes. What agents read is this same
          artifact, <a className="ds-swatch__case" href="/api/bella.json">/api/bella.json</a>,
          alongside the plain-text route map at{" "}
          <a className="ds-swatch__case" href="/llms.txt">/llms.txt</a>. The audit:agents check
          fails the build if either one disagrees with the live registry.
        </p>
      </div>
    </section>
  );
}
