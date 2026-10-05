import { CasePage, Beat, BeatText, CaseQuote, Lessons } from "@/components/case/CasePage";
import CaseFigure from "@/components/case/CaseFigure";
import CaseHero from "@/components/case/CaseHero";
import CaseShowcase, { type ShowcaseCard } from "@/components/case/CaseShowcase";
import type { CollagePiece } from "@/components/case/CaseCollage";
import { ButtonAnatomyMini, DriftAnatomy, DriftButtons, DriftedButton, DriftedList, DriftedSet, DriftShipped, DriftSurvey, StayCard, TokenPin } from "@/components/case/pictures/DriftPictures";
import NextCase from "@/components/case/NextCase";
import { ZoomLevels, TokenCascade, Rollout, Staircase, TokenEverywhere } from "@/components/case/DriftFigures";

/* From Drift to Foundation (Site v3, Elleta, 4 Oct 2026): the case rebuilt
   from the Site v3 frames, Figma e7U5Hxpr441rT719SPclas, 1440 293:1259 and
   390 303:4790, on Template / Case page. Copy is the frames' copy.
   Every picture is live and follows the theme (no PNG pictures, Elleta,
   4 Oct late): 1, 2, 5 and 8 are drawn from the Case UI kit; 3, 4, 6
   and 7 are drawn here and move. The hero band and showcase (4 Oct late)
   replace the kicker, the lead and the Figure 1 cover; their pieces are
   clones of the figures' own components. */

const HERO_LABEL =
  "Before and after, overlapping: a drifted 'Stays in Lisbon' list where each row uses its own type and capitalisation, and the Harbour loft stay card on the system with one Book now button; five drifted book buttons and two token pins, action.primary and accent, scattered below.";

/* job 38 (P1.4): no text under another card. The stay card sits behind
   on the right; the drifted list sits in front and overlaps only the
   card's photo (its "1 / 8" dropped here), ending above the card's title.
   The loose buttons and pins share the free corner bottom left. */
/* the 6fd03f9 composition (job 41); the one fix: "Canal House Suite" is
   no longer under the stay card (card flush right at 261, list 0.94) */
const COLLAGE: CollagePiece[] = [
  { key: "before", node: <DriftedList />, x: 0, y: 90, s: 0.94 },
  { key: "after", node: <StayCard />, x: 261, y: 10, s: 0.89 },
  { key: "b1", node: <DriftedButton n={1} />, x: 39, y: 382 },
  { key: "b2", node: <DriftedButton n={2} />, x: 111, y: 402 },
  { key: "b3", node: <DriftedButton n={3} />, x: 23, y: 429, phone: false },
  { key: "b4", node: <DriftedButton n={4} />, x: 149, y: 443, phone: false },
  { key: "b5", node: <DriftedButton n={5} />, x: 235, y: 422 },
  { key: "t1", node: <TokenPin token="action.primary" swatch="var(--kit-action)" float swap />, x: 331, y: 440, s: 0.75, phone: false },
  { key: "t2", node: <TokenPin token="accent" swatch="var(--color-semantic-accent)" float />, x: 349, y: 405, s: 0.75 },
];

/* "17 → 1 → everywhere" (Elleta, 5 Oct): the drift, the one button, and
   the one token reaching every screen */
const SHOWCASE: ShowcaseCard[] = [
  {
    title: "17 buttons, one job",
    label: "17 buttons, one job: a count of 17, then six of the drifted book buttons, Book, BOOK NOW, Book Now, Reserve, RESERVE and Book this stay, each its own fill, radius and type.",
    node: <DriftedSet />,
  },
  {
    title: "1 button",
    label: "1 button: the system's Book now button, pinned to the three tokens it reads: action.primary for the fill, radius 16 for the corners, text.primary for the label.",
    node: <ButtonAnatomyMini />,
  },
  {
    title: "1 token, every screen",
    label: "1 token, every screen: the action.primary token, cycling from indigo to teal to ochre, and the buttons that read it, on a Harbour loft stay card, a search bar and a booking bar, recolouring together.",
    node: <TokenEverywhere />,
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
          collage={{ label: HERO_LABEL, pieces: COLLAGE, phone: <StayCard />, phoneLabel: "The Harbour loft stay card, built on the system: old town by the water, 4.9 stars from 23 reviews, 2 beds, 1 bath, Wi-Fi and parking, and one Book now button at 142 euros a night." }}
        />
      }
      showcase={<CaseShowcase label="Drift, in real UI" cards={SHOWCASE} hook="Change it once. It ships everywhere." />}
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
        <CaseFigure n={3} replay caption="One file, one page, one frame, one field. Recreated from my audit deck.">
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
        <CaseFigure n={6} replay caption="From one designer's side project to every team's.">
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
        <CaseFigure n={7} replay caption="Each step is a product area shipped on the system. Order as on my list; not to scale.">
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

      <NextCase slug="design-system-transformation" />
    </CasePage>
  );
}
