"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import styles from "./ThemeToggle.module.css";

/**
 * Theme toggle (step 1, 18 Sep 2026): ONE round, icon-only button.
 * Moon while light (the way to dark), sun while dark. aria-pressed
 * reports dark mode. The resolved theme follows the OS until the
 * visitor chooses here; the choice persists to localStorage and the
 * layout.tsx pre-paint script defers to it. Renders once, in the
 * header, directly left of the CTA or the menu button.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

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
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable: theme still flips for this page view */
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      className={`${styles.toggle} pointer-events-auto`}
      aria-label="Dark mode"
      aria-pressed={dark}
      data-component="ThemeToggle"
      onClick={toggle}
    >
      <Icon name={dark ? "SunLight" : "HalfMoon"} size="sm" />
    </button>
  );
}
