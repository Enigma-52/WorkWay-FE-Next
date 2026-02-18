# Homepage Jobs-First Migration Plan (`/` shows jobs feed first)

## Objective
Migrate the current homepage route (`/`) from a landing-first experience to a jobs-first experience, while preserving the existing top header and keeping route/backend contract parity with the current app.

## Scope
- In scope:
  - Route: `/` (`src/app/(site)/page.tsx`)
  - Shared navigation/header behavior from layout/navbar
  - Jobs feed rendering for first-screen + scroll continuation
  - Metadata updates for new homepage intent
  - Reuse and/or replacement strategy for `/jobs` page
- Out of scope:
  - Backend API contract changes
  - Redesign of global header
  - Changes to unrelated legacy repos

## Current State (as-is)
- `src/app/(site)/page.tsx` renders a multi-section marketing landing page (`Hero`, `SocialProof`, `ProblemSection`, etc.).
- `src/app/(site)/jobs/page.tsx` is a "coming soon" placeholder and does not render real job listings.
- Header is globally rendered in `src/app/layout.tsx` through `src/components/layout/Navbar.tsx` and should remain unchanged.
- API client exists in `src/lib/api/server-client.ts` using `backendGet`.
- Relevant contract baseline includes `GET /api/feed/home`.

## Target State (to-be)
- `/` opens directly into a jobs feed view.
- Top header remains exactly as-is.
- Scrolling down the homepage continues through job listings/content blocks related to jobs discovery.
- `/jobs` no longer shows a placeholder; it either:
  - Reuses the same feed implementation as `/`, or
  - Provides a deeper filtered view while sharing the same feed core component.
- SEO metadata on `/` reflects jobs discovery intent.

## Implementation Plan

### Phase 1: Data and contract readiness
1. Confirm `/api/feed/home` response shape from current backend.
2. Add typed response models:
   - `src/lib/api/contracts.ts` for feed response contract
   - `src/types/jobs.ts` for job listing compatibility
3. Add any needed mapping/normalization helpers if backend payload differs from UI model.

### Phase 2: Build reusable jobs feed module
1. Create a reusable jobs feed server-rendered component (new component under `src/components/`).
2. Fetch data with `backendGet` in a Server Component path to keep SSR-first behavior.
3. Build clear states:
   - Loading fallback (if needed)
   - Empty feed state
   - API error/fallback state
4. Reuse existing job card patterns/styles from current job/domain/company components where possible to preserve visual consistency and reduce risk.

### Phase 3: Replace homepage content stack
1. Update `src/app/(site)/page.tsx`:
   - Remove landing-first section stack from top-of-page.
   - Render jobs-first hero/header copy + jobs feed immediately on first paint.
   - Keep layout container spacing consistent with current design system.
2. Ensure scroll behavior reveals continued jobs content without breaking sticky header overlap or spacing.
3. Keep any retained marketing content below jobs only if required for conversion/SEO (not first-screen).

### Phase 4: Align `/jobs` route behavior
1. Update `src/app/(site)/jobs/page.tsx` to remove "coming soon".
2. Reuse the same feed module created for homepage.
3. Decide canonical behavior:
   - Option A: `/` and `/jobs` are equivalent feed pages.
   - Option B: `/` is the main feed and `/jobs` adds advanced filtering/sorting.
4. Keep navigation links intact (`Navbar` already points to both routes).

### Phase 5: SEO and metadata parity/improvement
1. Update homepage metadata in `src/app/(site)/page.tsx` via `buildPageMetadata`.
2. Ensure canonical remains `/`.
3. Ensure OG/Twitter titles/descriptions reflect jobs-first value.
4. Validate robots/index behavior remains correct.

### Phase 6: Functional and quality validation
1. Route checks:
   - `/` shows jobs feed on first load
   - `/jobs` shows real feed (no placeholder)
2. UX checks:
   - Header unchanged and sticky behavior intact
   - Mobile and desktop scroll behavior
   - No visual regressions in spacing/typography
3. Data checks:
   - Feed renders valid jobs
   - Empty/error states work as expected
4. SSR/hydration checks:
   - No hydration mismatch warnings
5. Performance checks:
   - LCP/CLS impact for new above-fold content
   - Verify no unnecessary client-side bundle inflation

### Phase 7: Release and deployment workflow
1. Create implementation commits in small logical chunks.
2. Push branch to GitHub (mandatory primary deployment path).
3. Validate GitHub-connected Vercel deployment status.
4. Verify production `/` health and correct jobs-first behavior after deploy.

## File-Level Execution Checklist
- [ ] `src/app/(site)/page.tsx` migrated to jobs-first homepage
- [ ] `src/app/(site)/jobs/page.tsx` migrated from placeholder to feed
- [ ] `src/lib/api/contracts.ts` updated with feed response typing
- [ ] `src/types/jobs.ts` updated (if shape extensions needed)
- [ ] New reusable feed component(s) added under `src/components/`
- [ ] Metadata copy updated for `/`
- [ ] Basic empty/error states implemented
- [ ] Mobile + desktop UI parity verified

## Acceptance Criteria
- Homepage first paint shows job listings content, not marketing landing sections.
- Header remains unchanged from current implementation.
- Scrolling on homepage continues through jobs content.
- `/jobs` is no longer "coming soon".
- No backend endpoint contract changes required.
- Metadata/canonical for `/` remains valid and aligned to jobs-first intent.
- Deployment goes through GitHub -> Vercel auto deployment and is healthy in production.

## Risks and Mitigations
- Risk: Backend payload mismatch with UI expectations.
  - Mitigation: Add strict typing + mapper layer with safe fallbacks.
- Risk: SSR fetch failures degrade homepage.
  - Mitigation: Handle fetch errors gracefully with fallback content and logging.
- Risk: Layout regressions from replacing hero/landing stack.
  - Mitigation: Reuse existing container classes and test breakpoints early.
- Risk: Duplicate intent between `/` and `/jobs`.
  - Mitigation: Define canonical content strategy before final merge.

## Suggested Delivery Sequence
1. Contracts and feed model typing.
2. Reusable feed component.
3. `/` migration to jobs-first.
4. `/jobs` alignment.
5. Metadata + SEO pass.
6. QA + performance checks.
7. Commit, push, deploy verification.
