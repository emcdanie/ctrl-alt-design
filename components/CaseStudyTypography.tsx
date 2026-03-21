/** Shared typography primitives for case study pages */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontSize: "11px",
      fontWeight: 500,
      textTransform: "uppercase" as const,
      letterSpacing: "0.12em",
      color: "#8A8A8A",
      marginBottom: "12px",
    }}>
      {children}
    </p>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: "clamp(28px, 4vw, 40px)",
      fontWeight: 400,
      color: "#1A1A1A",
      lineHeight: 1.1,
      marginBottom: "20px",
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
      lineHeight: 1.75,
      marginBottom: "20px",
    }}>
      {children}
    </p>
  );
}

export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote style={{
      fontFamily: "var(--font-display)",
      fontSize: "clamp(20px, 2.5vw, 26px)",
      fontStyle: "italic",
      color: "#2C2C2C",
      borderLeft: "3px solid #1A1A1A",
      paddingLeft: "24px",
      paddingTop: "16px",
      paddingBottom: "16px",
      background: "#F9F8F5",
      borderRadius: "4px",
      margin: "40px 0",
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
    <section style={{ marginBottom: "80px" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <H2>{heading}</H2>
      {children}
    </section>
  );
}
