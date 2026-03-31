import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildGuidesBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { GUIDES } from "@/data/guidesData";

export const metadata: Metadata = buildPageMetadata({
  title: "WorkWay Guides — Job Search Comparisons & How-Tos",
  description:
    "See how WorkWay compares to manually browsing Greenhouse, Lever, and Ashby career pages. Stop opening 50 tabs — let WorkWay aggregate everything in one place.",
  path: "/guides",
  keywords: [
    "workway guides",
    "greenhouse lever ashby",
    "job search comparison",
    "ats job aggregator",
    "job search automation",
  ],
});

const ATS_GROUPS = [
  {
    label: "Core Comparisons",
    slugs: [
      "workway-vs-greenhouse-job-boards",
      "workway-vs-lever-career-pages",
      "workway-vs-ashby-job-tracking",
      "workway-vs-multiple-ats-tabs",
    ],
  },
  {
    label: "Multi-ATS",
    slugs: [
      "workway-vs-greenhouse-lever-ashby-separately",
      "workway-vs-multiple-ats-platforms",
    ],
  },
  {
    label: "Workflow Comparisons",
    slugs: [
      "workway-vs-spreadsheet-job-tracking",
      "workway-vs-manual-job-search",
      "workway-vs-bookmarking-job-links",
    ],
  },
];

export default function GuidesPage() {
  const breadcrumbs = buildGuidesBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary tracking-wide uppercase">
              Guides
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            WorkWay vs the{" "}
            <span className="text-gradient">old way of job searching</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
            WorkWay automatically collects jobs from company career pages
            powered by Greenhouse, Lever, and Ashby — so you don&apos;t have to
            open each one individually.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Greenhouse", "Lever", "Ashby"].map((ats) => (
              <span
                key={ats}
                className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm font-mono text-muted-foreground"
              >
                {ats}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* One-liner positioning */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg mb-1">The core idea</p>
            <p className="text-muted-foreground leading-relaxed">
              Instead of opening 50 different company career pages, WorkWay
              aggregates jobs from Greenhouse, Lever, and Ashby into a single
              feed — and lets you track every application without a spreadsheet.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison page groups */}
      <section className="max-w-4xl mx-auto px-6 pb-24 space-y-16">
        {ATS_GROUPS.map((group) => {
          const guides = group.slugs
            .map((slug) => GUIDES.find((g) => g.slug === slug))
            .filter(Boolean);

          return (
            <div key={group.label}>
              <p className="section-heading mb-6">{group.label}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {guides.map((guide) => {
                  if (!guide) return null;
                  return (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:glow-subtle transition-all duration-200"
                    >
                      <p className="font-semibold mb-2 group-hover:text-primary transition-colors leading-snug">
                        {guide.h1}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {guide.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-primary">
                        Read comparison
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-lg mb-1">
              Ready to stop tab-switching?
            </p>
            <p className="text-muted-foreground">
              Browse all jobs from Greenhouse, Lever, and Ashby in one place.
            </p>
          </div>
          <Link
            href="/jobs"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Explore Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
