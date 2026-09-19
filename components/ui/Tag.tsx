/** §7: non-interactive metadata. Quiet flat chip, visually distinct
 * from FilterChip (no border, linen fill) so it never reads clickable.
 * `identity` (§8): tags on a case's own page wear that case's tint via
 * the --case-tint-* vars passed in `style`. `outline` (19 Sep 2026):
 * a hairline and muted ink on no fill, flipping with the theme, for
 * tags that sit on a card (Work). */
export function Tag({
  children,
  identity,
  outline,
  style,
}: {
  children: React.ReactNode;
  identity?: boolean;
  outline?: boolean;
  style?: React.CSSProperties;
}) {
  const cls = ["tag", identity ? "tag--identity" : "", outline ? "tag--outline" : ""].filter(Boolean).join(" ");
  return (
    <span className={cls} style={style}>
      {children}
    </span>
  );
}
