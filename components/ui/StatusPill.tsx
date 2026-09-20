/**
 * §5: the status marker. Quiet, non-interactive, and it always says the
 * state IN WORDS, so colour is never the only carrier.
 *
 * One pill for every status on the site (Elleta, 20 Sep 2026). It used
 * to be a caps mono marker for "Current focus" only, while the case
 * studies grew their own sentence-case status line beside it. Two pills
 * for one job is one too many: this is the one, with a `tone`.
 */
export function StatusPill({
  children,
  tone = "neutral",
  live = false,
}: {
  children: React.ReactNode;
  /** neutral by default; ok and warn carry the status ramp */
  tone?: "neutral" | "ok" | "warn";
  /** announce changes (a status that updates in place, role="status") */
  live?: boolean;
}) {
  return (
    <span
      className={`status-pill${tone === "neutral" ? "" : ` status-pill--${tone}`}`}
      data-component="StatusPill"
      {...(live ? { role: "status" } : {})}
    >
      {children}
    </span>
  );
}
