import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FeedbackButton from "@/components/layout/FeedbackButton";
import AppProviders from "@/components/providers/AppProviders";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/seo/metadata";
import { buildSiteOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo/jsonld";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
  preload: false,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const siteUrl = getSiteUrl();
const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-4936731849151313";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WorkWay — Jobs Simplified. Find Your Next Opportunity",
    template: "%s",
  },
  description:
    "WorkWay helps you discover the right jobs faster. Browse thousands of opportunities, explore companies, and apply with confidence.",
  keywords: [
    "jobs",
    "careers",
    "hiring",
    "job search",
    "workway",
    "tech jobs",
    "startup jobs",
    "remote jobs",
    "fresher jobs",
    "internships",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "WorkWay — Jobs Simplified. Find Your Next Opportunity",
    description:
      "WorkWay helps you discover the right jobs faster. Browse thousands of opportunities, explore companies, and apply with confidence.",
    url: "/",
    siteName: "WorkWay",
    type: "website",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkWay — Jobs Simplified. Find Your Next Opportunity",
    description:
      "WorkWay helps you discover the right jobs faster. Browse thousands of opportunities, explore companies, and apply with confidence.",
    images: ["/logo.png"],
  },
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ||
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.workway.dev" />
        <link rel="dns-prefetch" href="https://cdn.workway.dev" />
        {/* Analytics is deferred until the page is idle, so only resolve DNS
            up front — an early preconnect would compete with critical
            requests for a connection opened seconds later. */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
        {/* AdSense's own docs ask for this on every page, loaded early, so
            Auto Ads can scan the page for placements — afterInteractive
            matches the same strategy already used for gtag.js above: it
            still waits until after hydration, so it doesn't compete with
            LCP/TBT-critical work, but doesn't get deferred to full idle the
            way Mixpanel is (that deferral is specific to Mixpanel's own
            non-time-sensitive event tracking). */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <JsonLd data={buildSiteOrganizationJsonLd()} />
        <JsonLd data={buildWebSiteJsonLd()} />
        <AppProviders>
          <Suspense fallback={null}>
            <AnalyticsProvider />
          </Suspense>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <FeedbackButton />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
