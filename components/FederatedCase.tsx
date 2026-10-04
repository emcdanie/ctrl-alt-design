import { CasePage, Beat, BeatText, CaseQuote, Lessons } from "@/components/case/CasePage";
import CaseFigure from "@/components/case/CaseFigure";
import CasePicture from "@/components/case/CasePicture";
import NextCase from "@/components/case/NextCase";
import Swipe from "@/components/case/Swipe";
import styles from "@/components/case/Case.module.css";

/* Federated (Site v3, Elleta, 4 Oct 2026; approved as-is): the case built
   from the Site v3 frames, Figma e7U5Hxpr441rT719SPclas, 1440 293:20908
   and 390 304:7219, on Template / Case page, product theme mode
   "Federated". Copy is the frames' copy; the retailer stays "a leading
   European fashion retailer". All seven figures are the frames' own art
   at 2x: the Case UI kit is never live DOM. */

const IMG = "/images/case/federated";

export default function FederatedCase() {
  return (
    <CasePage
      kicker="Federated design system · 2026 · 13 weeks"
      title="They stopped telling me what they’d done"
      lead="A cross-platform design system for a leading European fashion retailer, with three of its four designers out. I made the slow work fast, opened one door for every squad, and extended what already worked instead of copying it."
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
      cover={
        <CaseFigure n={1} bare phoneTop="label" caption="Same squads, same quarter. What changed is when they came to us.">
          <CasePicture
            src={`${IMG}/f1-cover.webp`}
            phone={`${IMG}/f1-cover-390.webp`}
            width={2112}
            height={1213}
            alt="Before, told after it shipped: a team chat where three squads report what they already built and ask for review, marked with a red cross, annotated 'told after the fact' and 'three side channels'. After, brought to the open desk: a Thursday agenda with squads, devs and the system team, where the size selector and order card states are decided together and a video tag comes next week, marked with a green tick."
          />
        </CaseFigure>
      }
    >
      <Beat
        id="setup"
        num="1"
        label="The setup"
        heading="I’ve been on both sides of a federated system."
        lead="I started my career using a federated system, then building one. Here a small system team sat between many squads, three platforms and two partner teams. Three of its four designers were out, so I ran it day to day for 13 weeks."
        leadSize="base"
      >
        <CaseFigure n={2} bare caption="One small system team in the middle of many squads, three platforms and two partner teams.">
          <CasePicture
            src={`${IMG}/f2-who.webp`}
            phone={`${IMG}/f2-who-390.webp`}
            width={2112}
            height={1464}
            alt="Who serves whom: a design manager who set priorities and backed the process, above the design system team of four designers (one running it, one lead on leave, one on leave, one out) with about 7 component libraries. Beside it, partners (marketing email templates, AI assistant design) and engineering (system tech leads and platform devs on Web, iOS and Android). Below, the product squads, each with its own designer: Checkout, Account and orders, Product page, Listing and search, Email, Assistant."
          />
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
        <CaseFigure n={3} bare caption="Recreated. The card being redesigned already existed three times.">
          <div className={styles.wideOnly}>
            <CasePicture
              src={`${IMG}/f3-versions.webp`}
              width={2112}
              height={1434}
              alt="One product card, three versions: the published card with its name, discounted price, colour and size and a 'last units' mark; a new draft with a caps title on two lines, the colour cut off, a 20px close target and a discount badge; a post-purchase copy with the full price and no discount. Four issues are marked: caps title on two lines, colour cut off, close target 20px, discount missing."
            />
          </div>
          <div className={styles.phoneOnly}>
            <Swipe
              label="Three versions of one product card"
              items={[
                { src: `${IMG}/f3-published.webp`, width: 560, height: 1038, short: "published", alt: "Published: the product card with its name, a discounted price of 119.99 from 179.99, beige, size M and a 'last units' mark." },
                { src: `${IMG}/f3-draft.webp`, width: 560, height: 1038, short: "new draft", alt: "New draft: the same card with a caps title on two lines, a minus 33 percent badge, a small close target, and the colour line cut off." },
                { src: `${IMG}/f3-copy.webp`, width: 560, height: 1038, short: "post-purchase copy", alt: "Post-purchase copy: the same card at the full price of 179.99 with colour and size on their own lines, and no discount." },
              ]}
            />
          </div>
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
          n={4}
          bare
          caption="Product page, bag, size guide and filters all had to keep working. The slot added the new case without breaking the old pattern."
        >
          <CasePicture
            src={`${IMG}/f4-shipped.webp`}
            phone={`${IMG}/f4-shipped-390.webp`}
            width={2112}
            height={3430}
            alt="Asked for versus shipped. A squad designer asks for a new size selector chip; I review it with the devs through a code audit, the blast radius and a best-practice check, agreed at the weekly open desk. What shipped: the old chip kept with a slot variant added, three fills for the slot (size and stock, kids' age and height, colour filter), and the stock marks aligned with a Trim property instead of negative spacing. A chip group with slots replaces selecting 11 chips by hand. Every place the chip lives kept working: the product page, the bag's change-size sheet, the size guide and the colour filters."
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
        <CaseFigure n={5} bare caption="Claude did the slow, checkable work. The time it saved went into the decisions.">
          <CasePicture
            src={`${IMG}/f5-lanes.webp`}
            phone={`${IMG}/f5-lanes-390.webp`}
            width={2112}
            height={980}
            alt="Two lanes. The slow work: a spacing migration of 3,882 bindings, about 12 hours by hand per platform, under 3 minutes with Claude and checked by me; 84 of 84 brand tokens ready for dark mode; 280 icon bindings cleaned with searchable names; 12 components with accessibility fixes. What stayed with people: component names, props and structure, and which requests to close, decided with the platform devs."
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
        <CaseFigure n={6} bare caption="The value is timing: squads brought the case before building, so it was built once.">
          <CasePicture
            src={`${IMG}/f6-intake.webp`}
            phone={`${IMG}/f6-intake-390.webp`}
            width={2112}
            height={1010}
            alt="When did the system team hear about it? Before, after the build: the squad builds its own version, the dev waits over a week, the system hears last, then rework or a new copy. After, before the build: the need comes from the squad, the open desk takes it that week, it's decided together, and the dev builds once. From the team retro: 'Technical feedback reaches us after the open desk, not before.' What changed: a new open desk template to bring the case before building, Kanban with three in progress at most, and one way in through squad, system team, open desk and dev."
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
        <CaseFigure n={7} bare caption="The slide I took to leadership, recreated. Shape only, the real numbers stay private.">
          <CasePicture
            src={`${IMG}/f7-kpi.webp`}
            phone={`${IMG}/f7-kpi-390.webp`}
            width={2112}
            height={1200}
            alt="The leadership slide, recreated: 'Clean the system before scaling AI'. The ask, phase 1: bridge design and code on the top components, machine-readable descriptions, one sprint with no new budget, phases 2 and 3 only if phase 1 works. Beside it the cost (duplicated components rebuilt squad by squad), time to market (decisions before the build, not after) and risk (AI copies whatever is there today), over a KPI tree from business goals to product results to system work. Two months after I left: developers on the system went from 50% to 100% on Web, iOS and Android."
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

      <NextCase
        slug="federated"
        next={{
          href: "/case-studies/chip",
          meta: "AI-enabled design · 2026",
          title: "CHIP",
          cover: { src: `${IMG}/next-chip.webp`, width: 1040, height: 680, alt: "CHIP's Atlas view of the FilterChip: six parts pinned on the anatomy stage, bottom layer first, with 'checks 6 of 6 pass'." },
        }}
        lead="An agent that watches the system and never moves silently. I approve every fix."
        more={[
          {
            href: "/case-studies/design-system-transformation",
            meta: "Complex SaaS · Design systems",
            title: "From Drift to Foundation: two years without a live redesign, then a system that shipped",
            cover: { src: `${IMG}/work-drift.webp`, width: 980, height: 520, alt: "The Harbour loft stay card on the system: photo, title and location." },
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
