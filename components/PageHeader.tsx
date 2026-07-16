/**
 * Shared page open (visual-language move #1): mono eyebrow + oversized
 * Unique display headline. Every top-level page opens with this — the
 * home hero register, never the small section-title size.
 */
export default function PageHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="layout-header">
      <p className="eyebrow" style={{ marginBottom: "var(--spacing-4)" }}>
        {eyebrow}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-hero-display)",
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
    </header>
  );
}
