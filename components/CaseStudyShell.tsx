import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import OverlayNav from "@/components/OverlayNav";

interface CaseStudyShellProps {
  children: React.ReactNode;
}

export default function CaseStudyShell({ children }: CaseStudyShellProps) {
  return (
    <main style={{ background: "#EDE8DF", minHeight: "100vh" }}>
      <CustomCursor />
      <OverlayNav />

      {/* Fixed floating back button */}
      <Link
        href="/#work"
        className="hover:opacity-75 transition-opacity duration-150"
        style={{
          position: "fixed",
          bottom: "28px",
          left: "28px",
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
          padding: "10px 20px",
          letterSpacing: "0.02em",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        }}
      >
        ← All work
      </Link>

      {children}
    </main>
  );
}
