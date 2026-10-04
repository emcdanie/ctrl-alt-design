import { CasePage, Beat, Lessons } from "@/components/case/CasePage";
import CaseFigure from "@/components/case/CaseFigure";
import NextCase from "@/components/case/NextCase";
import { CoverProduct, CoverSearch, CoverStay } from "@/components/case/pictures/Covers";
import { ChipAsk, ChipCover, ChipGate, ChipLesson } from "@/components/case/pictures/Chip";
import { ChipExplode } from "@/components/case/pictures/ChipExplode";
import s from "./ChipCase.module.css";

/* CHIP 2.0 (Site v3, Elleta, 4 Oct 2026; Figma e7U5Hxpr441rT719SPclas,
   1440 407:8187 and 390 407:10271, the Atlas rework of 4 Oct late) on
   Template / Case page. Copy is the frames' copy (approved for code 4 Oct
   late). "CHIP 2.0 · in progress" everywhere; no results row: the facts
   are words, so they live in the meta row. Atlas is a concept mock and
   every Atlas figure says so; the gate findings keep their dated source.
   Own work on own systems: no NDA line. */

export default function ChipCase() {
  return (
    <CasePage
      kicker="CHIP 2.0 · in progress · AI + design systems · 2026"
      title="AI builds what your system is. CHIP sees it first."
      lead="AI doesn’t fix a neglected design system. It sends you the bill. CHIP 2.0 is a local bridge for BELLA: it reads the real repo, runs BELLA’s own gate scripts, indexes my notes and docs, and answers questions with a local model."
      facts={[
        { label: "Role", value: "Designer and builder" },
        { label: "Team", value: "Solo, personal project" },
        { label: "Timeline", value: "Apr 2026 to now" },
        { label: "Status", value: "CHIP 2.0 · in progress, runs locally" },
      ]}
      cover={
        <CaseFigure
          n={1}
          caption="The Atlas view on Filter chip: CHIP 2.0 takes a component apart and checks every layer. A concept mock, drawn from BELLA components."
        >
          <ChipCover label="A concept mock of CHIP's Atlas view of the FilterChip, specimen No. 003 in Actions: the chip on an anatomy stage with six numbered parts pinned to it, bottom layer first (box 44px min, outline 1px, hover wash, pressed fill, label, focus ring 3px), and 'Checks 6 of 6 pass'." />
        </CaseFigure>
      }
    >
      <Beat
        id="why"
        num="1"
        label="Why I built it"
        heading="The truth about my system lived in four places."
        lead="Notion, Storybook, Figma and BELLA’s gate scripts each held a piece. Every switch was a tax, and asking a cloud agent to look cost money."
        align="edge"
      >
        <p className={s.body}>
          I didn’t build this for a theoretical user. I built it for me. CHIP started as a five-day build at a Claude Code hackathon in April 2026; CHIP 2.0 replaced the cloud agent with a local one, so nothing leaves my machine.
        </p>
      </Beat>

      <Beat
        id="apart"
        num="2"
        label="Take it apart"
        heading="Five layers make one button."
        lead="Atlas shows a component the way it is built: rest with numbered parts, then exploded into its layers. A concept mock on BELLA’s Button."
        align="edge"
      >
        <CaseFigure
          n={2}
          replay
          caption="The Button specimen in the Atlas concept mock. Rest: five numbered parts with their tokens. Exploded: the same five layers, top to bottom. Motion: Explode takes it apart in 0.8s (ease-out); Replay puts it back together. Reduced motion shows the exploded frame."
        >
          <ChipExplode label="A concept mock of the Atlas Button specimen. At rest, a Save changes keycap with five numbered parts: 1 key shadow, --shadow-key-resting; 2 fill, ink keycap, primary-fill; 3 box, 44px min, pad 12/20, r12; 4 label, Geist 13, 700, caps, .08em; 5 focus ring, 3px ochre-deep, focus only. Beside it the same five layers exploded into tilted plates, focus ring at the top down to the key shadow at the bottom, each labelled." />
        </CaseFigure>
      </Beat>

      <Beat
        id="gate"
        num="3"
        label="The gate tells the truth"
        heading="Real checks, not illustrations."
        lead="Atlas reads BELLA’s own gate. What it finds is what the gate found, with the date it ran."
        align="edge"
      >
        <CaseFigure
          n={3}
          caption="Real findings from BELLA’s checks, not illustrations. Source: BELLA’s gate, 2 Oct 2026. Shown in the Atlas concept mock."
        >
          <ChipGate label="A concept mock with two panels. Checks from the gate: contrast of the primary label 15.8:1, contract parity, story and docs present, and focus ring visible in both themes all pass; touch target minimum 44px. What the gate caught: BrandWordmark has no story, PatternField has no story, and 6 components are missing a DSDS entry. Source: BELLA's gate, 2 Oct 2026." />
        </CaseFigure>
      </Beat>

      <Beat
        id="teaches"
        num="4"
        label="It teaches"
        heading="One job per state."
        lead="Every specimen carries a short lesson, so the rule travels with the component."
        align="edge"
      >
        <CaseFigure n={4} caption="The Lesson dialog in the Atlas concept mock. Each state does one thing, so you can read it at a glance.">
          <ChipLesson label="A concept mock of the Lesson dialog for Button, One job per state. Rest: the ink keycap. Hover rolls the label; nothing lifts. Focus is the only place ochre-deep appears. Press sinks the key 2px. Disabled drops the keycap: no shadow, no roll. Why it matters: when hover, focus and press each look different, a keyboard user always knows where they are, and nobody mistakes a hover for a selection." />
        </CaseFigure>
      </Beat>

      <Beat
        id="ask"
        num="5"
        label="Ask, then approve"
        heading="Ask anything. Nothing runs until I confirm."
        lead="One input jumps or asks OBI. A miss says so and lists the closest three. The terminal takes ask, sync, audit and status, never a shell."
        align="edge"
      >
        <CaseFigure
          n={5}
          caption="One input asks OBI, and answers list their sources. Write tools return a before → after preview and wait. Nothing runs before Confirm, a preview expires after ten minutes, and CHIP never merges. Illustrative exchange."
        >
          <ChipAsk label="An illustrative exchange. I ask OBI why Filter chip fails the touch target at 40; OBI answers that at 40px the hit area is under the 44px BELLA floor, so the chip passes 5 of 6, and at 44 all six pass, citing the FilterChip story and the touch target check. The terminal runs audit filter-chip: touch target 40 to 44, preview before to after, expires in 10 min. A proposed change, FilterChip box size 40 to 44, waits for Elleta with Confirm and Cancel." />
        </CaseFigure>
      </Beat>

      <Beat
        id="reflection"
        num="6"
        label="Reflection"
        heading="The hard part isn’t the tokens."
        lead="It’s keeping a human in control while the machine moves fast."
      >
        <Lessons
          label="Lessons"
          items={[
            { icon: "Group", title: "The agent never moves silently.", body: "The human stays in the judgment layer: watch, catch, draft, approve, log." },
            { icon: "Label", title: "Run it on my own systems.", body: "Not a client’s: NDA-clean and more honest." },
            { icon: "Search", title: "Build it in public, labelled a prototype.", body: "Honesty beats polish." },
          ]}
        />
        <p className={s.next}>Atlas is a concept mock. The next step is building it into CHIP, one specimen at a time.</p>
        <p className={s.credit}>
          Credit: Brad Frost, TJ Pitre and Ian Frost (Southleft), whose AI and design systems course seeded the inspection thinking.
        </p>
      </Beat>

      <NextCase
        slug="chip"
        next={{
          href: "/case-studies/design-system-transformation",
          meta: "Complex SaaS · Design systems",
          title: "From Drift to Foundation",
          cover: <CoverStay slot="next" label="The Harbour loft stay card on the system: photo, title and location." />,
        }}
        lead="Nobody asked for a system. I built one anyway, got a CTO to fund a team, then handed it to every product team."
        more={[
          {
            href: "/case-studies/federated",
            meta: "Design systems · federated · 2026",
            title: "They stopped telling me what they’d done",
            cover: <CoverProduct slot="work" label="A product card: a wool blend belted coat at €119.99, down from €179.99." />,
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
