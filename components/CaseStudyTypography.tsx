/** Shared typography primitives for case study pages */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.14em",
      color: "#8A8A8A",
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
      fontWeight: 400,
      color: "#1A1A1A",
      lineHeight: 1.12,
      marginBottom: "24px",
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
      fontSize: "16px",
      fontWeight: 400,
      color: "#2C2C2C",
      lineHeight: 1.6,
      marginBottom: "18px",
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
      color: "#2C2A28",
      borderLeft: "3px solid #3A3430",
      paddingLeft: "28px",
      paddingTop: "20px",
      paddingBottom: "20px",
      paddingRight: "8px",
      background: "#F5F2EE",
      borderRadius: "0 6px 6px 0",
      margin: "48px 0",
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
