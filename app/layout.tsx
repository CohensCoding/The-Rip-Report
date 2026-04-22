import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rip Report — Sports card release breakdowns",
  description:
    "Opinionated breakdowns of every major sports card release. Odds, parallels, chase cards, and honest takes.",
};

const fontSerif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${fontSans.variable} ${fontSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
