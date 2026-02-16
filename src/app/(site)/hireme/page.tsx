import type { Metadata } from "next";
import { Briefcase, Sparkles, UserPlus } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Hire Me Profile — Create Your Hiring Profile | WorkWay",
  description:
    "Create your Hire Me profile on WorkWay and let companies discover you. Build a professional profile, showcase your skills, and get discovered by top employers. Coming soon.",
  path: "/hireme",
});

export default function HireMePage() {
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
                WorkWay Hire Me
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Create Your <span className="text-primary">Hire Me</span> Profile
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              A professional profile that lets companies discover you directly —
              showcase your skills, experience, and what you want to work on.
            </p>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="container mx-auto py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-border bg-card/40 p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>

            <h2 className="font-display text-2xl font-semibold mb-3">Coming Soon</h2>

            <p className="mx-auto mb-6 max-w-md text-muted-foreground">
              We’re building a simple, powerful “Hire Me” profile that lets you
              create a single page companies can browse and contact you from.
              This will be available shortly.
            </p>

            <div className="mx-auto max-w-md rounded-lg border border-border bg-secondary/40 p-6 text-left">
              <div className="mb-3 flex items-start gap-3">
                <Briefcase className="mt-0.5 h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  List your skills, experience, and preferred roles
                </p>
              </div>
              <div className="mb-3 flex items-start gap-3">
                <Briefcase className="mt-0.5 h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Get discovered by companies hiring in your domain
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Share one clean WorkWay profile link instead of multiple docs
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
