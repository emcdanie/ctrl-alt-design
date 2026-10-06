import { Fragment, type ReactNode } from "react";
import { CasePage, Beat } from "@/components/case/CasePage";
import caseStyles from "@/components/case/Case.module.css";
import CaseHero from "@/components/case/CaseHero";
import CaseShowcase, { type ShowcaseCard } from "@/components/case/CaseShowcase";
import CaseFigure, { ReplayKey } from "@/components/case/CaseFigure";
import NextCase from "@/components/case/NextCase";
import ShowAll from "@/components/case/ShowAll";
import { ThemeStage, ThemeExhibit, ThemeJson } from "@/components/theming/ThemeStage";
import HeroExhibit from "@/components/theming/HeroExhibit";
import OneName from "@/components/theming/OneName";
import Pipeline from "@/components/theming/Pipeline";
import Preview, { WhatChanged } from "@/components/theming/Preview";
import Swipe from "@/components/case/Swipe";
import { FACE_ORDER, LISTING, THEMES, faceRows, type FaceKey, faceVars } from "@/components/theming/themes";
import { STORYBOOK_SEMANTIC } from "@/content/case-studies/theming";
import s from "@/components/ThemingCase.module.css";

/* Theming (Site v3, Elleta, 4 Oct 2026; Figma 420:12279 / 420:14617): the
   case on Template / Case page. Copy and beats are the live case's
   (approved 4 Oct late); the exhibit keeps its motion, with Replay, and
   reduced motion shows its final frame. No results row, no cover, no NDA
   line. The hero band (4 Oct late) replaces the kicker and the lead; its
   collage and showcase dress the one listing card (Preview) in the four
   themes. Theme hexes live inside the pictures only. */

function Win({ path, dark = false, children }: { path: string; dark?: boolean; children: ReactNode }) {
  return (
    /* a dark window is pinned dark in both page modes (job 38) */
    <div className={dark ? `${s.win} ${s.pinDark}` : s.win} data-theme={dark ? "dark" : undefined}>
      <header>
        <span className={s.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={s.winPath}>{path}</span>
      </header>
      {children}
    </div>
  );
}

const K = ({ children }: { children: ReactNode }) => <span className={s.k}>{children}</span>;
const V = ({ children }: { children: ReactNode }) => <span className={s.v}>{children}</span>;
const C = ({ children }: { children: ReactNode }) => <span className={s.c}>{children}</span>;
/* a token path may break after each "." when the window is narrow */
const R = ({ children }: { children: string }) => (
  <span className={s.r}>
    {children.split(".").map((part, k, all) => (
      <Fragment key={k}>
        {part}
        {k < all.length - 1 ? (
          <>
            .<wbr />
          </>
        ) : null}
      </Fragment>
    ))}
  </span>
);

const ONE_NAME_CAPTION =
  "One name, two answers: the component asks for background; light mode answers #ffffff, dark mode answers #0d0d0d."; // token-waiver: the two answers shown as caption text

const RULES: [string, ReactNode][] = [
  ["Components never read tier 1.", "A new need gets a new named role first."],
  ["Dark is a theme, not an inversion.", "Its own greys, chosen so muted text still clears 7:1."],
  ["Colour lives in fills.", "Text and lines stay ink or grey, so a brand change can't hurt readability."],
  ["Every theme passes the gate.", "AAA for text, 3:1 for controls, checked on every story before merge."],
  [
    "The same names in Figma and code.",
    <>
      Designers and developers say <code className={s.ic}>surface.panel</code> and mean the same thing.
    </>,
  ],
];

const GATE_CHECKS = [
  ["Rebuild every token output from the source files.", "npm run build"],
  ["If the rebuild differs from what's committed, stop. Someone edited by hand or forgot to rebuild.", "git diff --exit-code tokens/bella.css tokens/bella.json …"],
  ["Check the code still matches each component's contract.", "node scripts/contract-parity.mjs"],
  ["Screenshot every story, compare it, and run accessibility checks.", "npm run audit:visual"],
];

function StorybookTable() {
  return (
    <div className={s.sbFrame} role="img" aria-label="Storybook, Foundations / Colors / Semantic: the same five names, background, text-primary, text-muted, surface-card and focus-ring, each with a light answer and a dark answer.">
      <div aria-hidden="true">
        <Win path="Storybook · Foundations / Colors / Semantic">
          <div className={s.sbPair}>
            {(["light", "dark"] as const).map((mode) => (
              <div key={mode}>
                {/* each table pinned to the mode it shows, whatever the page's (job 38) */}
                <ul className={`${s.sbTable} ${mode === "dark" ? s.pinDark : s.pinLight}`} data-theme={mode}>
                  {STORYBOOK_SEMANTIC.map((row) => (
                    <li key={row.name}>
                      <span className={s.sbSwatch} style={{ background: row[mode] }} />
                      <code>{row.name}</code>
                      <code className={s.sbHex}>{row[mode]}</code>
                    </li>
                  ))}
                </ul>
                <p className={s.sbNote}>
                  {mode} · semantic/{mode}.json
                </p>
              </div>
            ))}
          </div>
        </Win>
      </div>
    </div>
  );
}

const faceTitle = (k: FaceKey) => `${k} · ${LISTING[k].brand}`;
const faceLabel = (k: FaceKey) =>
  `${LISTING[k].brand} in theme ${k}${k === "night" ? " (BELLA)" : ", a demo brand"}: ${LISTING[k].title}, ${LISTING[k].location}, ${LISTING[k].price} a month.`;
const changedLabel = (k: FaceKey) => `What changed: ${faceRows(k).map(([n, v]) => `${n} ${v}`).join(", ")}.`;
const FACE_LABELS = Object.fromEntries(FACE_ORDER.map((k) => [k, `${faceLabel(k)} ${changedLabel(k)}`])) as Record<FaceKey, string>;

const SHOWCASE: ShowcaseCard[] = FACE_ORDER.map((k) => ({
  title: faceTitle(k),
  label: faceLabel(k),
  node: (
    <div className={s.showFace}>
      <Preview theme={THEMES[k]} face={k} />
    </div>
  ),
}));

export default function ThemingCase() {
  return (
    <ThemeStage>
      <CasePage
        hero={
          <CaseHero
            title="One system, many faces."
            meta={["Case · Theming · BELLA", "2026"]}
            intro="Themes in BELLA swap the values, never the components. Pick a theme and watch the same screen change, token by token."
            art={<HeroExhibit />}
          />
        }
        showcase={<CaseShowcase label="Theming, the same card in three more themes" cards={SHOWCASE} strip />}
        facts={[
          { label: "Role", value: "Design systems lead, and the person who builds it" },
          { label: "System", value: "BELLA, my own open design system" },
          { label: "Scope", value: "Token tiers, themes, contrast gate, Figma ⇄ code" },
          { label: "Proof", value: "Light and dark live on this site; axe runs clean in both" },
        ]}
        tags={["token strategy figma → code", "consistency without fragmentation", "accessibility in every theme", "ai-ready structure"]}
      >
        <Beat id="exhibit" num="1" label="The exhibit" heading="Change the theme, not the code.">
          <CaseFigure
            n={1}
            replay
            replayBelow
            caption="The exhibit, shown on theme ground (BELLA · light)."
          >
            <ReplayKey>
              <ThemeExhibit />
            </ReplayKey>
          </CaseFigure>
        </Beat>

        <Beat
          id="storybook"
          num="2"
          label="In Storybook"
          heading="One name, two answers."
          lead="Every component asks for a name that exists in every theme, so nothing falls back to light."
          lead2="A component asks for background. Light mode answers white; dark mode answers near-black. The name never changes."
         
        >
          <CaseFigure
            n={2}
            caption={ONE_NAME_CAPTION}
          >
            <OneName />
          </CaseFigure>
          <CaseFigure n={3} caption="And here it is in the real Storybook table (Foundations / Colors / Semantic), redrawn: the same five names, with their light and dark answers.">
            <StorybookTable />
          </CaseFigure>
        </Beat>

        <Beat id="decisions" num="3" label="Decisions" heading="Name the job, not the colour." lead="No component holds a colour of its own, so there's no stand-in to forget." align="edge">
          {/* at 1440 the three cells sit beside the figure (job F, 5 Oct 2026) */}
          <div className={caseStyles.beside}>
            <ul className={s.cells}>
              <li>
                <b>the idea</b>
                <p>
                  Components only read meaning. A button reads action, never blue-600.
                </p>
              </li>
              <li>
                <b>what shows it</b>
                <p>Three themes above, one component tree. Switching theme swaps nine semantic pointers and touches zero components.</p>
              </li>
              <li>
                <b>why it matters</b>
                <p>A new brand or market is a token file, not a redesign. And it can&apos;t ship below the contrast bar.</p>
              </li>
            </ul>
            <CaseFigure n={4} caption="The tier 2 file for theme ground. Every theme file has the same names; only the pointers change. On the live page it follows whichever theme the exhibit shows.">
              <ThemeJson />
            </CaseFigure>
          </div>
        </Beat>

        <Beat
          id="repo"
          num="4"
          label="From the repo"
          heading="The real files, not a slide."
          lead="These are excerpts from BELLA's public repo. Light and dark are the same names pointing at different values."
         
        >
          <CaseFigure n={5} caption="Three excerpts from BELLA's public repo: the semantic names, the Button's contract, and the reading order.">
            {/* the semantic names stay in view; the Button's contract and the
                reading order sit behind Show all 3 (job F, 5 Oct 2026) */}
            <div className={s.repo} role="img" aria-label="The first of three excerpts from BELLA's public repo, the semantic names: each name has one answer for light mode and one for dark.">
              <div className={s.code} aria-hidden="true">
                <Win dark path="emcdanie/bella · tokens/semantic/light.json → dark.json">
                  <pre className={s.hl}>
                    <K>&quot;text-primary&quot;</K>{"   "}<R>{"{color.light.ink}"}</R>{"         "}<R>{"{color.dark.ink}"}</R>{"\n"}
                    <K>&quot;text-muted&quot;</K>{"     "}<R>{"{color.light.muted}"}</R>{"       "}<R>{"{color.dark.muted}"}</R>{"\n"}
                    <K>&quot;surface-card&quot;</K>{"   "}<R>{"{color.light.panel}"}</R>{"       "}<R>{"{color.dark.surface}"}</R>{"\n"}
                    <K>&quot;border-strong&quot;</K>{"  "}<R>{"{color.light.control}"}</R>{"     "}<R>{"{color.dark.control}"}</R>{"\n"}
                    <K>&quot;focus-ring&quot;</K>{"     "}<R>{"{color.brand.ochre-deep}"}</R>{"  "}<R>{"{color.brand.ochre}"}</R>{"\n"}
                    <K>&quot;chip-1&quot;</K>{"         "}<R>{"{color.chip.c1}"}</R>{"           "}<R>{"{color.chip.c1}"}</R>{"  "}<C>{"// same in both"}</C>
                  </pre>
                </Win>
                <p className={s.say}>In plain words: each name on the left has one answer for light mode and one for dark.</p>
              </div>
            </div>
            <ShowAll total={3}>
              <div className={s.repo} role="img" aria-label="Two more excerpts from BELLA's public repo. The Button's contract: its variants, states and what not to do. The reading order: raw values first, then what they're for, then what uses them.">
                <div className={s.code} aria-hidden="true">
                  <Win dark path="emcdanie/bella · tokens/component.json">
                    <pre className={s.hl}>
                      <K>&quot;button&quot;</K>{": {\n  "}
                      <K>&quot;name&quot;</K>{": "}<V>&quot;Button&quot;</V>{",\n  "}
                      <K>&quot;variants&quot;</K>{": ["}<V>&quot;primary&quot;</V>{", "}<V>&quot;secondary&quot;</V>{", "}<V>&quot;tertiary&quot;</V>{"],\n  "}
                      <K>&quot;states&quot;</K>{": ["}<V>&quot;default&quot;</V>{", "}<V>&quot;hover&quot;</V>{", "}<V>&quot;active&quot;</V>{", "}<V>&quot;focus&quot;</V>{", "}<V>&quot;disabled&quot;</V>{"],\n  "}
                      <K>&quot;dont&quot;</K>{": ["}<V>&quot;Do not render more than one primary per view&quot;</V>{",\n           "}<V>&quot;Do not use for filters, toggles, or sort&quot;</V>{"]\n}"}
                    </pre>
                  </Win>
                  <p className={s.say}>In plain words: the Button&apos;s rulebook. Which versions exist, which states it has, and how not to use it. People and AI tools both read this.</p>
                  <Win dark path="emcdanie/bella · tokens/$themes.json">
                    <pre className={s.hl}>
                      <K>&quot;tokenSetOrder&quot;</K>{": [\n  "}
                      <V>&quot;primitive&quot;</V>{",       "}<C>{"// tier 1 · raw values"}</C>{"\n  "}
                      <V>&quot;semantic/light&quot;</V>{",  "}<C>{"// tier 2 · what it's for"}</C>{"\n  "}
                      <V>&quot;semantic/dark&quot;</V>{",\n  "}
                      <V>&quot;component&quot;</V>{"        "}<C>{"// tier 3 · what reads it"}</C>{"\n]"}
                    </pre>
                  </Win>
                  <p className={s.say}>In plain words: the reading order. Raw values first, then what they&apos;re for, then what uses them.</p>
                </div>
              </div>
            </ShowAll>
          </CaseFigure>
        </Beat>

        <Beat
          id="ships"
          num="5"
          label="How it ships"
          heading="From a token file to production, through a gate."
          lead="The gate fails the build if anyone hand-edits the generated tokens, if code and contract drift apart, or if a colour pair misses the contrast bar."
          lead2="DTCG tokens in, CSS custom properties out. A theme only counts once it's in code. This is BELLA's real pipeline, and every step runs on every change."
         
        >
          <CaseFigure
            n={6}
            replay
            replayBelow
            caption="BELLA's pipeline."
          >
            <Pipeline />
          </CaseFigure>
          <CaseFigure n={7} caption="The gate in four checks, from BELLA's package.json. Every theme passes it before it ships.">
            <div role="img" aria-label="The gate in four checks: rebuild every token output; stop if the rebuild differs from what's committed; check the code still matches each component's contract; screenshot every story, compare it, and run accessibility checks.">
              <div aria-hidden="true">
                <Win path="emcdanie/bella · package.json · the gate, in four checks">
                  <ol className={s.plainList}>
                    {GATE_CHECKS.map(([text, cmd], i) => (
                      <li key={cmd} className={s.plain}>
                        <span className={s.n}>{i + 1}</span>
                        <p>{text}</p>
                        <code className={s.ic}>{cmd}</code>
                      </li>
                    ))}
                  </ol>
                </Win>
              </div>
            </div>
          </CaseFigure>
        </Beat>

        <Beat id="side-by-side" num="6" label="Side by side" heading="Same card. Three themes. No new components.">
          <CaseFigure n={8} caption="The same card in three themes. One component tree; only the token values change. Coast and market are demo brands.">
            {/* three faces, each with its list under it (Figma 420:12279;
                K1, Elleta, 6 Oct 2026: undoes I3 for this figure) */}
            <div className={caseStyles.wideOnly}>
              <div className={s.faces} role="img" aria-label={`The same listing screen in three themes. ${FACE_ORDER.map((k) => FACE_LABELS[k]).join(" ")}`}>
                {FACE_ORDER.map((k) => (
                  <div key={k} className={s.face} aria-hidden="true">
                    <Preview theme={THEMES[k]} face={k} />
                    <WhatChanged face={k} />
                  </div>
                ))}
              </div>
            </div>
            <div className={caseStyles.phoneOnly}>
              {/* three peers to compare: a Reel (job 42) */}
              <Swipe
                reel
                label="The same listing screen in three themes"
                items={FACE_ORDER.map((k) => ({
                  key: k,
                  short: faceTitle(k),
                  node: (
                    <div className={s.face} role="img" aria-label={FACE_LABELS[k]}>
                      <Preview theme={THEMES[k]} face={k} />
                      <WhatChanged face={k} />
                    </div>
                  ),
                }))}
              />
            </div>
          </CaseFigure>
        </Beat>

        <Beat id="rules" num="7" label="The rules" heading="What keeps themes honest." lead="These rules are the lessons from a client's dark mode, written down so I don't learn them twice.">
          <ol className={s.rules}>
            {RULES.map(([title, body], i) => (
              <li key={title}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <b>{title}</b>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Beat>

        <Beat
          id="reflection"
          num="8"
          label="Reflection"
          heading="Themes are a promise about names."
          lead="The hard part of theming isn't the colours. It's agreeing on what each role means, so a new brand can arrive without anyone opening a component file."
        />

        <NextCase slug="theming" />
      </CasePage>
    </ThemeStage>
  );
}
