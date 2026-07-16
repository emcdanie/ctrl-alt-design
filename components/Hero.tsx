"use client";

import Link from "next/link";
import BubbleCluster from "./BubbleCluster";
import { POSITIONING } from "@/lib/copy";
import styles from "./Hero.module.css";

/**
 * Bubble-cluster hero (from _proto/_hero.html): "Pick a piece." headline
 * (the only Unique surface) next to the glossy case-bubble cluster.
 * Cluster behaviour + a11y live in BubbleCluster (also the /work Map view).
 */
export default function Hero({ onEnterDashboard }: { onEnterDashboard?: () => void }) {
  return (
    <section className="hero-landing" style={{ display: "flex", alignItems: "center", flex: 1, minHeight: 0 }}>
      <div className={styles.hero}>
        {/* ── Headline ── */}
        <div>
          <p className={styles.kicker}>Elleta McDaniel, Barcelona</p>
          <h1 className={styles.headline}>
            Pick a<br />
            <span className={styles.o}>piece.</span>
          </h1>
          <p className={styles.intro}>
            I design <b>{POSITIONING}</b>. Tokens, components, and the governance
            that keeps them from drifting. I read code and work with engineers directly.
          </p>

          {/* CTA row, dashboard path + the labeled route into the library.
              The bubble cluster is the library's Map teaser, never the
              only path in. */}
          <div className={styles.ctaRow} style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-3)" }}>
            <button onClick={() => onEnterDashboard?.()} className="btn-key btn-key--primary">
              Come see what I&apos;ve been building
              <span aria-hidden="true">→</span>
            </button>
            <Link href="/work" className="btn-key">
              Browse the library
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <BubbleCluster />
      </div>
    </section>
  );
}
