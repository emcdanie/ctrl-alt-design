import { BoldText } from "@/lib/richtext";
import type { CaseStudy, CaseBlock } from "@/lib/content";

/**
 * THE case prose helpers (one implementation, lifted verbatim from
 * CodeFirstV2 at the drift migration, feat/case-migration-drift):
 * every CaseBeat composition renders her copy through these, never
 * a bespoke copy. No prose is written here; the machine re-chunks
 * her sentences, it does not write them.
 */

export function para(cs: CaseStudy, pred: (b: CaseBlock) => boolean, child: number): string {
  const block = cs.blocks?.find(pred) as { children?: { kind: string; text?: string }[] } | undefined;
  return block?.children?.[child]?.text ?? "";
}

export function P({ text }: { text: string }) {
  if (!text.trim()) return null;
  return (
    <p className="cs2-body">
      <BoldText text={text} strongStyle={{ fontWeight: 600, color: "var(--color-ink)" }} />
    </p>
  );
}

/** Vitaly scannability, applied MECHANICALLY (her training notes:
    layer-cake scanning, inverted pyramid): the keyline is an EXACT
    sentence lifted from her text and front-loaded on the keyline
    recipe (bold ink, never iris); the rest re-chunks at sentence
    boundaries into short paragraphs, every word hers, none written */
export function Scannable({ text, keyline }: { text: string; keyline?: string }) {
  /* keyline is STRIPPED here and rendered by CaseBeat's keyline slot */
  if (!text.trim()) return null;
  let rest = text;
  if (keyline && text.includes(keyline)) {
    rest = text.replace(keyline, "").replace(/\s{2,}/g, " ").trim();
  }
  const sentences = rest.split(/(?<=[.!?])\s+/).filter(Boolean);
  const chunks: string[] = [];
  let cur: string[] = [];
  let words = 0;
  for (const sen of sentences) {
    const w = sen.split(/\s+/).length;
    if (words + w > 42 && cur.length) {
      chunks.push(cur.join(" "));
      cur = [];
      words = 0;
    }
    cur.push(sen);
    words += w;
  }
  if (cur.length) chunks.push(cur.join(" "));
  return (
    <>
      {chunks.map((c) => (
        <P key={c.slice(0, 24)} text={c} />
      ))}
    </>
  );
}
