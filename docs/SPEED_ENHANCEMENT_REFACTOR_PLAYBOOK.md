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
