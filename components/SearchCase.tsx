import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import ExampleFrame, { FrameDemo } from "@/components/ExampleFrame";
import type { CaseStudy } from "@/lib/content";

/**
 * Search for experts (Elleta, 21 Sep 2026; approved mock
 * case-study-search-mock.html): the flight results page, shipped and
 * refined, as a working prototype with its six numbered notes. The
 * prototype lives in public/demos/travel (the mock's own markup, style
 * and script); the section's words are page-native. NDA: industry only.
 */
export default function SearchCase({ cs }: { cs: CaseStudy }) {
  void cs;
  return (
    <Section id="results" labelledBy="results-title" ruled>
      <SectionHeader
        id="results-title"
        kicker="01 · Results, shipped and refined"
        heading="Change anything without starting over."
        lead="Pick a note to see it on the screen. The refined version works, so try editing the search or adding a filter."
      />
      <ExampleFrame
        demo
        path="travel / flights / results"
        caption={
          <>
            Shipped and refined, desktop and mobile. Recreated and de-branded.{" "}
            <a href="/demos/travel/search-results.html" target="_blank" rel="noopener noreferrer" className="trv-link">
              Open full screen ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </>
        }
      >
        <FrameDemo src="/demos/travel/search-results.html" title="Flight results prototype, shipped and refined, with six notes" heights={[790, 1330, 1590]} />
      </ExampleFrame>
    </Section>
  );
}
