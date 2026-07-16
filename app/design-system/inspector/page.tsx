import type { Metadata } from "next";
import TokenInspector from "@/components/TokenInspector";

export const metadata: Metadata = {
  title: "Token inspector",
  robots: { index: false },
};

/* Chromeless: exists to be embedded as case evidence (Code First) via the
   one embed render path. The full page is /design-system. */
export default function InspectorEmbedPage() {
  return (
    <main
      id="main-content"
      style={{
        minHeight: "100dvh",
        display: "grid",
        alignItems: "center",
        padding: "var(--spacing-6)",
        background: "var(--color-semantic-background)",
      }}
    >
      <TokenInspector />
    </main>
  );
}
