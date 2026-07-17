"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { social } from "@/lib/social";
import ThemeSwitch from "@/components/ThemeSwitch";


/* Primary IA — visible in the desktop header (NN/g: hidden desktop nav
 * halves discoverability); the same list collapses into the hamburger
 * on mobile. */
const menuItems = [
  { num: "01", label: "Work", href: "/work" },
  { num: "02", label: "System", href: "/design-system" },
  { num: "03", label: "Skills", href: "/skills" },
  { num: "04", label: "About", href: "/about" },
  { num: "05", label: "Contact", href: "/contact" },
];

export default function OverlayNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  /* Work owns the library and every case page */
  const isCurrent = (href: string) =>
    href === "/work"
      ? pathname.startsWith("/work") || pathname.startsWith("/case-studies")
      : pathname === href || pathname.startsWith(href + "/");
  const [hovered, setHovered] = useState<string | null>(null);
  const [triggerHovered, setTriggerHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* On open, move focus to the first menu item */
  useEffect(() => {
    if (open) {
      menuRef.current?.querySelector<HTMLElement>("nav button, nav a[href]")?.focus();
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Nav stays visible at all times — no hide-on-scroll */

  const handleNavClick = (href: string) => {
    setOpen(false);

    if (href.startsWith("#")) {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[9995]"
      >
        <div className="flex w-full items-center justify-between border-b border-[color:var(--color-semantic-border-glass-edge)] bg-[var(--color-semantic-background)]/72 px-4 py-3 shadow-[var(--shadow-nav-bar)] backdrop-blur-xl sm:px-6"
          style={{ borderTop: "1px solid var(--color-semantic-border-glass-top)" }}
        >
          <Link
            href="/"
            className="kbd-logo pointer-events-auto"
            aria-label="ctrl alt design, home"
            onClick={() => setOpen(false)}
          >
            <span className="key">Ctrl</span>
            <span className="plus" aria-hidden="true">+</span>
            <span className="key">Alt</span>
            <span className="plus" aria-hidden="true">+</span>
            <span className="key key-iris">Design</span>
          </Link>

          {/* Desktop primary nav, hidden below lg, where the hamburger takes over */}
          <nav aria-label="Primary" className="pointer-events-auto hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.num}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={`flex min-h-[var(--spacing-touch-target)] items-center rounded-[var(--radius-md)] px-3 font-[family:var(--font-mono)] text-[length:var(--typography-font-size-tag)] font-medium uppercase tracking-[0.1em] transition-colors hover:text-[color:var(--color-accent-ink)] ${
                  isCurrent(item.href)
                    ? "text-[color:var(--color-accent-ink)] underline underline-offset-8 decoration-2"
                    : "text-[color:var(--color-ink-soft)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
          <ThemeSwitch />
          <button
            onClick={() => setOpen((o) => !o)}
            onMouseEnter={() => setTriggerHovered(true)}
            onMouseLeave={() => setTriggerHovered(false)}
            className="lg:hidden pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--color-border-medium)] bg-[color:var(--color-glass)] text-[color:var(--color-ink)] shadow-[var(--shadow-soft)] transition-all duration-200 hover:bg-[color:var(--color-glass-strong)]"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="overlay-menu"
          >
            <span
              className="absolute block h-[2px] rounded-full bg-current transition-all duration-200 ease-out"
              style={{
                width: triggerHovered && !open ? "24px" : "20px",
                transform: open ? "rotate(45deg)" : "translateY(-4px)",
              }}
            />
            <span
              className="absolute block h-[2px] w-6 rounded-full bg-current transition-all duration-200 ease-out"
              style={{
                opacity: open ? 0 : triggerHovered ? 1 : 0,
              }}
            />
            <span
              className="absolute block h-[2px] rounded-full bg-current transition-all duration-200 ease-out"
              style={{
                width: triggerHovered && !open ? "24px" : "20px",
                transform: open ? "rotate(-45deg)" : "translateY(4px)",
              }}
            />
          </button>
          </div>
        </div>
      </div>

      <div
        ref={menuRef}
        id="overlay-menu"
        inert={!open}
        className="fixed inset-0 z-[9990] overflow-hidden bg-[var(--color-semantic-background)]/98 text-[color:var(--color-ink)] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          clipPath: open ? "inset(0% 0 0% 0)" : "inset(100% 0 0% 0)",
          /* belt-and-braces with the inert guard: closed-menu content can
             never paint or catch focus. visibility flips instantly on
             open, and waits for the 300ms clip animation on close. */
          visibility: open ? "visible" : "hidden",
          transitionProperty: "clip-path, visibility",
          transitionDuration: "300ms, 0s",
          transitionDelay: open ? "0s, 0s" : "0s, 300ms",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--color-glass-strong),transparent_36%),radial-gradient(circle_at_bottom_right,var(--color-semantic-accent-subtle),transparent_34%)]" />
        <div className="absolute left-6 right-6 top-6 h-px bg-[color:var(--color-border-soft)] sm:left-8 sm:right-8" />

        <div className="relative flex h-full flex-col justify-between px-6 pb-8 pt-28 sm:px-8 sm:pb-10 sm:pt-32 lg:px-16 lg:pb-14 lg:pt-36">
          <div
            className="pointer-events-none absolute right-[-16px] top-1/2 -translate-y-1/2 select-none font-[family:var(--font-display)] text-[clamp(120px,18vw,240px)] font-bold leading-none tracking-[-0.04em] text-[color:var(--color-semantic-accent-border)]"
            aria-hidden="true"
          >
            EM
          </div>

          <nav className="relative z-10 max-w-5xl">
            {menuItems.map((item) => {
              const isHovered = hovered === item.num;
              const anyHovered = hovered !== null;
              const dimmed = anyHovered && !isHovered;

              const sharedClasses =
                "font-[family:var(--font-display)] text-[length:var(--font-hero)] font-normal leading-[1.02] tracking-[-0.02em] transition-colors duration-150";
              const colorClass = dimmed ? "text-[color:var(--color-ink-muted)]" : "text-[color:var(--color-ink)]";

              return (
                <div
                  key={item.num}
                  className="group flex items-start gap-4 border-b border-[color:var(--color-border-soft)] py-4 sm:gap-6 sm:py-5 lg:gap-10"
                  onMouseEnter={() => setHovered(item.num)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="mt-2 min-w-14 font-[family:var(--font-body)] text-[length:var(--typography-font-size-tag)] uppercase tracking-[0.24em] text-[color:var(--color-ink-muted)] sm:min-w-20">
                    (_{item.num})
                  </span>

                  {item.href.startsWith("#") ? (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`${sharedClasses} ${colorClass} bg-transparent p-0 text-left hover:text-[color:var(--color-ink-soft)]`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={`${sharedClasses} ${colorClass} block hover:text-[color:var(--color-ink-soft)]`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="relative z-10 mt-12 flex flex-col gap-3 sm:mt-16">
            <div className="flex items-center gap-3">
              <ThemeSwitch />
              <span className="font-[family:var(--font-mono)] text-[length:var(--typography-font-size-tag)] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)]">
                Theme
              </span>
            </div>
            {/* no plaintext email anywhere (copy rule, 2026-07-17):
                the contact form is the channel */}
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center font-[family:var(--font-body)] text-[length:var(--typography-font-size-tag)] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)] transition-colors duration-150 hover:text-[color:var(--color-ink)]"
              style={{ minHeight: "var(--spacing-touch-target)" }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
}