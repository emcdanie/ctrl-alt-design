import type { ReactNode } from "react";
import s from "./Covers.module.css";

/* Card covers as live pictures (Site v3): the Next case tab slot (520x340)
   and the More work card slot (490x260). Each cover draws at its slot's
   design size; NextCase scales the canvas to the slot's real width
   (--cover-scale) and draws the Stage grid behind it. A cover is a
   picture: one role="img" with a label, everything inside aria-hidden.
   Colours read the semantic tokens, so the product cards follow the
   theme; brand, carrier and on-photo colours are picture tokens
   (--cover-*, --kit-*). */

export type CoverSlot = "next" | "work";

/* the type floor (job 38): no cover text renders under 14px through any
   scale. The CSS reads the scales it sits under (NextCase's --cover-scale,
   a ScaledArt's inverse --art-k), so each text size is max(its design
   size, 14px over the scale), from the first paint. */
function Canvas({ slot, label, children }: { slot: CoverSlot; label: string; children: ReactNode }) {
  return (
    <div className={s.canvas} data-slot={slot} role="img" aria-label={label}>
      <div className={s.fill} aria-hidden="true">
        {children}
      </div>
    </div>
  );
}

/* ── Cover/CHIP · Atlas filter chip (hi-fi), Figma 383:684 (440x264) ──
   A teaser (job 38): the head and the specimen chip, centred, no pins or
   parts list, so the 14px-floored type fits at every slot size. */

export function CoverAtlas({ slot, label }: { slot: CoverSlot; label: string }) {
  return (
    <Canvas slot={slot} label={label}>
      <div className={s.art}>
        <div className={s.atlas}>
          <div className={s.atlasHead}>
            <div className={s.atlasTitle}>
              <span className={s.atlasEyebrow}>Atlas · No. 003</span>
              <span className={s.atlasName}>FilterChip</span>
            </div>
            <span className={s.atlasPass}>Checks 6 of 6 pass</span>
          </div>
          <div className={s.atlasBody}>
            <div className={s.atlasStage}>
              <span className={s.atlasChip}>Accessible</span>
            </div>
          </div>
        </div>
      </div>
    </Canvas>
  );
}

/* ── Cover/Drift · stay card (hi-fi), Figma 367:3054 (440x264) ── */
function Glyph({ d, className }: { d: string[]; className: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none">
      {d.map((p) => (
        <path key={p} d={p} />
      ))}
    </svg>
  );
}

export function CoverStay({ slot, label }: { slot: CoverSlot; label: string }) {
  return (
    <Canvas slot={slot} label={label}>
      <div className={s.art}>
        <div className={s.stay}>
          <div className={s.stayPhoto}>
            {/* 600px source; at most 316 CSS px wide (254 in a More work card) */}
            <img src="/images/kit/stay-harbour.jpg" width={600} height={400} alt="" loading="lazy" decoding="async" />
            <span className={s.stayControl} data-at="start">
              <Glyph className={s.stayGlyph} d={["M7 11.08 2.92 7 7 2.92", "M11.08 7H2.92"]} />
            </span>
            <span className={s.stayControl} data-at="end">
              <Glyph
                className={s.stayGlyph}
                d={["M11.08 8.17c.87-.85 1.75-1.87 1.75-3.2a3.2 3.2 0 0 0-3.2-3.2c-1.03 0-1.75.29-2.63 1.17C6.12 2.06 5.4 1.77 4.37 1.77a3.2 3.2 0 0 0-3.2 3.2c0 1.34.87 2.36 1.75 3.2L7 12.25l4.08-4.08Z"]}
              />
            </span>
          </div>
          <div className={s.stayBody}>
            <span className={s.stayTitle}>Harbour loft</span>
            <span className={s.stayWhere}>
              <Glyph
                className={s.stayPin}
                d={["M11.67 5.83C11.67 9.33 7 12.83 7 12.83S2.33 9.33 2.33 5.83a4.67 4.67 0 0 1 9.34 0Z", "M7 7.58a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"]}
              />
              Old town, by the water
            </span>
          </div>
        </div>
      </div>
    </Canvas>
  );
}

/* ── Search for experts cover (Work card · Search for experts > Cover,
   Figma I293:1259;291:1844;299:22335;299:22206), drawn in the 490x260
   slot: the search card fills the cover. ── */
export function CoverSearch({ slot, label }: { slot: CoverSlot; label: string }) {
  return (
    <Canvas slot={slot} label={label}>
      <div className={s.search}>
        <div className={s.searchHead}>
          <span className={s.searchTitle}>Search</span>
          <span className={s.searchLive}>Live</span>
        </div>
        <div className={s.searchRow}>
          <span className={s.searchInput}>
            <svg className={s.searchIcon} viewBox="0 0 12 12" fill="none">
              <circle cx="5.25" cy="5.25" r="3.75" />
              <path d="m8 8 2.75 2.75" />
            </svg>
            Lisbon → Amsterdam
          </span>
          <span className={s.searchChip} data-selected="">
            Direct
          </span>
          <span className={s.searchChip}>Morning</span>
        </div>
        <div className={s.searchResult}>
          <span className={s.carrier}>
            <svg viewBox="0 0 24 24" fill="none">
              <path className={s.carrierMark} d="M6.64 17.7 14.01 5.16h2.95l-3.69 8.11h5.16v2.21h-6.27l-1.84 2.21H6.64Z" />
              <path className={s.carrierStripe} d="M5.16 19.17h13.27" />
            </svg>
          </span>
          <span className={s.searchTimes}>
            <span className={s.searchTime}>08:10 → 11:55</span>
          </span>
          <span className={s.searchPrice}>€89</span>
        </div>
      </div>
    </Canvas>
  );
}

/* ── Theming "brands" cover (Next case tab · Theming > Cover, Figma
   I293:1259;291:1811;299:22097;299:22019), drawn in the 520x340 slot:
   one trip screen in three client themes. ── */
const BRANDS = ["a", "b", "c"] as const;

export function CoverBrands({ slot, label }: { slot: CoverSlot; label: string }) {
  return (
    <Canvas slot={slot} label={label}>
      <div className={s.brands}>
        {BRANDS.map((b) => (
          <div key={b} className={s.brand} data-brand={b}>
            <span className={s.brandBar}>Brand {b.toUpperCase()}</span>
            <span className={s.brandBody}>
              <span className={s.brandTrip}>Your trip</span>
              <span className={s.brandPhoto} />
              <span className={s.brandButton}>Continue</span>
            </span>
          </div>
        ))}
        <code className={s.brandsNote}>one Button · three themes · zero forks</code>
      </div>
    </Canvas>
  );
}

/* ── Cover/Federated · product card (hi-fi), Figma 367:3124 (440x264):
   the published product card, cropped to photo, title and price. In a
   More work card the Theming frame draws it at 393x236. ── */
export function CoverProduct({ slot, label }: { slot: CoverSlot; label: string }) {
  return (
    <Canvas slot={slot} label={label}>
      <div className={s.art} data-fit="product">
        <div className={s.product}>
          <div className={s.productPhoto}>
            {/* 1200px source crop; 288 CSS px at 1:1, 257 in a More work card */}
            <img src="/images/kit/product-coat.jpg" width={1200} height={754} alt="" loading="lazy" decoding="async" />
            <span className={s.productClose}>
              <svg className={s.stayGlyph} viewBox="0 0 14 14" fill="none">
                <path d="M3.5 3.5 10.5 10.5M10.5 3.5 3.5 10.5" />
              </svg>
            </span>
          </div>
          <span className={s.productTitle}>Wool blend belted coat with wide lapels</span>
          <span className={s.productPrice}>
            <span className={s.productNow}>€119.99</span>
            <span className={s.productOff}>-33%</span>
          </span>
        </div>
      </div>
    </Canvas>
  );
}
