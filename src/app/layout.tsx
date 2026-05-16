import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FeedbackButton from "@/components/layout/FeedbackButton";
import AppProviders from "@/components/providers/AppProviders";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import { getSiteUrl } from "@/lib/seo/metadata";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const siteUrl = getSiteUrl();

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
      <body className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
        <AppProviders>
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
