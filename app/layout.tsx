import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import DevTools from "@/components/DevTools";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// redesign/lush — Unique is reserved for the large hero headline ONLY
// (fails legibility at label sizes). Everything else is Geist / Geist Mono.
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
  title: "Elleta McDaniel — Product Designer",
  description:
    "Product Designer specialising in Design Systems & Complex Platforms. Designing scalable systems, intuitive workflows, and structured design languages.",
};

// Dark tokens are wired but sections still hardcode light backgrounds, so
// light is PINNED until Phase 5 conformance. To re-enable OS-follow, swap in:
// try{var m=matchMedia("(prefers-color-scheme: dark)");var a=function(){document.documentElement.dataset.theme=m.matches?"dark":"light"};a();m.addEventListener("change",a)}catch(e){}
const themeInit = `document.documentElement.dataset.theme="light"`;

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
      <body className={`${geist.variable} ${geistMono.variable} ${unique.variable} antialiased`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <DevTools />
        {children}
      </body>
    </html>
  );
}
