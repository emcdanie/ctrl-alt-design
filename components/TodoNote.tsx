import type { ReactNode } from "react";

/* A visible "needs Elleta" block on draft pages: a question to answer
   before publishing, never an invented answer. Dev and Vercel previews
   show it; a production build renders nothing (Elleta, 1 Oct 2026).
   next build sets NODE_ENV=production on previews too, so on Vercel
   VERCEL_ENV decides; off Vercel (local and CI builds) NODE_ENV does.
   audit:structure fails if a built page still carries one. */
const hidden = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export default function TodoNote({ children }: { children: ReactNode }) {
  if (hidden) return null;
  return (
    <p className="todo-note">
      <strong>TODO (Elleta):</strong> {children}
    </p>
  );
}
