import Image from "next/image";

/**
 * ArtifactGallery
 *
 * Responsive grid of screenshots / artifact images with optional per-item captions.
 * Defaults to a 2-column grid; pass `columns={1}` for full-width or `columns={3}` for denser grids.
 *
 * Usage:
 *   <ArtifactGallery
 *     items={[
 *       { src: "/artifacts/audit-map.png", alt: "Component audit map", caption: "Initial audit across 6 flows" },
 *       { src: "/artifacts/tokens.png", alt: "Token structure" },
 *     ]}
 *   />
 */

export interface ArtifactItem {
  src: string;
  alt: string;
  caption?: string;
  /** Override aspect ratio for this specific item, e.g. "4/3" or "1/1". Defaults to "16/9". */
  aspectRatio?: string;
}

interface ArtifactGalleryProps {
  items: ArtifactItem[];
  /** Number of columns on desktop (1 | 2 | 3). Mobile is always 1 col. */
  columns?: 1 | 2 | 3;
  /** Optional label above the grid */
  label?: string;
  className?: string;
}

const GRID_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export default function ArtifactGallery({
  items,
  columns = 2,
  label,
  className = "",
}: ArtifactGalleryProps) {
  if (!items || items.length === 0) return null;

  const gridClass = GRID_CLASS[columns] ?? GRID_CLASS[2];

  return (
    <div className={`w-full ${className}`.trim()}>
      {label && (
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted,#8A8A8A)]">
          {label}
        </p>
      )}

      <div className={`grid gap-5 ${gridClass}`}>
        {items.map((item, i) => {
          const ratio = item.aspectRatio ?? "16/9";
          return (
            <figure key={i} className="m-0">
              <div
                className="relative w-full overflow-hidden rounded-[14px] border border-black/[0.07] bg-[#F5F4F1]"
                style={{ aspectRatio: ratio }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes={
                    columns === 1
                      ? "100vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                />
              </div>
              {item.caption && (
                <figcaption className="mt-2.5 text-[13px] leading-[1.65] text-[var(--color-muted,#8A8480)]">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </div>
  );
}
