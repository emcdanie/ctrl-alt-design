import type { ReactNode } from "react";

/* The one container: --layout-max content width plus the gutters.
   Nothing else (specs/layout-system). */
export default function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container ${className}`.trim()}>{children}</div>;
}
