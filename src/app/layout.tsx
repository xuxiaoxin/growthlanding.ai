import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_ORIGIN = "https://growthlanding.ai";
const SITE_NAME = "GrowthRadar";
const DEFAULT_TITLE = "GrowthRadar — AI & SaaS Product Directory";
const DEFAULT_DESCRIPTION =
  "A daily-updated leaderboard of newly launched, worth-studying SaaS and AI products discovered across the web — ranked by opportunity score and enriched with AI analysis.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | GrowthRadar",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_ORIGIN,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "GrowthRadar — AI & SaaS Product Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        {/* Vercel Analytics + Speed Insights — privacy-friendly, cookie-free.
            Both only run in the deployed Vercel environment (no-op in dev /
            self-hosted). See /privacy for what's collected. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
