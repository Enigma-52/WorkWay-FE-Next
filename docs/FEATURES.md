# Feature reference

What exists in WorkWay today, how it works, and where the code lives. Written
so a fresh contributor (or a fresh Claude session) has the context that would
otherwise only live in chat history. Companion to
[`DEPLOYMENT.md`](./DEPLOYMENT.md) (infra/env) and
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) (visual language).

## Auth

Google OAuth + email magic links, NextAuth v5 (beta), JWT session strategy.

- **Google**: `src/lib/auth.ts` → on first sign-in, the NextAuth `jwt`
  callback calls the backend's `POST /api/user/sync` (internal-secret gated)
  to upsert the user row and pull back `roles`/`plan_key`/`is_new`.
- **Magic link**: a `Credentials` provider whose `authorize()` calls the
  backend's `GET /api/auth/magic-link/verify`. Sending a link
  (`POST /api/auth/magic-link/send`) is rate-limited (5 per 15 min per IP,
  `express-rate-limit`) and restricted to a curated allowlist of consumer
  email domains (`WorkWay--BE/src/utils/allowedEmailDomains.js` — Gmail,
  Yahoo variants, Outlook, Proton, iCloud, etc.); anything else gets a
  rejection message pointing at Google sign-in instead. This exists to keep
  magic-link delivery reputation clean — business/unknown domains are far
  more likely to bounce or spam-filter.
- **New vs. returning**: `users.id` uses the Postgres `xmax = 0` trick
  (`is_new` column in `upsertUser`'s `RETURNING`) to tell a fresh insert from
  an upsert-of-existing-row in one query. Threaded through into the session
  as `session.user.isNewUser` + `session.user.authProvider`, consumed once by
  `AnalyticsProvider.tsx` to fire `Signup Completed` vs `Login Completed` to
  Mixpanel (see [Analytics](#analytics-mixpanel) below) — guarded by a
  `localStorage` flag so a page reload mid-session never double-fires it.
- **Role self-escalation is blocked**: `PATCH /api/user/me` whitelists
  `roles` to `{'seeker', 'hirer'}` only — `admin` can never be set through
  that endpoint, only via the admin panel's grant-role flow.

## Plans, subscriptions & Dodo Payments

Built as infrastructure ahead of actually launching paid plans — the explicit
sequencing was: ship the plan model → ship real payment integration → ship
paid features → launch pricing publicly. Designed to support more tiers and
non-Dodo sources later without a redesign.

**Data model** (all on integer/uuid user FKs, not duplicated data):
- `plans` — catalog: `key`, `name`, `description`, `dodo_product_id`, `is_active`.
- `subscriptions` — full history, provider-agnostic via a `source` column
  (`'dodo' | 'admin_grant'`), keyed by `external_subscription_id` for
  idempotent upserts from webhooks.
- `users.plan_key` — a cached/derived column, recomputed by
  `subscriptionsService.recomputeAndPersistPlan()` after every subscription
  change (grant, cancel, or webhook event) by picking the highest-priority
  *active* subscription (`PLAN_PRIORITY = ['free', 'pro', 'lifetime']` in
  `subscriptionsDao.js`). Nothing reads raw `subscriptions` rows to decide
  access — always `users.plan_key` via `isPro()`/`hasPlan()`
  (`WorkWay--BE/src/utils/plans.js`, mirrored client-side in
  `workway-next/src/lib/plans.ts` — keep both in sync if the tier set changes).

**Dodo integration** (test mode today — see `DEPLOYMENT.md`):
- `POST /api/billing/checkout` (`routes/billing.js`) creates a hosted
  checkout session, round-tripping `metadata.workway_user_id` so the webhook
  can resolve the user reliably even if their email changes later.
- `POST /api/billing/webhook` (`routes/dodoWebhook.js`) verifies the
  signature (`standardwebhooks`), and **every event is logged to
  `dodo_webhook_events` immediately on receipt** — success or failure,
  before any processing — via `dodoWebhookEventsDao.logReceived()`, then
  marked `processed`/`handled`/`error` after. This was an explicit
  requirement ("store everything Dodo sends for success and errors both")
  and is the first place to look when a payment doesn't reflect correctly.
- `subscriptionsService.handleDodoWebhookEvent()` is the single entry point
  for all event types (`subscription.active/renewed/on_hold/failed/updated`).
  `subscription.failed` is treated as terminal and never grants access.
  `subscription.updated` trusts whatever status Dodo sends for an
  already-known subscription — there's a known-acceptable race if
  `updated` arrives before the initial `active` event creates the local row
  (falls through as "no local subscription row", logged, not retried).
- The webhook route always returns 200 regardless of internal handling
  result — Dodo retries on non-2xx, and retried duplicate events are safe
  because every write is either an upsert-by-external-id or idempotent.

**Admin plan management**: the admin panel can search any user by
email/name and grant a role or a plan (with a duration or unlimited) via
`subscriptionsService.grantPlan()` — this is the `source = 'admin_grant'`
path, independent of Dodo, used for testing and manual comps.

## Pricing page

`/pricing` (`src/app/(site)/pricing/page.tsx` +
`src/components/Pricing/PricingCards.tsx`) — job-seeker plans only for now
(Free / Pro $5/mo / Lifetime "coming soon", no Dodo product created for
Lifetime yet). Employer/company pricing is intentionally not built —
company/hirer portal pages are a planned future phase that the whole plan
system was designed to accommodate (see `plan_key` being provider- and
tier-agnostic above).

## Talents directory

`/talents` — public, paginated, bot- and human-crawlable directory of
published Talent Profiles, filterable by category/skills/languages/country
(mirrors the same filter treatment as `/jobs`). Each profile lives at
`/p/[username]` with its own SEO metadata and JSON-LD.

Talent Profile creation/edit (`/dashboard/seeker/talent-profile/create`) is a
single multi-section form (`handlePublish()`) covering experience,
education, certifications, skills, languages, avatar/resume upload (via
Cloudflare R2), compensation visibility, and social links. Resume viewing
supports inline PDF preview with a new-tab fallback for browsers that refuse
cross-origin inline PDFs.

## Company follow + instant Pro alerts

**Follow**: any signed-in user can follow a company (`job_alerts` table,
`alert_type = 'company'`, unique per `(user_id, company_slug)`). Followed
companies' recent postings already surface for free in
`Dashboard → Companies` — that page is untouched by the Pro feature below.

**Instant email alerts (Pro feature)** — the first feature built out under
the plan system, and slide 7 of the onboarding modal (`pro: true` in
`onboardingFeatures.ts`). Full design rationale lives in
`docs/superpowers/plans/` history / the original planning artifact; summary:

- A standalone poller cron (`company_alert_check`, every 10 min,
  `WorkWay--BE/src/services/companyAlertService.js`) — deliberately **not**
  hooked onto the ingestion crons (no hook system exists, and decoupling
  means one ingestion platform failing can't block alerts sourced from
  another).
- Tracks a single-row watermark (`company_alert_checkpoint.last_job_id`,
  seeded to the current max job id at ship time so it never floods everyone
  with history) rather than a timestamp, avoiding clock-skew edge cases.
- Each run: find jobs with `id > checkpoint`, join to `companies`, batch-match
  against followers (`alertsDao.getFollowersForCompanySlugs()`), filter to
  `isPro()` and not opted out, per-job dedup via `email_log.reference_id`
  (`emailLogDao.hasSent()`), send one digest email per user grouped by
  company (never one email per job), log each sent job, advance the
  checkpoint. Gated by the `company_alert_emails_enabled` feature flag —
  when off, the run still executes and advances the checkpoint (so flipping
  it on later never floods a backlog), it just skips the actual send.
- **Dashboard surface**: `Dashboard → Alerts`
  (`src/app/dashboard/seeker/alerts/page.tsx`), gated server-side in
  `GET /api/alerts/recent` — a non-Pro request never even queries job data
  (returns `{ pro: false }` immediately), so there's nothing for the client
  to leak by rendering it wrong. Pro users see exactly what they were
  actually emailed (sourced from `email_log`, not a fresh re-computation),
  each row linking to `/job/[slug]` to apply.
- **Upsell surfacing**: an inline nudge + toast action on the company page's
  Follow button for non-Pro users following a company
  (`CompanyPage/CompanyHeader.tsx`), and the sidebar's Alerts nav item shows
  a Crown badge for non-Pro users. Both route to `/pricing`.
- **Admin test-send**: `company_alert` email type in the admin panel's
  lifecycle-email tester, using synthetic company/job data (no real
  follower/job data touched) — the standard way to preview the template
  before flipping the flag on.

## Lifecycle emails

`WorkWay--BE/src/services/lifecycleEmailService.js`, all gated by the
`lifecycle_emails_enabled` flag, all logged to `email_log`:

- **Welcome** — sent immediately on new-user detection (`user.is_new`) from
  `POST /api/user/sync`, not on a cron.
- **7-day feedback** — cron `feedback_7day_email`, daily at 09:00, targets
  users created ≥7 days ago with no prior `feedback_7day` log row, links to
  the external Featurebase board (`https://workway.featurebase.app/` — the
  internal `/feedback` page was deprecated and now redirects here from the
  footer and everywhere else it was linked).
- **Weekly summary** — cron `weekly_summary_email`, Mondays 09:00: saved
  jobs + applications logged in the last 7 days, plus trending domains
  platform-wide (`jobsDao.getTrendingDomainsSince()`). Includes a one-click
  unsubscribe link (HMAC token, `utils/unsubscribeToken.js`) that flips
  `users.emails_opted_out` — checked by every lifecycle/alert send.

All templates share one inline-styled, table-based HTML shell
(`utils/emailTemplates.js`'s `emailShell()`) matching the app's real dark/
acid-green brand (`#080A0C` / `#111318` / `#ABFF1A`), sent via Resend.

## Admin panel

`/dashboard/admin` (`admin` role required; not shown in the seeker/hirer
sidebar, reached directly). Everything here calls Next.js BFF routes under
`src/app/api/admin/*`, which check the session's admin role, then forward to
backend routes gated by `requireInternalSecret` + a second per-request
`requireAdmin` check (`routes/admin.js`) that re-verifies the calling user
actually has the admin role — belt-and-suspenders since the internal secret
alone only proves "this came from our Next.js server," not "this user is an
admin."

Sections:
1. **Test lifecycle emails** — send any real template (welcome, 7-day
   feedback, weekly summary, company alert) to the logged-in admin's own
   inbox, bypassing feature flags. The company-alert one uses synthetic data.
2. **Grant access** — search any user by email/name, grant a role or a plan
   (optionally time-boxed), see their subscription history inline.
3. **Feature flags** — every row in the `feature_flags` table renders here
   automatically (`getAll()`-driven, no hardcoded list to maintain) with a
   live toggle.
4. **Cron jobs** — see [below](#cron-jobs--admin-visibility).

## Cron jobs & admin visibility

`WorkWay--BE/src/services/cronScheduler.js`'s `JOBS` array is the single
source of truth for every scheduled job (currently: `daily_greenhouse`,
`daily_ashby`, `daily_yc`, `feedback_7day_email`, `weekly_summary_email`,
`company_alert_check`). `daily_workable` exists in `dailyService.js` but is
**not registered** — it was written but never wired in, so Workable-sourced
companies currently produce no ingestion (and therefore no alerts) at all.
Wiring it in is a one-line addition to `JOBS` whenever that's prioritized.

Every job runs through the generic `runCronJob()` wrapper
(`cronRunner.js`), which:
- checks `cron_config` for an `enabled` flag per tag,
- inserts a `cron_runs` row before running and updates it with
  `status`/`duration_ms`/**`result`** (whatever the job function returns,
  stored as jsonb) or `error` after,
- clears the ingestion in-memory caches afterward regardless of which job ran.

**Convention, enforced in code as of this doc**: `startCronScheduler()` now
calls `ensureCronConfigRows()` at boot, which inserts an
`enabled = true` row into `cron_config` for every entry in `JOBS`
(`ON CONFLICT DO NOTHING`) — so a newly-added cron always has an explicit,
admin-visible, toggleable row from the moment it's registered. Previously
`runCronJob` silently treated "no `cron_config` row" as enabled, which meant
three jobs (`feedback_7day_email`, `weekly_summary_email`,
`company_alert_check`) had been running by default with no visible on/off
switch until this was backfilled. **Do not rely on the implicit-enabled
fallback going forward** — it still exists as a defensive default, but every
real job should get its row from `ensureCronConfigRows()` automatically.

The admin panel's **Cron jobs** section
(`src/components/Admin/AdminPanelClient.tsx`, backed by
`src/app/api/admin/cron/{status,runs,toggle,run}/route.ts`) surfaces, per job:
schedule, live enabled/disabled toggle, whether it's currently running,
next-run time, a manual "Run now" button, and a filterable feed of recent
`cron_runs` rows with their `result` payload — e.g. `company_alert_check`'s
result shows `checked` / `matchedCompanies` / `matchedFollowers` / `sent` /
`skippedNotPro` / `skippedOptedOut` / `flagOn` per run, which is exactly the
per-run analytics data needed to answer "how many users were actually
emailed."

## Job reporting & staleness

- `POST /api/job/report` (`routes/job.js`, rate-limited): one report per IP
  per job (`UNIQUE(job_id, reporter_ip)`, `ON CONFLICT DO NOTHING` treated as
  a no-op success rather than an error). A job auto-deactivates
  (`is_active = false`) once it crosses **3** reports
  (`AUTO_DEACTIVATE_THRESHOLD` in `jobReportsDao.js`).
- IP is read via Express's `trust-proxy`-resolved `req.ip`
  (`normalizeIpAddress`), not a manually-parsed `X-Forwarded-For` header —
  the latter was a found-and-fixed bug, since the leftmost `X-Forwarded-For`
  entry is client-spoofable and made the one-report-per-IP dedup trivially
  bypassable (a mass-deactivation vector).
- **"Possibly stale" badge**: client-side only, `JobPageClient.tsx` — a job
  is flagged stale if `created_at` is more than 30 days old. Purely a UI
  signal, does not affect `is_active` or search ranking.

## Onboarding / feature-showcase modal

`src/components/Onboarding/{OnboardingGate,FeatureShowcaseModal}.tsx` +
`src/data/onboardingFeatures.ts`. A full-screen modal — 20% left rail of
selectable features (auto-advancing every 10s), 80% right detail pane —
covering all seven current features, the last one (`pro-alerts`) flagged
`pro: true` and rendered with a Crown badge.

Two trigger paths, both in `OnboardingGate.tsx`:
1. **First sign-in on this browser** — gated by a `localStorage` key
   (`workway_onboarding_seen_<userId>`), starts at the first slide.
2. **Just completed a Dodo checkout** (`?checkout=success` on the redirect
   URL) — jumps straight to the Pro alerts slide, fires the `Payment
   Completed` Mixpanel event, then strips the checkout query params via
   `router.replace` so refreshing or sharing the URL doesn't re-trigger it.

## Analytics (Mixpanel)

`src/lib/analytics.ts` + `src/components/providers/AnalyticsProvider.tsx`.
The SDK loads lazily (deferred until idle or first interaction, to protect
Lighthouse TBT), and **never loads at all on localhost or private-LAN
hosts** (`isLocalDevHost()`/`shouldLoadAnalytics()`) — this was added after
localhost dev traffic had been polluting production Mixpanel reports; the
existing pre-fix events had to be removed manually via Mixpanel's own Data
Management filters, since code can't retroactively delete already-ingested
events. A one-time `?mp_debug=1` query param opts a local session back in
for deliberate local QA of analytics itself.

Every event fired today, by area (all via the single `track()` helper):

| Area | Events |
|---|---|
| Page/bot | `Page View`, `is_bot` super-property on every event (heuristic UA/webdriver/headless detection, for filtering, not blocking) |
| Auth | `Sign In Started` (method, source), `Magic Link Sent`, `Magic Link Send Failed`, `Signup Completed` (once ever per user, via `is_new`), `Login Completed` |
| Jobs | `Job Viewed`, `Apply Click`, `Job Card Clicked`, `Job Saved`, `Job Unsaved`, `Application Logged`, `Application Status Updated`, `Job Reported`, `Search Performed`, `Jobs Filters Applied` |
| Companies | `Company Page Viewed`, `Company Followed`, `Company Unfollowed` |
| Talent profiles | `Talent Profile Creation Started`, `Talent Profile Created`, `Talent Profile Updated`, `Talent Profile Viewed`, `Talent Profile Shared`, `Resume Previewed`, `Resume Downloaded`, `Talents Filters Applied` |
| Pricing/payments | `Pricing Plan Clicked` (with `source`: pricing page, follow-nudge, alerts-tab teaser, etc.), `Checkout Started`, `Checkout Start Failed`, `Payment Completed` |
| Alerts | `Alert Job Clicked` |

`identify()` is only ever called once a real signed-in `dbId` exists (never
an inferred/anonymous identity), and `resetIdentity()` fires on sign-out so a
shared machine's next login doesn't get attributed to the previous user.

## SEO & indexing (condensed from the removed `SEO_STATUS.md`, as of 2026-08-05)

GSC indexed pages dropped from ~150k to ~600 around Google's May 21–June 1
2026 core update. Most likely cause: "scaled content abuse" — WorkWay's
`JobPosting.description` is **99.6% verbatim-identical** (8-gram overlap) to
the source ATS posting on a sampled job, across a ~465k-page catalog that's
mostly reformatted copies of content already indexed elsewhere. No manual
action or security issue in GSC; recovery from a core-update demotion has no
direct technical fix or guaranteed timeline.

**Confirmed healthy** (don't re-litigate): metadata (title/description/
canonical/H1) is clean and unique across every page type; all JSON-LD
(`JobPosting`/`ItemList`/`FAQPage`/`Dataset`/`BreadcrumbList`) is well-typed;
guides content is genuinely differentiated, not templated; `sitemap.xml`
structure (index + per-type sub-sitemaps) is sound; `robots.txt` correctly
allows Googlebot.

**Fixed**: `/jobs` and `/companies` pagination now uses real `<a href>` links
with `rel=next/prev` (was invisible `<button onClick>` — same fix applied to
`/salary-insights`, `/domain/[slug]`, `/skill/[slug]`, location hub pages);
related-job cards on job pages are now crawlable.

**Still open** (real work, not done):
1. The core duplicate-content problem is unaddressed at scale — needs either
   noindex-ing the long tail of thin/generic postings (see the RemoteYeah
   comparison below) or more substantive per-page differentiation.
2. `jobs.xml` was capped to a single 50k-URL file filtered by recency to
   fight crawl-budget waste — wrong lever; should filter by job **status**
   (active vs. closed) and chunk across multiple sitemap-index files instead.
3. No daily job-closure sync — closed jobs should get `noindex` + HTTP 410
   and drop from the sitemap the same cycle; currently nothing marks a job
   closed until a human notices.
4. Domain/skill hub pages share near-identical templated intro copy.
5. A handful of internal duplicate postings exist in the raw sitemap
   (same job title, different trailing numeric ID) — not yet deduped.
6. **Strategic question, undecided**: RemoteYeah's total catalog (~19k URLs)
   is ~25x smaller than WorkWay's (~472k) and presents descriptions as a
   labeled fact sheet rather than narrative text. Worth deciding whether to
   deliberately shrink the indexed footprint rather than keep chasing full
   catalog indexation.
7. Domain authority gap confirmed via Ahrefs (manual check): workway.dev
   DR 11 / 400 backlinks vs. remoteyeah.com DR 40 / 2,400 backlinks / 510
   referring domains — a real, separate lever (backlink-building) alongside
   content differentiation and the noindex-strategy question above.

## Security posture (from the full-site audit)

A full audit pass (auth, all user-facing APIs, talent-profile edit/admin
endpoints) found and fixed the following — noted here so the fixes aren't
silently reverted by a future change that looks like a simplification:

- **SQL injection** in `GET /api/cron/runs?tag=` — was raw string
  interpolation into a `WHERE` clause via the shared `getAllRows({where})`
  helper; fixed with a parameterized query for that one call site. That
  shared helper (`dao.js`) is still string-concatenation-based — never pass
  user input into its `where` option elsewhere without the same care.
- **Open unauthenticated endpoints** — `POST /api/user/sync` and all
  `/api/admin/*` routes were reachable without any auth; fixed via
  `requireInternalSecret`.
- **Self-privilege-escalation** — `PATCH /api/user/me` accepted an arbitrary
  `role` value including `admin`; fixed with the `{'seeker','hirer'}`
  whitelist noted above under Auth.
- **IP spoofing** — `job.js` and `feedback.js` parsed the leftmost
  (attacker-controlled) `X-Forwarded-For` entry instead of Express's
  `trust-proxy`-resolved `req.ip`; fixed in both, closing the report-dedup
  bypass noted above.
- **Hardcoded secret fallbacks** — `unsubscribeToken.js` and the session
  secret in `server.js` fell back to literal strings like `'dev-secret'`;
  replaced with a random-per-boot value (`crypto.randomBytes(32)`), which
  fails safe (previously-issued tokens/sessions just stop validating across
  a restart) instead of fails guessable.
- **Country filter false positives** — `country=IND` (India) via
  `ILIKE '%India%'` also matched "Indianapolis"; fixed with a Postgres
  word-boundary regex (`~* '\yIndia\y'`), confirmed to still use the
  `pg_trgm` GIN index.

Rate limiting (`express-rate-limit`) is keyed by `req.ip` — always confirm
this stays true for any new limiter; keying by a raw header is the same
spoofing class of bug as above.

### Follow-up audit — company alerts, cron admin panel, auth redirects (2026-08)

Scoped to everything added in that batch of work. Found and fixed:

- **Stored HTML injection in transactional emails.** `emailTemplates.js`
  interpolated `displayName` (Google account name — attacker-settable) and,
  in the new company-alert digest, third-party ATS-sourced `companyName`/
  `job.title`/`job.location` directly into HTML with no escaping. A company
  named e.g. `<img src=x onerror=...>` on the source ATS, or a user setting
  their Google display name to markup, would have rendered as live HTML in
  every recipient's inbox. Fixed with a shared `escapeHtml()` applied to
  every dynamic text field across all five templates (welcome, feedback,
  weekly summary, company alert, and the trending-domains list). Verified
  against real `<script>`/`<img onerror>`/`<b>` payloads — all render as
  inert escaped text now. Left href attributes alone; those are always
  server-constructed from DB slugs/IDs, never raw dynamic text.
- **Subject-line injection surface.** `shortenCompanyName()` (used to build
  alert-email subjects from third-party company names) now also strips
  `\r`/`\n` before truncating — Resend's API builds the real envelope
  itself so this isn't a classic SMTP header-injection vector, but a
  newline in a subject-building value is exactly that attack's shape and
  costs nothing to close.
- **Missing second auth layer on cron admin routes.** The new admin-panel
  Cron Jobs UI calls backend `/api/cron/{status,runs,toggle,run}` through a
  Next.js BFF that checks the caller is an admin — but those backend routes
  themselves were gated *only* by `requireInternalSecret` (proves "called by
  our own server," not "by an admin"), unlike `/api/admin/*`, which already
  double-checks. Extracted the existing `requireAdmin` middleware out of
  `routes/admin.js` into `utils/roles.js` and applied it to all four cron
  routes too, so a leaked internal secret alone can no longer trigger/disable
  crons or read run history without also supplying a real admin user id. The
  four Next.js BFF routes now pass `session.user.dbId` through for this
  check to verify. Verified with a stubbed `usersDao` (admin passes,
  non-admin/unknown/missing `user_id` all correctly 403/400).
- **`/api/cron/toggle/:tag` accepted any tag string**, unlike `/run/:tag`
  which already validated against the registered `JOBS` list — fixed to use
  the same whitelist, so it can no longer create a stray `cron_config` row
  for a typo'd or nonexistent tag.
- **Open-redirect surface in the new auth-redirect flow.** The
  `callbackUrl`/`authRedirect` deep-link mechanism (added so an email link
  like `/dashboard/seeker/alerts` survives a sign-in round trip) validated
  only `startsWith("/")` and rejected `//host` — missed `/\host`, which some
  browsers normalize to `//host` (a known open-redirect bypass class).
  Hardened in all three places it's checked (`AuthModal` → magic-link send
  → emailed link → `/auth/verify`, and the new `middleware.ts` →
  `AuthRedirectGate`), consolidated the frontend check into one shared
  `src/lib/safeRedirect.ts` instead of three copies that could drift.
  Verified against `//evil.com`, `/\evil.com`, and a bare absolute URL — all
  correctly rejected and fall back to `/dashboard`.
- **Middleware matcher relying on regex nuance.** `/dashboard/:path*` is
  documented to also match the bare `/dashboard`, but a route gate is the
  wrong place to trust that without also checking explicitly — the matcher
  now lists `["/dashboard", "/dashboard/:path*"]` and the handler itself
  does an explicit `pathname === prefix` check independent of the matcher.

No issues found in: the `/api/alerts/recent` Pro-gating (confirmed a
non-Pro request never queries job data), the new DAO methods (all
parameterized, no string-built SQL), or the Mixpanel/pricing-page changes
(no new privileged surface).

### Second pass — re-entrancy on manual cron triggering

- **No overlap guard on `runCronJob`.** This gap predates the admin panel
  (`cronRunner.js` wasn't touched building the alerts feature itself), but
  it was only reachable before by knowing the raw internal-secret-gated
  URL — the new one-click "Run now" button makes a double-click or a
  retried request a realistic way to fire two overlapping runs of the same
  job. Impact was already capped for `company_alert_check` specifically
  (per-job dedup via `email_log.hasSent()` prevents an overlap from
  double-emailing anyone), but nothing stopped it for any other job, and
  the outcome (double-charged API quota against Greenhouse/Ashby/YC,
  confusing concurrent `cron_runs` rows) wasn't something to leave
  latent just because the immediate email case happened to be safe.
  Fixed: `runCronJob` now checks for an existing unfinished (`started`,
  no `finished_at`) row for the same tag before starting a new one, and
  returns `{ status: 'already_running' }` instead. Verified with a mocked
  DAO: a run started mid-flight correctly blocks a second trigger, and a
  third trigger after the first completes proceeds normally. Residual: the
  check-then-insert isn't wrapped in a DB transaction/lock, so a true
  simultaneous race is theoretically still possible — acceptable for a
  single-instance deployment (see `DEPLOYMENT.md`) where the realistic
  trigger is a UI double-click or retry, not concurrent requests from
  separate app instances.
- Re-verified `job.url` (built server-side as `${SITE_URL}/job/${slug}`,
  interpolated unescaped into `href="..."`) can't be used for HTML
  attribute injection — every ingestion path generates `slug` through an
  allowlist sanitizer (`.replace(/[^a-z0-9]+/g, '-')` in `dailyService.js`
  and `cronService.js`, `.replace(/[^\w\s-]/g, '')` for company slugs in
  `buildCompanySlug`), so it can never contain `"`, `<`, or `>`. Left as-is.
