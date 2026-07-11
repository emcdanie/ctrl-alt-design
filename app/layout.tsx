import type { Metadata } from "next";
import { Chivo_Mono, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import DevTools from "@/components/DevTools";
import "./globals.css";

const chivoMono = Chivo_Mono({
  variable: "--font-chivo-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// redesign/chip-purple — CHIP editorial serif. Fraunces (opsz) replaces the
// Cormorant trial as --font-display (see globals.css). Iowan/Palatino fallback.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Elleta McDaniel — Product Designer",
  description:
    "Product Designer specialising in Design Systems & Complex Platforms. Designing scalable systems, intuitive workflows, and structured design languages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
      </head>
      <body className={`${chivoMono.variable} ${fraunces.variable} ${plusJakarta.variable} antialiased`}>
        <DevTools />
        {children}
      </body>
    </html>
  );
}
