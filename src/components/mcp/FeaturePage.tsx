import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/jsonld";
import { buildFeatureBreadcrumb } from "@/lib/seo/breadcrumbs";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import ExploreMoreLinks from "@/components/seo/ExploreMoreLinks";

export type FeaturePageProps = {
  breadcrumbName: string;
  eyebrow: string;
  icon: LucideIcon;
  title: React.ReactNode;
  intro: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  points: { icon: LucideIcon; title: string; body: string }[];
  mcpBlurb: string;
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
};

// Shared shell for the /features/* pages — they differ only in copy, so the
// layout, JSON-LD and internal-linking block live here rather than being
// re-implemented (and drifting) per page.
export default function FeaturePage({
  breadcrumbName,
  eyebrow,
  icon: HeroIcon,
  title,
  intro,
  primaryCta,
  secondaryCta,
  points,
  mcpBlurb,
  faqs,
  relatedLinks,
}: FeaturePageProps) {
  const breadcrumbs = buildFeatureBreadcrumb(breadcrumbName);

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildFaqJsonLd(faqs)} />

      <div className="mx-auto w-full max-w-4xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <main className="mx-auto w-full max-w-4xl px-6 py-10 md:py-14 space-y-14">
        <header className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-xs text-muted-foreground">
            <HeroIcon className="h-3.5 w-3.5 text-primary" />
            {eyebrow}
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary/60 transition-colors"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </header>

        <section>
          <div className="grid gap-4 sm:grid-cols-2">
            {points.map(({ icon: Icon, title: pointTitle, body }) => (
              <div
                key={pointTitle}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </span>
                <h2 className="mt-4 text-base font-medium">{pointTitle}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold md:text-2xl">
            Works from your AI assistant too
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{mcpBlurb}</p>
          <Link
            href="/mcp"
            className="mt-4 inline-flex items-center gap-1 font-mono text-sm text-primary hover:underline"
          >
            Set up the WorkWay MCP server
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold">Frequently asked</h2>
          <dl className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
            {faqs.map(({ question, answer }) => (
              <div key={question} className="p-5">
                <dt className="text-base font-medium">{question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Related</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {relatedLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/60 transition-colors"
              >
                {label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <ExploreMoreLinks />
          </div>
        </section>
      </main>
    </>
  );
}
