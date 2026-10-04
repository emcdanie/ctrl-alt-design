import { CasePage, Beat, BeatText, CaseQuote, Lessons } from "@/components/case/CasePage";
import CaseFigure from "@/components/case/CaseFigure";
import CasePicture from "@/components/case/CasePicture";
import NextCase from "@/components/case/NextCase";
import { ZoomLevels, TokenCascade, Rollout, Staircase } from "@/components/case/DriftFigures";

/* From Drift to Foundation (Site v3, Elleta, 4 Oct 2026): the case rebuilt
   from the Site v3 frames, Figma e7U5Hxpr441rT719SPclas, 1440 293:1259 and
   390 303:4790, on Template / Case page. Copy is the frames' copy.
   Pictures 1, 2, 3, 6 and 9 are the frames' own art at 2x (the Case UI
   kit is never live DOM); figures 4, 5, 7 and 8 are drawn here and move. */

const IMG = "/images/case/drift";

export default function DriftCase() {
  return (
    <CasePage
      kicker="Complex SaaS · 2024 to 26 · Design systems"
      title="From Drift to Foundation"
      lead="A B2B travel platform had spent two years on a redesign with nothing live. I built its first design system from zero, wired the tokens to production, and the work started shipping."
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
      cover={
        <CaseFigure
          n={1}
          phoneTop="label"
          caption="Before: every team built its own card, button and type. After: one system, and 17 buttons became one. Under NDA: visuals are my own, recreated; no client screens or data."
        >
          <CasePicture
            src={`${IMG}/f1-cover.webp`}
            phone={`${IMG}/f1-cover-390.webp`}
            width={2112}
            height={1391}
            alt="Before: a 'Stays in Lisbon' list where each row uses a different button, type and capitalisation, marked with a red cross. After: one Harbour loft stay card on the system, with one Book now button, marked with a green tick."
          />
        </CaseFigure>
      }
    >
      <Beat
        id="problem"
        num="1"
        label="The problem, framed"
        heading="It felt complicated. The numbers said why."
        lead="The drift was structural. Every vertical solved the same need its own way, with no shared language. I interviewed customer success and sales to turn “it looks inconsistent” into evidence."
      >
        <CaseFigure n={2} caption="Four answers in words, not percentages: from my own interviews, not customer data.">
          <CasePicture
            src={`${IMG}/f2-survey.webp`}
            phone={`${IMG}/f2-survey-390.webp`}
            width={2112}
            height={988}
            alt="What support and sales told me, from my survey of 28 people: most had walked a customer through a booking; more than half said changing a booking was hard; more than 4 in 10 had lost a booking to complexity; more than half spent an hour or more a week helping customers book."
          />
        </CaseFigure>
        <BeatText>Then I counted. Seventeen buttons did one job. The filter chip was built four ways, which broke sort and empty states.</BeatText>
        <CaseFigure
          n={3}
          caption="Seventeen near-identical buttons from one product: 8 corner radii, 2 fonts, 4 heights. The ringed one is the one the system kept. Recreated."
        >
          <CasePicture
            src={`${IMG}/f3-buttons.webp`}
            phone={`${IMG}/f3-buttons-390.webp`}
            width={2112}
            height={1016}
            alt="Buttons in production: 17 buttons that all mean 'book a stay', labelled for their differences: square corners, no radius at all, all caps, full pill, a second font, light weight and pale. One is ringed as the one the system kept."
          />
        </CaseFigure>
      </Beat>

      <Beat
        id="zoom"
        num="1b"
        label="Four zoom levels"
        heading="From the whole file, down to one field, and back."
        lead="One overloaded design file, and code that didn’t match it. Zooming in showed the same input built again and again, each a little different."
      >
        <CaseFigure n={4} replay inset caption="One file, one page, one frame, one field. Recreated from my audit deck.">
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
          n={5}
          replay
          inset
          caption="Change it once in the foundation, and every button follows. Decide the colour once; the semantic name carries the meaning, and every vertical’s button reads that name. Recreated concept."
        >
          <TokenCascade />
        </CaseFigure>
        <BeatText>Every fare case became one rule string, so a card can’t show the wrong text. Here is one stay card with the tokens it reads.</BeatText>
        <CaseFigure n={6} caption="One stay card, each part pinned to the token it reads.">
          <CasePicture
            src={`${IMG}/f6-anatomy.webp`}
            phone={`${IMG}/f6-anatomy-390.webp`}
            width={2112}
            height={1386}
            alt="The Harbour loft stay card with each part pinned to its token: --radius-card on the corners, --text-primary on the title, --accent on the stars, color.action.primary on Book now, --text-secondary on the location, --border-subtle on the divider, --surface-card on the card."
          />
        </CaseFigure>
      </Beat>

      <Beat id="collaboration" num="3" label="Collaboration, and where it broke" heading="Nobody asked for a system.">
        <CaseFigure n={7} replay inset caption="From one designer's side project to every team's.">
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
        <CaseFigure n={8} replay inset caption="Each step is a product area shipped on the system. Order as on my list; not to scale.">
          <Staircase />
        </CaseFigure>
        <CaseFigure n={9} caption="A handful of small parts builds every product area. Recreated with BELLA; no client screens.">
          <CasePicture
            src={`${IMG}/f9-shipped.webp`}
            phone={`${IMG}/f9-shipped-390.webp`}
            width={2112}
            height={1620}
            alt="Atoms, small parts designed once (input, chip, button, avatar, tag), wired to the product areas they build: Search, Checkout and payment, and Users and roles, each marked Live. Also live on the system: Design system, Flights, Cars. Next: flight extras, nearly done."
          />
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
          cover: { src: `${IMG}/next-federated.webp`, width: 1040, height: 680, alt: "One Button in three client themes, Brand A, B and C: one Button, three themes, zero forks." },
        }}
        lead="How the same components wear each client’s brand without forking the code."
        more={[
          {
            href: "/case-studies/chip",
            meta: "AI · Design systems",
            title: "CHIP: an agent that catches drift",
            cover: { src: `${IMG}/work-chip.webp`, width: 980, height: 520, alt: "CHIP reviewing checkout: found 14 hard-coded colours outside tokens, with the fix as a diff and Approve or Reject." },
          },
          {
            href: "/case-studies/search-experts",
            meta: "B2B travel · Product",
            title: "Search for experts",
            cover: { src: `${IMG}/work-search.webp`, width: 980, height: 520, alt: "A flight search result: Lisbon to Amsterdam, a direct morning flight at €89 with Select." },
          },
        ]}
      />
    </CasePage>
  );
}
