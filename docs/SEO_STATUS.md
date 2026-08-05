# SEO Status (as of 2026-08-05)

Replaces the old `SEO_UPGRADE.md`, `INTERNAL_LINKING_STRATEGY.md`, `LOCATION_SEO_PAGES.md`, and
`BREADCRUMBS_AND_RICH_RESULTS.md` — those described one-time implementation plans that have since
shipped. This doc tracks current state, not a build plan.

## Root cause of the index drop

- GSC went from ~150k indexed pages to ~600 (`site:workway.dev` shows ~6, but that operator is
  unreliable for real counts — use GSC's Pages report instead).
- No manual action, no security issue in GSC.
- Timing lines up with Google's **May 21 – June 1, 2026 core update**. Most likely cause:
  Google's "scaled content abuse" pattern — a domain publishing ~465k pages that mostly reformat
  content already indexed elsewhere (job descriptions copied near-verbatim from the source ATS).
- Confirmed directly: WorkWay's `JobPosting.description` for a sampled job is **99.6% identical**
  (8-gram overlap) to the original Greenhouse posting text. Full-page overlap (including nav,
  related-jobs, sidebar) is lower — 53.5% after today's fixes, down from 55.3% — but the
  information-dense core of the page is still a near-total copy.
- Recovery from a core-update demotion has no direct technical fix and isn't guaranteed on any
  timeline — it depends on Google's next reassessment of overall site quality, not a specific
  page-level change.

## Fixed today

1. **`/jobs` and `/companies` pagination now uses real `<a href>` links** (previously
   `<button onClick={...}>`, invisible to crawlers, no `rel=next/prev`, no discoverable path past
   page 1). Same fix applied to `/salary-insights`, `/domain/[slug]`, `/skill/[slug]`,
   `/[locationSeoSlug]` (role+location combo pages), and the plain `/location-only` variant.
   Components: `DomainPage/JobPagination.tsx`, `CompaniesPage/Pagination.tsx`.
2. **Related-job cards were not crawlable at all.** `JobPage/JobCard.tsx` (used for the
   similar-domain / same-company / same-location / same-skill sections on every job detail page)
   wrapped the whole card in `<div onClick={() => router.push(...)}>` — worked for mouse clicks,
   invisible to Googlebot. Fixed with a "stretched link" pattern (real `<Link>` positioned behind
   the card, nested interactive elements like the skill tags and save button raised above it with
   z-index) to avoid nesting `<a>` inside `<a>`. Verified before/after: 0 → 11 real `<a href="/job/...">`
   links in the server-rendered HTML for a sampled job page.
3. **Job detail pages now surface real, existing data instead of just the raw description**, via
   `JobInsights` (`src/types/jobs.ts`) fetched in `app/(site)/job/[jobSlug]/page.tsx`:
   - "Open roles at {company}" sidebar row (`/api/company?q=...`)
   - "Avg. salary ({level or domain})" sidebar row for non-YC jobs (`/api/job/salary-insights`,
     `by_experience_level` / `by_domain`)
   - A short trust/aggregation sentence above the description ("This is one of N open roles
     WorkWay tracks directly from X's Y careers page, refreshed daily...")
   - All reused from endpoints that already existed — no new data collection, no AI cost.

## Confirmed healthy, no action needed

- Metadata layer (title/meta description/canonical/H1) is clean and unique across every page type
  audited: home, jobs, job detail, companies, company detail, domains, domain detail, skills,
  skill detail, salary-insights, location hubs, guides, about.
- All `JobPosting` / `ItemList` / `FAQPage` / `Dataset` / `BreadcrumbList` JSON-LD parses and is
  well-typed — zero malformed schema found.
- Guides (`/guides/workway-vs-*`) are genuinely differentiated content (~9,900 chars each, ~11%
  6-gram overlap between two sampled guides) — not part of the duplicate-content problem.
- Company pages have real per-company description text, not templated.
- `/salary-insights` has real aggregate stats, not templated.
- `sitemap.xml` structure (index + per-type sub-sitemaps) is sound. `robots.txt` correctly allows
  Googlebot (only blocks AI-training crawlers, which doesn't affect search indexing).

## Open issues (not yet fixed)

1. **Job description duplicate-content problem, at scale.** The 99.6%-verbatim-copy finding is
   unaddressed for the ~465k catalog. Today's fact-sidebar addition helps but is small relative to
   the raw description length. Real fix requires either (a) noindex-ing the long tail of thin/generic
   postings and being deliberate about a smaller, higher-quality indexed subset (see RemoteYeah
   comparison below), and/or (b) more substantive per-page differentiation than what shipped today.
2. **`jobs.xml` sitemap was reduced to a single 50k-URL file capped by recency** to fight crawl-budget
   waste on stale listings. Wrong lever — sitemap inclusion should be filtered by **job status**
   (active vs closed), not recency, and chunked across multiple 50k-max files via the existing
   sitemap-index pattern to cover all active jobs, however many that is. Not yet reverted/rebuilt.
3. **No daily job-closure sync.** Closed jobs should get `noindex` + HTTP 410 immediately and drop
   from the sitemap same-cycle. Currently nothing marks a job closed until/unless a human notices.
   This is the actual fix for the crawl-budget concern that motivated the sitemap change in #2.
4. **Domain and skill hub pages** (`/domain/[slug]`, `/skill/[slug]`) have near-identical templated
   intro copy: `"Browse latest {X} roles across top companies. {N} open positions. Updated daily."`
   Same issue on both page types. The `FAQPage` block underneath each is good (real per-page facts)
   but the primary visible body copy is boilerplate.
5. **Internal duplicate postings found in the raw sitemap sample**: 5 URLs all titled "Wrike Senior
   CloudOps Engineer (Databases)" differing only by trailing numeric ID. Not yet deduped.
6. **Strategic question, undecided**: RemoteYeah's total catalog is ~19k URLs (9,672 jobs + 8,625
   companies + 749 tags + 20 pages + 19 salary pages) — ~25x smaller than WorkWay's ~472k. Their
   job pages present raw description content restructured into a labeled fact sheet (job
   type/experience/salary/skills/location/benefits as distinct fields, salary shown as "-" when
   unknown rather than fabricated) rather than narrative text. WorkWay is trying to index a much
   larger, lower-differentiation catalog than a comparable competitor — worth deciding whether to
   deliberately shrink the indexed footprint (noindex the long tail) rather than keep chasing full
   catalog indexation.
7. **Domain authority gap confirmed (Ahrefs, checked manually — no API access in this
   environment to pull automatically):**
   - remoteyeah.com: **DR 40**, 2,400 backlinks, 510 referring domains
   - workway.dev: **DR 11**, 400 backlinks
   - This is a real, meaningful gap, separate from the catalog-size and content-duplication
     issues. A DR 11 domain gets less crawl trust/budget from Google to begin with, which
     compounds with the other issues rather than being explained by them. Both sites' footers
     link out to the same set of indie launch/directory badges (dang.ai, findly.tools, fazier.com,
     frogdr.com) — so that's not the differentiator; RemoteYeah's backlinks are coming from
     somewhere with more real weight. Backlink-building (topically-relevant directories,
     guides content pitched externally, organic launch mentions) should be treated as a real
     third lever alongside content differentiation and the catalog-size/noindex strategy, not
     a nice-to-have.
8. Canonical URLs resolve to `http://localhost:3002` in local dev (expected) — confirm the prod
   env var driving canonical generation is actually `https://www.workway.dev` before the next
   deploy.

## Mobile Core Web Vitals (separate from indexing, still affects mobile-first ranking)

Found via an untracked local scratchpad (`PERF_AUDIT_SCRATCHPAD.md`, dated 2026-07-13, since
folded in here) plus a fresh header check against live prod today (2026-08-05):

- **Root cause, confirmed still live today**: `backendGet()` in `src/lib/api/server-client.ts`
  calls `next/headers`'s `headers()` unconditionally to forward cookies/auth — even on fully
  public, unauthenticated endpoints. Reading `headers()` forces the whole route to render
  dynamically on every request and stamps the response `Cache-Control: private, must-revalidate`,
  which Cloudflare correctly refuses to edge-cache.
  - Verified via direct header check on live prod just now: `/jobs`, `/job/[slug]`,
    `/company/[slug]` still return `private, must-revalidate` + `cf-cache-status: MISS`.
    `/` and `/skills` are correctly cached (`HIT`, no `private`) — those are fine.
  - A `forwardHeaders: false` option already exists on `backendGet()` and is used by some public
    calls (including the new job-insights fetch added today) — but `/jobs`, `/job/[jobSlug]`, and
    `/company/[companySlug]` don't currently benefit from real caching regardless, because...
- **The ISR fix (`generateStaticParams` + `revalidate`) for `/job/[jobSlug]` and
  `/company/[companySlug]` was tried and reverted** — see the comment at the top of
  `job/[jobSlug]/page.tsx`: it wrote a permanent cache segment file per job slug, which grew to
  **2.85M files / 56.7GiB on disk** on the self-hosted deployment. Both routes are back to
  `export const dynamic = "force-dynamic"`. This is a real constraint, not an oversight — any fix
  here needs a caching strategy that doesn't scale a file-per-slug on an ever-growing, high-
  cardinality route (e.g., cache at a layer that doesn't write per-param disk files, or a bounded
  LRU/short-TTL cache instead of Next's on-disk ISR segment cache).
- **GTM script loading**: scratchpad claims `strategy="lazyOnload"` was applied to reduce main-
  thread contention; current code (`AnalyticsProvider.tsx`) still shows `strategy="afterInteractive"`
  — that fix did not stick or was reverted.
- Scratchpad's original live PSI mobile reading (pre-fix, 2026-07-13): **Performance 72**, LCP
  5.7s, TTFB 1.6s, **Core Web Vitals Assessment: Failed** (this is CrUX real-user field data, the
  trustworthy kind).
- I ran Lighthouse mobile against live `/jobs` today for a fresh read — got implausible numbers
  (Performance 33, TBT 11.2s) that contradicted a simple raw TTFB check (~90-100ms, 5 runs). This
  mismatch means the Lighthouse run itself is unreliable from this environment (likely CPU/network-
  constrained sandbox, same class of problem the scratchpad flagged on its own dev machine) — not
  discarded as fixed, just not a number to trust. **Get a real PSI mobile run against
  `www.workway.dev/jobs` directly (google PageSpeed Insights, ~30s, no signup) for the actual
  current number** — same recommendation pattern as the DR check.
- Not verified either way today: accessibility fixes (Footer contrast/heading-order/alt text),
  backend query/caching fixes (`jobsDao.js`, `filterDao.js`, connection pool size), DB index
  changes (partial index add, redundant index cleanup) — lower risk of having been reverted since
  none of them share the ISR-specific disk-blowup failure mode, but not spot-checked.

## Not investigated / lower priority

- `/hireme` currently just `redirect()`s to `/dashboard/seeker/talent-profile` with no metadata of
  its own — fine since it's a redirect, but if it's meant to be a public marketing/landing page
  rather than purely a redirect, that's a product decision, not a bug.
- Ads / third-party monetization: deferred, current real (non-bot-inflated) traffic is too low to
  be worth the integration effort right now.
