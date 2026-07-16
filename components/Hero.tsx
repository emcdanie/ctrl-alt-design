"use client";

import { useState } from "react";
import Link from "next/link";
import BubbleCluster from "./BubbleCluster";
import { Button } from "@/components/ui/Button";
import { POSITIONING } from "@/lib/copy";
import styles from "./Hero.module.css";

/**
 * Bubble-cluster hero (from _proto/_hero.html): "Pick a piece." headline
 * (the only Unique surface) next to the glossy case-bubble cluster.
 * Cluster behaviour + a11y live in BubbleCluster (also the /work Map view).
 */
export default function Hero() {
  // §7: max one primary per view. While the reveal card (peek) is open it
  // owns the primary, so the hero CTA demotes to secondary.
  const [peekOpen, setPeekOpen] = useState(false);
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

          {/* Two doors, no forced path: explore (the library) or the
              four-minute quick version. ONE primary per view. */}
          <div className={styles.ctaRow} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--spacing-4)" }}>
            <Button href="/work" variant={peekOpen ? "secondary" : "primary"}>
              Browse the library
              <span aria-hidden="true">→</span>
            </Button>
            <Link href="/quick" className={styles.quietLink}>
              Short on time? The quick version →
            </Link>
          </div>
        </div>

        <BubbleCluster onOpenChange={setPeekOpen} />
      </div>
    </section>
  );
}
