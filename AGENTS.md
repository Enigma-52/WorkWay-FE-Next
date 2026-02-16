# AGENTS.md (workway-next)

## Scope
- This folder contains the new Next.js SSR migration target for WorkWay.
- Do not modify legacy apps in `/Users/enigma/Documents/GitHub/WorkWay-complete/WorkWay--FE` or `/Users/enigma/Documents/GitHub/WorkWay-complete/WorkWay--BE` from inside this workspace unless explicitly asked.

## Primary Goals
- Preserve all existing user-facing behavior, styling, and flows from the current frontend.
- Improve SEO and crawlability using Next.js App Router SSR/SSG/ISR.
- Keep backend API contracts unchanged and integrate with existing `/api/*` endpoints.
- Ensure deployment is production-ready on Vercel with zero-downtime rollout support.

## Migration Rules
- Treat this as a structural migration, not a redesign.
- Keep route parity with legacy frontend:
  - `/`
  - `/jobs`
  - `/about`
  - `/companies`
  - `/domains`
  - `/hireme`
  - `/company/[companySlug]`
  - `/domain/[domainSlug]`
  - `/job/[jobSlug]`
- Preserve current query parameter behavior for listing/filter pages.
- Keep canonical/meta/OG/Twitter behavior equivalent or better.

## Backend Contract Baseline
- Existing backend app is in `/Users/enigma/Documents/GitHub/WorkWay-complete/WorkWay--BE`.
- Required endpoints to preserve:
  - `GET /api/company`
  - `GET /api/company/details`
  - `GET /api/company/overview`
  - `GET /api/job/details`
  - `GET /api/filter/domain`
  - `GET /api/filter/domain/all`
  - `GET /api/feed/home`
  - `GET /api/sitemap.xml`
  - `GET /api/sitemaps/static.xml`
  - `GET /api/sitemaps/companies.xml`
  - `GET /api/sitemaps/domains.xml`
  - `GET /api/sitemaps/jobs.xml`

## Engineering Standards
- TypeScript-first.
- Server Components by default, Client Components only where browser APIs/interactivity are needed.
- Centralize API calls and metadata helpers.
- Add minimal, targeted comments only when logic is non-obvious.
- Do not add unnecessary dependencies.

## Validation Expectations
- Functional parity checks for each migrated route.
- SEO checks: metadata, canonical, sitemap, robots, structured data.
- Performance checks: LCP/CLS/INP, bundle size, cache headers.
- Hydration mismatch checks in preview and production-like environments.

## Deployment Workflow (Mandatory)
- For any code change, always commit and push to the GitHub repository first.
- Do not rely on manual direct Vercel production deploys as the primary path.
- Production deployment must happen through GitHub-connected auto deployment.
- After pushing, verify the production deployment status and production URL health.
