"use client";

import { Building2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/CompaniesPage/SearchBar";
import FilterBar from "@/components/CompaniesPage/FilterBar";
import FeaturedSection from "@/components/CompaniesPage/FeaturedSection";
import CompanyCard from "@/components/CompaniesPage/CompanyCard";
import Pagination from "@/components/CompaniesPage/Pagination";
import type {
  CompanyListResponse,
  CompanyOverview,
} from "@/lib/api/contracts";

type CompaniesPageClientProps = {
  overview: CompanyOverview;
  list: CompanyListResponse;
};

export default function CompaniesPageClient({
  overview,
  list,
}: CompaniesPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const hiring = searchParams.get("hiring") || "false";
  const totalPages = Math.ceil(list.meta.total / list.meta.limit);

  function updateParams(next: Record<string, string | null>) {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === null || v === "") sp.delete(k);
      else sp.set(k, v);
    });
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16">
        <section className="border-b border-border bg-gradient-hero">
          <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
                Browse Companies Hiring on{" "}
                <span className="text-gradient">WorkWay</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                <span className="font-mono text-primary">
                  {overview.stats.total_companies.toLocaleString()}
                </span>{" "}
                companies •{" "}
                <span className="font-mono text-primary">
                  {overview.stats.total_jobs.toLocaleString()}
                </span>{" "}
                open jobs • Startups to large tech firms
              </p>
              <div className="mt-8">
                <SearchBar
                  value={q}
                  onChange={(value) => updateParams({ q: value, page: "1" })}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <FeaturedSection
              title="Trending Companies"
              icon="trending"
              companies={overview.trending}
            />
            <FeaturedSection
              title="Recently Added"
              icon="new"
              companies={overview.recently_added}
            />
            <FeaturedSection
              title="Actively Hiring"
              icon="hiring"
              companies={overview.actively_hiring}
            />
          </div>

          <div className="mb-6">
            <FilterBar
              hiringFilter={hiring === "true" ? "hiring" : "all"}
              onHiringFilterChange={(value) =>
                updateParams({
                  hiring: value === "hiring" ? "true" : "false",
                  page: "1",
                })
              }
            />
          </div>

          <div className="mb-6 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              Showing{" "}
              <span className="font-mono text-foreground">{list.meta.total}</span>{" "}
              companies
            </span>
          </div>

          {list.companies.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
              <Pagination
                currentPage={list.meta.page}
                totalPages={totalPages}
                onPageChange={(p) => updateParams({ page: String(p) })}
              />
            </>
          ) : (
            <div className="py-16 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                No companies found
              </h3>
              <p className="mt-2 text-muted-foreground">
                Try searching: Jane Street, Duolingo , Anthropic
              </p>
            </div>
          )}

          <div className="mt-16 rounded-xl border border-border bg-card/30 p-8">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Discover Top Hiring Companies on WorkWay
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              WorkWay indexes hundreds of companies hiring across startups and
              enterprises. Discover companies, explore their open roles, and
              learn about their teams, culture, and tech stacks. From
              fast-growing startups to established tech giants, find your next
              opportunity at companies that are actively looking for talent like
              you.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
