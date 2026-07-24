import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import DevTools from "@/components/DevTools";
import IconProvider from "@/components/ui/IconProvider";
import { POSITIONING } from "@/lib/copy";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// redesign/lush — Unique is reserved for the large hero headline ONLY
// (fails legibility at label sizes). Everything else is Geist.
// Licensed webfonts, free for commercial use; files unmodified.
const unique = localFont({
  src: [
    { path: "./fonts/unique/Unique-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/unique/Unique-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-unique",
  display: "swap",
});

/* Site metadata (Elleta, 2026-07-20). The positioning phrase resolves
 * from the ONE constant (constitution section 6); the title wears its
 * title-case form, derived, never a second literal. */
const siteTitle = `Elleta McDaniel, ${POSITIONING.replace(/\b[a-z]/g, (c) => c.toUpperCase())} Designer`;
const siteDescription = `${POSITIONING[0].toUpperCase()}${POSITIONING.slice(1)} and complex platforms. Token-first foundations, agent-ready governance, and systems that ship.`;

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    siteName: "elleta.design",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

// Theme follows the visitor (2026-07-17): a stored ThemeSwitch choice
// wins; otherwise the OS preference applies, live (the matchMedia
// listener re-runs on OS theme change and defers to a stored choice).
// Pre-paint inline in <head>: no flash either way.
const themeInit = `try{var d=document.documentElement,m=matchMedia("(prefers-color-scheme: dark)"),a=function(){var s=null;try{s=localStorage.getItem("theme")}catch(e){}d.dataset.theme=s||(m.matches?"dark":"light")};a();m.addEventListener("change",a)}catch(e){document.documentElement.dataset.theme="light"}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) inject
          attributes like cz-shortcut-listen on <body> before hydration; this
          silences that benign server/client attribute mismatch only */}
      <body className={`${geist.variable} ${unique.variable} antialiased`} suppressHydrationWarning>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <DevTools />
        <IconProvider>{children}</IconProvider>
      </body>
    </html>
  );
}
