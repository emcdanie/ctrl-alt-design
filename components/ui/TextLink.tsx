import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./TextLink.module.css";

/* Site/Text link (Gate 2, 3 Oct 2026): an inline link with no side
   padding, so its text starts on the content edge. Ink and underline,
   a 44px hit area, an optional leading icon. Inside a card that is
   itself the link, use `textLinkClass` on a span instead. */
export const textLinkClass = styles.link;

export function TextLink({
  href,
  children,
  icon,
  trackEvent,
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  trackEvent?: string;
  external?: boolean;
  className?: string;
}) {
  const cls = `${styles.link} ${className}`.trim();
  if (external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer" data-umami-event={trackEvent}>
        {icon}
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link className={cls} href={href} data-umami-event={trackEvent}>
      {icon}
      {children}
    </Link>
  );
}
