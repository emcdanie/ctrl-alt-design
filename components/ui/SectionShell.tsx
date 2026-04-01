import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface SectionShellProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
  containerClassName?: string;
}

export default function SectionShell({
  children,
  className = "",
  containerClassName = "",
  ...props
}: SectionShellProps) {
  return (
    <section className={`layout-section ${className}`.trim()} {...props}>
      <div className={`layout-container ${containerClassName}`.trim()}>{children}</div>
    </section>
  );
}
