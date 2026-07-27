"use client";

import { useId, useState } from "react";

/**
 * Beat 01, the hook (proto _proto/beat-agent-demo.html, 27 Jul 2026):
 * "Can an AI build with your system?"
 *
 * One switch flips the SAME agent between two runs: guessing, and
 * grounded in a machine-readable contract. The left pane shows what it
 * built, the right pane shows what the gate said about it.
 *
 * HONESTY, two deliberate choices:
 *
 * 1. NO SCORE. The proto carried 69/100 and 100/100. Those are the
 *    numbers from Southleft's PUBLISHED A/B of an agent building with
 *    and without a contract, not a measurement of this site. Presenting
 *    them here would read as BELLA's own result, which would be an
 *    invented metric. The verdict is therefore qualitative and its
 *    counts are DERIVED from the findings list below it, so the number
 *    on screen is always literally what is listed.
 *
 * 2. THE UNGOVERNED ARTIFACT IS AN ILLUSTRATION, and says so. It is
 *    marked data-example="ungoverned" and carries aria-hidden with a
 *    visually-hidden description beside it, because its whole point is
 *    to be off-system: invented colours, a hardcoded type size, failing
 *    contrast. The gate is scoped to skip that subtree by name (see the
 *    [data-example] carve-out in audit:contrast, audit:type and
 *    audit:axe) so it cannot launder a real defect. Everything else on
 *    this page is policed normally.
 */

type Finding = { ok: boolean; text: string };

const OFF: {
  state: string;
  headline: string;
  body: string;
  cta: string;
  findings: Finding[];
  caption: string;
} = {
  state: "Off. The agent is guessing.",
  headline: "Book your trip",
  body: "Fast and easy booking today",
  cta: "BOOK NOW",
  findings: [
    { ok: false, text: "Invented a colour that is not in the system" },
    { ok: false, text: "Hardcoded a body size below the readable floor" },
    { ok: false, text: "Contrast fails at the accessibility bar" },
    { ok: false, text: "Restyled the button instead of using the component" },
  ],
  caption:
    "Without a machine-readable system, the agent guesses. It invents colours, hardcodes values, and ships things that fail. A design system is only as useful to AI as it is readable by a machine.",
};

const ON: typeof OFF = {
  state: "On. The agent is grounded.",
  headline: "Book your trip",
  body: "Confirm your dates and go.",
  cta: "Continue",
  findings: [
    { ok: true, text: "Every value pulled from a token, nothing invented" },
    { ok: true, text: "Body text at the system's readable size" },
    { ok: true, text: "Contrast passes at the AAA bar" },
    { ok: true, text: "Hit a missing state and reported the gap instead of faking it" },
  ],
  caption:
    "With the contract, the same agent is grounded. It builds from tokens, clears accessibility, and when it hits a real gap it reports it rather than inventing around it. Same model, both runs.",
};

export default function AgentDemo() {
  const [grounded, setGrounded] = useState(false);
  const labelId = useId();
  const s = grounded ? ON : OFF;
  /* derived, never typed: the verdict counts what is actually listed */
  const failing = s.findings.filter((f) => !f.ok).length;
  const verdict = failing === 0 ? "Passes the gate" : "Refused by the gate";

  return (
    <div className="agentdemo">
      <div className="agentdemo__control">
        <button
          type="button"
          className="agentdemo__toggle"
          aria-pressed={grounded}
          aria-labelledby={labelId}
          onClick={() => setGrounded((v) => !v)}
        >
          <span className="agentdemo__track" aria-hidden="true">
            <span className="agentdemo__knob" />
          </span>
          <span className="agentdemo__lab" id={labelId}>
            Hand the agent your contract
          </span>
        </button>
        <p className="agentdemo__state" aria-live="polite">{s.state}</p>
      </div>

      <div className="agentdemo__split">
        <div className="agentdemo__pane">
          <p className="ds-section__kicker agentdemo__panehead">What the agent built</p>
          <div className="agentdemo__stage">
            {grounded ? (
              /* the grounded artifact is built from REAL tokens, so it
                 is policed by the gate like any other surface */
              <div className="agentdemo__art agentdemo__art--good">
                <span className="agentdemo__art-top" aria-hidden="true" />
                <div className="agentdemo__art-body">
                  <p className="agentdemo__art-h">{s.headline}</p>
                  <p className="agentdemo__art-p">{s.body}</p>
                  <p className="agentdemo__art-cta">{s.cta}</p>
                </div>
              </div>
            ) : (
              /* ILLUSTRATION of ungoverned output. aria-hidden with a
                 described alternative beside it; the gate skips this
                 subtree by name so a deliberately bad example can never
                 launder a real defect. */
              <>
                <div
                  className="agentdemo__art agentdemo__art--bad"
                  data-example="ungoverned"
                  aria-hidden="true"
                >
                  <span className="agentdemo__art-top" />
                  <div className="agentdemo__art-body">
                    <p className="agentdemo__art-h">{s.headline}</p>
                    <p className="agentdemo__art-p">{s.body}</p>
                    <p className="agentdemo__art-cta">{s.cta}</p>
                  </div>
                </div>
                <p className="sr-only">
                  An illustration of ungoverned output: a card in invented colours, with
                  body text below the readable size and text that fails contrast.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="agentdemo__pane">
          <p className="ds-section__kicker agentdemo__panehead">The gate&apos;s verdict</p>
          <p className={`agentdemo__verdict agentdemo__verdict--${failing === 0 ? "pass" : "fail"}`}>
            {verdict}
          </p>
          <p className="agentdemo__count">
            {failing === 0
              ? `${s.findings.length} checks, none failing`
              : `${failing} of ${s.findings.length} checks failing`}
          </p>
          <ul className="agentdemo__findings">
            {s.findings.map((f) => (
              <li key={f.text} className={f.ok ? "is-ok" : "is-bad"}>
                <span className="agentdemo__mk" aria-hidden="true">{f.ok ? "✓" : "✕"}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="agentdemo__caption">{s.caption}</p>
      <p className="agentdemo__foot">
        Illustrative of a documented pattern, not a measurement of this site. The
        with-contract and without-contract comparison is published in Southleft&apos;s A/B
        of an agent building against a machine-readable design system.
      </p>
    </div>
  );
}
