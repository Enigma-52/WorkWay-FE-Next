# Route Mapping (Legacy -> Next.js)

## Static Routes
- `/` -> `/src/app/(site)/page.tsx`
- `/jobs` -> `/src/app/(site)/jobs/page.tsx`
- `/about` -> `/src/app/(site)/about/page.tsx`
- `/companies` -> `/src/app/(site)/companies/page.tsx`
- `/domains` -> `/src/app/(site)/domains/page.tsx`
- `/hireme` -> `/src/app/(site)/hireme/page.tsx`

## Dynamic Routes
- `/company/:companySlug` -> `/src/app/(site)/company/[companySlug]/page.tsx`
- `/domain/:domainSlug` -> `/src/app/(site)/domain/[domainSlug]/page.tsx`
- `/job/:jobSlug` -> `/src/app/(site)/job/[jobSlug]/page.tsx`

## Not Found
- `*` -> `/src/app/not-found.tsx`

## Backend API Mapping
- Companies listing: `GET /api/company`
- Company details: `GET /api/company/details?slug=...`
- Company overview: `GET /api/company/overview`
- Domain listing: `GET /api/filter/domain/all`
- Domain jobs: `GET /api/filter/domain?slug=...`
- Job details: `GET /api/job/details?slug=...`

