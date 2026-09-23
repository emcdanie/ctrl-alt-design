import type { ReactNode } from "react";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import {
  ThemeStage,
  ThemeExhibit,
  ThemeJson,
} from "@/components/theming/ThemeStage";
import OneName from "@/components/theming/OneName";
import Pipeline from "@/components/theming/Pipeline";
import Preview from "@/components/theming/Preview";
import { ORDER, THEMES } from "@/components/theming/themes";
import type { CaseStudy } from "@/lib/content";
import s from "@/components/ThemingCase.module.css";

/**
 * Theming (approved mock theming-case-study.html, 22 Sep 2026): BELLA's
 * token tiers shown working. A looping exhibit swaps four themes on one
 * listing card, then the real Storybook table, the repo files in plain
 * words, the pipeline and its gate, the card side by side, and the
 * rules. Copy is the mock's; the mock's notes to Elleta stay out.
 */

function Win({ path, children }: { path: string; children: ReactNode }) {
  return (
    <figure className={s.win}>
      <header>
        <span className={s.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={s.winPath}>{path}</span>
      </header>
      {children}
    </figure>
  );
}

const K = ({ children }: { children: ReactNode }) => (
  <span className={s.k}>{children}</span>
);
const V = ({ children }: { children: ReactNode }) => (
  <span className={s.v}>{children}</span>
);
const C = ({ children }: { children: ReactNode }) => (
  <span className={s.c}>{children}</span>
);
const R = ({ children }: { children: ReactNode }) => (
  <span className={s.r}>{children}</span>
);


const RULES: [string, ReactNode][] = [
  ["Components never read tier 1.", "A new need gets a new named role first."],
  [
    "Dark is a theme, not an inversion.",
    "Its own greys, chosen so muted text still clears 7:1.",
  ],
  [
    "Colour lives in fills.",
    "Text and lines stay ink or grey, so a brand change can't hurt readability.",
  ],
  [
    "Every theme passes the gate.",
    "AAA for text, 3:1 for controls, checked on every story before merge.",
  ],
  [
    "The same names in Figma and code.",
    <>
      Designers and developers say <code className={s.ic}>surface.panel</code>{" "}
      and mean the same thing.
    </>,
  ],
];

const GATE_CHECKS = [
  ["Rebuild every token output from the source files.", "npm run build"],
  [
    "If the rebuild differs from what's committed, stop. Someone edited by hand or forgot to rebuild.",
    "git diff --exit-code tokens/bella.css tokens/bella.json …",
  ],
  [
    "Check the code still matches each component's contract.",
    "node scripts/contract-parity.mjs",
  ],
  [
    "Screenshot every story, compare it, and run accessibility checks.",
    "npm run audit:visual",
  ],
];

export default function ThemingCase({ cs }: { cs: CaseStudy }) {
  void cs;
  return (
    <ThemeStage>
      <Section id="theming-exhibit" labelledBy="theming-exhibit-title" ruled>
        <SectionHeader
          id="theming-exhibit-title"
          kicker="01 · The exhibit"
          heading="Change the theme, not the code."
        />
        <div className={s.exWrap}>
          <ThemeExhibit />
        </div>
      </Section>

      <Section
        id="theming-storybook"
        labelledBy="theming-storybook-title"
        ruled
      >
        <SectionHeader
          id="theming-storybook-title"
          kicker="01b · In Storybook"
          heading="One name, two answers."
          lead={
            <>
              A component asks for <code className={s.ic}>background</code>.
              Light mode answers white; dark mode answers near-black. The name
              never changes.
            </>
          }
        />
        <OneName />
        <p className={s.shotCap}>
          and here it is in the real Storybook table ↓
        </p>
        <Win path="Storybook · Foundations / Colors / Semantic">
          <div className={s.pair}>
            <figure>
              <div
                tabIndex={0}
                role="region"
                aria-label="Storybook table, light theme"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/case-studies/theming/storybook-semantic-light.webp"
                  width={634}
                  height={247}
                  loading="lazy"
                  alt="Semantic tokens, light theme: background points to color.light.bg"
                />
              </div>
              <figcaption>light · semantic/light.json</figcaption>
            </figure>
            <figure>
              <div
                tabIndex={0}
                role="region"
                aria-label="Storybook table, dark theme"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/case-studies/theming/storybook-semantic-dark.webp"
                  width={733}
                  height={247}
                  loading="lazy"
                  alt="Semantic tokens, dark theme: background points to color.dark.bg"
                />
              </div>
              <figcaption>dark · semantic/dark.json</figcaption>
            </figure>
          </div>
        </Win>
      </Section>

      <Section
        id="theming-decisions"
        labelledBy="theming-decisions-title"
        ruled
      >
        <SectionHeader
          id="theming-decisions-title"
          kicker="02 · Decisions"
          heading="Name the job, not the colour."
        />
        <div className={s.cee}>
          <div>
            <small>
              <i className={s.dot1} aria-hidden="true" />
              the idea
            </small>
            <p>
              Components only read meaning. A button reads{" "}
              <code className={s.ic}>action</code>, never{" "}
              <code className={s.ic}>blue-600</code>.
            </p>
          </div>
          <div>
            <small>
              <i className={s.dot2} aria-hidden="true" />
              what shows it
            </small>
            <p>
              Four themes above, one component tree. Switching theme swaps nine
              semantic pointers and touches zero components.
            </p>
          </div>
          <div>
            <small>
              <i className={s.dot3} aria-hidden="true" />
              why it matters
            </small>
            <p>
              A new brand or market is a token file, not a redesign. And it
              can&apos;t ship below the contrast bar.
            </p>
          </div>
        </div>
        <ThemeJson />
      </Section>

      <Section id="theming-repo" labelledBy="theming-repo-title" ruled>
        <SectionHeader
          id="theming-repo-title"
          kicker="02b · From the repo"
          heading="The real files, not a slide."
          lead="These are excerpts from BELLA's public repo. Light and dark are the same names pointing at different values."
        />
        <div className={s.code}>
          <Win path="emcdanie/bella · tokens/semantic/light.json → dark.json">
            <p className={s.say}>
              <b>In plain words:</b> each name on the left has one answer for
              light mode and one for dark.
            </p>
            <pre className={s.hl} tabIndex={0}>
              <K>&quot;text-primary&quot;</K>
              {"   "}
              <R>{"{color.light.ink}"}</R>
              {"      "}
              <R>{"{color.dark.ink}"}</R>
              {"\n"}
              <K>&quot;text-muted&quot;</K>
              {"     "}
              <R>{"{color.light.muted}"}</R>
              {"    "}
              <R>{"{color.dark.muted}"}</R>
              {"\n"}
              <K>&quot;surface-card&quot;</K>
              {"   "}
              <R>{"{color.light.panel}"}</R>
              {"    "}
              <R>{"{color.dark.surface}"}</R>
              {"\n"}
              <K>&quot;border-strong&quot;</K>
              {"  "}
              <R>{"{color.light.control}"}</R>
              {"  "}
              <R>{"{color.dark.control}"}</R>
              {"\n"}
              <K>&quot;focus-ring&quot;</K>
              {"     "}
              <R>{"{color.brand.ochre-deep}"}</R>
              {" "}
              <R>{"{color.brand.ochre}"}</R>
              {"\n"}
              <K>&quot;chip-1&quot;</K>
              {"         "}
              <R>{"{color.chip.c1}"}</R>
              {"        "}
              <R>{"{color.chip.c1}"}</R>
              {"   "}
              <C>{"// same in both"}</C>
            </pre>
          </Win>
          <Win path="emcdanie/bella · tokens/component.json">
            <p className={s.say}>
              <b>In plain words:</b> the Button&apos;s rulebook. Which versions
              exist, which states it has, and how not to use it. People and AI
              tools both read this.
            </p>
            <pre className={s.hl} tabIndex={0}>
              <K>&quot;button&quot;</K>
              {": {\n  "}
              <K>&quot;name&quot;</K>
              {": "}
              <V>&quot;Button&quot;</V>
              {",\n  "}
              <K>&quot;variants&quot;</K>
              {": ["}
              <V>&quot;primary&quot;</V>
              {", "}
              <V>&quot;secondary&quot;</V>
              {", "}
              <V>&quot;tertiary&quot;</V>
              {"],\n  "}
              <K>&quot;states&quot;</K>
              {": ["}
              <V>&quot;default&quot;</V>
              {", "}
              <V>&quot;hover&quot;</V>
              {", "}
              <V>&quot;active&quot;</V>
              {", "}
              <V>&quot;focus&quot;</V>
              {", "}
              <V>&quot;disabled&quot;</V>
              {"],\n  "}
              <K>&quot;dont&quot;</K>
              {": [\n    "}
              <V>&quot;Do not render more than one primary per view&quot;</V>
              {",\n    "}
              <V>&quot;Do not use for filters, toggles, or sort&quot;</V>
              {"\n  ]\n}"}
            </pre>
          </Win>
          <Win path="emcdanie/bella · tokens/$themes.json">
            <p className={s.say}>
              <b>In plain words:</b> the reading order. Raw values first, then
              what they&apos;re for, then what uses them.
            </p>
            <pre className={s.hl} tabIndex={0}>
              <K>&quot;tokenSetOrder&quot;</K>
              {": [\n  "}
              <V>&quot;primitive&quot;</V>
              {",       "}
              <C>{"// tier 1 · raw values"}</C>
              {"\n  "}
              <V>&quot;semantic/light&quot;</V>
              {",  "}
              <C>{"// tier 2 · what it's for"}</C>
              {"\n  "}
              <V>&quot;semantic/dark&quot;</V>
              {",\n  "}
              <V>&quot;component&quot;</V>
              {"        "}
              <C>{"// tier 3 · what reads it"}</C>
              {"\n]"}
            </pre>
          </Win>
        </div>
      </Section>

      <Section id="theming-pipeline" labelledBy="theming-pipeline-title" ruled>
        <SectionHeader
          id="theming-pipeline-title"
          kicker="02c · How it ships"
          heading="From a token file to production, through a gate."
          lead="DTCG tokens in, CSS custom properties out. A theme only counts once it's in code. This is BELLA's real pipeline, and every step runs on every change."
        />
        <Pipeline />
        <div className={s.gateWin}>
          <Win path="emcdanie/bella · package.json · the gate, in four checks">
            <ol className={s.plainList}>
              {GATE_CHECKS.map(([text, cmd], i) => (
                <li key={cmd} className={s.plain}>
                  <span className={s.n} aria-hidden="true">
                    {i + 1}
                  </span>
                  <p>{text}</p>
                  <code className={s.ic}>{cmd}</code>
                </li>
              ))}
            </ol>
          </Win>
        </div>
      </Section>

      <Section
        id="theming-side-by-side"
        labelledBy="theming-side-by-side-title"
        ruled
      >
        <SectionHeader
          id="theming-side-by-side-title"
          kicker="03 · Side by side"
          heading="Same card. Four themes. No new components."
        />
        <div className={s.strip}>
          {ORDER.map((k) => (
            <figure key={k}>
              <Preview theme={THEMES[k]} small />
              <figcaption>
                {k} · {k === "ground" || k === "night" ? "BELLA" : "demo brand"}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="theming-rules" labelledBy="theming-rules-title" ruled>
        <SectionHeader
          id="theming-rules-title"
          kicker="04 · The rules"
          heading="What keeps themes honest."
        />
        <ol className={s.rules}>
          {RULES.map(([title, body], i) => (
            <li key={title}>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <p>
                <b>{title}</b> {body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="theming-reflection"
        labelledBy="theming-reflection-title"
        ruled
      >
        <SectionHeader
          id="theming-reflection-title"
          kicker="05 · Reflection"
          heading="Themes are a promise about names."
          lead="The hard part of theming isn't the colours. It's agreeing on what each role means, so a new brand can arrive without anyone opening a component file."
        />
      </Section>
    </ThemeStage>
  );
}
