import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Section from "@/components/layout/Section";
import { HOME_TAGLINE, POSITIONING } from "@/lib/copy";
import styles from "./Hero.module.css";

/* the H1 is the positioning phrase (the ONE constant, constitution
   section 6) with the iris accent on its last word, then the tagline */
const WORDS = POSITIONING.split(" ");

/**
 * Home opening (home rebuild, 19 Sep 2026): status line, the H1, the
 * lead, one primary and one quiet link, and Bella saying hello. On
 * scroll the H1 thins and tightens and Bella drifts up (CSS scroll
 * timeline, Hero.module.css); static where unsupported or when the
 * reader prefers reduced motion.
 */
export default function Hero() {
  return (
    <Section labelledBy="home-hero-title">
      <div className={styles.hero}>
        <div>
          <p className={`text-code ${styles.status}`}>
            <span className={styles.metaItem}>
              <span className={styles.dot} aria-hidden="true" />
              Open to roles and projects
            </span>
            <span className={styles.metaItem}>Elleta McDaniel · near Barcelona</span>
          </p>
          <Heading
            tier="hero"
            as="h1"
            id="home-hero-title"
            className={styles.headline}
            accent={WORDS[WORDS.length - 1]}
            after={`. ${HOME_TAGLINE}`}
          >
            {WORDS.slice(0, -1).join(" ")}
          </Heading>
          <p className={`text-lead ${styles.lead}`}>
            Tokens, components and the governance that keeps them honest. I work in Figma and in
            the code, and I build the <strong>contracts and gates</strong> that let AI move fast
            without breaking the system.
          </p>
          <div className={styles.ctas}>
            <Button href="/work" variant="primary">
              See the work
              <Icon name="ArrowRight" size="sm" />
            </Button>
            <Link href="/quick" className={styles.quietLink}>
              Short on time? The 4-minute version
            </Link>
          </div>
        </div>

        <figure className={styles.art}>
          <picture>
            <source srcSet="/images/bella/set/bella-hello.webp" type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/bella/set/bella-hello.svg"
              alt="Illustration of Bella, a black and white papillon, lifting a paw to say hello."
              width={800}
              height={900}
            />
          </picture>
          <figcaption className="text-meta">Bella says hi. Head of quality assurance.</figcaption>
        </figure>
      </div>
    </Section>
  );
}
