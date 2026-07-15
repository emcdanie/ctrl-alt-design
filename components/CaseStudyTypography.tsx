/** Shared typography primitives for case study pages */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      /* mono eyebrows — same treatment as the home sections */
      fontFamily: "var(--font-chivo-mono), var(--typography-font-family-mono)",
      fontSize: "11px",
      fontWeight: 500,
      textTransform: "uppercase" as const,
      letterSpacing: "var(--typography-letter-spacing-wider)",
      color: "var(--color-accent-ink)",
      marginBottom: "14px",
    }}>
      {children}
    </p>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: "clamp(26px, 3.5vw, 38px)",
      fontWeight: "var(--typography-font-weight-regular)",
      color: "#1A1A1A",
      lineHeight: 1.12,
      marginBottom: "var(--spacing-6)",
      marginTop: "0",
    }}>
      {children}
    </h2>
  );
}

export function Body({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontSize: "var(--typography-font-size-base)",
      fontWeight: "var(--typography-font-weight-regular)",
      color: "#2C2C2C",
      lineHeight: 1.65,
      marginBottom: "var(--spacing-4)",
    }}>
      {children}
    </p>
  );
}

export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote style={{
      fontFamily: "var(--font-display)",
      fontSize: "clamp(19px, 2.4vw, 24px)",
      fontStyle: "italic",
      color: "var(--color-ink-soft)",
      /* periwinkle rule — fill-only accent use */
      borderLeft: "3px solid var(--color-semantic-accent)",
      paddingLeft: "28px",
      paddingTop: "var(--spacing-5)",
      paddingBottom: "var(--spacing-5)",
      paddingRight: "var(--spacing-2)",
      background: "var(--color-semantic-surface-elevated)",
      borderRadius: "0 var(--radius-md) var(--radius-md) 0",
      margin: "var(--spacing-12) 0",
      lineHeight: 1.55,
    }}>
      {children}
    </blockquote>
  );
}

export function Section({ eyebrow, heading, children }: {
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cs-section">
      <Eyebrow>{eyebrow}</Eyebrow>
      <H2>{heading}</H2>
      {children}
    </section>
  );
}
