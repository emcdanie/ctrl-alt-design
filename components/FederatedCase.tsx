import { CasePage, Beat, BeatText, CaseQuote, Lessons } from "@/components/case/CasePage";
import CaseFigure from "@/components/case/CaseFigure";
import caseStyles from "@/components/case/Case.module.css";
import CaseHero from "@/components/case/CaseHero";
import CaseShowcase, { type ShowcaseCard } from "@/components/case/CaseShowcase";
import type { CollagePiece } from "@/components/case/CaseCollage";
import { ColourChip, FedIntake, FedKpi, FedPieces, FedShipped, FedTwoLanes, ROWS, SizeGrid, SlotChip, TextChip, TrimBox } from "@/components/case/pictures/FederatedPicturesB";
import NextCase from "@/components/case/NextCase";
import { Copy, Draft, FederatedVersions, FederatedWho, Published } from "@/components/case/pictures/FederatedPicturesA";

/* Federated (Site v3, Elleta, 4 Oct 2026; approved as-is): the case built
   from the Site v3 frames, Figma e7U5Hxpr441rT719SPclas, 1440 293:20908
   and 390 304:7219, on Template / Case page, product theme mode
   "Federated". Copy is the frames' copy; the retailer stays "a leading
   European fashion retailer". All six figures, the hero band's collage,
   the showcase and the covers are built live from the Case UI kit
   (components/case/pictures); the hero band (4 Oct late) replaces the
   kicker, the lead and the Figure 1 cover. */

const HERO_LABEL =
  "Three versions of one product card: a new draft, the published card on top of it (a wool blend belted coat at €119.99, down from €179.99, beige, size M, last units) and a post-purchase copy at the full price.";

/* the 6fd03f9 composition (job 41), drawn at 1:1 so every text is 14px
   or more (Elleta, 5 Oct: never scaled down) on a 660x634 canvas. The
   published card is on top and covers only the draft's photo (it ends at
   487, where the draft's text starts); the copy sits beside it, so its
   tag stays clear. The chip-group strip is 928 wide at 1:1 and does not
   fit, so it leaves the hero (it is in Figure 1). */
const CANVAS = { w: 660, h: 634 };
const COLLAGE: CollagePiece[] = [
  { key: "draft", node: <FedPieces><Draft bare /></FedPieces>, x: 0, y: 112 },
  { key: "copy", node: <FedPieces><Copy bare /></FedPieces>, x: 380, y: 112 },
  { key: "published", node: <FedPieces><Published bare /></FedPieces>, x: 100, y: 0 },
];

const SHOWCASE: ShowcaseCard[] = [
  {
    title: "One chip group, every size",
    label: "One chip group with every size, XXS to 4XL: M selected, XXS and 2XL out of stock with a notify bell, 3XL and 4XL marked last units.",
    node: (
      <FedPieces>
        <SizeGrid cells={ROWS("M", ["XXS", "2XL"], ["3XL", "4XL"])} w={62} h={44} />
      </FedPieces>
    ),
  },
  {
    title: "Three layouts, one chip",
    label: "One chip in three layouts: a colour swatch, text (Fabric, Linen) and the new slot.",
    node: (
      <FedPieces className={caseStyles.piecesRow}>
        <ColourChip />
        <TextChip />
        <SlotChip />
      </FedPieces>
    ),
  },
  {
    title: "Trim off · trim on",
    label: "The 3XL size with its notify bell, twice: without Trim the bell sits off the size's edge; with Trim it lines up.",
    node: (
      <FedPieces className={caseStyles.piecesRow}>
        <TrimBox on={false} label={false} />
        <TrimBox on label={false} />
      </FedPieces>
    ),
  },
];

export default function FederatedCase() {
  return (
    <CasePage
      hero={
        <CaseHero
          title="They stopped telling me what they’d done"
          long
          meta={["Federated design system", "2026 · 13 weeks"]}
          intro="A cross-platform design system for a leading European fashion retailer, with three of its four designers out. I made the slow work fast, opened one door for every squad, and extended what already worked instead of copying it."
          collage={{ label: HERO_LABEL, pieces: COLLAGE, canvas: CANVAS, phone: <FedPieces><Published bare /></FedPieces>, phoneLabel: "The published product card: the product name, a discounted price of 119.99 from 179.99, beige, size M." }}
        />
      }
      showcase={<CaseShowcase label="Federated, in real UI" cards={SHOWCASE} />}
      resultSize="page"
      results={[
        { n: "< 3 min", label: "a spacing migration of 3,882 bindings, about 12 hours by hand per platform" },
        { n: "12 → 1", label: "duplicated email headers, now one header with slots" },
        { n: "50% → 100%", label: "developer time on the system, on every platform" },
      ]}
      facts={[
        { label: "Role", value: "Design system specialist, running it day to day" },
        { label: "Team", value: "Design manager, platform tech leads and developers, squad designers" },
        { label: "Timeline", value: "April to July 2026" },
        { label: "Platforms", value: "Web, iOS and Android" },
      ]}
    >
      <Beat
        id="setup"
        num="1"
        label="The setup"
        heading="I’ve been on both sides of a federated system."
        lead="I started my career using a federated system, then building one. Here a small system team sat between many squads, three platforms and two partner teams. Three of its four designers were out, so I ran it day to day for 13 weeks."
        leadSize="base"
      >
        <CaseFigure n={1} caption="One small system team in the middle of many squads, three platforms and two partner teams.">
          <FederatedWho />
        </CaseFigure>
      </Beat>

      <Beat
        id="breaking"
        num="2"
        label="What was breaking"
        heading="The card already existed three times."
        lead="Squads built what they needed and told us afterwards. The product card had a published version, a post-purchase copy and a new draft, each with its own rules. Adding AI on top would only have copied the mess faster."
        leadSize="base"
      >
        <CaseFigure n={2} caption="Recreated. The card being redesigned already existed three times.">
          <FederatedVersions />
        </CaseFigure>
      </Beat>

      <Beat
        id="chip"
        num="3"
        label="The chip"
        heading="They asked for a new chip. I reviewed it first."
        lead="The redesign asked for a brand new size selector chip. The designer also wanted negative spacing to line up the stock marks. I didn’t say no to the need. I took it to the developers and audited what the code really rendered."
        leadSize="base"
      >
        <CaseFigure
          n={3}
          caption="Product page, bag, size guide and filters all had to keep working. The slot added the new case without breaking the old pattern."
        >
          <FedShipped
            label="Asked for versus shipped. A squad designer asks for a new size selector chip; I review it with the devs through a code audit, the blast radius and a best-practice check, agreed at the weekly open desk. What shipped: the old chip kept with a slot variant added, three fills for the slot (size and stock, kids' age and height, colour filter), and the stock marks aligned with a Trim property instead of negative spacing. A chip group with slots replaces selecting 11 chips by hand. Every place the chip lives kept working: the product page, the bag's change-size sheet, the size guide and the colour filters."
          />
        </CaseFigure>
        <BeatText>
          The chip already lived on the product page, in the bag, in the size guide and in the filters, and every one had to keep working. So I left the old chip as it was, added one slot variant and filled it with three types. A Trim property on the icon lined up the marks without negative spacing. I did the same with order cards and 12 email headers.
        </BeatText>
      </Beat>

      <Beat
        id="speed"
        num="4"
        label="Speed"
        heading="AI took the slow work. I kept the decisions."
        lead="Claude did the checkable work: the spacing migration, dark mode coverage, accessibility checks and icon clean-up, and I checked what it did. Names, props and which requests to close stayed decisions with the platform developers."
        leadSize="base"
      >
        <CaseFigure n={4} caption="Claude did the slow, checkable work. The time it saved went into the decisions.">
          <FedTwoLanes
            label="Two lanes. The slow work: a spacing migration of 3,882 bindings, about 12 hours by hand per platform, under 3 minutes with Claude and checked by me; 84 of 84 brand tokens ready for dark mode; 280 icon bindings cleaned with searchable names; 12 components with accessibility fixes. What stayed with people: component names, props and structure, and which requests to close, decided with the platform devs."
          />
        </CaseFigure>
      </Beat>

      <Beat
        id="one-way-in"
        num="5"
        label="One way in"
        heading="The value was timing."
        lead="Every week, squads brought real cases to an open desk, before anyone built. One path in: need, system team, open desk, joint decision, developer. After a retro we moved to Kanban with three in flight at most, and seven requests closed with a written reason."
        leadSize="base"
      >
        <CaseFigure n={5} caption="The value is timing: squads brought the case before building, so it was built once.">
          <FedIntake
            label="When did the system team hear about it? Before, after the build: the squad builds its own version, the dev waits over a week, the system hears last, then rework or a new copy. After, before the build: the need comes from the squad, the open desk takes it that week, it's decided together, and the dev builds once. From the team retro: 'Technical feedback reaches us after the open desk, not before.' What changed: a new open desk template to bring the case before building, Kanban with three in progress at most, and one way in through squad, system team, open desk and dev."
          />
        </CaseFigure>
        <CaseQuote quote="AI doesn’t fix a neglected design system. It sends you the bill for it." name="Elleta McDaniel" role="What I told leadership" />
      </Beat>

      <Beat
        id="ask"
        num="6"
        label="The ask"
        heading="The data got the system its own developers."
        lead="The system had no baseline, so I built one: a KPI tree from business goals to system work, and a Pareto of the pain points. A few root causes held most of the pain. I asked for a small, low-risk first phase before scaling AI."
        leadSize="base"
      >
        <CaseFigure n={6} caption="The slide I took to leadership, recreated. Shape only, the real numbers stay private.">
          <FedKpi
            label="The leadership slide, recreated: 'Clean the system before scaling AI'. The ask, phase 1: bridge design and code on the top components, machine-readable descriptions, one sprint with no new budget, phases 2 and 3 only if phase 1 works. Beside it the cost (duplicated components rebuilt squad by squad), time to market (decisions before the build, not after) and risk (AI copies whatever is there today), over a KPI tree from business goals to product results to system work. Two months after I left: developers on the system went from 50% to 100% on Web, iOS and Android."
          />
        </CaseFigure>
        <BeatText>Two months after I left, leadership moved the platform developers from half time to full time on the system, on every platform. The case was mine. The decision was theirs.</BeatText>
      </Beat>

      <Beat id="reflection" num="7" label="Reflection" heading="Three things I’d do again on day one." lead="Most of this came from saying yes to the need and no to the copy." leadSize="base">
        <Lessons
          label="What I’d keep doing"
          items={[
            { icon: "Group", title: "Make the slow work fast first.", body: "Speed earns the early conversations. Fast answers are why squads started coming before they built." },
            { icon: "Label", title: "Open one door, every week.", body: "A fixed weekly desk beats ten side channels. People learn where decisions happen." },
            { icon: "Search", title: "Extend before you add.", body: "A slot keeps every old case working and gives the new one a home. Copies only add upkeep." },
          ]}
        />
      </Beat>

      <NextCase slug="federated" />
    </CasePage>
  );
}
