"use client";

import { useEffect, useRef, useState } from "react";
import { ASKS } from "@/components/theming/themes";
import s from "@/components/ThemingCase.module.css";

const STEP = 2200; /* ms per name, the mock's interval */

/* "One name, two answers": a component asks for a role, light and dark
 * each answer with their own value. Loops through five names while in
 * view, with a pause button; reduced motion holds the first name. */
export default function OneName() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setInView(es.some((e) => e.isIntersecting)), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = !paused && !reduce && inView;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % ASKS.length), STEP);
    return () => window.clearInterval(id);
  }, [running]);

  const a = ASKS[i];
  return (
    <div ref={ref} className={`${s.ask} ${reduce ? s.still : ""}`}>
      {reduce ? null : (
        <button type="button" className={s.askPause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          pause
        </button>
      )}
      <div className={s.askSide}>
        <span className={s.askLbl}>light mode</span>
        <i key={`l${i}`} className={s.askSw} style={{ background: a.lightHex }} aria-hidden="true" />
        <code>{a.light}</code>
        <span className={s.askHex}>{a.lightHex}</span>
      </div>
      <div className={s.askMid}>
        <span className={s.askLbl}>the component asks for</span>
        <b>{a.name}</b>
        <svg key={`a${i}`} viewBox="0 0 200 40" aria-hidden="true">
          <path className={s.aw} d="M100 20 H10 m8 -6 l-8 6 l8 6" />
          <path className={`${s.aw} ${s.awR}`} d="M100 20 H190 m-8 -6 l8 6 l-8 6" />
        </svg>
      </div>
      <div className={s.askSide}>
        <span className={s.askLbl}>dark mode</span>
        <i key={`d${i}`} className={s.askSw} style={{ background: a.darkHex }} aria-hidden="true" />
        <code>{a.dark}</code>
        <span className={s.askHex}>{a.darkHex}</span>
      </div>
    </div>
  );
}
