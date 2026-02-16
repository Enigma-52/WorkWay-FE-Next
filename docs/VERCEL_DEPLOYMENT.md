# Vercel Deployment Setup (WorkWay Next)

## Project Creation
1. Import `/Users/enigma/Documents/GitHub/WorkWay-complete/workway-next` as a new Vercel project.
2. Framework preset: `Next.js`.
3. Build command: `npm run build`.
4. Output setting: default (Next.js managed).

## Required Environment Variables
- `BACKEND_API_URL`
- `NEXT_PUBLIC_SITE_URL`

Use:
- `/Users/enigma/Documents/GitHub/WorkWay-complete/workway-next/.env.example` for local.
- `/Users/enigma/Documents/GitHub/WorkWay-complete/workway-next/.env.production.example` for production values.

## Runtime Notes
- Dynamic routes (`/companies`, `/company/[companySlug]`, `/domain/[domainSlug]`, `/job/[jobSlug]`) run as server-rendered routes.
- Static routes are pre-rendered.

## Pre-Production Verification
1. Open preview deployment.
2. Validate:
   - `/api/health`
   - `/companies`
   - `/company/<valid-slug>`
   - `/domain/<valid-slug>`
   - `/job/<valid-slug>`
3. Confirm metadata:
   - title/description
   - canonical URL
   - JSON-LD present on company/job/domain detail pages
4. Confirm `robots.txt` and `sitemap.xml`.

## Cutover
1. Promote stable preview to production.
2. Point domain to Vercel production.
3. Keep legacy app ready for rollback.
4. Monitor status code trends and response latency for 30-60 minutes.

