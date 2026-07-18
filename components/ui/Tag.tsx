/** §7: non-interactive metadata. Quiet flat chip, visually distinct
 * from FilterChip (no border, linen fill) so it never reads clickable.
 * `identity` (§8): tags on a case's own page wear that case's tint via
 * the --case-tint-* vars passed in `style`. */
export function Tag({
  children,
  identity,
  style,
}: {
  children: React.ReactNode;
  identity?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span className={identity ? "tag tag--identity" : "tag"} style={style}>
      {children}
    </span>
  );
}
