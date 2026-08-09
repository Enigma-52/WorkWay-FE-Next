# Deployment & infrastructure reference

Current-state reference for how WorkWay actually runs in production. Supersedes
`PROD_DEPLOY_CHECKLIST.md`, `PROD_DEPLOY_AUTH_EMAIL.md`, and
`VERCEL_DEPLOYMENT.md` (removed — they described a pre-launch checklist and an
unused Vercel path; the site is live on the infra below as of 2026-08-07).

## Topology

Single DigitalOcean VPS, four containers via `workway-infra/docker-compose.yml`:

| Container  | Image                                    | Role                                    |
|------------|-------------------------------------------|------------------------------------------|
| `postgres` | `pgvector/pgvector:pg16`                  | Primary DB, SSL-only, local volume       |
| `backend`  | `ghcr.io/enigma-52/workway-backend:latest`  | Express API + node-cron ingestion/lifecycle jobs |
| `frontend` | `ghcr.io/enigma-52/workway-frontend:latest` | Next.js (App Router, standalone output)  |
| `nginx`    | `nginx:alpine`                            | TLS termination + routing                |

Images are built and pushed to `ghcr.io` manually (no CI workflow in-repo yet —
see the TODO in `workway-infra/README.md`), then pulled on the VPS and brought
up with `docker compose up -d`. SSH: `ssh -L 5433:localhost:5432 root@<droplet-ip>`
(the local port-forward is for connecting a local `psql`/GUI client to prod
Postgres over SSH, not for app traffic).

## The nginx BFF carve-out — read this before touching routing

`workway-infra/nginx/nginx.conf` routes some `/api/*` paths to the **frontend**
container instead of the backend catch-all. This exists because several
backend routes trust a client-supplied `user_id` — safe only when the caller
is guaranteed to be the Next.js server itself, which first reads the real
NextAuth session and injects the verified `user_id` before forwarding. A
browser hitting the backend directly for these paths would be able to act as
any user by supplying an arbitrary `user_id`.

Carved out to `frontend:3000` today:
- `/api/auth/` (NextAuth's own session/signin/callback/csrf routes — but
  `/api/auth/magic-link/` is matched *first* and goes to the backend, since
  that's a real backend route, not a NextAuth one)
- `/api/(saved-jobs|applications|alerts|talent-profiles|admin)(/|$)`
- `/api/billing/checkout` (needs the session to know who's paying)

Deliberately **not** carved out: `/api/billing/webhook` — Dodo calls this
directly and authenticates via webhook signature verification, not a session,
so it falls through to the backend catch-all (`/api/`) like everything else.

**When adding a new user-scoped backend route that trusts a body/query
`user_id`**, add its prefix to the carve-out regex and create the matching
Next.js BFF route under `src/app/api/...` that calls `auth()` and injects the
real `session.user.dbId`. Getting this wrong was the single most common class
of bug hit during the initial prod rollout (routes silently trusting whatever
`user_id` the browser sent).

Also note: every carved-out location sets `Cache-Control: no-store` and hides
any upstream cache header — Cloudflare was previously caching authenticated
API responses across users until this was added.

## Environment variables

Names only below — see the running containers' env (`docker inspect`) or
`.env` files on the VPS for actual values; never commit real secrets to a
doc. `docker-compose.yml` currently has several of the frontend's secrets
inlined directly in the `environment:` block rather than via `.env` — worth
moving to an env file at some point, but out of scope here.

### Backend (`WorkWay--BE/.env`, loaded via `env_file` in compose)

| Var | Purpose |
|---|---|
| `POSTGRES_DB_HOST` / `_PORT` / `_USER` / `_PASSWORD` / `_DATABASE` | DB connection |
| `PORT` | Express listen port (3000 inside the container) |
| `APP_ENV` | Environment tag used in a few log/behavior branches |
| `FRONTEND_ORIGIN` | CORS allow-origin + base URL for links in emails (magic-link, unsubscribe, alert emails) |
| `INTERNAL_API_SECRET` | Shared secret gating server-to-server-only routes (`/api/cron`, `/api/ai`, `/api/sync`, `/api/scripts`, `/api/admin`) via `requireInternalSecret` — must match the frontend's copy |
| `SESSION_SECRET` | Passport session secret; also the fallback source for `EMAIL_UNSUB_SECRET` if that's unset |
| `EMAIL_UNSUB_SECRET` *(optional)* | HMAC secret for one-click unsubscribe tokens; falls back to `SESSION_SECRET`, then a random-per-boot value (never a hardcoded string) |
| `RESEND_API_KEY` | Transactional email (magic links, welcome/feedback/weekly-summary/company-alert emails) |
| `RESEND_FROM_EMAIL` | From-address for all of the above; falls back to `noreply@workway.dev` |
| `DODO_PAYMENTS_API_KEY` | Dodo Payments SDK auth for creating checkout sessions |
| `DODO_PAYMENTS_ENVIRONMENT` | `test` or `live` |
| `DODO_PAYMENTS_WEBHOOK_KEY` | Webhook signing secret (`standardwebhooks` verification) for `/api/billing/webhook` |
| `CF_ACCOUNT_ID` / `CF_R2_ACCESS_KEY` / `CF_R2_SECRET_KEY` | Cloudflare R2 — resume/avatar uploads for Talent Profiles |
| `OPENROUTER_API_KEY` | AI-assisted routes (`/api/ai`) |

### Frontend (currently inlined in `workway-infra/docker-compose.yml`'s `frontend.environment`)

| Var | Purpose |
|---|---|
| `BACKEND_API_URL` | Server-side base URL for backend calls (`http://backend:3000` inside the Docker network) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL — SEO metadata, sitemap, absolute links |
| `AUTH_SECRET` | NextAuth v5 JWT signing secret |
| `AUTH_TRUST_HOST` | Required behind a reverse proxy (nginx) so NextAuth trusts the forwarded host |
| `AUTH_URL` | Explicit NextAuth base URL (`https://www.workway.dev/api/auth`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth provider |
| `INTERNAL_API_SECRET` | Must match the backend's — sent as `x-internal-api-secret` on every BFF→backend call |

### Frontend build-time only (Docker `ARG`s in `Dockerfile`, must be passed to `docker build`, not just runtime `environment:`)

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Read by `src/lib/auth.ts` (magic-link verify, user sync) and client components calling the backend directly by absolute URL. **`NEXT_PUBLIC_*` vars are baked into the client JS bundle at build time** — setting them only in `docker-compose.yml`'s runtime `environment:` has no effect on the built frontend image; they must be passed as `--build-arg` (or set at build time in whatever process produces the image). |
| `NEXT_PUBLIC_SITE_URL`, `BACKEND_API_URL` | Also consumed at build time for static generation |
| `NEXT_PUBLIC_MIXPANEL_TOKEN` *(optional)* | Falls back to a hardcoded token in `AnalyticsProvider.tsx` if unset — fine for now, but move to a real build-arg if the token ever needs to rotate |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` *(optional)* | Same pattern — hardcoded fallback (`G-PMBBRGCPM5`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` *(optional)* | Cloudflare Turnstile widget on the login modal. Falls back to Cloudflare's public always-pass test key if unset — functional but zero real bot protection. Not a secret (site keys are meant to be client-embedded), but still build-time only. |
| `NEXT_PUBLIC_PAYMENTS_ENABLED` *(optional, default off)* | Set to the literal string `"true"` to show a real "Subscribe" button on `/pricing`; anything else (including unset) shows a disabled "Launching soon" button. Must match the backend's `PAYMENTS_ENABLED` — the backend independently refuses `POST /api/billing/checkout` with 503 if its own copy isn't `"true"`, so the frontend flag alone can't accidentally let a checkout through. |

**Current full build command** (run wherever the frontend image is actually built — not something `workway-infra` triggers itself):
```
docker build \
  --build-arg BACKEND_API_URL=http://backend:3000 \
  --build-arg NEXT_PUBLIC_SITE_URL=https://www.workway.dev \
  --build-arg NEXT_PUBLIC_API_URL=https://www.workway.dev \
  --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site key from Cloudflare Turnstile dashboard> \
  --build-arg NEXT_PUBLIC_PAYMENTS_ENABLED=false \
  -t ghcr.io/enigma-52/workway-frontend:latest .
```

## External services — current live configuration

- **Google Cloud Console**: OAuth redirect URI `https://www.workway.dev/api/auth/callback/google` registered.
- **Resend**: domain `workway.dev` verified — DKIM present; SPF includes `amazonses.com` alongside Cloudflare's; DMARC record added at `_dmarc.workway.dev`.
- **Dodo Payments**: webhook URL pointed at `https://www.workway.dev/api/billing/webhook`; currently in **test mode** (`DODO_PAYMENTS_ENVIRONMENT=test`) — flipping to live requires a real Dodo product for each plan and swapping the API/webhook keys.
- **Mixpanel**: project token in `NEXT_PUBLIC_MIXPANEL_TOKEN`; the client SDK refuses to load on `localhost`/private-LAN hosts (see `src/lib/analytics.ts`'s `isLocalDevHost()`) so local dev never pollutes production analytics — pass `?mp_debug=1` once to opt a local session in in for testing.
- **Cloudflare**: sits in front of the VPS. Watch for two past incidents if traffic issues recur: (1) edge-caching authenticated API responses — fixed via the `Cache-Control: no-store` carve-outs above; (2) an "AI Crawl Control" rule blocking Googlebot — was found disabled once already, worth checking first if organic traffic drops unexpectedly.

## Database: tables with no formal migration tool

There is no migration framework — each DAO file that introduced a table
carries the exact `CREATE TABLE` DDL as a comment at the top of the file
("Migration SQL (run once)"), and it was applied by hand against the live DB
when the feature shipped. **On a fresh environment, grep for that comment
pattern and run every one, in dependency order** (roughly: `users` →
`companies`/`jobs` → everything else). As of this writing, the tables using
this pattern include `job_alerts`, `job_reports`, `email_log`
(`reference_id` column added later, also documented inline),
`company_alert_checkpoint`, `feature_flags`, `plans`, `subscriptions`,
`dodo_webhook_events`, `cron_config`, `cron_runs`, `talent_profiles` and its
child tables (experiences/education/certifications), `saved_jobs`,
`applications`.

Two rows also need seeding by hand on a fresh DB (both are idempotent,
`ON CONFLICT DO NOTHING`, safe to re-run):
```sql
INSERT INTO company_alert_checkpoint (id, last_job_id)
VALUES (1, (SELECT COALESCE(MAX(id), 0) FROM jobs)) ON CONFLICT (id) DO NOTHING;

INSERT INTO feature_flags (flag_key, enabled, description) VALUES
  ('lifecycle_emails_enabled', false, 'Welcome/feedback/weekly-summary emails to real users.'),
  ('company_alert_emails_enabled', false, 'Instant email alerts when a followed company posts (Pro).')
ON CONFLICT (flag_key) DO NOTHING;
```

`cron_config` rows for every registered job are now created automatically at
boot (`ensureCronConfigRows()` in `cronScheduler.js`) — see
[`FEATURES.md`](./FEATURES.md#cron-jobs--admin-visibility) — so that one no
longer needs manual seeding.

## Rollout convention for anything gated behind a feature flag

Established pattern (weekly summary, company alerts): ship the code with the
flag **off**, verify via the admin panel's test-send (bypasses the flag,
sends only to the calling admin), flip it on for a single account first if
possible, then flip it globally. Never flip a real-user-facing flag on as
part of a routine deploy without this sequence — see
[`FEATURES.md`](./FEATURES.md) for what currently exists behind flags.
