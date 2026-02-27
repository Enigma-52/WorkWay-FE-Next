# SEO Upgrade Audit (WorkWay Next.js)

This document lists high-impact SEO gaps found in the current codebase, with exact locations and implementation guidance.

## Priority 0 (Fix First)

### 1) Canonical logic is inverted on domain pages
- Where:
  - `src/app/(site)/domain/[domainSlug]/page.tsx` (`generateMetadata`, `path` assignment)
- What is missing:
  - Correct canonical policy for filtered/paginated domain views.
- Why it matters:
  - Current logic canonicalizes filtered/paginated URLs to themselves and canonicalizes unfiltered pages to a URL with query params (inverted behavior). This can cause duplicate indexing and weaker canonical signals.
- How to fix:
  - Make canonical path be `/domain/[slug]` for filtered/paginated states.
  - Keep `robots: { index: false, follow: true }` on non-canonical filtered states.
  - For clean page 1 (no filters), canonical should be the exact base URL.

### 2) `/jobs` filter combinations are fully indexable
- Where:
  - `src/app/(site)/jobs/page.tsx` (`generateMetadata`)
- What is missing:
  - A crawl/index strategy for high-cardinality filter URLs (`q`, `location`, `page`, combinations).
- Why it matters:
  - Indexing every filter combination can create massive near-duplicate pages, dilute rankings, and waste crawl budget.
- How to fix:
  - Define canonical rules:
    - Canonical to `/jobs` for free-text/low-value combinations.
    - Optionally allow a small set of high-intent facet pages to self-canonicalize.
  - Add `noindex,follow` for deep pagination and ephemeral search-result states.

### 3) Pagination is client-button driven, not crawl-link driven
- Where:
  - `src/components/DomainPage/JobPagination.tsx`
  - `src/components/CompaniesPage/Pagination.tsx`
  - Usage in `JobsPageClient`, `DomainPageClient`, `CompaniesPageClient`
- What is missing:
  - Crawlable `<a>/<Link>` pagination URLs and rel prev/next metadata hints.
- Why it matters:
  - Search engines crawl links best. JS click handlers on buttons reduce discoverability/reliability for deeper pages.
- How to fix:
  - Render pagination controls as actual links with stable `?page=N` URLs.
  - Add `alternates`/metadata handling for paginated pages (`Page N` titles are already partly present on domain pages).
  - Ensure page 1 canonicalizes to base route.

### 4) Internal links point to non-existent `/skills/*` pages
- Where:
  - `src/components/JobPage/JobCard.tsx`
  - `src/components/CompanyPage/CompanyPageJobCard.tsx`
- What is missing:
  - Valid target route for skill links (or link suppression until route exists).
- Why it matters:
  - Broken internal links create crawl waste and quality issues.
- How to fix:
  - Either implement `/skills/[skillSlug]` pages, or remove/replace those links with non-link chips until route exists.

## Priority 1 (High Impact)

### 5) JobPosting schema is too thin for Google for Jobs
- Where:
  - `src/lib/seo/jsonld.ts` (`buildJobPostingJsonLd`)
  - `src/app/(site)/job/[jobSlug]/page.tsx` (injection)
- What is missing:
  - Rich `JobPosting` fields (as available):
    - stronger `description` (actual job description, not short synthetic text)
    - `identifier`
    - `dateModified`
    - `validThrough`
    - `jobLocationType` / remote handling
    - `applicantLocationRequirements` (if remote constraints exist)
    - compensation fields when available
- Why it matters:
  - Better eligibility and richer search appearance for job results.
- How to fix:
  - Build schema directly from job detail payload with normalized fields.
  - Output ISO timestamps and validate with Rich Results Test.

### 6) Structured data coverage is narrow
- Where:
  - `src/lib/seo/jsonld.ts`
  - Detail/listing routes under `src/app/(site)/*`
- What is missing:
  - `BreadcrumbList` for job/company/domain detail pages.
  - `WebSite` + `SearchAction` on homepage.
  - `CollectionPage`/`ItemList` coverage for companies and domains index pages.
- Why it matters:
  - Better SERP understanding, richer snippets, improved information architecture signals.
- How to fix:
  - Add schema builders for breadcrumb + website + collection pages.
  - Inject JSON-LD per route using existing `JsonLd` component.

### 7) Static site URL in JSON-LD can drift from environment
- Where:
  - `src/lib/seo/jsonld.ts` (`SITE_URL = "https://www.workway.dev"`)
- What is missing:
  - Environment-aware URL source (same as `getSiteUrl()`).
- Why it matters:
  - In staging/preview/custom-domain contexts, structured data may emit incorrect URLs.
- How to fix:
  - Reuse the same centralized site URL resolver used by metadata.

### 8) Thin/utility pages likely should be non-indexable
- Where:
  - `src/app/(site)/chat/page.tsx`
  - `src/app/(site)/hireme/page.tsx` (currently “Coming Soon”)
- What is missing:
  - Explicit `robots: { index: false, follow: true }` policy for low-value utility states.
- Why it matters:
  - Prevents low-intent or incomplete pages from competing with core money pages in indexation.
- How to fix:
  - Set page-level robots to noindex until content is deep and conversion-ready.

## Priority 2 (Quality + Scale)

### 9) Companies page metadata does not reflect query/pagination state
- Where:
  - `src/app/(site)/companies/page.tsx` (static `metadata`, no `generateMetadata`)
- What is missing:
  - Query-aware titles/descriptions and explicit pagination/canonical policy.
- Why it matters:
  - Better relevance for important subviews and cleaner duplicate control for deep pages.
- How to fix:
  - Add `generateMetadata` using `searchParams`.
  - Keep canonical policy conservative (base canonical for low-value filters).

### 10) OG/Twitter image strategy is generic
- Where:
  - `src/lib/seo/metadata.ts`
  - Route metadata usage across app
- What is missing:
  - Route/entity-specific OG images with consistent dimensions and meaningful text context.
- Why it matters:
  - Improves CTR from social/DM shares and indirectly supports brand search demand.
- How to fix:
  - Introduce dynamic OG image generation for job/company/domain pages (or route-level static templates).

### 11) Missing first-party sitemap route fallback in app layer
- Where:
  - `next.config.ts` rewrites `/sitemap.xml` and `/sitemaps/*` to backend
  - No `src/app/sitemap.ts`
- What is missing:
  - Native app-route sitemap generation/fallback ownership.
- Why it matters:
  - SEO reliability depends on backend rewrite availability; app layer has no fallback if backend routing fails.
- How to fix:
  - Add `src/app/sitemap.ts` fallback or health-guarded pass-through strategy.
  - Keep backend source-of-truth if needed, but ensure Next app can still serve a valid sitemap.

### 12) Global fetch strategy is always `no-store`
- Where:
  - `src/lib/api/server-client.ts` (`cache: "no-store"`)
- What is missing:
  - Route-appropriate caching/ISR strategy for crawl-critical list/detail pages.
- Why it matters:
  - Slower response times can reduce crawl efficiency and worsen Core Web Vitals under load.
- How to fix:
  - Move selected pages to controlled `revalidate` windows and tagging.
  - Keep truly dynamic/private endpoints `no-store`.

## Validation Checklist After Upgrades

- Canonical URLs are deterministic and match indexation strategy for all filter pages.
- Filter pages intended to stay out of index have `noindex,follow`.
- Pagination links are crawlable anchors with stable URLs.
- No internal links resolve to 404 routes.
- Job structured data passes Google Rich Results Test for representative job URLs.
- Breadcrumb schema present on job/company/domain detail pages.
- `robots.txt` and `sitemap.xml` remain accessible in production.
- Metadata/OG/Twitter output validated in page source for all key routes:
  - `/`
  - `/jobs`
  - `/job/[jobSlug]`
  - `/companies`
  - `/company/[companySlug]`
  - `/domains`
  - `/domain/[domainSlug]`

## Quick Wins Sequence

1. Fix domain canonical inversion.
2. Remove/resolve `/skills/*` dead internal links.
3. Enforce noindex strategy for low-value filter pages (`/jobs`, optionally deep `/companies` pages).
4. Upgrade JobPosting schema fields from real payload data.
5. Convert pagination buttons to link-based crawlable pagination.
