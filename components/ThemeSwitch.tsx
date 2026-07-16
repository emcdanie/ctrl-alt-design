"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeSwitch.module.css";

/**
 * Sun/moon theme switch (from _proto/_hero.html): role="switch" with
 * aria-checked, sliding keycap thumb (iris in dark). Light is the
 * default on every load; the switch lets a visitor opt into navy dark
 * by flipping [data-theme] on <html> (BELLA's activation hook).
 */
export default function ThemeSwitch() {
  const [dark, setDark] = useState(false);

  // layout.tsx pins data-theme="light" before paint; mirror it here so
  // aria-checked and the DOM attribute can never disagree.
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    setDark(next);
  };

  return (
    <button
      type="button"
      className={`${styles.switch} pointer-events-auto`}
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={toggle}
    >
      <span className={styles.track}>
        <svg className={`${styles.ic} ${styles.sun}`} viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 1.5v2.5M12 20v2.5M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8" />
          </g>
        </svg>
        <svg className={`${styles.ic} ${styles.moon}`} viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="currentColor" />
        </svg>
        <span className={styles.thumb} />
      </span>
    </button>
  );
}
