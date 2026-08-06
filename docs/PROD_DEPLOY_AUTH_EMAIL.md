# Prod config needed: auth (Google + magic link) and Resend email

Everything works locally; these are the prod-only gaps to close before/around deploy.

## workway-infra/.env

- `FRONTEND_ORIGIN=https://www.workway.dev`
  - BE CORS allow-origin (`server.js`) and magic-link email URL builder (`magicLinkService.js`) both default to `http://localhost:3001` without this. Missing it breaks all credentialed API calls from prod and sends localhost links in magic-link emails.
- `RESEND_FROM_EMAIL` — confirm/set explicitly (currently falls back to hardcoded `noreply@workway.dev`).

## workway-infra/docker-compose.yml (`frontend` service)

- Fix `NEXT_PUBLIC_SITE_URL` from `http://localhost` to `https://www.workway.dev`.
- Add `AUTH_SECRET` (generate fresh, e.g. `openssl rand -base64 32`) — required by NextAuth v5 at runtime.
- Add `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — read server-side by `src/lib/auth.ts`, not currently passed to this container.
- Add `AUTH_TRUST_HOST=true` — needed behind the nginx reverse proxy.

## FE build (`Dockerfile` + `.github/workflows/deploy.yml`)

- Add `NEXT_PUBLIC_API_URL=https://www.workway.dev` as a build-arg. `src/lib/auth.ts` reads this specific var; only `NEXT_PUBLIC_BACKEND_API_URL` (unused in code) is currently passed.

## External: Google Cloud Console

- Add `https://www.workway.dev/api/auth/callback/google` as an authorized redirect URI (NextAuth's callback path — distinct from the BE's older passport route at `/api/auth/google/callback`; confirm whether that flow is still live and needs its own URI too).

## External: Resend / DNS (workway.dev)

- DKIM (`resend._domainkey.workway.dev`) is already present — domain is added in Resend.
- SPF currently only covers Cloudflare mail routing (`v=spf1 include:_spf.mx.cloudflare.net ~all`); add `include:amazonses.com` so Resend's sending infra is authorized.
- No `_dmarc.workway.dev` record exists — add one to reduce spam-foldering risk for magic-link emails on strict providers (Gmail/Outlook).
