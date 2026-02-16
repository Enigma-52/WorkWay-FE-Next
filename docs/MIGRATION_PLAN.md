# WorkWay React Router -> Next.js SSR Migration Blueprint

## 0) Current-State Baseline (From Existing Codebase)

### Frontend baseline (`/WorkWay--FE`)
- Router: React Router config with route table in `app/routes.ts`.
- Rendering: Server-side rendering is enabled (`react-router.config.ts` has `ssr: true`).
- Data model: Route loaders fetch backend data through `app/api/*`.
- Styling: Tailwind v4 + app-level CSS tokens in `app/app.css`.
- Meta/SEO: route-level `meta()` functions for key pages.
- Analytics/scripts: Google tag in `app/root.tsx`, Mixpanel init on client.

### Backend baseline (`/WorkWay--BE`)
- API mounted under `/api` (`src/server.js` + `src/routes/index.js`).
- Active route groups:
  - `/api/company`
  - `/api/job`
  - `/api/feed`
  - `/api/filter`
  - `/api/sitemap.xml` + `/api/sitemaps/*.xml`

### Route parity targets
- Static: `/`, `/jobs`, `/about`, `/companies`, `/domains`, `/hireme`
- Dynamic: `/company/:companySlug`, `/domain/:domainSlug`, `/job/:jobSlug`
- Fallback: 404 page

---

## 1) Workspace Initialization (Execution Order)

1. Create isolated migration workspace:
   - `/Users/enigma/Documents/GitHub/WorkWay-complete/workway-next`
2. Bootstrap Next.js App Router project in that folder (no edits to old SPA).
3. Keep TypeScript enabled (recommended for contract-safe migration).
4. Enable ESLint and strict TS checks.
5. Add Vercel-ready defaults:
   - Next build/start scripts
   - runtime-specific env var templates
   - health endpoint (`/api/health`)
6. Add migration docs + utilities in:
   - `/Users/enigma/Documents/GitHub/WorkWay-complete/workway-next/docs`
   - `/Users/enigma/Documents/GitHub/WorkWay-complete/workway-next/scripts`

---

## 2) Target Folder Structure

```text
workway-next/
  src/
    app/
      (site)/
        page.tsx
        jobs/page.tsx
        about/page.tsx
        companies/page.tsx
        domains/page.tsx
        hireme/page.tsx
        company/[companySlug]/page.tsx
        domain/[domainSlug]/page.tsx
        job/[jobSlug]/page.tsx
      api/health/route.ts
      layout.tsx
      not-found.tsx
      robots.ts
      sitemap.ts
    components/
      layout/
      providers/
    lib/
      api/
        server-client.ts
        contracts.ts
      seo/
        metadata.ts
      config/
        env.ts
  docs/
    MIGRATION_PLAN.md
    ROUTE_MAPPING.md
    CUTOVER_RUNBOOK.md
  scripts/
    audit-ssr-compat.mjs
```

---

## 3) Architecture Mapping

### React Router -> Next App Router
- Route table in `app/routes.ts` maps directly to `src/app/(site)` files.
- `Layout.tsx` + root wrappers map to Next `layout.tsx` + provider wrapper.

### Loader migration model
- React Router `loader()` functions become:
  - Server component `await` fetches for SSR pages.
  - `generateMetadata()` for per-page SEO from server data.
  - `generateStaticParams()` only where route universe is stable enough.

### Client vs Server boundaries
- Server by default:
  - `companies`, `domains`, `company/[slug]`, `domain/[slug]`, `job/[slug]`
- Client only for:
  - query-param interaction, local UI state, animations needing browser APIs.

### Global state/providers
- Preserve React Query provider behavior in a top-level client provider.
- Keep current stale/retry defaults from `app/Provider.tsx`.

---

## 4) Routing Migration Strategy

### Static routes
- `/`, `/jobs`, `/about`, `/companies`, `/domains`, `/hireme`
- Implement as App Router `page.tsx` files.

### Dynamic routes
- `/company/[companySlug]`
- `/domain/[domainSlug]`
- `/job/[jobSlug]`
- Use `notFound()` for null/empty backend responses.

### Nested routes/layouts
- Shared navbar/footer from current `routes/Layout.tsx` move into `(site)/layout.tsx`.

### Auth-protected routes
- No protected route currently observed in active route table.
- Keep middleware slot ready for future auth gating.

### Redirects/rewrites
- Ensure exact legacy slug routes remain intact.
- Add optional rewrites if backend endpoints are proxied from same origin.

---

## 5) Rendering Strategy (Per Page Category)

### High SEO/value pages
- `/`, `/companies`, `/domains`, `/company/[slug]`, `/domain/[slug]`, `/job/[slug]`
- Strategy: SSR or ISR.
- Reason: crawler-visible content + frequently updated listings.

### Lower volatility static pages
- `/about`, `/hireme`, `/jobs` (coming soon page)
- Strategy: SSG.

### Freshness guidance
- Company/domain/job detail: SSR or short ISR revalidation.
- Directory pages: ISR with revalidate window tuned to data update cadence.

---

## 6) SEO Infrastructure Plan

1. Use Next Metadata API (`generateMetadata`) on each route.
2. Preserve existing title/description intent from current `meta()` functions.
3. Add canonical URLs consistently (existing app does this selectively).
4. Implement OG + Twitter defaults in root layout with page overrides.
5. Add JSON-LD:
   - Job detail -> `JobPosting`
   - Company detail -> `Organization`
   - Breadcrumbs where helpful
6. Implement:
   - `src/app/robots.ts`
   - `src/app/sitemap.ts` (and split sitemaps if size grows)
7. Prevent duplicate content:
   - canonicalized query params on filter/pagination pages
   - `noindex,follow` for non-canonical filter combinations if needed

---

## 7) Backend Integration Plan (Using Existing BE Folder)

### API discovery (already mapped)
- `GET /api/company`
- `GET /api/company/details?slug=...`
- `GET /api/company/overview`
- `GET /api/job/details?slug=...`
- `GET /api/filter/domain?slug=...&page=...&employment_type=...&employment_level=...&location=...`
- `GET /api/filter/domain/all`
- `GET /api/feed/home`

### Endpoint classification
- Public read endpoints: all active page data endpoints above.
- XML endpoints for sitemap currently served by backend.

### Server fetch model
- Build a central server fetch utility in Next:
  - passes through cookies
  - forwards auth header if needed
  - standardized timeout + error handling
- Fail closed with `notFound()` on empty detail payloads.
- Fail open with graceful fallback UI for list endpoints.

### Cookie/token forwarding
- Mirror current behavior from `app/api/api.ts`:
  - read cookie from request context
  - forward bearer token when required

---

## 8) Styling and UI Preservation

1. Port `app/app.css` tokens/utilities to `src/app/globals.css`.
2. Keep Tailwind v4 configuration parity.
3. Move components with minimal path change (`~` alias -> `@/` alias).
4. Preserve animation classes and className structure to avoid visual drift.
5. Keep existing design system components (`app/components/ui/*`) intact.

---

## 9) Library Compatibility Audit

### Libraries requiring client-only boundaries
- `framer-motion`
- `mixpanel-browser`
- amplitude browser SDKs
- any direct `window`/`document` usage

### Handling policy
- Wrap browser-only code in Client Components.
- Use `next/dynamic(..., { ssr: false })` only when unavoidable.
- Keep server-safe libs in Server Components to reduce JS shipped.

---

## 10) Performance Optimization Plan

1. Use Server Components for heavy data pages.
2. Convert `<img>` to `next/image` where domain policies allow.
3. Use `next/font` for display/mono fonts to reduce layout shift.
4. Enable fetch caching/revalidation strategically.
5. Run bundle analysis before cutover (identify client JS regressions).
6. Evaluate edge runtime only for lightweight endpoints/middleware.

---

## 11) Vercel Deployment Plan

1. Create new Vercel project for `workway-next` (parallel to current prod).
2. Configure env vars:
   - `NEXT_PUBLIC_SITE_URL`
   - `BACKEND_API_URL` (existing BE origin)
   - analytics ids/secrets as needed
3. Ensure preview deployments for each PR.
4. Use Node runtime for data-heavy routes first; edge selectively.
5. Add rollback safety:
   - keep legacy app active until parity sign-off
   - instant domain switch-back path documented

---

## 12) Testing and Validation Plan

### Functional regression
- For each legacy route, compare:
  - rendered content blocks
  - query filter behavior
  - pagination behavior
  - internal links and 404 behavior

### SEO regression
- Validate page source contains expected title/meta/canonical/OG/Twitter.
- Validate robots and sitemap endpoints.
- Validate structured data via rich results test tooling.

### Performance
- Compare old vs new:
  - LCP
  - CLS
  - INP
  - TTFB
- Compare JS bundle size on route-level basis.

### Hydration validation
- Check for mismatches on all interactive pages with query params.

---

## 13) Incremental Zero-Downtime Migration

### Parallel run
- Keep legacy frontend live while Next.js app ships on preview/protected prod URL.

### Page-by-page migration order
1. `/about`, `/hireme`, `/jobs`
2. `/domains`
3. `/companies`
4. `/company/[companySlug]`
5. `/domain/[domainSlug]`
6. `/job/[jobSlug]`
7. `/` landing page (last, highest visibility)

### Traffic strategy
- Option A: domain-level cutover after full parity.
- Option B: proxy/page-level split (legacy serves non-migrated routes).

### Rollback
- DNS/project alias revert within minutes.
- Keep previous production artifact/version alias available.

---

## 14) Risk Register and Mitigations

### Hydration mismatch risk
- Cause: browser-only code running during SSR render path.
- Mitigation: strict server/client component boundaries + runtime guards.

### Routing/canonical conflicts
- Cause: query-param heavy pages, dynamic slugs.
- Mitigation: canonical policy per route + route parity tests.

### Data contract drift
- Cause: BE payload shape assumptions.
- Mitigation: typed contracts + runtime validation on critical payloads.

### Third-party script impact
- Cause: analytics scripts blocking or duplicate events.
- Mitigation: load via `next/script` strategy and one-time client init guards.

---

## 15) Delivery Phases, Timeline, and Effort

### Phase 1: Foundation (2-3 days)
- Scaffold Next app, providers, global styles, route skeleton, API client.

### Phase 2: Core Page Migration (4-6 days)
- Migrate static and list pages with metadata parity.

### Phase 3: Dynamic SEO Pages (4-6 days)
- Migrate company/domain/job detail pages + structured data.

### Phase 4: Hardening and Cutover (3-4 days)
- Perf + SEO validation, Vercel preview QA, rollout + rollback drills.

### Total estimate
- 13-19 engineering days (single senior IC), excluding major unexpected contract changes.

---

## 16) Decision Checklist

- [ ] Keep App Router (not Pages Router)
- [ ] TypeScript strict mode on
- [ ] Server Components default
- [ ] Canonical strategy approved for filter pages
- [ ] ISR revalidate windows approved
- [ ] Vercel env map validated
- [ ] Rollback runbook approved

---

## 17) Definition of Done

- Route parity achieved for all legacy public routes.
- No user-facing styling/functionality regressions.
- Metadata/canonical/OG/Twitter parity verified.
- Sitemap/robots active and valid.
- Lighthouse + CWV meet agreed thresholds.
- Production cutover completed with rollback path tested.

---

## 18) Launch Readiness Checklist

- [ ] All env vars set in Vercel preview + production
- [ ] Health checks passing
- [ ] 404 and error pages tested
- [ ] Structured data validated on representative pages
- [ ] Crawlability verified (`robots`, sitemap index, canonical)
- [ ] Analytics event parity validated
- [ ] On-call rollback owner assigned
- [ ] Cutover window + communication plan approved

---

## 19) Implementation Status Audit (2026-02-16)

### Implemented
- [x] Route parity for all legacy public routes in `src/app/(site)`.
- [x] SSR for dynamic detail/listing routes (`/companies`, `/company/[slug]`, `/domain/[slug]`, `/job/[slug]`).
- [x] SEO metadata baseline + per-page metadata + canonical handling.
- [x] `robots.txt` and `sitemap.xml` generated in Next app.
- [x] JSON-LD for job/company/domain detail pages.
- [x] Google Analytics + Mixpanel client tracking parity.
- [x] Google Search Console verification token support via metadata verification.
- [x] Sitemap index delegated to backend generator:
  - `/sitemap.xml` rewritten to backend `/api/sitemap.xml`.

### Still Pending / Missed
- [ ] React Query provider parity from old `Provider.tsx` is not wired in `AppProviders`.
- [ ] Legacy third-party tracking validation in real browser session (network/event payload check) is pending.
- [ ] `<img>` -> `next/image` optimization pass is pending (warnings remain).
- [ ] Zero-downtime traffic split/cutover execution is pending (plan exists, rollout not executed).
