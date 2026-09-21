import Image from "next/image";
import Link from "next/link";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";

/* 404 on the Section pattern: Obi, rolled over, and the way back. */
export default function NotFound() {
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />
      <Section prose id="not-found" labelledBy="not-found-title">
        <SectionHeader
          as="h1"
          id="not-found-title"
          heading="Obi rolled"
          accent="over"
          after=". This page doesn't exist."
          figure={<Image className="illo" src="/images/bella/set/obi-404.webp" alt="Obi, rolled over" width={1020} height={650} />}
        />
        <p className="not-found__links">
          <Link href="/work" className="text-action">
            Back to Work →
          </Link>
          <Link href="/about" className="text-action">
            About me →
          </Link>
        </p>
      </Section>
    </main>
  );
}
