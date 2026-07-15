"use client";

import caseStudies from "@/lib/content";
import FadeIn from "@/components/FadeIn";
import CaseStudyCard, {
  type CaseStudyCardProps,
  type CaseStudyTagVariant,
} from "@/components/bella/CaseStudyCard";
import CaseStudyCardGrid from "@/components/bella/CaseStudyCardGrid";

/** Map the free-text `category` field on CaseStudy data → the 3 BELLA
 * CaseStudyCard tag variants. TODO(bella-migration): the data model has
 * 4 categories (DESIGN SYSTEMS / DATA VIZ / UX STRATEGY / PRODUCT UX);
 * BELLA's card has 3 variants. DATA VIZ and anything unrecognised fall
 * through to "research". Revisit when BELLA adds a 4th variant or when
 * CaseStudy.category is promoted to an enum. */
function categoryToVariant(category: string): CaseStudyTagVariant {
  const normalized = category.toUpperCase();
  if (normalized.includes("DESIGN SYSTEM")) return "design-systems";
  if (normalized.includes("UX STRATEGY") || normalized.includes("PRODUCT UX")) {
    return "ux-strategy";
  }
  return "research";
}

type CardEntry = CaseStudyCardProps & { key: string };

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="layout-header flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="section-label mb-3">{label}</p>
        <h2 className="heading-section">{title}</h2>
        {description && (
          <p
            className="body-lg mt-3 max-w-xl"
            style={{ color: "var(--color-muted)" }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CaseStudyGrid() {
  // Extract card data into a typed array above the grid — no inline JSX per card.
  const cards: CardEntry[] = caseStudies.map((cs) => ({
    key: cs.slug,
    image: {
      src: cs.thumbnailImage || cs.heroImage,
      alt: cs.title,
      ratio: "16:9",
    },
    tag: {
      label: cs.category,
      variant: categoryToVariant(cs.category),
    },
    title: cs.title,
    description: cs.description,
    href: cs.href ?? `/case-studies/${cs.slug}`,
  }));

  return (
    <section id="work" className="layout-section">
      <div className="layout-container">
        <FadeIn>
          <SectionHeader
            label="— Selected Work"
            title="Case Studies"
            description="Long-form project work across design systems, enterprise platforms, and complex product UX."
          />
        </FadeIn>

        <CaseStudyCardGrid>
          {cards.map((card, i) => (
            <FadeIn key={card.key} delay={i * 60}>
              <CaseStudyCard
                image={card.image}
                tag={card.tag}
                title={card.title}
                description={card.description}
                href={card.href}
              />
            </FadeIn>
          ))}
        </CaseStudyCardGrid>

        {/* Stat moment — one confident statement, no invented metrics.
            Figure is true framing; support line reuses process copy. */}
        <FadeIn>
          <div className="stat-moment flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <p className="stat-moment__figure">
              Design systems built <span className="stat-moment__accent">from zero.</span>
            </p>
            <p className="stat-moment__support">
              Token-based component libraries, design language definition, and scalable patterns built to last.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
