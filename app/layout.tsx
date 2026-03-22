import type { Metadata } from "next";
import { Chivo_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const chivoMono = Chivo_Mono({
  variable: "--font-chivo-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
      <body className={`${chivoMono.variable} ${plusJakarta.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
