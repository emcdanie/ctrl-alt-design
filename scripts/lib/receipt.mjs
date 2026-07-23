/* THE receipt (A1, gate-receipt spec, 23 Jul 2026; Southleft:
 * "refused by name, never papered over with a plausible value").
 * Every audit failure prints this ONE format so a fail is
 * self-documenting: the exact offender, what it is, what it should
 * have been. All 13 audits import this; exit codes stay theirs.
 *
 *   audit:<name>: <offender> — got <actual>, expected <expected>
 */
export function receipt(audit, offender, got, expected) {
  return `audit:${audit}: ${offender} — got ${got}, expected ${expected}`;
}
