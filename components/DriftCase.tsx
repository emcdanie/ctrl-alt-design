import { CasePage, Beat, BeatText, CaseQuote, Lessons } from "@/components/case/CasePage";
import CaseFigure from "@/components/case/CaseFigure";
import caseStyles from "@/components/case/Case.module.css";
import CaseHero from "@/components/case/CaseHero";
import CaseShowcase, { type ShowcaseCard } from "@/components/case/CaseShowcase";
import type { CollagePiece } from "@/components/case/CaseCollage";
import { KitButton } from "@/components/case/kit/Kit";
import { AtomRow, DriftAnatomy, DriftButtons, DriftedButton, DriftedList, DriftShipped, DriftSurvey, StayCard, TokenPin } from "@/components/case/pictures/DriftPictures";
import NextCase from "@/components/case/NextCase";
import { CoverAtlas, CoverBrands, CoverSearch } from "@/components/case/pictures/Covers";
import { ZoomLevels, TokenCascade, Rollout, Staircase } from "@/components/case/DriftFigures";

/* From Drift to Foundation (Site v3, Elleta, 4 Oct 2026): the case rebuilt
   from the Site v3 frames, Figma e7U5Hxpr441rT719SPclas, 1440 293:1259 and
   390 303:4790, on Template / Case page. Copy is the frames' copy.
   Every picture is live and follows the theme (no PNG pictures, Elleta,
   4 Oct late): 1, 2, 5 and 8 are drawn from the Case UI kit; 3, 4, 6
   and 7 are drawn here and move. The hero band and showcase (4 Oct late)
   replace the kicker, the lead and the Figure 1 cover; their pieces are
   clones of the figures' own components. */

const HERO_LABEL =
  "Before and after, overlapping: a drifted 'Stays in Lisbon' list where each row uses its own button, type and capitalisation, and the Harbour loft stay card on the system with one Book now button; five drifted book buttons and two token pins, action.primary and accent, scattered below.";

const COLLAGE: CollagePiece[] = [
  { key: "before", node: <DriftedList />, x: -4, y: 83, r: 6, s: 0.975 },
  { key: "after", node: <StayCard />, x: 244, y: -14, r: -3, s: 0.96 },
  { key: "b1", node: <DriftedButton n={1} />, x: 39, y: 382, r: 4 },
  { key: "b2", node: <DriftedButton n={2} />, x: 111, y: 402, r: -2 },
  { key: "b3", node: <DriftedButton n={3} />, x: 23, y: 429, r: -3, phone: false },
  { key: "b4", node: <DriftedButton n={4} />, x: 149, y: 448, r: 3, phone: false },
  { key: "b5", node: <DriftedButton n={5} />, x: 235, y: 422, r: 2 },
  { key: "t1", node: <TokenPin token="action.primary" swatch="var(--kit-action)" />, x: 299, y: 426, r: -4, phone: false },
  { key: "t2", node: <TokenPin token="accent" swatch="var(--color-semantic-accent)" />, x: 348, y: 403, r: 3 },
];

const SHOWCASE: ShowcaseCard[] = [
  {
    title: "Drifted · six of seventeen",
    label: "Six of the seventeen drifted book buttons: Book, BOOK NOW, Book Now, Reserve, RESERVE and Book this stay, each its own fill, radius and type.",
    node: (
      <span className={caseStyles.piecesRow}>
        {([1, 2, 3, 4, 5, 6] as const).map((n) => (
          <DriftedButton key={n} n={n} />
        ))}
      </span>
    ),
  },
  {
    title: "On the system · atoms",
    label: "Atoms on the system: one Book now button, then a chip (Direct), an input (Where to?) and a tag (Admin).",
    node: (
      <span className={caseStyles.piecesStack}>
        <KitButton>Book now</KitButton>
        <AtomRow atom="Chip" />
        <AtomRow atom="Input" />
        <AtomRow atom="Tag" />
      </span>
    ),
  },
  {
    title: "One token, every button",
    label: "The tokens every button reads: action.primary, text.primary, accent, radius/card 16 and shadow.card.",
    node: (
      <span className={caseStyles.piecesRow}>
        <TokenPin token="action.primary" swatch="var(--kit-action)" />
        <TokenPin token="text.primary" swatch="var(--color-semantic-text-primary)" />
        <TokenPin token="accent" swatch="var(--color-semantic-accent)" />
        <TokenPin token="radius/card 16" />
        <TokenPin token="shadow.card" />
      </span>
    ),
  },
];

export default function DriftCase() {
  return (
    <CasePage
      hero={
        <CaseHero
          title="From Drift to Foundation"
          meta={["Complex SaaS · B2B travel", "2024 to 2026"]}
          intro="A B2B travel platform had spent two years on a redesign with nothing live. I built its first design system from zero, wired the tokens to production, and the work started shipping."
          disclosure="Under NDA: visuals are my own, recreated; no client screens or data."
          collage={{ label: HERO_LABEL, pieces: COLLAGE }}
        />
      }
      showcase={<CaseShowcase label="Drift, in real UI" cards={SHOWCASE} />}
      resultSize="page"
      results={[
        { n: "+2", label: "designers, plus a funded engineering team" },
        { n: "6", label: "product areas live on the system" },
        { n: "1", label: "checkout for every product" },
      ]}
      facts={[
        { label: "Role", value: "Lead product designer, design systems" },
        { label: "Team", value: "Me, then two more designers and a funded engineering team" },
        { label: "Timeline", value: "2024 to 2026" },
        { label: "Shipped", value: "Six product areas on the system" },
      ]}
    >
      <Beat
        id="problem"
        num="1"
        label="The problem, framed"
        heading="It felt complicated. The numbers said why."
        lead="The drift was structural. Every vertical solved the same need its own way, with no shared language. I interviewed customer success and sales to turn “it looks inconsistent” into evidence."
      >
        <CaseFigure n={1} caption="Four answers in words, not percentages: from my own interviews, not customer data.">
          <DriftSurvey />
        </CaseFigure>
        <BeatText>Then I counted. Seventeen buttons did one job. The filter chip was built four ways, which broke sort and empty states.</BeatText>
        <CaseFigure
          n={2}
          caption="Seventeen near-identical buttons from one product: 8 corner radii, 2 fonts, 4 heights. The ringed one is the one the system kept. Recreated."
        >
          <DriftButtons />
        </CaseFigure>
      </Beat>

      <Beat
        id="zoom"
        num="1b"
        label="Four zoom levels"
        heading="From the whole file, down to one field, and back."
        lead="One overloaded design file, and code that didn’t match it. Zooming in showed the same input built again and again, each a little different."
      >
        <CaseFigure n={3} replay inset caption="One file, one page, one frame, one field. Recreated from my audit deck.">
          <ZoomLevels />
        </CaseFigure>
      </Beat>

      <Beat
        id="decisions"
        num="2"
        label="Decisions"
        heading="Decide once, and let it travel."
        lead="Tiered tokens, so a component reads a meaning, never a raw value. The same names live in Figma variables and in code, so design and code stay in parity."
      >
        <CaseFigure
          n={4}
          replay
          inset
          caption="Change it once in the foundation, and every button follows. Decide the colour once; the semantic name carries the meaning, and every vertical’s button reads that name. Recreated concept."
        >
          <TokenCascade />
        </CaseFigure>
        <BeatText>Every fare case became one rule string, so a card can’t show the wrong text. Here is one stay card with the tokens it reads.</BeatText>
        <CaseFigure n={5} caption="One stay card, each part pinned to the token it reads.">
          <DriftAnatomy />
        </CaseFigure>
      </Beat>

      <Beat id="collaboration" num="3" label="Collaboration, and where it broke" heading="Nobody asked for a system.">
        <CaseFigure n={6} replay inset caption="From one designer's side project to every team's.">
          <Rollout />
        </CaseFigure>
        <CaseQuote
          quote="I didn’t wait for sign-off. The team said a system, docs and changelogs weren’t necessary, so I built it for myself and paired with one developer. The cost: months carrying it alone, and pushback later on workflows, complexity and naming."
          name="Elleta McDaniel"
          role="What I chose not to do"
        />
      </Beat>

      <Beat
        id="outcome"
        num="4"
        label="Outcome"
        heading="From a redesign that stalled to one that shipped."
        lead="Two years of redesign, and nothing live. Then the system gave every squad one language, and the work started landing."
      >
        <CaseFigure n={7} replay inset caption="Each step is a product area shipped on the system. Order as on my list; not to scale.">
          <Staircase />
        </CaseFigure>
        <CaseFigure n={8} caption="A handful of small parts builds every product area. Recreated with BELLA; no client screens.">
          <DriftShipped />
        </CaseFigure>
        <CaseQuote
          quote="I used Figma Make to prototype components and whole flows, so developers found the gaps before the sprint instead of halfway through it. What I kept out: the decisions. What ships and what things are called were settled with the team, not generated."
          name="Elleta McDaniel"
          role="AI, and where I kept it out"
        />
      </Beat>

      <Beat
        id="reflection"
        num="5"
        label="Reflection"
        heading="Next time, the team comes first."
        lead="Inconsistency is a symptom. The cause is missing structure, and decisions nobody wrote down."
      >
        <Lessons
          items={[
            { icon: "Group", title: "Build the team first.", body: "Get senior developers on board before building, not after the first components land." },
            { icon: "Label", title: "Name it together.", body: "Review and name components with the developers who will build them, so naming never stalls the work." },
            { icon: "Search", title: "Ask why it is there.", body: "In a legacy product, half the job is finding out why something exists before you change it." },
          ]}
        />
      </Beat>

      <NextCase
        slug="design-system-transformation"
        next={{
          href: "/case-studies/theming",
          meta: "B2B travel · Theming",
          title: "One system, many brands",
          cover: <CoverBrands slot="next" label="One Button in three client themes, Brand A, B and C: one Button, three themes, zero forks." />,
        }}
        lead="How the same components wear each client’s brand without forking the code."
        more={[
          {
            href: "/case-studies/chip",
            meta: "AI-enabled design · 2026",
            title: "CHIP",
            cover: <CoverAtlas slot="work" label="CHIP's Atlas view of the FilterChip: six parts pinned on the anatomy stage, bottom layer first, with 'checks 6 of 6 pass'." />,
          },
          {
            href: "/case-studies/search-experts",
            meta: "B2B travel · Product",
            title: "Search for experts",
            cover: <CoverSearch slot="work" label="A flight search result: Lisbon to Amsterdam, a direct morning flight at €89 with Select." />,
          },
        ]}
      />
    </CasePage>
  );
}
