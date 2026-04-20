import Link from "next/link";
import Image from "next/image";
import styles from "./CaseStudyCard.module.css";

export type CaseStudyTagVariant = "design-systems" | "ux-strategy" | "research";

export interface CaseStudyCardProps {
  image: {
    src: string;
    alt: string;
    ratio?: "16:9" | "4:3";
  };
  tag: {
    label: string;
    variant: CaseStudyTagVariant;
  };
  title: string;
  description: string;
  href: string;
}

const TAG_VARIANT_CLASS: Record<CaseStudyTagVariant, string> = {
  "design-systems": styles.tagDesignSystems,
  "ux-strategy": styles.tagUxStrategy,
  "research": styles.tagResearch,
};

export default function CaseStudyCard({
  image,
  tag,
  title,
  description,
  href,
}: CaseStudyCardProps) {
  const ratio = image.ratio ?? "16:9";
  const ratioClass = ratio === "4:3" ? styles.ratio43 : styles.ratio169;

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.link}>
        <div className={`${styles.imageWrap} ${ratioClass}`}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
          />
        </div>
        <div className={styles.body}>
          <span className={`${styles.tag} ${TAG_VARIANT_CLASS[tag.variant]}`}>
            {tag.label}
          </span>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </Link>
    </article>
  );
}
