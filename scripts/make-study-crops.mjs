/* Pattern-study thumbnails (Work, 19 Sep 2026): each screenshot cropped
 * to the part that shows the pattern, 640px wide WebP at quality 80, into
 * public/images/studies/<id>.webp. Run once after a source changes:
 *   node scripts/make-study-crops.mjs
 * Boxes are source pixels [left, top, right, bottom]. The legal-search box
 * keeps the presenter's face and the regulator's logo out of frame.
 * Guardian and Pattern Mentor keep their SVGs. Prints each output's size
 * for content/studies.ts. */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "public/images/thumbnails";
const OUT = "public/images/studies";

const CROPS = {
  "travel-search": ["TRAVEL.png", [40, 440, 1300, 1150]],
  "stock-screener": ["finviz-3.png", [26, 240, 720, 600]],
  "race-day": ["FormularOne.png", [110, 236, 1200, 990]],
  "insurance-forms": ["HealthForm.png", [170, 550, 1000, 960]],
  "legal-search": ["AIPoweredSearch.png", [490, 640, 2250, 1290]],
  "command-center": ["BradFrostCommandCenter.png", [90, 110, 1500, 760]],
};

mkdirSync(OUT, { recursive: true });
for (const [id, [file, [left, top, right, bottom]]] of Object.entries(CROPS)) {
  const info = await sharp(`${SRC}/${file}`)
    .extract({ left, top, width: right - left, height: bottom - top })
    .resize({ width: 640 })
    .webp({ quality: 80 })
    .toFile(`${OUT}/${id}.webp`);
  console.log(`${id}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
}
