import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import GlassBanner from "@/components/ui/GlassBanner";
import type { ReactNode } from "react";

/**
 * THE closing CTA banner (merge sweep 2026-07-17): About and every
 * case page hand-rolled the same GlassBanner + kicker + headline +
 * keycap; this is the one implementation.
 */
export default function CtaBanner({
  kicker = "Have a project in mind?",
  title,
  href = "/contact",
  label = "Get in touch",
}: {
  kicker?: string;
  title: ReactNode;
  href?: string;
  label?: string;
}) {
  return (
    <GlassBanner className="flex flex-col gap-[var(--spacing-8)] md:flex-row md:items-center md:justify-between">
      <div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--typography-font-size-tag)",
            fontWeight: "var(--typography-font-weight-medium)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-eyebrow)",
            color: "var(--color-eyebrow)",
            marginBottom: "var(--spacing-2)",
          }}
        >
          {kicker}
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--font-subsection)",
            fontWeight: "var(--typography-font-weight-bold)",
            color: "var(--color-ink)",
            lineHeight: 1.15,
            textTransform: "uppercase",
          }}
        >
          {title}
        </h2>
      </div>
      <Button href={href} className="shrink-0 self-start md:self-auto">
        {label} <Icon name="ArrowRight" size="sm" />
      </Button>
    </GlassBanner>
  );
}
