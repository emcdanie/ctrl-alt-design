"use client";

import { useState } from "react";

/* CHIP's ONE interactive proof (decision 1 made operable): the
 * AI-readiness inspection map. Rows = Elleta's own systems, columns =
 * inspection stations, cells scored red / warn / green from
 * ILLUSTRATIVE data in the content file. Selecting a cell reveals what
 * the agent caught; on a Watch/Drift cell it also shows CHIP's drafted
 * plan and a waiting-for-approval state. Only an explicit Approve flips
 * it green and appends a log line. The agent watches, catches, drafts,
 * then waits: the human stays in the judgment layer.
 * Status is never colour-only (dot + word in every cell); keyboard
 * operable (cells are buttons, approve carries aria-pressed); no
 * animation, reduced-motion safe by construction; tokens only, both
 * themes. The approve control is a quiet bordered button, NOT a keycap
 * (section 5: keycaps are brand + true page actions). */

type Status = "red" | "warn" | "green";

const STATUS_STYLE: Record<Status, { bg: string; fg: string; word: string }> = {
  red: { bg: "color-mix(in srgb, var(--case-writing-hi) 26%, transparent)", fg: "var(--case-writing-text)", word: "Drift" },
  warn: { bg: "color-mix(in srgb, var(--case-design-lab-hi) 26%, transparent)", fg: "var(--case-design-lab-text)", word: "Watch" },
  green: { bg: "color-mix(in srgb, var(--case-clarity-hi) 26%, transparent)", fg: "var(--case-clarity-text)", word: "Ready" },
};

/* the drafted-plan line is NEW copy shown on Watch/Drift cells before
   approval, mirroring CHIP's approve-inbox (the agent drafts a plan, the
   human approves, the action logs). Generic illustrative line for now.
   TODO(elleta): confirm or replace with your real drafted-plan wording. */
const DRAFTED_PLAN =
  "Normalise the flagged values to tokens, add the missing usage notes, then re-run the inspection.";

interface Cell {
  station: string;
  status: Status;
  note: string;
}

interface Row {
  id: string;
  label: string;
  cells: Cell[];
}

export default function ChipReadinessMap({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<{ row: string; station: string } | null>(null);
  const [approved, setApproved] = useState<Set<string>>(new Set());

  const keyOf = (row: string, station: string) => `${row}::${station}`;
  const stations = rows[0]?.cells.map((c) => c.station) ?? [];

  const selectedRow = selected ? rows.find((r) => r.id === selected.row) : null;
  const selectedCell = selectedRow?.cells.find((c) => c.station === selected?.station) ?? null;
  const selectedKey = selected ? keyOf(selected.row, selected.station) : null;
  const isApproved = selectedKey != null && approved.has(selectedKey);
  const effectiveStatus = (row: string, cell: Cell): Status =>
    approved.has(keyOf(row, cell.station)) ? "green" : cell.status;

  return (
    <div
      style={{
        border: "1px solid var(--color-border-medium)",
        borderRadius: "var(--radius-2xl)",
        background: "var(--color-card)",
        padding: "var(--spacing-6)",
        marginTop: "var(--spacing-6)",
        marginBottom: "var(--spacing-6)",
      }}
    >
      <p className="section-label" style={{ marginBottom: "var(--spacing-4)" }}>
        AI-readiness inspection, illustrative data
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "separate", borderSpacing: "var(--spacing-1)", width: "100%" }}>
          <thead>
            <tr>
              <td aria-hidden />
              {stations.map((st) => (
                <th
                  key={st}
                  scope="col"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--typography-font-size-tag)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "var(--tracking-eyebrow)",
                    color: "var(--color-eyebrow)",
                    padding: "var(--spacing-2)",
                    textAlign: "left",
                  }}
                >
                  {st}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th
                  scope="row"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--typography-font-size-sm)",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    padding: "var(--spacing-2)",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.label}
                </th>
                {row.cells.map((cell) => {
                  const status = effectiveStatus(row.id, cell);
                  const st = STATUS_STYLE[status];
                  const isSel = selected?.row === row.id && selected?.station === cell.station;
                  return (
                    <td key={cell.station} style={{ padding: 0 }}>
                      <button
                        type="button"
                        className="chip-rmap__btn"
                        onClick={() => setSelected(isSel ? null : { row: row.id, station: cell.station })}
                        aria-pressed={isSel}
                        aria-label={`${row.label}, ${cell.station}: ${st.word}. Select to inspect.`}
                        style={{
                          width: "100%",
                          minHeight: "var(--spacing-touch-target)",
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--spacing-2)",
                          padding: "var(--spacing-2) var(--spacing-3)",
                          borderRadius: "var(--radius-lg)",
                          border: isSel
                            ? "1px solid var(--case-chip-text)"
                            : "1px solid transparent",
                          background: st.bg,
                          cursor: "pointer",
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--typography-font-size-tag)",
                          fontWeight: 600,
                          color: st.fg,
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            width: "var(--spacing-2)",
                            height: "var(--spacing-2)",
                            borderRadius: "var(--radius-full)",
                            background: st.fg,
                            flexShrink: 0,
                          }}
                        />
                        {st.word}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCell && selected && (
        <div
          style={{
            marginTop: "var(--spacing-4)",
            padding: "var(--spacing-4)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-soft)",
            background: "var(--color-surface)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-3)",
          }}
          role="status"
          aria-live="polite"
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-body)",
              fontSize: "var(--typography-font-size-base)",
              color: "var(--color-ink-soft)",
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: "var(--color-ink)" }}>What the agent caught:</strong>{" "}
            {selectedCell.note}
          </p>

          {/* Watch/Drift, not yet approved: CHIP drafts a plan and waits */}
          {selectedCell.status !== "green" && !isApproved && (
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-base)",
                color: "var(--color-ink-soft)",
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "var(--color-ink)" }}>CHIP drafted a plan:</strong>{" "}
              {DRAFTED_PLAN}
            </p>
          )}

          {selectedCell.status !== "green" && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "var(--spacing-4)",
              }}
            >
              <span
                style={{
                  flex: 1,
                  minWidth: "12em",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--typography-font-size-tag)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-eyebrow)",
                  color: isApproved ? "var(--case-clarity-text)" : "var(--color-muted)",
                }}
              >
                {isApproved
                  ? `Logged · ${selectedRow?.label} · ${selectedCell.station} → Ready`
                  : "Waiting for approval"}
              </span>
              <button
                type="button"
                className="chip-rmap__btn"
                aria-pressed={isApproved}
                aria-label={
                  isApproved
                    ? `Undo approval for ${selectedRow?.label}, ${selectedCell.station}`
                    : `Approve the plan for ${selectedRow?.label}, ${selectedCell.station}, flip to Ready`
                }
                onClick={() =>
                  setApproved((prev) => {
                    const next = new Set(prev);
                    if (selectedKey) {
                      if (next.has(selectedKey)) next.delete(selectedKey);
                      else next.add(selectedKey);
                    }
                    return next;
                  })
                }
                style={{
                  minHeight: "var(--spacing-touch-target)",
                  padding: "var(--spacing-2) var(--spacing-5)",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--case-chip-text)",
                  background: isApproved
                    ? "color-mix(in srgb, var(--case-chip-hi) 30%, transparent)"
                    : "transparent",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--typography-font-size-sm)",
                  fontWeight: 600,
                  color: "var(--case-chip-text)",
                  cursor: "pointer",
                }}
              >
                {isApproved ? "Approved ✓" : "Approve"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* backs the case's Accessibility tag: the inspection is operable by
          the people it is about, not just clickable. TODO(elleta): confirm
          the wording. */}
      <p
        style={{
          marginTop: "var(--spacing-4)",
          marginBottom: 0,
          fontFamily: "var(--font-body)",
          fontSize: "var(--typography-font-size-base)",
          color: "var(--color-ink-soft)",
          lineHeight: 1.5,
        }}
      >
        Every cell is a keyboard-operable button, labelled for screen readers,
        with visible focus and reduced-motion respected.
      </p>
    </div>
  );
}
