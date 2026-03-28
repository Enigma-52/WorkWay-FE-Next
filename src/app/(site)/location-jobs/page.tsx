import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildLocationJobsBreadcrumb } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import {
  ALL_ROLES,
  ALL_LOCATIONS,
  composeLocationSeoSlug,
} from "@/data/locationSeoData";

export const metadata: Metadata = buildPageMetadata({
  title: "Jobs by Role and Location | WorkWay",
  description:
    "Browse job listings by role and city. Find Software Engineer, Product Manager, Data Scientist roles in Bangalore, Remote, San Francisco and more.",
  path: "/location-jobs",
});

export default function LocationJobsHubPage() {
  const breadcrumbs = buildLocationJobsBreadcrumb();

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <main className="container mx-auto py-10 md:py-14">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl mb-3">
            Browse Jobs by Role & Location
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore curated job listings for every major role across top hiring cities and remote options.
          </p>
        </div>

        <div className="space-y-10">
          {ALL_ROLES.map((role) => (
            <section key={role.slug}>
              <h2 className="font-display text-xl font-semibold mb-4 text-foreground">
                {role.name} Jobs
              </h2>
              <div className="flex flex-wrap gap-3">
                {ALL_LOCATIONS.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/${composeLocationSeoSlug(role.slug, loc.slug)}`}
                    className="inline-flex items-center rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-colors"
                  >
                    {role.name} in {loc.name}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
