"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import styles from "./ThemeSwitch.module.css";

/**
 * Sun/moon theme switch (from _proto/_hero.html): role="switch" with
 * aria-checked, sliding keycap thumb (iris in dark). Light is the
 * default on every load; the switch lets a visitor opt into navy dark
 * by flipping [data-theme] on <html> (BELLA's activation hook).
 */
export default function ThemeSwitch() {
  const [dark, setDark] = useState(false);

  // layout.tsx pins data-theme="light" before paint; mirror the DOM
  // attribute (and watch it) so aria-checked can never disagree — the
  // switch renders in both the header and the mobile menu, and both
  // instances must stay in sync.
  useEffect(() => {
    const sync = () => setDark(document.documentElement.dataset.theme === "dark");
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
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
        <Icon name="SunLight" size="sm" className={`${styles.ic} ${styles.sun}`} />
        <Icon name="HalfMoon" size="sm" className={`${styles.ic} ${styles.moon}`} />
        <span className={styles.thumb} />
      </span>
    </button>
  );
}
