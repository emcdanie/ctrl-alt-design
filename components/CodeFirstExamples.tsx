"use client";

import { useEffect, useState } from "react";
import { StatusPill } from "@/components/ui/StatusPill";

/* The four examples of "Code First" (Elleta, 20 Sep 2026, built from
   _private/specs/case-study/case-study-codefirst-mock.html).

   In-page DOM, not iframes: a LinkedPhrase has to be able to point at a
   part of one, so the parts carry data-t. Recreated and simplified from
   the real Button; no client data. */

/* ── 01 · the mismatch: the same button under two names ────────────── */
export function NameMismatch() {
  return (
    <div className="cf-stack">
      <div className="cf-pair">
        <div className="cf-panel" data-t="fig">
          <span className="cf-panel__t">Figma · Button</span>
          <dl className="cf-kv">
            <div>
              <dt>Type</dt>
              <dd>Primary</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>Large</dd>
            </div>
          </dl>
        </div>
        <div className="cf-panel" data-t="sb">
          <span className="cf-panel__t">Storybook · Button</span>
          <dl className="cf-kv">
            <div>
              <dt className="text-code">variant</dt>
              <dd className="text-code">&quot;action&quot;</dd>
            </div>
            <div>
              <dt className="text-code">size</dt>
              <dd className="text-code">&quot;lg&quot;</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="cf-diff" data-t="gap">
        2 of 2 properties named differently. Handoff has to guess.
      </p>
    </div>
  );
}

/* ── 02 · starting from code: the rename, then the token chain ─────── */
const RENAMES = [
  { figma: "Type", code: "variant", state: "Renamed" },
  { figma: "Size · Large", code: "size · lg", state: "Renamed" },
  { figma: "Icon left", code: "iconStart", state: "Matched" },
];

export function CodeAlignment() {
  return (
    <div className="cf-stack">
      <table className="cf-table" data-t="names">
        <thead>
          <tr>
            <th scope="col">Figma</th>
            <th scope="col">Code</th>
            <th scope="col">Now</th>
          </tr>
        </thead>
        <tbody>
          {RENAMES.map((r) => (
            <tr key={r.figma}>
              <td>{r.figma}</td>
              <td className="text-code">{r.code}</td>
              <td>
                <span className="cf-pill">
                  <span aria-hidden="true">✓</span> {r.state}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="case-pipe" data-t="chain">
        <div className="case-tier">
          <span className="case-tier__t">Primitive</span>
          <span className="text-code">blue-600</span>
        </div>
        <span className="text-code case-pipe__to" aria-hidden="true">
          →
        </span>
        <div className="case-tier">
          <span className="case-tier__t">Semantic</span>
          <span className="text-code">action</span>
        </div>
        <span className="text-code case-pipe__to" aria-hidden="true">
          →
        </span>
        <div className="case-tier">
          <span className="case-tier__t">Component</span>
          <span className="text-code">button-bg</span>
        </div>
      </div>
    </div>
  );
}

/* ── 03 · AI in the loop: what the codebase could answer, and what it
   could not. The flagged answer is the point of the section. ──────── */
export function McpTranscript() {
  return (
    <ol className="cf-chat">
      <li className="cf-chat__q" data-t="q">
        Which components use the action token?
      </li>
      <li className="cf-chat__a" data-t="grounded">
        Button, Link and Tabs.
        <span className="text-code cf-chat__meta">3 files · checked against source ✓</span>
      </li>
      <li className="cf-chat__q" data-t="q">
        Is action the right token for the delete button?
      </li>
      <li className="cf-chat__a cf-chat__a--flag" data-t="human">
        That is a design decision. Flagged for Elleta.
      </li>
    </ol>
  );
}

/* ── 04 · same discipline: this page's own tokens, read live ───────── */
const LIVE = ["--color-accent-ink", "--color-ink", "--surface-card", "--radius-card"];

export function LiveTokens() {
  const [rows, setRows] = useState<{ name: string; value: string }[]>([]);
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      setRows(LIVE.map((name) => ({ name, value: cs.getPropertyValue(name).trim() || "unset" })));
    };
    read();
    /* the theme toggle flips a data attribute on <html> */
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  return (
    <div className="cf-stack">
      <table className="cf-table" data-t="tokens">
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Value now</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="text-code">reading the stylesheet</td>
              <td className="text-code">…</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.name}>
                <td className="text-code">{r.name}</td>
                <td className="text-code">{r.value}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <span data-t="gate">
        <StatusPill tone="ok" live>
          <span aria-hidden="true">✓</span> Gate: 0 drift on the last build
        </StatusPill>
      </span>
    </div>
  );
}
