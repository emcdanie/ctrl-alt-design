import FadeIn from "@/components/motion/FadeIn";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";

/* One uniform quote card per recommendation, no avatars, no featured
   size. Brad Frost goes first; his credential carries the weight. */
const quotes = [
  {
    quote:
      "Straight up: Elleta is awesome. Any team would be lucky to have Elleta join their crew.",
    name: "Brad Frost",
    role: "Creator of Atomic Design",
  },
  {
    quote:
      "Elleta consistently brings clarity to complex product problems and builds systems that scale.",
    name: "Product Manager",
    role: "A B2B travel platform",
  },
  {
    quote:
      "She approaches design system work with the right mix of rigour and pragmatism, always grounded in real engineering constraints.",
    name: "Engineering Lead",
    role: "A B2B travel platform",
  },
  {
    quote:
      "Her ability to translate messy stakeholder requirements into clear, navigable prototypes was exceptional.",
    name: "ICTS Stakeholder",
    role: "A UN agency, Geneva",
  },
];

const LINKEDIN_RECOMMENDATIONS =
  "https://www.linkedin.com/in/elletamcdaniel/details/recommendations/";

function QuoteCard({
  quote,
  name,
  role,
  delay,
}: {
  quote: string;
  name: string;
  role: string;
  delay: number;
}) {
  return (
    <FadeIn delay={delay} distance={4} className="h-full">
      <Card className="h-full" innerClassName="flex flex-col gap-[var(--spacing-3)]">
        {/* small quote glyph, soft periwinkle tint */}
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--font-subsection)",
            lineHeight: 1,
            color: "var(--color-semantic-accent)",
            opacity: 0.35,
            userSelect: "none",
          }}
          aria-hidden
        >
          &ldquo;
        </span>

        <blockquote
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--typography-font-size-base)",
            color: "var(--color-ink-soft)",
            lineHeight: 1.65,
            margin: 0,
            flex: 1,
          }}
        >
          {quote}
        </blockquote>

        {/* attribution: one quiet line */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--typography-font-size-tag)",
            margin: 0,
            paddingTop: "var(--spacing-3)",
            borderTop: "1px solid var(--color-border-soft)",
            color: "var(--color-muted)",
            lineHeight: 1.4,
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--color-ink)" }}>{name}</span>
          {", "}
          {role}
        </p>
      </Card>
    </FadeIn>
  );
}

export default function TestimonialSection() {
  return (
    <section className="layout-section-tight">
      <div className="layout-container">
        <FadeIn distance={4}>
          <SectionHeader label="Social Proof" title="Trusted by product teams" />
        </FadeIn>

        {/* One uniform grid. Four quotes wrap 2x2 (1-col mobile) so no
            row is left with an orphan card; equal heights via stretch. */}
        <div className="grid grid-cols-1 items-stretch gap-[var(--grid-gap)] sm:grid-cols-2">
          {quotes.map((q, i) => (
            <QuoteCard key={q.name + q.role} {...q} delay={60 + i * 60} />
          ))}
        </div>

        <FadeIn delay={340} distance={4}>
          <div style={{ marginTop: "var(--spacing-6)" }}>
            <a
              href={LINKEDIN_RECOMMENDATIONS}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-nav-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "var(--spacing-touch-target)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-tag)",
                fontWeight: "var(--typography-font-weight-medium)",
                color: "var(--color-muted)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                letterSpacing: "0.02em",
              }}
            >
              View all recommendations &rarr;
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
