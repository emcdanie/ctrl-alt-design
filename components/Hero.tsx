import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import { POSITIONING } from "@/lib/copy";
import styles from "./Hero.module.css";

/* the display headline IS the positioning phrase, resolved from the
   ONE constant (constitution section 6); split only for the line break
   and the established iris accent word, never a second literal */
const WORDS = POSITIONING.split(" ");

/**
 * Compact landing hero (surface-the-work, 2026-07-23; hierarchy fix
 * same day): what-you-do leads as the display H1 (the POSITIONING
 * constant through the Heading primitive), name eyebrow above, "Pick a
 * piece." demoted to the eyebrow leading the doors. The bubble cluster
 * lives below the selected-work row (app/page.tsx, philosophy layer);
 * the portrait reuses the About .photo-bubble recipe, no new pattern.
 * The .headline shell keeps the proto's recorded hero scale.
 */
export default function Hero({ peekOpen = false }: { peekOpen?: boolean }) {
  return (
    <section className="hero-landing">
      <div className={styles.hero}>
        {/* ── Headline ── */}
        <div>
          <p className={styles.kicker}>Elleta McDaniel, Barcelona</p>
          <Heading tier="hero" className={styles.headline}>
            {WORDS.slice(0, -1).join(" ")}{" "}
            <br />
            <span className="display-heading__accent">{WORDS[WORDS.length - 1]}.</span>
          </Heading>
          {/* the H1 states the positioning; the body starts at the how
              (repeat dropped, Elleta 23 Jul) */}
          <p className={styles.intro}>
            Tokens, components, and the governance that keeps them from drifting.
            I read code and work with engineers directly.
          </p>

          {/* "Pick a piece." keeps its energy as the eyebrow framing the
              doors: the cards below, the library, the quick version. */}
          <p className={`section-label ${styles.pick}`}>Pick a piece.</p>

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

        {/* ── Portrait: the About bubble frame at hero scale ── */}
        <div className={`photo-bubble ${styles.portrait} justify-self-center lg:justify-self-end`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/thumbnails/Me.jpeg" alt="Elleta, portrait" />
        </div>
      </div>
    </section>
  );
}
