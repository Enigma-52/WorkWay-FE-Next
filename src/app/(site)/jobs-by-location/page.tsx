import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildJobsByLocationBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { ALL_LOCATIONS, composeLocationOnlySlug } from "@/data/locationSeoData";
import { backendGet } from "@/lib/api/server-client";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Jobs by Location | WorkWay",
  description:
    "Browse job listings by city or region. Find jobs in Bangalore, Remote, San Francisco, London, and hundreds more locations.",
  path: "/jobs-by-location",
});

type ValidLocationsResponse = {
  locations: { location_slug: string }[];
};

async function getValidLocations(): Promise<Set<string>> {
  const data = await backendGet<ValidLocationsResponse>(
    "/api/seo/valid-locations",
    { revalidate: 3600 }
  ).catch(() => null);

  if (!data || data.locations.length === 0) return new Set();

  return new Set(data.locations.map((l) => l.location_slug));
}

export default async function JobsByLocationHubPage() {
  const breadcrumbs = buildJobsByLocationBreadcrumb();
  const validLocations = await getValidLocations();
  const showAll = validLocations.size === 0; // fallback: API down or returned nothing

  const visibleLocations = ALL_LOCATIONS.filter(
    (loc) => showAll || validLocations.has(loc.slug)
  );

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <main className="container mx-auto py-10 md:py-14">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl mb-3">
            Browse Jobs by Location
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore curated job listings across top hiring cities and remote options worldwide.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {visibleLocations.map((loc) => (
            <Link
              key={loc.slug}
              href={`/${composeLocationOnlySlug(loc.slug)}`}
              className="inline-flex items-center rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-colors"
            >
              Jobs in {loc.name}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
