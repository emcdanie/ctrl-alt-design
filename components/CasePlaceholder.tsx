import { StatusPill } from "@/components/ui/StatusPill";

/**
 * The sanctioned pending-visual slot (case-migration kickoff, Elleta
 * 23 Jul): where a beat's visual or demo does not exist yet, this
 * renders in the visual slot, a warm card on token surfaces with the
 * quiet "In progress" status, NOT a blank slot and NOT an invented
 * gizmo. The case reads as complete-with-pending-visuals. Replace
 * with the real asset at the TODO(elleta) beside each use.
 */
export default function CasePlaceholder({ label = "In progress" }: { label?: string }) {
  return (
    <div className="case-placeholder">
      <StatusPill>{label}</StatusPill>
    </div>
  );
}
