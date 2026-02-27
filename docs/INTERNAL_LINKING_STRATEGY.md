# Internal Linking Strategy (WorkWay)

## Objective
Build a predictable internal linking system that:
- Improves crawl depth and topical authority for money pages (`/jobs`, `/company/*`, `/domain/*`, `/job/*`).
- Improves user navigation speed from discovery to apply.
- Creates link-worthy "hub" pages that attract backlinks and pass authority internally.

## Core SEO Principles
- Keep every important page within 3 clicks from homepage.
- Use descriptive anchors (not generic "click here").
- Link from high-authority pages (home, jobs, domains, companies) to deep pages.
- Use consistent anchor variants for the same destination to strengthen relevance.
- Prevent dead-end pages: every detail page should link to related listings/hubs.

## Route Hierarchy (Primary)
- Tier 1 hubs: `/`, `/jobs`, `/companies`, `/domains`
- Tier 2 hubs: `/company/[companySlug]`, `/domain/[domainSlug]`
- Tier 3 conversion pages: `/job/[jobSlug]`

Flow target:
`Home -> Domain/Company hubs -> Job detail -> Apply`

## Placement Plan: Where to Add Links

### 1) Homepage (`src/app/(site)/page.tsx` + landing sections)
Add strong crawlable blocks above fold and mid-page:
- "Top domains hiring now" -> links to 8-12 key `/domain/[slug]` pages.
- "Top companies hiring now" -> links to 8-12 `/company/[slug]` pages.
- "Newest roles" -> links to 10-20 `/job/[slug]` pages.

Anchor examples:
- `Software Engineering jobs`
- `Data Science roles`
- `Jobs at Stripe`
- `Frontend Engineer at CompanyName`

### 2) Jobs index (`src/app/(site)/jobs/page.tsx`, `src/components/JobsPage/*`)
Add static text modules (crawlable, SSR rendered):
- Domain quick links block (all major domains).
- Company quick links block (top hiring companies).
- Location quick links block (Remote + major cities if data exists).

Anchor examples:
- `Remote Product Manager jobs`
- `Backend jobs at CompanyName`
- `Marketing jobs in New York`

### 3) Domain pages (`src/app/(site)/domain/[domainSlug]/page.tsx`, `DomainPageClient`)
Add two internal-link modules:
- "Related domains" (5-8 nearest categories).
- "Top hiring companies in [Domain]" (links to `/company/*`).

Anchor examples:
- `Product Design jobs`
- `AI/ML jobs`
- `View CompanyName hiring profile`

### 4) Company pages (`src/app/(site)/company/[companySlug]/page.tsx`, `CompanyPageClient`)
Add structured link clusters:
- "Roles by domain at [Company]" linking to matching `/domain/*` pages.
- "Similar companies" (same domain/size/hiring behavior).
- "More from [Company]" links to all open `/job/*` roles.

Anchor examples:
- `[Company] engineering jobs`
- `Companies similar to [Company]`
- `[Job Title] at [Company]`

### 5) Job detail pages (`src/app/(site)/job/[jobSlug]/page.tsx`, `JobPageClient`)
Keep and expand existing related links:
- Already present: similar roles + more jobs by company.
- Add: breadcrumb-style links near title.

Breadcrumb anchors:
- `All jobs`
- `[Domain] jobs`
- `[Company] careers`

### 6) Global navigation (`src/components/layout/Navbar.tsx`, `Footer.tsx`)
Add footer SEO columns (text links, not only nav):
- Top domains
- Top companies
- Popular job searches
- Resources/data pages (see backlink section)

Anchor examples:
- `Browse software jobs`
- `Browse actively hiring companies`
- `Entry-level jobs`

## Anchor Text System

### Primary pattern library
- Domain to Domain page: `[Domain] jobs`
- Company to Company page: `Jobs at [Company]` / `[Company] careers`
- Job to Job page: `[Job Title] at [Company]`
- Company to Domain page: `[Domain] jobs at [Company]`
- Domain to Company page: `[Company] hiring in [Domain]`

### Rules
- Keep anchor length 2-6 words when possible.
- Put primary keyword close to start (`Backend jobs`, not `See all opportunities for backend`).
- Rotate safe variants to avoid over-optimization.
- Avoid repeating identical anchors 20+ times on same page.

## Link Density Targets
- Homepage: 60-120 crawlable internal links.
- `/jobs`: 80-150 links (filters + job cards + hubs).
- `/domain/*`: 40-100 links.
- `/company/*`: 30-80 links.
- `/job/*`: 15-40 links.

## Backlink Generation via Internal Linking Architecture
Create "link-worthy" pages and pipe authority into money pages.

### New high-value assets to add (recommended)
- `State of Hiring` reports (`/reports/*`).
- Salary/market trend pages (`/insights/*`).
- Company hiring benchmarks (`/benchmarks/*`).
- Domain guides (`/guides/[domain]`).

Internal linking rule for these assets:
- Every asset must link contextually to relevant `/domain/*`, `/company/*`, and `/jobs` pages.
- Add reciprocal links back from hub pages to best assets.

Anchor examples from assets:
- `See all cybersecurity jobs`
- `Companies hiring data engineers`
- `Current product manager openings`

## UX Rules (User-Ease)
- Keep link blocks scannable (short lists with clear labels).
- Use section titles users understand: `Related roles`, `Hiring companies`, `Explore by domain`.
- Prioritize likely next actions (domain -> jobs, company -> open roles, job -> related jobs).
- Avoid sending users to thin/empty pages.

## Technical Rules
- Use `<Link>` for internal routes everywhere.
- Keep links SSR-visible (not only interaction-triggered).
- Ensure no internal links point to non-existent routes.
- Add breadcrumb UI + breadcrumb schema on detail pages.
- Keep URL params clean and canonicalized on listing pages.

## Rollout Plan
1. Add homepage hub blocks (domains, companies, newest jobs).
2. Add domain/company cross-link modules.
3. Add breadcrumb links on job/company/domain detail pages.
4. Add footer SEO columns.
5. Launch first link-worthy data page and connect it to hubs.

## KPI Tracking
- Crawl depth to `/job/*`, `/company/*`, `/domain/*` (target: <=3 clicks).
- Indexed pages by type in GSC.
- Impressions/clicks for non-brand queries by page template.
- Internal link count to top converting pages.
- Assisted conversions from internal navigation paths.

## QA Checklist
- Every template has at least one contextual outbound internal link section.
- All key pages have at least one inbound link from a higher-tier hub.
- No broken internal links (`404`) in crawl.
- Anchor texts are descriptive and non-duplicative.
- Mobile layout keeps link clusters usable (no hidden critical links).
