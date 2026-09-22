import { patternShapes } from "@/components/brand/pattern";
import { PRERENDERED_FIELD_SEEDS, SECTION_FIELDS } from "@/lib/patternSeed";

/* The brand pattern as a static SVG (PatternField brief, 22 Sep 2026):
   `/pattern/<seed>.svg` is the full hero field, `/pattern/<seed>-quiet.svg`
   the section field (the ground and every other shape, about half).
   Drawn once by BELLA's generator and served as a CSS background, so a
   page carries no pattern paths in its DOM. Same seed, same file. */

const W = 1600;
const H = 700;

function draw(seed: number, quiet: boolean) {
  const shapes = patternShapes(W, H, seed).filter((_, i) => !quiet || i % 2 === 0);
  const body = shapes
    .map((s) =>
      s.stroke
        ? `<path d="${s.d}" fill="none" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" stroke-linecap="round"/>`
        : `<path d="${s.d}" fill="${s.fill}"/>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

export function generateStaticParams() {
  return PRERENDERED_FIELD_SEEDS.flatMap((seed) => [
    { file: `${seed}.svg` },
    ...Array.from({ length: SECTION_FIELDS }, (_, i) => ({ file: `${seed + i + 1}-quiet.svg` })),
  ]);
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const m = /^(\d{1,10})(-quiet)?\.svg$/.exec((await params).file);
  if (!m) return new Response("Not found", { status: 404 });
  return new Response(draw(Number(m[1]), Boolean(m[2])), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
