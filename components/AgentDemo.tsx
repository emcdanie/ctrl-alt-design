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
 * 2. THE UNGOVERNED SIDE IS A PICTURE, NOT DOM. It renders as a flat
 *    <img> pointing at a static SVG in public/, with an alt describing
 *    what it shows. That is the whole trick: a drawing of bad output has
 *    no colours, no type sizes and no contrast pairs for an audit to
 *    read, so there is nothing to police and therefore nothing to skip.
 *
 *    An earlier pass shipped this side as live rule-violating DOM and
 *    added a [data-example] carve-out to three audits so the gate would
 *    look away. That carve-out is gone, and the constitution now forbids
 *    the whole idea: an audit you can opt out of is not an audit. If
 *    something cannot pass, it does not get to be live DOM.
 *
 *    The GROUNDED side is the opposite and deliberately so: real live
 *    BELLA surfaces built from tokens, policed by the gate exactly like
 *    every other element on the site. Bad is a drawing. Good is the
 *    real thing.
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
  caption: "No contract, so it invents what it does not know.",
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
  caption: "Same agent, same model. The contract is the only difference.",
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
              /* A PICTURE of ungoverned output, not real components. A
                 flat <img> is genuinely opaque: no audit traverses into
                 an image, so none has to be told to ignore it. The alt
                 carries the point for anyone who cannot see it. */
              <img
                className="agentdemo__art agentdemo__art--bad"
                src="/images/ungoverned-output.svg"
                width={280}
                height={214}
                alt="An off-brand travel booking card an ungoverned agent produced. It reads Book your trip, Fast and easy booking today, and BOOK NOW. Clashing magenta and lime colours, a dashed neon outline, cramped spacing, body text below the readable floor, and a call to action whose lime-on-magenta text fails contrast."
              />
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
      {/* one line, and the source is a link (28 Jul, readability audit):
          this was a three-line disclaimer restating the caption above it.
          The claim it qualifies still needs its citation, so the citation
          became the link it always should have been. */}
      <p className="agentdemo__foot">
        A documented pattern, not a measurement of this site.{" "}
        <a
          href="https://southleft.com/insights/design-systems/context-based-design-systems-a-new-model-for-the-ai-driven-product-lifecycle/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Southleft on context-based design systems
        </a>
      </p>
    </div>
  );
}
