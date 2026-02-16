import type { Metadata } from "next";
import { Briefcase, Sparkles } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Jobs Feed — Discover New Opportunities | WorkWay",
  description:
    "Explore a personalized feed of the latest job opportunities across top companies. The WorkWay jobs feed is coming soon.",
  path: "/jobs",
});

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-hero">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="container relative mx-auto py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm text-primary">
                WorkWay Jobs Feed
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Your Personalized <span className="text-primary">Jobs Feed</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              A smart feed of the latest and most relevant jobs across top
              companies — tailored for you.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="container mx-auto py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-border bg-card/40 p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>

            <h2 className="font-display text-2xl font-semibold mb-3">Coming Soon</h2>

            <p className="mx-auto max-w-md text-muted-foreground">
              We’re building a personalized jobs feed that learns what you care
              about and surfaces the best opportunities for you. This will be
              available shortly.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
