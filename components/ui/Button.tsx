import Link from "next/link";

/**
 * §7 Control taxonomy: THE action control. Real actions
 * only: navigate, submit, open. Never filters, toggles, or sort. Max ONE
 * primary rendered per view (audit:controls enforces it).
 *
 * The label roll (BELLA #44, ported 20 Sep 2026): hover and
 * focus-visible slide the real label up and an identical aria-hidden
 * copy in from below, on the button roll tokens. The copy is a real
 * span, never CSS `content:`, so assistive tech reads the label once.
 * Icons roll with the text because the whole children block is
 * duplicated. Reduced motion: no roll, the colour shift stays.
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
  newTab = false,
}: {
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  /** open in a new tab: a plain anchor with rel, not the router Link */
  newTab?: boolean;
}) {
  /* primary = the standard BELLA primary: flat fill, never lifts */
  const cls = `btn-key${variant === "primary" ? " btn-key--primary" : ""}${className ? ` ${className}` : ""}`;
  const label = (
    <span className="btn-key__roll">
      <span className="btn-key__label">{children}</span>
      <span className="btn-key__copy" aria-hidden="true">
        {children}
      </span>
    </span>
  );
  if (href) {
    /* external or new-tab links are a plain anchor: the router Link has
       no job on a target="_blank" destination */
    if (newTab || href.startsWith("http")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          aria-label={ariaLabel}
          data-component="Button"
        >
          {label}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={ariaLabel} data-component="Button">
        {label}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} aria-label={ariaLabel} data-component="Button">
      {label}
    </button>
  );
}
