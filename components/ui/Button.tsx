import Link from "next/link";

/**
 * §7 Control taxonomy: THE action control (raised keycap). Real actions
 * only: navigate, submit, open. Never filters, toggles, or sort. Max ONE
 * primary rendered per view (audit:controls enforces it).
 */
export function Button({
  variant = "secondary",
  href,
  onClick,
  type = "button",
  disabled,
  className = "",
  children,
  ariaLabel,
}: {
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  /* primary = the calm keycap + the SHARED travelling border light
     (task-2 pick, 20 Jul): trace-host is the one trace implementation */
  const cls = `btn-key${variant === "primary" ? " btn-key--primary trace-host" : ""}${className ? ` ${className}` : ""}`;
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
