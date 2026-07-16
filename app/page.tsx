import OverlayNav from "@/components/OverlayNav";
import Hero from "@/components/Hero";

/* ONE dashboard home (IA consolidation, 2026-07-16): the bubble board
 * with two marked doors — explore (the library) and the quick version
 * (/quick). The constellation itself tags the current-focus piece;
 * the old stranded current-focus card below the fold is gone. */
export default function Home() {
  return (
    <main id="main-content">
      <OverlayNav />
      <Hero />
    </main>
  );
}
