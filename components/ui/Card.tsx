import Link from "next/link";
import BellaCard, { type CardProps as BellaCardProps } from "@/components/bella/Card/Card";

/* ui/Card is now an ADAPTER, not an implementation (Card swap, 2026-07-30).
 * The card lives in BELLA and is vendored at components/bella/Card by
 * sync:bella. There is exactly one Card implementation and it is upstream.
 *
 * The adapter exists for one reason: BELLA is framework-agnostic and renders
 * internal links through an injected `linkComponent` (defaulting to a plain
 * anchor). Binding next/link here keeps client-side routing without asking
 * nine call sites to pass it, and keeps next/link out of BELLA.
 *
 * Everything else passes through untouched. Do not add styling or markup
 * here. A card change belongs in BELLA, then a sync. */
export type CardProps = Omit<BellaCardProps, "linkComponent">;

export default function Card(props: CardProps) {
  return <BellaCard {...props} linkComponent={Link} />;
}
