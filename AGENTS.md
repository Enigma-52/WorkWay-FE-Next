# AGENTS.md (workway-next)

## Scope
- This folder contains the new Next.js SSR migration target for WorkWay.
- Do not modify legacy apps in `/Users/enigma/Documents/GitHub/WorkWay-complete/WorkWay--FE` or `/Users/enigma/Documents/GitHub/WorkWay-complete/WorkWay--BE` from inside this workspace unless explicitly asked.

## Primary Goals
- Preserve all existing user-facing behavior, styling, and flows from the current frontend.
- Improve SEO and crawlability using Next.js App Router SSR/SSG/ISR.
- Keep backend API contracts unchanged and integrate with existing `/api/*` endpoints.
- Ensure deployment is production-ready on Vercel with zero-downtime rollout support.

## Migration Rules
- Treat this as a structural migration, not a redesign.
- Keep route parity with legacy frontend:
  - `/`
  - `/jobs`
  - `/about`
  - `/companies`
  - `/domains`
  - `/hireme`
  - `/company/[companySlug]`
  - `/domain/[domainSlug]`
  - `/job/[jobSlug]`
- Preserve current query parameter behavior for listing/filter pages.
- Keep canonical/meta/OG/Twitter behavior equivalent or better.

## Backend Contract Baseline
- Existing backend app is in `/Users/enigma/Documents/GitHub/WorkWay-complete/WorkWay--BE`.
- Required endpoints to preserve:
  - `GET /api/company`
  - `GET /api/company/details`
  - `GET /api/company/overview`
  - `GET /api/job/details`
  - `GET /api/filter/domain`
  - `GET /api/filter/domain/all`
  - `GET /api/feed/home`
  - `GET /api/sitemap.xml`
  - `GET /api/sitemaps/static.xml`
  - `GET /api/sitemaps/companies.xml`
  - `GET /api/sitemaps/domains.xml`
  - `GET /api/sitemaps/jobs.xml`

## Engineering Standards
- TypeScript-first.
- Server Components by default, Client Components only where browser APIs/interactivity are needed.
- Centralize API calls and metadata helpers.
- Add minimal, targeted comments only when logic is non-obvious.
- Do not add unnecessary dependencies.

## Validation Expectations
- Functional parity checks for each migrated route.
- SEO checks: metadata, canonical, sitemap, robots, structured data.
- Performance checks: LCP/CLS/INP, bundle size, cache headers.
- Hydration mismatch checks in preview and production-like environments.

## Deployment Workflow (Mandatory)
- For any code change, always commit and push to the GitHub repository first.
- Do not rely on manual direct Vercel production deploys as the primary path.
- Production deployment must happen through GitHub-connected auto deployment.
- After pushing, verify the production deployment status and production URL health.
- In production this app is actually **self-hosted** (Docker on a DigitalOcean
  droplet, see `workway-infra/`), not Vercel — pushing to `main` only builds
  and pushes a new `ghcr.io/enigma-52/workway-frontend:latest` image via
  `.github/workflows/deploy.yml`; it does **not** deploy it. Someone has to
  run `workway-infra/deploy.sh` on the droplet (or `--no-pulse` to skip the
  observability stack) to actually pick up the new image, for both frontend
  and backend together — never deploy just one side of a paired change.

## BFF Pattern: Routes Under `src/app/api/*` That Call the Backend

This app is the **only** thing allowed to establish a user's identity for
WorkWay — the backend (`WorkWay--BE`) has no session layer of its own and
trusts whatever `user_id`/`email` is handed to it on identity-sensitive
routes (`applications`, `saved-jobs`, `alerts`, `api-keys`, `user/me`).
Nginx routes those paths straight to this app (see
`workway-infra/nginx/nginx.conf`), and this app then calls the backend
directly over the internal Docker network (`BACKEND_API_URL`,
`http://backend:3000` in prod) as a BFF.

Every route handler under `src/app/api/*` that forwards to one of those
backend routes must:

1. **Call `auth()` first** and 401 if there's no `session.user.dbId` (or
   `session.user.email`, for routes keyed on email like `/api/user/me`
   PATCH) — never trust an identity field from the request body/query.
2. **Always use the session-derived identity**, discarding any client-sent
   `user_id`/`email` in the body (`{ ...body, user_id: session.user.dbId }` —
   the session value must come after the spread so it wins).
3. **Send the internal secret** on every fetch to the backend:
   `headers: { "x-internal-api-secret": process.env.INTERNAL_API_SECRET || "" }`
   (add `"Content-Type": "application/json"` alongside it for
   POST/PATCH/PUT). The backend route 401s without it. See any file under
   `src/app/api/applications/`, `saved-jobs/`, `alerts/`, `api-keys/`, or
   `user/me/` for the reference shape.

**When adding a new BFF route that talks to a newly-gated backend route**,
add the header in the same commit as the backend's `requireInternalSecret`
gate is *proposed*, but deploy this app first — the backend gate must never
go live before the frontend is already sending the header, or real user
requests start 401ing in the gap. See `WorkWay--BE/AGENTS.md` section 10 for
the backend side of this pattern and where the shared secret lives.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
