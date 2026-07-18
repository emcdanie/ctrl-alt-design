import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import DevTools from "@/components/DevTools";
import IconProvider from "@/components/ui/IconProvider";
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

export const metadata: Metadata = {
  title: "Elleta McDaniel, Product Designer",
  description:
    "Product Designer specialising in Design Systems & Complex Platforms. Designing scalable systems, intuitive workflows, and structured design languages.",
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
      <body className={`${geist.variable} ${unique.variable} antialiased`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <DevTools />
        <IconProvider>{children}</IconProvider>
      </body>
    </html>
  );
}
