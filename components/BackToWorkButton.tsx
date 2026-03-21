import Link from "next/link";

export default function BackToWorkButton() {
  return (
    <Link
      href="/#work"
      className="hover:opacity-100 transition-opacity duration-150"
      style={{
        position: "fixed",
        top: "24px",
        left: "24px",
        zIndex: 50,
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "var(--font-body)",
        fontSize: "13px",
        fontWeight: 600,
        color: "#EDE8DF",
        textDecoration: "none",
        background: "#1A1814",
        borderRadius: "999px",
        padding: "10px 18px",
        letterSpacing: "0.02em",
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        opacity: 0.88,
      }}
    >
      ← Back to Work
    </Link>
  );
}
