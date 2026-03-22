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
    <section className={`px-6 py-20 md:py-24 ${className}`.trim()} {...props}>
      <div className={`mx-auto max-w-7xl ${containerClassName}`.trim()}>{children}</div>
    </section>
  );
}