import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import { POSITIONING } from "@/lib/copy";
import styles from "./Hero.module.css";

/**
 * Compact landing hero (surface-the-work, 2026-07-23): what-you-do +
 * name + portrait, "Pick a piece." energy intact. The bubble cluster
 * moved below the selected-work row (app/page.tsx, philosophy layer);
 * the portrait reuses the About .photo-bubble recipe, no new pattern.
 * The headline renders through the Heading primitive (hero tier); the
 * .headline shell keeps the proto's recorded hero scale.
 */
export default function Hero({ peekOpen = false }: { peekOpen?: boolean }) {
  return (
    <section className="hero-landing">
      <div className={styles.hero}>
        {/* ── Headline ── */}
        <div>
          <p className={styles.kicker}>Elleta McDaniel, Barcelona</p>
          <Heading tier="hero" className={styles.headline}>
            Pick a<br />
            <span className="display-heading__accent">piece.</span>
          </Heading>
          <p className={styles.intro}>
            I design <b>{POSITIONING}</b>. Tokens, components, and the governance
            that keeps them from drifting. I read code and work with engineers directly.
          </p>

          {/* Two doors, no forced path: explore (the library) or the
              four-minute quick version. ONE primary per view. */}
          <div className={styles.ctaRow} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--spacing-4)" }}>
            <Button href="/work" variant={peekOpen ? "secondary" : "primary"}>
              Browse the library
              <Icon name="ArrowRight" size="sm" />
            </Button>
            <Link href="/quick" className={styles.quietLink}>
              Short on time? The quick version →
            </Link>
          </div>
          {/* ONE pointer to the system (phase 1): a line, not a section */}
          <p className={styles.systemLine}>
            Built on its own design system.{" "}
            <Link href="/design-system" className={styles.quietLink}>
              Inspect it live →
            </Link>
          </p>
        </div>

        {/* ── Portrait: the About bubble treatment, same asset ── */}
        <div className="photo-bubble justify-self-center lg:justify-self-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/thumbnails/Me.jpeg" alt="Elleta, portrait" />
        </div>
      </div>
    </section>
  );
}
