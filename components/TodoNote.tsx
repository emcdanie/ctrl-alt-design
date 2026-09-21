import type { ReactNode } from "react";

/* A visible "needs Elleta" block on draft pages: a question to answer
   before publishing, never an invented answer. */
export default function TodoNote({ children }: { children: ReactNode }) {
  return (
    <p className="todo-note">
      <strong>TODO (Elleta):</strong> {children}
    </p>
  );
}
