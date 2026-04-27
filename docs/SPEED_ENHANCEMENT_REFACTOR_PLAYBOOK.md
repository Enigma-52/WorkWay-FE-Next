# Speed Enhancement Refactor Playbook (WorkWay)

Last updated: April 21, 2026

## Why this exists

This doc converts the "no AI slop / no vibe coding" performance ideas into a practical WorkWay refactor plan.
Goal: make WorkWay feel instant, keep data fresh, and reduce client cost without rewriting everything at once.

## Success criteria (target)

1. Route transition perceived as instant on cache hits (<100ms to meaningful paint).
2. P75 mobile LCP on key pages under 2.5s.
3. P75 mobile INP under 200ms.
4. CLS under 0.05 on jobs list + job details pages.
5. Main JS bundle budget: keep each critical route under 130KB gzipped (stretch goal: ~114KB).
6. No stale-critical data regressions (prices/signals/chat state rules explicitly defined).

## Baseline first (do this before refactor)

Measure current performance and save snapshots:

- Lighthouse mobile for:
  - `/`
  - `/jobs`
  - `/job/[slug]`
  - `/chat`
- Bundle analysis (`next build` + analyzer) by route.
- Web Vitals capture (LCP, INP, CLS, TTFB) in production telemetry.
- API latency + cache hit ratio dashboard (server + client).

Do not optimize blind; compare every phase to this baseline.

## Work streams and implementation plan

## 1) Caching architecture (freshness + speed)

### 1.1 HTTP cache tiers

Adopt endpoint-level cache headers:

- Hot/churn-heavy endpoints: `max-age=30, stale-while-revalidate=30`
- Normal dynamic lists: `max-age=300, stale-while-revalidate=600`
- Mostly static metadata: `max-age=86400, stale-while-revalidate=604800`

Notes:
- Keep truly user-specific/private endpoints as `private, no-store`.
- Define this in one shared policy map so TTLs are intentional, not ad-hoc.

### 1.2 React Query persistent hydration

Use client cache persistence for fast repeat loads:

- Persist selected query keys to `localStorage`.
- Hydrate on app start.
- Use per-query `staleTime` (example: market/price-like fast data = 5m).

Rules:
- Persist only safe, serializable, non-sensitive data.
- Version the persisted cache schema; wipe on incompatible changes.

### 1.3 AI/context cache

For AI-heavy flows (chat/summaries/tools):

- Add 30-minute KV cache for context windows and summary artifacts.
- Cache by normalized input key + model/version key.
- Reuse cached chart/summary payloads where possible.

Guardrails:
- Do not cache user-private payloads across users.
- Invalidate on prompt or data model changes.

Acceptance:
- Repeat open of same data view avoids full recompute path.

## 2) Streaming and parallelism

### 2.1 Real streaming end-to-end

- Ensure chat/token endpoints stream real chunks (not delayed fake chunks).
- Add anti-buffering headers where needed:
  - `Cache-Control: no-cache, no-transform`
  - `X-Accel-Buffering: no` (if behind nginx/proxy)
  - `Content-Type: text/event-stream` for SSE style paths

### 2.2 Parallel tools + prompt batching

- Parallelize independent tool/API calls on server.
- Batch related model prompts where output format allows.
- Avoid request waterfalls in route loaders.

### 2.3 Client API batch endpoint

- Introduce a single batch endpoint for small, parallel client needs.
- Coalesce requests on page mount to reduce connection overhead.

Acceptance:
- Time-to-first-token materially reduced.
- 95th percentile "chat start latency" down vs baseline.

## 3) Rendering and UI cost

### 3.1 Lazy heavy components with reserved space

- Lazy load charts/heavy UI.
- Always reserve height/skeleton to prevent layout shift.

### 3.2 Tab-level lazy loading

- Render active tab first; defer inactive tab payload/components.

### 3.3 List render optimization

- Memoize row/card components where props are stable.
- Keep DOM shape lean; avoid nested wrappers and large hidden trees.

### 3.4 Instant paint on cache hit

- Render from hydrated cache immediately, then background refresh.

Acceptance:
- No major layout jumps on lazy component resolve.
- Cached revisits paint nearly instantly.

## 4) WebSocket strategy

### 4.1 Single shared socket manager

- One WS connection shared app-wide (provider/service singleton).
- Route modules subscribe/unsubscribe to channels.

### 4.2 Smart reconnect + visibility gating

- Backoff reconnect strategy.
- Pause/limit reconnect when tab is hidden.

### 4.3 Prefetch on connect

- On successful connect, prefetch critical queries likely needed next.

Acceptance:
- Fewer duplicate sockets per session.
- Lower reconnect spam while tab inactive.

## 5) Service Worker strategy

### 5.1 App shell precache

- Precache core shell assets for fast repeat entry.

### 5.2 Navigation strategy

- `NetworkFirst` for navigation with ~3s timeout, then offline/cache fallback.

### 5.3 Asset policies

- Fonts/images/static assets cached long-term (example: 30d).
- Register service worker during idle window to avoid first-interaction contention.

Guardrails:
- Keep SW versioning strict to avoid stale shell bugs.
- Add explicit cache migration on release.

## 6) Bundle + cold-load discipline

### 6.1 Library audit

- Remove/replace heavy libraries with minimal in-house utilities where justified.
- Validate every dependency by size and runtime value.

### 6.2 Split + preload

- Route/feature-level lazy splits.
- `modulepreload` for known critical chunks.
- Inline only tiny critical CSS required for above-the-fold.

### 6.3 Edge/middleware routing checks

- Use middleware cookie checks for fast route decisions where it avoids client boot cost.

Budget:
- Track largest route bundle each PR.
- Block regressions above agreed threshold.

## 7) Prefetch system (intent-based)

### 7.1 Login intent prefetch

- On login intent, preload next route + critical APIs before auth transition completes.

### 7.2 Critical API warmup

- Preload key APIs and preconnect WS for high-value routes.

### 7.3 Hover/focus prefetch

- Prefetch route/data on hover/focus for likely next interactions.

Rules:
- Gate prefetch by network conditions (`saveData`, effectiveType).
- Avoid aggressive prefetch on slow networks.

## WorkWay-specific refactor phases

## Phase 0 (1-2 days): Instrumentation + budgets

- Add clear performance budgets (bundle + vitals).
- Add dashboard/alerts for regressions.
- Establish baseline report markdown in repo.

## Phase 1 (2-4 days): High-impact quick wins

- Cache header tier policy on API routes.
- React Query persistence for selected keys.
- Lazy-load heavy components with reserved heights.
- Fix obvious request waterfalls.

Expected: best effort 20-40% perceived speed gain on repeat visits.

## Phase 2 (4-7 days): Data + streaming architecture

- Real streaming hardening.
- Batch endpoint + parallel server orchestration.
- AI/context cache.

Expected: faster chat/data interactions and reduced backend recompute.

## Phase 3 (4-7 days): Network/runtime layer

- Shared WebSocket manager.
- Service Worker app shell + navigation strategy.
- Intent-based prefetch policies.

Expected: strongest gains on repeat usage and weak networks.

## Phase 4 (ongoing): Bundle minimization program

- Dependency pruning.
- Route-level chunk audits each release.
- Continuous regression gates in CI.

## PR checklist template (copy into each performance PR)

- Baseline metric referenced.
- Hypothesis stated ("what should get faster").
- Change is gated with feature flag if risky.
- Before/after metrics attached.
- No stale-data regression for affected queries.
- Rollback path documented.

## Suggested file touchpoints in current FE codebase

- `src/lib/api/` for batching/client-server fetch behavior.
- `src/components/providers/AppProviders.tsx` for shared query/socket providers.
- `src/app/layout.tsx` and `src/app/(site)/*` route trees for lazy/loading boundaries.
- `src/components/*` high-cost UI (charts/lists/cards).
- `next.config.ts` for bundle/runtime tuning.
- Add SW files only after strategy is finalized (`public/` + registration logic).

---

## Implementation log

Changes are recorded here as they are made. Each entry references the playbook section it satisfies.

---

### 2026-04-27 — Phase 1 audit + quick wins

**Audit findings (pre-change baseline)**

| Area | Finding |
|------|---------|
| API route cache headers | 5 of 6 routes missing `Cache-Control`. Only `/api/chat` had one. |
| React Query | Not installed. All client state uses raw `useState`. Persistence is not possible until installed. |
| Lazy loading | Zero `next/dynamic` or `React.lazy` usage. Heavy components (600+ lines) load eagerly everywhere. |
| Suspense/loading boundaries | No `loading.tsx` files. Only root-level Suspense in `layout.tsx`. |
| Image optimization | No `formats` config. Serving unoptimized originals when avif/webp would be smaller. |
| Static asset caching | No `Cache-Control` header on `/_next/static/` — browser re-validates on every visit. |
| Streaming (chat) | `/api/chat` missing `X-Accel-Buffering: no` and `no-transform` — at risk of proxy buffering. |
| Duplicate fetches | `generateMetadata` and page render both call `backendGet` independently. Next.js deduplicates same-URL `fetch()` calls within a render, so this is mitigated by the framework — but worth monitoring if revalidate options diverge. |

---

**Changes made**

#### 1. Cache-Control headers on API routes (Playbook §1.1)

Adopted the endpoint-level cache tier policy from §1.1. Each route now has an intentional, explicit TTL.

| File | Policy applied | Reason |
|------|---------------|--------|
| `src/app/api/health/route.ts` | `no-store` | Returns live timestamp — must not be cached |
| `src/app/api/feedback/route.ts` | `private, no-store` | POST, user-specific submission |
| `src/app/api/job/view/route.ts` | `private, no-store` | POST, view-tracking — must not be shared |
| `src/app/api/feed/job-views/route.ts` | `public, max-age=30, stale-while-revalidate=30` | Hot/churn data — matches §1.1 hot tier |
| `src/app/api/company/search/route.ts` | `public, max-age=300, stale-while-revalidate=600` | Search results — matches §1.1 normal dynamic tier |

#### 2. Chat streaming anti-buffering headers (Playbook §2.1)

`src/app/api/chat/route.ts` — added `X-Accel-Buffering: no` and `no-transform` to the existing SSE response. Prevents nginx/proxy from holding chunks and delivering a fake-streaming experience.

Before: `Cache-Control: no-cache`
After: `Cache-Control: no-cache, no-transform` + `X-Accel-Buffering: no`

#### 3. Lazy-load OnboardingModal (Playbook §3.1)

`OnboardingModal` (603 lines, multi-step form) was statically imported in two landing page components. Replaced with `next/dynamic` + `ssr: false` so the modal chunk is not included in the initial landing page JS bundle — it loads only if/when triggered.

Files changed:
- `src/components/LandingPage/Hero.tsx`
- `src/components/LandingPage/FinalCTA.tsx`

#### 4. Image format optimization (Playbook §6.2)

`next.config.ts` — added `images.formats: ["image/avif", "image/webp"]`. Next.js Image now serves avif (smallest) with webp fallback instead of the original format. No code changes required at call sites.

#### 5. Static asset cache headers (Playbook §6.2)

`next.config.ts` — added response headers:
- `/_next/static/:path*` → `Cache-Control: public, max-age=31536000, immutable`
  (versioned hashed chunks — safe to cache forever)
- `/fonts/:path*` → `Cache-Control: public, max-age=2592000, stale-while-revalidate=86400`
  (30-day font cache with background revalidation)

---

---

### 2026-04-27 — Second audit + remaining lazy-load sweep

**Second audit results (all original findings re-checked)**

| Finding | Status |
|---------|--------|
| API route cache headers | ✅ All 6 routes have explicit Cache-Control |
| Chat streaming headers | ✅ X-Accel-Buffering + no-transform added |
| Lazy loading (Phase 1 components) | ✅ OnboardingModal, ChatUI, JobPageClient, SalaryInsightsClient, LocationSeoPageClient, LocationOnlyPageClient |
| loading.tsx boundaries | ✅ 5 routes covered: jobs, job/[jobSlug], salary-insights, [locationSeoSlug], chat |
| Image formats | ✅ avif + webp configured |
| Static asset cache | ✅ immutable 1yr on /_next/static/ |
| Duplicate generateMetadata fetches | ⚠️ Dedup handled by Next.js fetch cache; revalidate strategies differ intentionally |

**Second audit new findings (addressed in this session)**

Additional heavy components found still statically imported. All converted to `next/dynamic`:

| File | Component | Lines | ssr |
|------|-----------|-------|-----|
| `src/app/(site)/page.tsx` | `CompanyLogoScroll` | 228 | true (default) — ssr:false not allowed in Server Components |
| `src/app/(site)/jobs/page.tsx` | `JobsPageClient` | 247 | true (default) |
| `src/app/(site)/feedback/page.tsx` | `FeedbackForm` (named export) | 239 | true (default) |
| `src/app/(site)/skills/page.tsx` | `AllSkillsPageClient` | 230 | true (default) |
| `src/app/(site)/domain/[domainSlug]/page.tsx` | `DomainPageClient` | ~200 | true (default) |

**loading.tsx files added (Playbook §3.1, §3.4)**

All skeletons use `animate-pulse` with `bg-white/[0.06]` blocks. Shapes match the real page layout to minimize perceived CLS on hydration.

| Route | File |
|-------|------|
| `/jobs` | `src/app/(site)/jobs/loading.tsx` |
| `/job/[jobSlug]` | `src/app/(site)/job/[jobSlug]/loading.tsx` |
| `/salary-insights` | `src/app/(site)/salary-insights/loading.tsx` |
| `/[locationSeoSlug]` | `src/app/(site)/[locationSeoSlug]/loading.tsx` |
| `/chat` | `src/app/(site)/chat/loading.tsx` |

**TypeScript:** clean after all changes (`tsc --noEmit` zero errors).

---

**Total next/dynamic imports as of this session: 11 components**

| Component | File | ssr |
|-----------|------|-----|
| OnboardingModal | LandingPage/Hero.tsx | false |
| OnboardingModal | LandingPage/FinalCTA.tsx | false |
| ChatUI | app/(site)/chat/page.tsx | false |
| CompanyLogoScroll | app/(site)/page.tsx | true (default) |
| JobPageClient | app/(site)/job/[jobSlug]/page.tsx | true |
| JobsPageClient | app/(site)/jobs/page.tsx | true |
| SalaryInsightsClient | app/(site)/salary-insights/page.tsx | true |
| LocationSeoPageClient | app/(site)/[locationSeoSlug]/page.tsx | true |
| LocationOnlyPageClient | app/(site)/[locationSeoSlug]/page.tsx | true |
| AllSkillsPageClient | app/(site)/skills/page.tsx | true |
| DomainPageClient | app/(site)/domain/[domainSlug]/page.tsx | true |

---

---

### 2026-04-27 — Remaining no-dep work: skeletons + lazy-load sweep + ipapi fix

**loading.tsx files — rewritten to match real page layouts, new routes added**

All skeletons now mirror the actual section structure (hero, grid columns, card shapes) of the rendered page to minimise perceived layout shift when content arrives.

| Route | File | What the skeleton matches |
|-------|------|--------------------------|
| `/jobs` | `jobs/loading.tsx` | Hero + 3-col grid (240px sidebar \| cards \| 360px feed) |
| `/job/[jobSlug]` | `job/[jobSlug]/loading.tsx` | Hero (logo+title+badges) + description + info sidebar |
| `/salary-insights` | `salary-insights/loading.tsx` | 4 stat cards + 2 charts + filter row + job rows |
| `/[locationSeoSlug]` | `[locationSeoSlug]/loading.tsx` | Hero with location name + same 3-col grid |
| `/chat` | `chat/loading.tsx` | AI/user message bubbles + job card previews + input bar |
| `/companies` | `companies/loading.tsx` *(new)* | Centered hero + search + alpha filter + company card grid |
| `/company/[companySlug]` | `company/[companySlug]/loading.tsx` *(new)* | Full company header + 2/3+1/3 content grid |
| `/domains` | `domains/loading.tsx` *(new)* | pt-32 centered heading + 4-col domain card grid + bottom text |
| `/skills` | `skills/loading.tsx` *(new)* | Stats + search + category pills + skill card grid |
| `/skill/[skillSlug]` | `skill/[skillSlug]/loading.tsx` *(new)* | Left-aligned hero badge+heading + filter bar + job cards |
| `/domain/[domainSlug]` | `domain/[domainSlug]/loading.tsx` *(new)* | Left-aligned hero badge+heading + job cards |

**Additional lazy-load: CompaniesPageClient (Playbook §3.1)**

`src/app/(site)/companies/page.tsx` — `CompaniesPageClient` converted to `next/dynamic`.

**Total next/dynamic imports: 12 components** (CompaniesPageClient added)

**ipapi.co AbortController fix (Playbook §2.2)**

`src/components/dynamic/JobPageClient.tsx` — replaced `cancelled` boolean flag with a proper `AbortController`. The geo fetch now receives `{ signal: controller.signal }` and the cleanup calls `controller.abort()`. This cancels the in-flight network request on unmount rather than just ignoring its result.

---

**What remains (not yet implemented — requires new dependencies or deeper refactor)**

| Area | Blocker | Playbook ref |
|------|---------|-------------|
| React Query data layer + persistence | React Query not installed | §1.2 |
| AI/context KV cache (30min TTL) | Backend change + KV store needed | §1.3 |
| Shared WebSocket manager | No WS usage found yet | §4 |
| Service Worker app shell | Needs SW registration + versioning strategy | §5 |
| Intent-based prefetch | Depends on React Query being set up first | §7 |
| Bundle analyzer | New dev dependency (@next/bundle-analyzer) | §6.1 |
| Batch API endpoint | Backend + frontend coordination needed | §2.3 |

---

## Anti-patterns to avoid ("AI slop" equivalents)

- Random TTLs without data-freshness rules.
- Premature micro-optimizations without baseline evidence.
- Fake streaming UX that still buffers server-side.
- Over-prefetching that hurts slower networks.
- Caching private or sensitive user payloads in shared scopes.
- Shipping performance changes without regression checks.

## Final note

Treat performance work as product work:
- measurable,
- incremental,
- reversible,
- owned with clear budgets.

That is how you get "instant" feel without fragile code.
