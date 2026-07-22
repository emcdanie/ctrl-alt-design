"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * The VISUAL gate run (PR 41 amendment 3, item 4; supersedes the
 * text-only console). The site's own Button specimen sits centre
 * stage; the thirteen audits run in the REAL package.json order as
 * stamps landing around it, and each featured check HIGHLIGHTS what
 * it validates on the component itself: audit:contrast flashes the
 * label with its ratio, audit:tokens traces the border to its token,
 * audit:type measures the label size, audit:controls rings the hit
 * area. Values are read LIVE from the rendered specimen (honest
 * data); audit:tokens fails first with the raw-24px reason exactly
 * like the && chain, the fix commits, the re-run stamps all green,
 * the merge lands. Compact console lines accompany the stamps, never
 * replace them. Replayable via the demo-register primary; reduced
 * motion renders the final stamped state instantly.
 */

/* the real gate order, package.json "gate" */
const ORDER = [
  "structure", "fonts", "tokens", "copy", "reuse", "nda", "controls",
  "parity", "agents", "contrast", "axe", "type", "visual",
] as const;

/* featured checks highlight the component itself; the rest stamp in
   compact sequence below the stage zone */
const FEATURED: Record<string, { corner: "tl" | "tr" | "bl" | "br"; zone: string }> = {
  contrast: { corner: "tl", zone: "gv-label" },
  tokens: { corner: "tr", zone: "gv-border" },
  type: { corner: "bl", zone: "gv-size" },
  controls: { corner: "br", zone: "gv-hit" },
};

type Phase = "idle" | "run1" | "halted" | "run2" | "done";

export default function GateRun() {
  const hostRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stamped, setStamped] = useState(0);
  const [live, setLive] = useState({ ratio: "…", size: "…", hit: "…", border: "…" });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const played = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  /* honest data: the stamp values are read from the rendered specimen */
  useEffect(() => {
    const read = () => {
      const el = specRef.current?.querySelector("a, button") as HTMLElement | null;
      const host = hostRef.current;
      if (!el || !host) return;
      const cs = getComputedStyle(el);
      const lum = (c: number[]) => {
        const f = (v: number) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
      };
      const parse = (s: string) => (s.match(/\d+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number);
      const ink = parse(cs.color);
      const bg = parse(getComputedStyle(document.body).backgroundColor);
      const l1 = lum(ink);
      const l2 = lum(bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      setLive({
        ratio: `${ratio.toFixed(1)}:1`,
        size: `${parseFloat(cs.fontSize)}px`,
        hit: `${Math.round(el.getBoundingClientRect().height)}px`,
        border: cs.borderTopColor,
      });
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const HALT_AT = ORDER.indexOf("tokens") + 1; // structure, fonts, tokens(FAIL)

  const play = () => {
    clearTimers();
    played.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      setStamped(ORDER.length);
      return;
    }
    setPhase("run1");
    setStamped(0);
    for (let i = 1; i <= HALT_AT; i++) {
      timers.current.push(setTimeout(() => setStamped(i), 500 * i));
    }
    timers.current.push(setTimeout(() => setPhase("halted"), 500 * HALT_AT + 600));
    /* the fix commits, then the second run stamps the full order */
    timers.current.push(
      setTimeout(() => {
        setPhase("run2");
        setStamped(0);
        for (let i = 1; i <= ORDER.length; i++) {
          timers.current.push(setTimeout(() => setStamped(i), 420 * i));
        }
        timers.current.push(setTimeout(() => setPhase("done"), 420 * ORDER.length + 500));
      }, 500 * HALT_AT + 2400)
    );
  };

  /* auto-play once on scroll into view */
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      setStamped(ORDER.length);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !played.current) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failing = phase === "run1" || phase === "halted";
  const green = phase === "run2" || phase === "done";
  const count = phase === "idle" ? 0 : stamped;
  const stampOn = (name: string) => {
    const i = ORDER.indexOf(name as (typeof ORDER)[number]);
    return count > i && (green || i < HALT_AT);
  };
  const featuredValue = (name: string) => {
    if (name === "contrast") return `label ${live.ratio}`;
    if (name === "type") return `label ${live.size} computed`;
    if (name === "controls") return `hit area ${live.hit}`;
    /* tokens: red on run 1 (the raw value in the diff), the traced
       token once green */
    return failing ? "raw 24px in the diff" : "border --color-accent-ink";
  };
  const tokensFailedStamp = failing && count >= HALT_AT;

  return (
    <div ref={hostRef} className="gv demo-scope">
      <div className="spec-stage gv-stage in" data-hl={undefined}>
        <span className="spec-stage__tag" aria-hidden="true">
          {phase === "idle" ? "The gate" : failing ? "Run 1, red" : phase === "done" ? "Green, merged" : "Run 2"}
        </span>
        {/* the site's own Button specimen (BELLA side, secondary tier;
            the page's one primary keycap stays the contact action) */}
        <span
          ref={specRef}
          className={[
            "gv-spec",
            stampOn("contrast") ? "gv-hl-label" : "",
            stampOn("tokens") && green ? "gv-hl-border" : "",
            tokensFailedStamp ? "gv-hl-fail" : "",
            stampOn("type") ? "gv-hl-size" : "",
            stampOn("controls") ? "gv-hl-hit" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Button variant="secondary">Specimen</Button>
          {stampOn("type") && <span className="gv-measure" aria-hidden="true">{live.size}</span>}
          {tokensFailedStamp && (
            <span className="ds-flag ds-flag--drift gv-failflag">
              <span className="ds-flag__token">padding 24px raw</span>
            </span>
          )}
        </span>
        {/* featured stamps around the specimen */}
        {Object.entries(FEATURED).map(([name, f]) => {
          const on = stampOn(name);
          const failed = name === "tokens" && tokensFailedStamp;
          return (
            <span
              key={name}
              className={`ds-flag ds-flag--${f.corner} gv-stamp${on ? " gv-stamp--on" : ""}${failed ? " ds-flag--drift" : ""}`}
              aria-hidden={!on}
            >
              <span className="ds-flag__value">{failed ? "FAIL" : "PASS"}</span>
              <span className="ds-flag__token">audit:{name} · {featuredValue(name)}</span>
            </span>
          );
        })}
      </div>

      {/* the compact stamps + console: BELOW the stage zone, never on it */}
      <div className="gv-row" role="log" aria-label="The thirteen audits, in gate order">
        {ORDER.map((name) => {
          const on = stampOn(name);
          const failed = name === "tokens" && failing;
          return (
            <span key={name} className={`gv-chip${on ? " on" : ""}${failed && on ? " gv-chip--fail" : ""}`}>
              {name} {on ? (failed ? "FAIL" : "PASS") : ""}
            </span>
          );
        })}
      </div>
      <div className="spec-console gv-console">
        <span className={`gr-line${phase !== "idle" ? " show" : ""}`}>$ git commit -m &quot;fix: hero spacing token&quot;</span>
        <span className={`gr-line gr-line--fail${tokensFailedStamp || green ? " show" : ""}${green ? " gr-line--struck" : ""}`}>
          TOKEN FAIL components/Hero.tsx: raw spacing 24px in the diff; tokens only
        </span>
        <span className={`gr-line${green ? " show" : ""}`}>$ git commit -m &quot;fix: --spacing-6 instead of 24px&quot;</span>
        <span className={`gr-line${phase === "done" ? " show" : ""}`}>gate: green (13/13) · $ gh pr merge, merged on green</span>
      </div>
      {/* the Run control stays the demo register's BLACK primary
          (Elleta's confirmed control-grammar call) */}
      <button type="button" className="demo-btn" onClick={play}>
        Run it again
      </button>
    </div>
  );
}
