import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface SurfaceCardProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  interactive?: boolean;
}

export default function SurfaceCard({
  children,
  className = "",
  interactive = false,
  ...props
}: SurfaceCardProps) {
  return (
    <div
      className={[
        "glass-card",
        interactive ? "card-hover transition-all duration-300 hover:-translate-y-0.5" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}