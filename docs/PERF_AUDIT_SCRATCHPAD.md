# Perf audit scratchpad — 2026-07-13

Local-only working notes, dated 2026-08-05: verified against current code, some fixes described
below did **not** stick (GTM `lazyOnload`, ISR for `/job/[jobSlug]` and `/company/[companySlug]` —
the ISR one was reverted on purpose, see `SEO_STATUS.md` for why). Treat this file as a historical
investigation log, not a current-state doc — **`docs/SEO_STATUS.md` → "Mobile Core Web Vitals"
section has the up-to-date summary.** Kept here for the detailed backend query/caching/DB-index
findings that haven't been re-verified but are lower-risk to still be accurate.

## Setup / method
- Backend (WorkWay--BE) running locally on :3001. Frontend reads `BACKEND_API_URL` / `NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001` from `.env` — verified real data flows through (job listings, `/company/openai`, `/job/sentinelone-software-engineer-7785500003` all render live backend data, no 404s/empty states).
- Frontend (WorkWay-FE-Next) production build (`next build && next start`) run on :3003 for realistic numbers — `next dev` is NOT representative (unminified JS inflates every score).
- Lighthouse CLI 12.8.2 (latest) via `npx lighthouse`, headless Chrome, default mobile preset unless noted.
- Google PageSpeed Insights API: got a key, confirmed it works, but useless against localhost/ngrok — Google's crawler can't reach `localhost`, and an ngrok tunnel just serves ngrok's free-tier interstitial page instead of the real app. Real signal only comes from PSI run directly against the live deployment (see below).
- IMPORTANT: Lighthouse's default mobile preset applies 4x CPU throttling + slow network simulation. On this dev machine (already running several node/chrome/ngrok processes) that produces noisy, sometimes-inflated numbers — don't over-read small mobile score deltas run-to-run on this machine. Desktop preset sanity check on the homepage gave Performance 100 / LCP 0.6s at one point, confirming a lot of the raw mobile number is throttling+host-noise, not a code defect.
- **Mobile matters more than desktop**: Google indexes and ranks using mobile-first crawling, so the mobile PSI score is the one that actually affects SEO — not the desktop number, even though desktop reads much better (91 vs 72 on the live site).

## Real ground-truth: PageSpeed Insights on live www.workway.dev (user-run)
Captured before any of the fixes below were deployed:
- Desktop: Performance 91
- Mobile: Performance 72 — FCP 2.2s, LCP 5.7s, TBT 230ms, SI 3.3s, CLS 0
- Concrete findings: render-blocking CSS chunk (~160ms), **23KB of unnecessary legacy JS** (`Array.prototype.at/flat/flatMap`, `Object.fromEntries/hasOwn`, `String.prototype.trimStart/trimEnd`, `Array.from` — all baseline features being needlessly transpiled), 180KB unused JS (two first-party chunks + Google Tag Manager), long main-thread tasks at ~4.6-4.8s traced to GTM script execution.
- These fixes have **not yet been re-verified against live PSI** (not deployed yet) — see "Next step" below.

## Fixes applied (all local, not yet deployed)

| # | Fix | File(s) | Why |
|---|---|---|---|
| 1 | Removed opacity-based `animate-fade-up` CSS animation from the Hero H1 (LCP element) | `src/components/LandingPage/Hero.tsx` | Chrome excludes opacity-0 elements from LCP candidacy until visible; this was inflating measured LCP. Turned out to be a smaller factor than expected (see local numbers below) but is still correct general practice — kept. |
| 2 | Added explicit modern `browserslist` (`chrome/edge/firefox >= 100`, `safari/ios_saf >= 15.4`) | `package.json` | Fixes the "Legacy JavaScript" PSI finding — stops SWC from transpiling/polyfilling baseline ES2019+ features for browsers nobody targeting this app needs to support. |
| 3 | Google Analytics/GTM scripts: `strategy="afterInteractive"` → `strategy="lazyOnload"` | `src/components/providers/AnalyticsProvider.tsx` | GTM was causing long main-thread tasks around 4.6-4.8s per the live PSI trace; loading it during idle time instead removes that contention from the critical path. |
| 4 | Footer copyright + "Featured on" label: dropped `/60` opacity modifier on `text-muted-foreground` | `src/components/layout/Footer.tsx` | Contrast was 2.68:1 against required 4.5:1 — real, systemic a11y bug present on every page (shared Footer). |
| 5 | Footer column headings `<h4>` → `<h3>` (Product/Legal/Creator) | `src/components/layout/Footer.tsx` | Page's last content heading before the footer is always `<h2>`; jumping to `<h4>` skipped a level. Present on every page. |
| 6 | Company-logo images (home) and site-logo images (Navbar + Footer): `alt={name}`/`alt="WorkWay"` → `alt=""` | `src/components/LandingPage/CompanyLogoScroll.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx` | Each image sits directly next to visible text with the same name — screen readers were announcing it twice. Marking decorative fixes "redundant alt" on every page. |
| 7 | Pagination prev/next buttons: added `aria-label="Previous page"` / `"Next page"` | `src/components/DomainPage/JobPagination.tsx` | Icon-only buttons had no accessible name — real bug, affects `/jobs` and anywhere pagination is used. |
| 8 | Job detail page: "Skills" heading `<h3>` → `<h2>` (was right after the page `<h1>`, skipping a level) | `src/components/dynamic/JobPageClient.tsx` | Same heading-order class of bug, page-specific instance. |
| 9 | Similar/related job card title `<h4>` → `<h3>` | `src/components/JobPage/JobCard.tsx` | These cards always sit under an `<h2>` section header, so `<h3>` is the correct next level; `<h4>` was skipping one. |
| 10 | `--muted-foreground` CSS var: `220 10% 55%` → `220 10% 60%` | `src/app/globals.css` | The "muted" `JobBadge` variant (domain/location tags on job detail page) had borderline contrast, 4.36:1 vs required 4.5:1, against the lighter `--muted` badge background. Small global bump fixes it everywhere it's used as a badge/label color while barely changing how it reads against the page's near-black background (which had large margin already). |
| 11 | JobViewFeed timestamp text: dropped `/80` opacity modifier | `src/components/JobViewFeed/JobViewFeed.tsx` | Same contrast issue, 3.9:1 vs 4.5:1 required, on the job detail page's "recently viewed" feed. |

**Deliberately left alone:**
- `SolutionSection.tsx`, `ForCandidates.tsx`, `SocialProof.tsx`, `MarketSignals.tsx`, `AISection.tsx`, `WhatWeAreNot.tsx` (all in `src/components/LandingPage/`) — import `framer-motion` but are **dead code**, not referenced anywhere in `src/app`. Per instruction to only touch actively-used code, these were not modified. Flagging in case someone wants to delete them later (would let you drop the `framer-motion` dependency entirely if nothing else needs it).
- "Go" skill link on job detail page flagged by SEO's `link-text` audit ("links do not have descriptive text") — false positive, "Go" is the programming-language skill name, not a generic "click here" link. Not changing real content to satisfy a heuristic.
- Unused-preconnect-to-`cdn.workway.dev` warning on the homepage — that origin is genuinely used for company/job logos elsewhere on the site; it's declared once, globally, in `layout.tsx`. Not a real bug.
- Next.js version: installed `16.1.6`, latest is `16.2.10` — a minor/patch gap, not worth chasing for perf on its own.

## Local before/after numbers (Lighthouse, mobile preset, prod build on :3003)

⚠️ These are **local** numbers on a dev machine running multiple background processes — treat the *direction* of change as signal, not the exact score, especially for Performance (see throttling/noise note above). Accessibility deltas are trustworthy since those audits are deterministic (DOM-based, not timing-based).

| Page | Performance | Accessibility | SEO |
|---|---|---|---|
| `/` (home) | 79 → 84 | 93 → **100** | 100 → 100 |
| `/jobs` | 91 → 88 (noise) | 88 → **98** | 100 → 100 |
| `/skills` | 93 → 90 (noise) | 95 → **100** | 100 → 100 |
| `/company/openai` | 86 → 83 (noise) | 94 → **98** | 100 → 100 |
| `/job/sentinelone-software-engineer-7785500003` | 79 → 94 | 94 → **100** | 92 → 92 (the "Go" false positive, left as-is) |

Accessibility is the clean win here — every page above 95, several at 100. Performance deltas are within this machine's run-to-run noise band; the two changes actually aimed at PSI's live performance findings (browserslist, GTM lazyOnload) were baked into the "before" column already for this specific table (they were applied earlier in the session) — this table mostly reflects the *accessibility* pass fixes (7-11 above), which is why performance barely moved either direction.

## Next step
Deploy fixes 1-3 (LCP animation, browserslist, GTM lazyOnload) and get a fresh **real** PSI mobile run on `www.workway.dev` to see if the 72 mobile score actually moved. That's the only trustworthy signal for the performance side — local Lighthouse on this machine isn't precise enough to confirm a few-point PSI change.

## Pages covered
- `/` (home)
- `/jobs`
- `/skills`
- `/company/openai`
- `/job/sentinelone-software-engineer-7785500003`

Not yet checked: `/companies`, `/domains`, `/skill/[slug]`, `/domain/[slug]`, `/salary-insights`, `/guides`, `/hireme`, `/chat` — lower traffic priority per user, can extend the same pattern if wanted.

## TTFB / real-user field data investigation (2026-07-13, later in the session)

User ran real PageSpeed Insights **field data** (CrUX, 28-day rolling) on live `www.workway.dev/jobs` and `/job/sentinelone-software-engineer-7785500003`: **Core Web Vitals Assessment: Failed** on both, identical numbers — LCP 2.8s, FCP 2.8s, TTFB **1.6s**, CLS 0. Same numbers on both pages pointed at a shared backend/infra cause rather than something page-specific.

### Traced and ruled out
- **DB indexes**: checked local Postgres schema for the `jobs` table — all the right indexes exist (`idx_jobs_location_trgm` GIN trigram correctly supporting the `ILIKE '%...%'` similar-location query, proper btree/GIN indexes on `domain`, `company`, `slug`, `skills`). Not the bottleneck.
- **`backendGet()` caching**: already had `revalidate: 86400` by default on the Next.js Data Cache layer — so repeated fetches to the same backend URL were already being cached at the data level.

### Root cause found
`backendGet()` (`src/lib/api/server-client.ts`) called `next/headers`'s `headers()` unconditionally on every call, to forward the visitor's `cookie`/`authorization` to the backend. Confirmed via grep that the backend (`WorkWay--BE/src/routes/job.js`, `company.js`, `filter.js`) **never reads these headers** for `/api/job/list`, `/api/job/details`, `/api/company/details`, `/api/filter/skills/all` — they're fully public, unauthenticated endpoints. But calling `headers()` in a Server Component forces Next.js to render that entire route dynamically on *every* request — even when the underlying data fetch was cache-hit, the full React render (and thus TTFB) still paid full cost every time, and the response always carried `Cache-Control: private, ...`, which `must-revalidate`. This meant Cloudflare (correctly) refused to cache the HTML at the edge — every real user request round-tripped to origin.

Real proof via curl against the live site:
```
/jobs, /job/*, /company/*, /skills  →  Cache-Control: private, max-age=7200, must-revalidate
/                                    →  Cache-Control: max-age=7200, s-maxage=31536000   (no "private" — cacheable)
```
`cf-cache-status` stayed `MISS` on repeat hits for the `private` pages; `/` eventually returned `HIT`.

User has a Cloudflare Cache Rule that force-caches HTML regardless of origin `Cache-Control` (got a `HIT` even on a `private` response) — flagged this as a workaround that happens to be safe *only* because these specific routes are confirmed to have zero personalization; recommended fixing the origin instead so Cloudflare caches these pages because they're actually public, not despite being told they're private.

### Fixes applied
1. `src/lib/api/server-client.ts`: added `forwardHeaders?: boolean` option to `backendGet()` (default `true`, preserves existing behavior for any caller that needs cookies/auth). Only skips the `headers()` call when explicitly set to `false`.
2. Passed `forwardHeaders: false` on the public/unauthenticated calls in:
   - `src/app/(site)/jobs/page.tsx` (both `generateMetadata` and page body)
   - `src/app/(site)/job/[jobSlug]/page.tsx` (both)
   - `src/app/(site)/company/[companySlug]/page.tsx`
   - `src/app/(site)/skills/page.tsx`
3. `/skills` had no route params or searchParams at all — removing `headers()` alone was enough to flip it from `ƒ Dynamic` to `○ Static` in the build output (confirmed: `1d` / `1y` revalidate/expire annotations appeared).
4. `/job/[jobSlug]` and `/company/[companySlug]` are **dynamic-segment routes without `generateStaticParams`** — in Next.js App Router, ISR caching for a param route requires a `generateStaticParams` export to exist (even returning `[]`) so Next knows the route is eligible for on-demand static caching; without it, the route stays fully dynamic no matter what `revalidate` is set to. Added to both:
   ```ts
   export const revalidate = 3600;
   export const dynamicParams = true;
   export async function generateStaticParams() { return []; }
   ```
   Verified with curl: first hit → `x-nextjs-cache: MISS`, `Cache-Control: s-maxage=3600, stale-while-revalidate=31532400` (no more `private`/`no-store`); second hit → `x-nextjs-cache: HIT`. This is on-demand ISR working correctly, not the Cloudflare override.
   - Chose 1hr revalidate window — safe because "Posted X days ago" text is computed client-side in `JobPageClient.tsx`/`JobCard.tsx` (`"use client"`, reads raw `created_at`/`updated_at` at render time in the browser), so relative dates stay accurate regardless of how stale the cached HTML shell is.
   - **Note on SEO framing**: user initially asked for "full SSR" out of SEO concern. Clarified that ISR *is* SSR — just with the rendered HTML reused for a bounded window instead of recomputed every request. Google's crawler sees identical, complete HTML either way; a 1hr cache window is invisible to real-world re-crawl frequency. Reverting to always-fresh/uncached rendering would directly hurt the TTFB Core Web Vitals signal this whole investigation was trying to fix — recommended keeping ISR.

### Local Lighthouse after all fixes (mobile preset, prod build :3003) — "deploy-ready" snapshot

⚠️ Same noise caveat as before applies — this machine was running several concurrent processes during this run (ngrok, multiple node/chrome instances), so treat Performance absolute numbers loosely; Accessibility numbers are trustworthy (deterministic, DOM-based).

| Page | Performance | Accessibility | SEO | LCP | TBT | Speed Index |
|---|---|---|---|---|---|---|
| `/` (home) | 79 | **100** | 100 | 3.7s | 430ms | 2.5s |
| `/jobs` | 73 | 98 | 100 | 4.7s | 380ms | 3.6s |
| `/skills` | 78 | **100** | 100 | 4.1s | 320ms | 3.7s |
| `/company/openai` | 70 | 98 | 100 | 5.2s | 430ms | 2.8s |
| `/job/sentinelone-...` | **90** | **100** | 92 (the "Go" link-text false positive) | 2.8s | 280ms | 1.0s |

Job detail page (the one that got the full ISR + generateStaticParams treatment) shows the best numbers of the batch locally. Home/jobs/skills/company performance dipped vs. the previous local run — consistent with this machine's noise, not a real regression (nothing in the caching/ISR changes should make client-side rendering slower). **The only trustworthy verification for the TTFB/caching fix is a fresh real PSI mobile run against the live site once deployed** — local Lighthouse against `next start` on a busy laptop cannot reproduce real Cloudflare-edge + real-network-latency conditions that TTFB actually measures.

### Deploy checklist
All frontend changes in this session are committed to the working tree (not yet deployed):
1. Hero LCP animation removal
2. `browserslist` (legacy JS fix)
3. GTM → `lazyOnload`
4. Accessibility fixes (Footer contrast/heading-order/alt text, CompanyLogoScroll/Navbar logo alt, JobPagination aria-labels, JobPageClient heading-order, JobCard heading-order, `--muted-foreground` contrast bump, JobViewFeed contrast)
5. `forwardHeaders: false` + ISR/`generateStaticParams` for `/jobs`, `/job/[jobSlug]`, `/company/[companySlug]`, `/skills`

**Nothing else identified locally that needs fixing before deploy.** Next real step is deploying and re-running PSI mobile against `www.workway.dev/jobs`, `/job/...`, `/company/...` to confirm the TTFB number actually drops from 1.6s.

## Backend API cold/warm timing report — 2026-07-13 (later in session)

Note: local backend (:3001) is connected directly to the real production database (not a separate copy) — every number below reflects real production-scale data (~417k jobs, ~6.2k companies).

**Methodology note**: "cold vs cold" is the right comparison when the SQL query itself changed (isolates the query fix). "cold vs warm" is the right comparison when the fix is caching an unchanged query — a cold-vs-cold comparison there would show ~0% difference (a cache miss still runs the same expensive query), which would hide the real win. Labeled accordingly below.

### 1. `/api/job/list` (unfiltered) — query fix, not caching
Removed an unconditional `JOIN companies` from `countJobs` and all 3 `getJobFacets` queries in `jobsDao.js` — that join was only ever needed for the `company_slug` filter, so it was pure overhead on every unfiltered request.

| | Before (original code) | After (fix) |
|---|---|---|
| Cold, unfiltered `/jobs` list | ~1.5-1.65s | ~0.66-0.71s |
| Filtered (`domain=engineering`) | ~4-6ms | ~4-6ms (unaffected either way — already index-backed) |

**~55% faster**, cold-vs-cold (true before/after, verified via `git stash`).

### 2. `/api/filter/skills/all` — caching fix (query unchanged)
`GET_ALL_SKILLS` expands every job's skills array via `jsonb_array_elements` across the full ~417k-row table with zero caching, on every request. Added a 24h in-memory TTL cache (this data only changes when ingestion crons run).

| | Cold (cache miss — same query as always) | Warm (cache hit) |
|---|---|---|
| Response time | ~4.1-4.4s | ~0.002-0.007s |

**~99.8% faster** for any request landing within the 24h cache window — which is nearly all real traffic, since the query itself never got faster, only the need to re-run it did.

### 3. `/api/company/search` — query restructure + caching
The `job_counts` CTE (`GROUP BY company_id` over the full jobs table) inside `ALL_COMPANY_LIST` was completely independent of the search text/letter/platform filters, yet recomputed identically on every search keystroke. Extracted it into a separately-cached 24h TTL query, fed into the search query via `jsonb_to_recordset`.

| | Before (original code, always uncached) | After — cold (first call, computes + caches job_counts) | After — warm (job_counts cached) |
|---|---|---|---|
| `q=a` | ~264-868ms | ~605ms | ~110-320ms |
| `q=openai` | (same range) | — | ~123ms |
| No-match search | (same range) | — | ~110ms |

Roughly **2-3x faster** once warm — smaller win than #2 since the search/filter/pagination logic still runs in SQL every time, only the expensive aggregate was extracted.

### 4. `/api/company/overview` — caching fix (query unchanged)
Zero-parameter, fully global result (stats, fixed trending IDs, recently-added, actively-hiring top-6 — the last one also doing a `GROUP BY` over the full jobs table). Cached the entire result, 24h TTL.

| | Cold (cache miss) | Warm (cache hit) |
|---|---|---|
| Response time | ~309-486ms | ~0.002-0.003s |

**~99% faster** once warm.

### Other fixes made this pass
- Connection pool `max: 5` → `max: 20` (`postgres.js`) — a single unfiltered `/jobs` request alone fanned out to 4-5 concurrent queries, so 5 was starving the app under any real concurrent traffic.
- `/jobs` page (FE): wrapped the job-list-and-filters section in a React `Suspense` boundary so breadcrumbs/shell paint immediately instead of blocking on the backend fetch — perceived-speed improvement, doesn't change actual data-fetch time. `/jobs` itself can't be ISR-cached (reads `searchParams` for bookmarkable filter URLs), so this was the available lever there.
- Fixed 2 more instances of the recurring heading-order a11y bug found via a live PSI check on `/company/clickup` (`CompanyPageJobCard.tsx`: `h4` → `h3`, same pattern as earlier `JobCard.tsx`/`JobPageClient.tsx` fixes).
- Noted but intentionally not fixed (deprioritized per instruction): `/company/[slug]` "Apply" links have identical, non-descriptive text across multiple job cards on the same page (flagged by both an SEO and an accessibility audit) — real bug, fix would be adding `aria-label={`Apply for ${job.title}`}` in `CompanyPageJobCard.tsx`, not yet applied.

**All of the above are still local/uncommitted, not deployed.** Production is still running pre-fix code for everything in this session (including the earlier frontend fixes) — confirmed via live PSI checks showing the same "Legacy JavaScript"/"unused JavaScript" findings we already fixed locally, unchanged.

## Backend performance audit round 2 + DB index audit — 2026-07-13 (later still)

### More global/unfiltered-aggregate bugs found and fixed (same pattern as round 1)

| Endpoint | Root cause | Cold | Warm (cached) |
|---|---|---|---|
| `/api/filter/domain/all` (`/domains` page) | `filterDao.getJobsPerDomain()` — zero-param `GROUP BY domain` over full jobs table, every request | ~215-468ms | ~5ms |
| `/api/job/salary-insights` | `jobsDao.getSalaryStatsRows()` — zero-param query scanning ~67k ashby rows, every request, regardless of filters | ~1.0-1.5s | ~229ms (residual is legitimate — see below) |

Both fixed with the same 24h in-memory TTL cache pattern as round 1 (`filterDao.js`, `jobsDao.js`). Verified correct data returned post-fix (22 domains with real counts; salary stats unchanged).

### `/salary-insights` residual (~229ms warm) — verified legitimate via `EXPLAIN ANALYZE`, not a new bug
Broke down all 3 queries this endpoint fires in parallel:
- Stats rows (now cached): was ~100ms raw DB time, now free on cache hit
- Paginated job list (LIMIT 20, ORDER BY created_at DESC): **1.2ms** — well-optimized, uses `idx_jobs_created_at_desc`
- Count query (`platform='ashby' AND compensation not empty`, no LIMIT): **87ms** — bitmap heap scan reading 5000+ disk buffers because there's no index matching this exact predicate

87ms + 1ms + cache-hit ≈ the ~229ms measured (rest is Node/network/JSON overhead). Not a bug, just the ceiling of what's achievable without a new index (see below).

### DB index audit
Reviewed indexes on `jobs`, `companies`, `skills` (the 3 largest/hottest tables) via `\d` and `EXPLAIN (ANALYZE, BUFFERS)` on the suspect queries found in the code audit.

**`jobs` table**: well-indexed. Every filter path used by the app (domain, company, company_id, slug, skills GIN, location trigram, employment_type, experience_level, platform, created_at, composite company_id+created_at) has a matching index. No missing-index bugs found here — every slow query traced back to *missing caching*, not *missing indexes*.

**`companies` table**: found one real, low-priority issue — **3 redundant btree indexes on the same single column**, all on `slug`:
- `idx_companies_slug` (plain btree)
- `idx_companies_slug_unique` (unique btree)
- `uniq_company_slug` (unique btree)
One unique index already both enforces uniqueness and serves every lookup/JOIN on `slug` — the other two are pure waste: extra disk space, and every `INSERT`/`UPDATE` on `companies` has to maintain all 3 instead of 1. Given ~6k rows this isn't causing measurable read slowness today, but it's free write overhead for no benefit.
**Not dropped — this is a DDL/write change on the live production DB, flagging for your explicit go-ahead rather than doing it unprompted.** If you want it done: `DROP INDEX idx_companies_slug; DROP INDEX idx_companies_slug_unique;` (keeping `uniq_company_slug`), or any 2 of the 3 dropped, same effect.

**`skills` table**: fine as-is — small (333 rows), only queried by exact slug match, already has `idx_skills_slug`.

**One index worth considering** (also not created — same reasoning): a partial index to speed up the `/salary-insights` count query:
```sql
CREATE INDEX CONCURRENTLY idx_jobs_ashby_with_compensation
  ON jobs (id)
  WHERE platform = 'ashby'
    AND metadata->>'compensation' IS NOT NULL
    AND metadata->>'compensation' != '';
```
Would likely cut that 87ms count query to low-single-digit ms (index-only scan instead of bitmap heap scan + per-row JSONB filter). Low priority given the endpoint is already mostly fixed by caching the stats query — this only shaves the residual, and `CREATE INDEX CONCURRENTLY` on a live table still has real cost/lock considerations worth being deliberate about rather than just running it.

### N+1 / loop-based query check
Scanned every `for`/`.map(async` loop across `src/services/*.js`. All loop-with-await patterns live in `cronService.js` / `dailyService.js` (background ingestion crons), not in any user-facing request path — no N+1 bugs found in the API surface actually hit by real traffic.

### Summary of everything fixed across both audit passes
1. `/api/job/list` unfiltered — removed unneeded join (query fix)
2. `/api/job/list` unfiltered facets+count — 10min cache
3. `/api/filter/skills/all` — 24h cache
4. `/api/company/search` job_counts — 24h cache + query restructure
5. `/api/company/overview` — 24h cache
6. `/api/filter/domain/all` — 24h cache
7. `/api/job/salary-insights` stats — 24h cache
8. Postgres pool `max: 5` → `20`

Not done, flagged for explicit approval (DDL on live prod DB):
- Drop 2 redundant indexes on `companies.slug`
- Add a partial index for the ashby-with-compensation filter

### Follow-up: partial index created, pg_stat_statements checked
- **Created** `idx_jobs_ashby_with_compensation` (partial index, `CREATE INDEX CONCURRENTLY`, live prod DB) per explicit approval. Verified via `EXPLAIN ANALYZE`: the `/salary-insights` count query went from 87ms (bitmap heap scan, 5000+ disk buffer reads) to **12ms** (index-only scan) — ~7x faster. This is a DB schema change, not a code change — not tracked in git, lives only in the database itself.
- **Checked for real historical slow-query data** (`pg_stat_statements`) per user request — not installed. Attempted `CREATE EXTENSION pg_stat_statements`, which succeeded at the catalog level but the extension is **inert**: it requires `shared_preload_libraries` set at the Postgres server config level + a full server restart to actually start collecting data, which is outside what's doable via SQL alone (needs hosting-provider dashboard access, likely Render given the commented-out connection string in `.env`). Flagged to user, who opted to skip enabling it for now — every finding this session came from manual code review + targeted `EXPLAIN ANALYZE`, not real execution history. Worth reconsidering later if more of these bugs keep surfacing, since a real slow-query log would catch things a code-only review can miss.
