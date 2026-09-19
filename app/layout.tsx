import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";
import BracketCursor from "@/components/BracketCursor";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import DevTools from "@/components/DevTools";
import IconProvider from "@/components/ui/IconProvider";
import { POSITIONING } from "@/lib/copy";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// The code face (Elleta, 19 Sep 2026): metadata only, through
// --font-code (CLAUDE.md section 3). font-waiver: the loader names it.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Unique is for the ELLETA wordmarks (nav + footer) and the BELLA logo
// only, so only its Regular cut loads. Everything else is Geist.
// Licensed webfonts, free for commercial use; files unmodified.
const unique = localFont({
  src: [
    { path: "./fonts/unique/Unique-Regular.woff2", weight: "400", style: "normal" },
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

// Theme follows the visitor (2026-07-17): a stored ThemeToggle choice
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
      <body className={`${geist.variable} ${geistMono.variable} ${unique.variable} antialiased`} suppressHydrationWarning>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <DevTools />
        <IconProvider>
          {children}
          <SiteFooter />
        </IconProvider>
        <BracketCursor />
      </body>
    </html>
  );
}
