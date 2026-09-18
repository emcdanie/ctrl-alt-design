import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import Section, { SectionList } from "@/components/Section";
import TodoNote from "@/components/TodoNote";
import FooterEmail from "@/components/FooterEmail";

export const metadata: Metadata = { title: "Accessibility · Elleta McDaniel" };

/* Accessibility statement. Copy is Elleta's draft (_private/content);
   every [CHECK] stays a visible TODO until she answers it. */
export default function AccessibilityPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />
      <Section
        variant="hero"
        id="accessibility"
        title="Accessibility"
        lede={
          <>
            I design systems for a living, and accessibility is part of the system, not a layer on top. This site
            aims to meet <strong>WCAG 2.2 level AA</strong>.
          </>
        }
      >
        <TodoNote>Last reviewed: the date of publishing.</TodoNote>
      </Section>

      <Section id="what-i-do" title="What I do">
        <SectionList
          items={[
            <><strong>Colour and contrast</strong> come from BELLA, my design system. Text and controls are checked against AA contrast in light and dark mode on every change.</>,
            <><strong>Automated checks</strong> (axe) run on every change, along with tests that make sure the page reads in a sensible order for screen readers.</>,
            <><strong>Keyboard:</strong> everything works without a mouse, with a visible focus ring.</>,
            <><strong>Text size:</strong> nothing is smaller than 14px, sizes follow your browser settings, and pages still work at 200% zoom.</>,
            <><strong>Motion:</strong> animations switch off if you&apos;ve asked your device to reduce motion.</>,
            <><strong>Images</strong> have text alternatives; decorative ones are hidden from screen readers.</>,
          ]}
        />
      </Section>

      <Section id="not-perfect" title="What isn't perfect yet">
        <p>
          Some older case studies and interactive prototypes in the lab were built before these checks and may have
          gaps.
        </p>
        <TodoNote>List any you know about.</TodoNote>
        <p>Videos:</p>
        <TodoNote>Do they have captions? If not, say so and when you&apos;ll add them.</TodoNote>
        <p>
          I test with VoiceOver on macOS and in Chrome. Other screen readers and browsers are checked less often.
        </p>
      </Section>

      <Section id="tell-me" title="Tell me if something doesn't work">
        <p>
          If anything on this site is hard to use, email me with the page and what happened (<FooterEmail className="text-action" />). I&apos;ll reply within five working days and fix what I can.
        </p>
      </Section>
    </main>
  );
}
