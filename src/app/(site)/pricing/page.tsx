import type { Metadata } from "next";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildPricingBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import PricingCards from "@/components/Pricing/PricingCards";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing — WorkWay",
  description:
    "WorkWay is free to use. Pro unlocks premium features like instant email alerts when companies you follow post new roles.",
  path: "/pricing",
});

export default function PricingPage() {
  const breadcrumbs = buildPricingBreadcrumb();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <header className="mx-auto mb-14 max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Simple pricing
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            WorkWay is free to search, save, and apply. Pro adds the features that
            help you move faster once you know what you&apos;re looking for.
          </p>
        </header>

        <PricingCards />

        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-dashed border-border bg-card/40 px-6 py-8 text-center">
          <h2 className="mb-2 text-lg font-semibold">Hiring on WorkWay?</h2>
          <p className="text-sm text-muted-foreground">
            Employer plans — job posting, candidate search, and hiring tools — are
            coming soon.
          </p>
        </div>
      </div>
    </main>
  );
}
