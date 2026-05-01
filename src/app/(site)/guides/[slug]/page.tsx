import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, Zap, Users, HelpCircle } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildGuideDetailBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/jsonld";
import { GUIDES, getGuideBySlug, ALL_GUIDE_SLUGS } from "@/data/guidesData";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ALL_GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return buildPageMetadata({
    title: `${guide.title} | WorkWay Guides`,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    keywords: guide.keywords,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const breadcrumbs = buildGuideDetailBreadcrumb(guide.h1);
  const relatedGuides = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 6);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      {guide.faq && guide.faq.length > 0 && (
        <JsonLd data={buildFaqJsonLd(guide.faq)} />
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-14">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary tracking-wide uppercase">
              Comparison Guide
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
            {guide.h1}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {guide.description}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* Who this is for */}
        {guide.whoIsFor && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-4 h-4 text-primary" />
              <p className="section-heading">Who this is for</p>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base">{guide.whoIsFor}</p>
          </section>
        )}

        {/* The Problem */}
        <section>
          <p className="section-heading mb-6">The old way</p>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {guide.painPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4">
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WorkWay Way */}
        <section>
          <p className="section-heading mb-6">The WorkWay way</p>
          <div className="rounded-xl border border-primary/20 bg-card divide-y divide-border">
            {guide.workwayPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground">{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section>
          <p className="section-heading mb-6">Side by side</p>
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 bg-card border-b border-border">
              <div className="px-6 py-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Feature
              </div>
              <div className="px-6 py-4 text-xs font-mono text-primary uppercase tracking-wider border-l border-border">
                WorkWay
              </div>
              <div className="px-6 py-4 text-xs font-mono text-muted-foreground uppercase tracking-wider border-l border-border">
                {guide.manualLabel}
              </div>
            </div>
            {/* Rows */}
            {guide.comparisonRows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 border-b border-border last:border-0 hover:bg-card/50 transition-colors"
              >
                <div className="px-6 py-4 text-sm font-medium">{row.feature}</div>
                <div className="px-6 py-4 text-sm text-primary border-l border-border">
                  {row.workway}
                </div>
                <div className="px-6 py-4 text-sm text-muted-foreground border-l border-border">
                  {row.manual}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        {guide.faq && guide.faq.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-4 h-4 text-primary" />
              <p className="section-heading">Frequently asked questions</p>
            </div>
            <div className="space-y-4">
              {guide.faq.map((item, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6">
                  <p className="font-semibold mb-3">{item.question}</p>
                  <p className="text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Verdict */}
        <section>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8">
            <p className="section-heading mb-4">Bottom line</p>
            <p className="text-lg leading-relaxed">{guide.verdict}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Try WorkWay free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold hover:border-primary/30 transition-colors"
              >
                See all comparisons
              </Link>
            </div>
          </div>
        </section>

        {/* How WorkWay Works (positioning) */}
        <section>
          <p className="section-heading mb-6">How WorkWay works</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Discover",
                body: "WorkWay maps thousands of companies to their ATS — Greenhouse, Lever, or Ashby.",
              },
              {
                step: "02",
                title: "Collect",
                body: "Jobs are pulled automatically from public ATS APIs every few hours. No scraping needed.",
              },
              {
                step: "03",
                title: "Normalize",
                body: "All jobs are normalized into one schema — same layout, same filters, regardless of source.",
              },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                className="rounded-xl border border-border bg-card p-6"
              >
                <span className="font-mono text-xs text-primary mb-3 block">
                  {step}
                </span>
                <p className="font-semibold mb-2">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related guides */}
        <section>
          <p className="section-heading mb-6">More comparisons</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedGuides.map((related) => (
              <Link
                key={related.slug}
                href={`/guides/${related.slug}`}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:glow-subtle transition-all duration-200"
              >
                <p className="text-sm font-semibold mb-2 group-hover:text-primary transition-colors leading-snug">
                  {related.h1}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-primary">
                  Read
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
