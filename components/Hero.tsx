"use client";

import BubbleCluster from "./BubbleCluster";
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
          <p className={styles.kicker}>Elleta McDaniel — Barcelona</p>
          <h1 className={styles.headline}>
            Pick a<br />
            <span className={styles.o}>piece.</span>
          </h1>
          <p className={styles.intro}>
            I design <b>AI-augmented design systems</b> — tokens, components, and the governance
            that keeps them from drifting. I read code and work with engineers directly.
          </p>

          {/* CTA kept from the previous hero — the path into the dashboard */}
          <div className={styles.ctaRow}>
            <button onClick={() => onEnterDashboard?.()} className="btn-key btn-key--primary">
              Come see what I&apos;ve been building
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <BubbleCluster />
      </div>
    </section>
  );
}
