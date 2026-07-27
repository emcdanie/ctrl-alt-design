"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import SectionHeader from "@/components/ui/SectionHeader";
import { dtcgToken, contrastRatio, toHex, parseRgb } from "@/lib/bella/dtcg";

/**
 * The governed pipeline (spec system-page-redesign, 27 Jul 2026): the
 * page's LEAD PROOF, and the reason the redesign exists. Three linked
 * stages that a visitor operates rather than reads:
 *
 *   SOURCE   nudge a real token, the specimen restyles immediately
 *   MANIFEST the DTCG entry recomputes through dtcgToken(), the SAME
 *            function /api/bella.json runs (lib/bella/dtcg.ts)
 *   REFUSAL  the contrast ratio is computed HERE, in the browser, with
 *            the same relative-luminance maths the gate runs, and
 *            judged against AAA 7:1. When it fails, it really failed.
 *
 * Nothing here is a recorded string pretending to be live. The two
 * computations that can honestly run in a browser do run; no check that
 * needs the filesystem is shown as having run (design.md 10.3).
 *
 * Degradation: every stage renders its explanation as real text before
 * any interaction and without JavaScript, so a 30-second scanner who
 * never touches the control still gets the argument. Reduced motion
 * removes transitions only. The verdict is announced through a live
 * region and always carries a text label, never colour alone.
 */

/* how far the ink is allowed to travel toward the ground, as a
   percentage. 0 is the shipped token; the top of the range is far
   enough that the ratio genuinely crosses the AAA threshold. */
const MAX_DRIFT = 80;
const AAA_NORMAL = 7;

export default function ContractPipeline() {
  const sliderId = useId();
  const [drift, setDrift] = useState(0);
  const [ink, setInk] = useState<[number, number, number] | null>(null);
  const [ground, setGround] = useState<[number, number, number] | null>(null);

  /* read the REAL resolved colours off the running stylesheet, and
     re-read them when the theme flips, so the instrument is measuring
     the site rather than a copy of it */
  const read = useCallback(() => {
    const probe = document.createElement("span");
    probe.style.display = "none";
    document.body.appendChild(probe);
    const resolve = (token: string): [number, number, number] | null => {
      probe.style.color = `var(${token})`;
      const v = getComputedStyle(probe).color;
      return parseRgb(v);
    };
    setInk(resolve("--color-ink-soft"));
    setGround(resolve("--color-card"));
    probe.remove();
  }, []);

  useEffect(() => {
    /* the first read is deferred to the next frame rather than run in
       the effect body: computed styles are only settled after paint,
       and a synchronous setState here would cascade a render (the
       react-hooks/set-state-in-effect rule) */
    const raf = requestAnimationFrame(read);
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, [read]);

  /* the nudged colour: the shipped ink mixed toward the card ground by
     the slider amount. Computed in JS so the ratio below is measured on
     the exact colour the specimen is painted with. */
  const mixed: [number, number, number] | null =
    ink && ground
      ? [
          ink[0] + (ground[0] - ink[0]) * (drift / 100),
          ink[1] + (ground[1] - ink[1]) * (drift / 100),
          ink[2] + (ground[2] - ink[2]) * (drift / 100),
        ]
      : null;

  const hex = mixed ? toHex(mixed) : null;
  const ratio = mixed && ground ? contrastRatio(mixed, ground) : null;
  const passes = ratio === null ? null : ratio >= AAA_NORMAL;
  const entry = hex ? dtcgToken(hex) : null;
  const live = ink !== null && ground !== null;

  return (
    <section className="ds-section" aria-labelledby="ds-pipeline">
      <SectionHeader
        id="ds-pipeline"
        title="The governed pipeline"
        className="ds-section__header"
      />
      <p className="ds-section__note ds-pipeline__lead">
        Authoring is human. Enforcement is deterministic. Move the control in the first step and
        watch the other two follow: the manifest reshapes through the same function the endpoint
        runs, and the contrast check recomputes and passes judgement. Nothing below is a
        recording. The maths runs here, in this tab, as you move it.
      </p>

      <div className="ds-pipeline">
        {/* ── 01 SOURCE ── */}
        <div className="ds-pipeline__step">
          <p className="ds-section__kicker ds-pipeline__step-kicker">01 Source</p>
          <p className="ds-section__note">
            The token is the source. Nudge the body ink toward the card it sits on and the
            specimen restyles immediately, because the control writes the custom property the
            page already resolves from.
          </p>
          <div className="ds-pipeline__control">
            <label className="ds-pipeline__label" htmlFor={sliderId}>
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
              aria-describedby={`${sliderId}-out`}
            />
            <output id={`${sliderId}-out`} className="ds-pipeline__out" htmlFor={sliderId}>
              {drift === 0 ? "shipped value, no drift" : `${drift}% toward the background`}
            </output>
          </div>
          {/* the nudge writes a CUSTOM PROPERTY on this element, which
              is a token operation, not a literal: the stylesheet still
              owns the colour and falls back to the shipped token */}
          <p
            className="ds-pipeline__specimen"
            style={
              mixed
                ? ({ "--ds-pipeline-ink": toHex(mixed) } as React.CSSProperties)
                : undefined
            }
          >
            This sentence is painted with the value you are editing.
          </p>
        </div>

        {/* ── 02 MANIFEST ── */}
        <div className="ds-pipeline__step">
          <p className="ds-section__kicker ds-pipeline__step-kicker">02 Manifest</p>
          <p className="ds-section__note">
            The manifest is generated, never maintained. This entry is shaped by dtcgToken from
            lib/bella/dtcg.ts, the same function that builds /api/bella.json, so what you see is
            the endpoint&apos;s own output for the value above.
          </p>
          <pre className="ds-pipeline__code">
            <code>
              {live && entry
                ? `"--color-ink-soft": ${JSON.stringify(entry, null, 2)}`
                : `"--color-ink-soft": {\n  "$value": "reading",\n  "$type": "color"\n}`}
            </code>
          </pre>
        </div>

        {/* ── 03 REFUSAL ── */}
        <div className="ds-pipeline__step">
          <p className="ds-section__kicker ds-pipeline__step-kicker">03 Refusal</p>
          <p className="ds-section__note">
            The gate does not ask whether the value looks right. It measures. This is the same
            relative luminance maths audit:contrast runs, judged against the AAA threshold of 7
            to 1 for normal text.
          </p>
          <div className="ds-pipeline__verdict" aria-live="polite">
            <StatusPill>
              {passes === null ? "Measuring" : passes ? "Pass" : "Refused"}
            </StatusPill>
            <p className="ds-pipeline__ratio">
              {ratio === null ? "reading" : `${ratio.toFixed(2)} to 1`}
              <span className="ds-pipeline__threshold"> against 7 to 1 required</span>
            </p>
          </div>
          <p className="ds-pipeline__receipt">
            {passes === null
              ? "audit:contrast is reading the running stylesheet."
              : passes
                ? "audit:contrast: --color-ink-soft on --color-card, passing at the AAA threshold."
                : `audit:contrast: --color-ink-soft on --color-card, got ${ratio?.toFixed(2)} to 1, expected 7 to 1 or better.`}
          </p>
        </div>
      </div>

      <div className="ds-pipeline__foot">
        {/* the page's ONE primary: this instrument is the real action on
            this view, so the Controls specimen demotes to secondary */}
        <Button variant="primary" onClick={() => setDrift(0)} disabled={drift === 0}>
          Restore the token
        </Button>
        <p className="ds-section__note ds-pipeline__foot-note">
          Authority lives where it can refuse, not where it instructs. The same check runs on
          every pull request, against every route, in both themes. What agents read is the same
          artifact: <a className="ds-swatch__case" href="/api/bella.json">/api/bella.json</a>.
        </p>
      </div>
    </section>
  );
}
