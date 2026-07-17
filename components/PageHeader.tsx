import BubbleHeading from "@/components/ui/BubbleHeading";

/**
 * Shared page open. variant="bubble" is the §8 one-per-page title
 * device (iris/peri identity for non-case pages); variant="flat" keeps
 * the plain display headline (the library stays utilitarian).
 */
export default function PageHeader({
  eyebrow,
  title,
  variant = "flat",
}: {
  eyebrow: string;
  title: string;
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
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "var(--font-case-display)",
            lineHeight: 0.9,
            letterSpacing: "0.005em",
            textTransform: "uppercase",
            color: "var(--color-ink)",
          }}
        >
          {title}
        </h1>
      )}
    </header>
  );
}
