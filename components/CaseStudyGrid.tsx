"use client";

import caseStudies from "@/lib/content";
import FadeIn from "@/components/FadeIn";
import CaseStudyCard, {
  type CaseStudyCardProps,
  type CaseStudyCoverVariant,
} from "@/components/bella/CaseStudyCard";
import CaseStudyCardGrid from "@/components/bella/CaseStudyCardGrid";

/* Label-cover treatment per case (from _proto/_cards2.html): variant
 * cycles graphite / peri / sage; ingredients are honest one-liners from
 * each case's own content; swatches are that project's token palette
 * (BELLA + recorded cover tokens — no raw values outside the token set). */
const COVER_META: Record<
  string,
  { variant: CaseStudyCoverVariant; ingredients: string[]; swatches: string[] }
> = {
  "brad-frost": {
    variant: "graphite",
    ingredients: [
      "Figma → code parity",
      "Token chain: primitive → semantic",
      "Component governance",
    ],
    swatches: [
      "var(--color-semantic-accent)",
      "var(--color-cover-graphite-ink)",
      "var(--color-accent-ink)",
      "var(--color-semantic-text-secondary)",
    ],
  },
  "design-system-transformation": {
    variant: "peri",
    ingredients: [
      "First design system, from zero",
      "Tokens wired to production",
      "5+ booking verticals",
    ],
    swatches: [
      "var(--color-cover-graphite)",
      "var(--color-semantic-accent)",
      "var(--color-surface)",
      "var(--color-accent-ink)",
    ],
  },
  "filters-decision-support-system": {
    variant: "sage",
    ingredients: [
      "Decision-support filtering",
      "Unified multi-vertical search",
      "Sort and compare patterns",
    ],
    swatches: [
      "var(--color-cover-graphite)",
      "var(--color-supporting-steel)",
      "var(--color-cover-sage-hi)",
      "var(--color-accent-ink)",
    ],
  },
  "un-operational-dashboard": {
    variant: "graphite",
    ingredients: [
      "6+ operational domains, one interface",
      "Role-based analytics views",
      "8-week contract delivery",
    ],
    swatches: [
      "var(--color-supporting-steel)",
      "var(--color-supporting-sage)",
      "var(--color-cover-graphite-ink)",
      "var(--color-semantic-accent)",
    ],
  },
};

const VARIANT_CYCLE: CaseStudyCoverVariant[] = ["graphite", "peri", "sage"];

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
  // Existing titles, tags (as the kicker), and hrefs are kept — only the
  // visual treatment changed to the label covers.
  const cards: CardEntry[] = caseStudies.map((cs, i) => {
    const meta = COVER_META[cs.slug];
    return {
      key: cs.slug,
      cover: {
        variant: meta?.variant ?? VARIANT_CYCLE[i % VARIANT_CYCLE.length],
        kicker: `${cs.category} · ${cs.year}`,
        ingredients: meta?.ingredients ?? cs.tags.slice(0, 3),
        swatches: meta?.swatches ?? [
          "var(--color-semantic-accent)",
          "var(--color-accent-ink)",
          "var(--color-surface)",
        ],
      },
      title: cs.title,
      description: cs.description,
      href: cs.href ?? `/case-studies/${cs.slug}`,
    };
  });

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
                cover={card.cover}
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
