import CustomCursor from "@/components/CustomCursor";
import OverlayNav from "@/components/OverlayNav";
import BackToWorkButton from "@/components/BackToWorkButton";

interface CaseStudyLayoutProps {
  children: React.ReactNode;
}

/**
 * Canonical shell for every case study page.
 * Provides: page background, custom cursor, overlay nav, sticky back button.
 *
 * Replaces CaseStudyShell — CaseStudyShell now re-exports this.
 */
export default function CaseStudyLayout({ children }: CaseStudyLayoutProps) {
  return (
    <main style={{ background: "#EDE8DF", minHeight: "100vh" }}>
      <CustomCursor />
      <OverlayNav />
      <BackToWorkButton />
      {children}
    </main>
  );
}
