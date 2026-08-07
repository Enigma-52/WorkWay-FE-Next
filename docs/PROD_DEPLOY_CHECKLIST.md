# Prod deploy checklist: auth + Resend email

Verified against current repo state and live DNS on 2026-08-07. Nothing below is done yet.

1. **`workway-infra/.env`**
   - Add `FRONTEND_ORIGIN=https://www.workway.dev` — missing today, so BE CORS (`src/server.js`) and magic-link URLs (`magicLinkService.js`) fall back to `localhost:3001`.
   - Add/confirm `RESEND_FROM_EMAIL` — missing today, falls back to hardcoded `noreply@workway.dev`.

2. **`workway-infra/docker-compose.yml`** (`frontend` service)
   - Change `NEXT_PUBLIC_SITE_URL` from `http://localhost` to `https://www.workway.dev`.
   - Add `AUTH_SECRET` (generate with `openssl rand -base64 32`) — required by NextAuth v5 at runtime, not set currently.
   - Add `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — read server-side by `src/lib/auth.ts`, not currently passed to this container.
   - Add `AUTH_TRUST_HOST=true` — needed behind the nginx reverse proxy.

3. **FE build (`Dockerfile` + `.github/workflows/deploy.yml`)**
   - Add `NEXT_PUBLIC_API_URL=https://www.workway.dev` as a build-arg. `src/lib/auth.ts` reads this var for magic-link verify and user-sync calls; only `BACKEND_API_URL` and `NEXT_PUBLIC_SITE_URL` are currently passed.

4. **Google Cloud Console**
   - Add `https://www.workway.dev/api/auth/callback/google` as an authorized redirect URI (NextAuth's callback path).
   - Confirm whether the BE's older passport route (`GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback` in `workway-infra/.env`) is still live — if so, it needs its own prod redirect URI too.

5. **DNS (workway.dev)** — live status checked 2026-08-07:
   - DKIM (`resend._domainkey.workway.dev`) — done, already present.
   - SPF — not done. Currently `v=spf1 include:_spf.mx.cloudflare.net ~all`; add `include:amazonses.com` for Resend.
   - DMARC — not done. No `_dmarc.workway.dev` record exists; add one to reduce spam-foldering on Gmail/Outlook.
