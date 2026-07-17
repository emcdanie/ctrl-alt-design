import BubbleHeading from "@/components/ui/BubbleHeading";
import Heading from "@/components/ui/Heading";

/**
 * Shared page open. variant="bubble" is the §8 one-per-page title
 * device (iris/peri identity for non-case pages); variant="flat" keeps
 * the plain display headline (the library stays utilitarian).
 */
export default function PageHeader({
  eyebrow,
  title,
  accent,
  variant = "flat",
}: {
  eyebrow: string;
  title: string;
  /** accent segment in iris after the title (flat tier only) */
  accent?: string;
  variant?: "flat" | "bubble";
}) {
  return (
    <header className="layout-header">
      <p className="eyebrow" style={{ marginBottom: "var(--spacing-4)" }}>
        {eyebrow}
      </p>
      {variant === "bubble" ? (
        <BubbleHeading title={title} />
      ) : (
        <Heading tier="page" as="h1" accent={accent}>
          {title}
        </Heading>
      )}
    </header>
  );
}
