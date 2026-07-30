import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ConsentBanner from "@/components/ConsentBanner";
import { GA_MEASUREMENT_ID } from "@/lib/consent";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_ORIGIN = "https://growthlanding.ai";
const SITE_NAME = "GrowthRadar";
const DEFAULT_TITLE = "GrowthRadar — AI & SaaS Product Directory";
const DEFAULT_DESCRIPTION =
  "A daily-updated leaderboard of newly launched, worth-studying SaaS and AI products discovered across the web — ranked by fit for solo founders.";

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
  verification: {
    // Bing Webmaster verification. Key has a dot, so it must be quoted and go
    // through `other` (renders as <meta name="msvalidate.01" content="...">).
    other: { "msvalidate.01": "61FBBC107CB385A779AD4900D5809F96" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Consent Mode v2 + gtag init — combined into ONE inline script so the
            consent `default` commands run synchronously BEFORE gtag.js loads.
            Splitting them (e.g. default consent via next/script while loading
            gtag via @next/third-parties) races: the GA <link rel=preload> ends
            up ahead of the consent script, which can set cookies pre-consent.
            Order here is intentional and is the Google-recommended pattern. */}
        <Script
          id="consent-and-ga-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              // 1) Catch-all default: EEA / UK / any unlisted region = denied
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500
              });
              // 2) Region override: outside EEA/UK, analytics permitted by default
              gtag('consent', 'default', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted',
                region: ['US','CA','MX','BR','AR','CL','CO','PE','AU','NZ',
                         'CN','JP','KR','IN','ID','TH','VN','PH','MY','SG',
                         'HK','TW','AE','SA','IL','TR','ZA','EG','NG','KE']
              });
              // 3) Load gtag.js AFTER consent defaults are set
              var s = document.createElement('script');
              s.async = true;
              s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
              document.head.appendChild(s);
              // 4) Standard GA config
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        {/* Vercel Analytics + Speed Insights — privacy-friendly, cookie-free.
            Both only run in the deployed Vercel environment (no-op in dev /
            self-hosted). See /privacy for what's collected. */}
        <VercelAnalytics />
        <SpeedInsights />
        <ConsentBanner />
      </body>
    </html>
  );
}
