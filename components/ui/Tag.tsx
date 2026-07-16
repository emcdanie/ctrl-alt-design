/** §7: non-interactive metadata. Quiet flat chip, visually distinct
 * from FilterChip (no border, linen fill) so it never reads clickable. */
export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="tag">{children}</span>;
}
