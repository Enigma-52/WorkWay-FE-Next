# Dodo Payments — Production Go-Live Checklist

## 1. Dodo dashboard
- [ ] Create **live-mode** products for every plan (Pro monthly, Pro yearly, Lifetime — Lifetime has no product yet)
- [ ] Generate a **live API key** and a **live webhook signing secret**
- [ ] Point the live webhook at `https://<prod-domain>/api/billing/webhook`, enabled for: `subscription.active`, `subscription.renewed`, `subscription.on_hold`, `subscription.failed`, `subscription.updated`

## 2. Database
- [ ] Update `plans.dodo_product_id` for every plan to the live product IDs

## 3. Environment variables
Backend (prod secrets store, not `.env` committed to disk):
- [ ] `DODO_PAYMENTS_API_KEY` → live key
- [ ] `DODO_PAYMENTS_WEBHOOK_KEY` → live webhook secret
- [ ] `DODO_PAYMENTS_ENVIRONMENT` → `live_mode`
- [ ] `PAYMENTS_ENABLED` → `true`

Frontend:
- [ ] `NEXT_PUBLIC_PAYMENTS_ENABLED` → `true`, then **rebuild/redeploy** (public env var is baked at build time)

## 4. Webhook sanity check
- [ ] Confirm `express.raw()` still runs before the JSON body parser on `/api/billing/webhook` in prod (`server.js:32`) — reordering silently breaks signature verification
- [ ] Confirm the endpoint is publicly reachable (no auth wall / VPN)

## 5. Live end-to-end test
- [ ] Real card checkout on each plan tier → confirm webhook fires → `users.plan_key` updates → pro-gated features (e.g. company follow alerts) unlock
- [ ] Test a decline → confirm it does NOT grant pro
- [ ] Refund the test charge afterward
- [ ] Check `dodo_webhook_events` rows move to processed, not stuck/error

## 6. Rollback plan
- [ ] If anything breaks post-launch: flip `PAYMENTS_ENABLED` and `NEXT_PUBLIC_PAYMENTS_ENABLED` back to `false` immediately rather than debugging live
- [ ] `grantPlan()` admin bypass (`source='admin_grant'`) still works for manual comps if Dodo has issues

---

## Separating test vs prod credentials

Dodo doesn't use differently-named keys for test vs live — it's the **same variable names**, switched by environment/deploy target. So separation has to happen at the infra level, not the code level:

**1. Never share one `.env` file across environments.**
Keep distinct files/secrets per environment:
- Local/dev: `WorkWay--BE/.env` — test-mode keys only
- Staging (if any): its own secret store entry — test-mode keys
- Production: its own secret store entry — live-mode keys

**2. Move prod secrets out of plaintext `.env` files entirely.**
Current test keys are committed in plaintext in `WorkWay--BE/.env` and `workway-infra/.env`. Don't repeat that for live keys — use your host's secret manager (e.g. Railway/Render/Fly secrets, AWS Secrets Manager, Doppler) so live keys never touch a file that could be git-added by accident.

**3. Gate by `DODO_PAYMENTS_ENVIRONMENT`, and make it match reality.**
`dodoService.js` reads `DODO_PAYMENTS_ENVIRONMENT` (`test_mode` default) and passes it straight to the SDK. The rule: this value and the API key/webhook secret must always be from the *same* mode — a live key with `test_mode` set (or vice versa) will fail or silently hit the wrong Dodo environment. Set all three together, per environment, never mixed.

**4. Separate product IDs per environment too.**
`plans.dodo_product_id` is per-plan, in the DB — not env-driven. If staging and prod share a database, you need either separate columns/rows per environment or a separate staging database, otherwise a staging checkout could resolve to a live product ID (or vice versa).

**5. Add a startup guard (recommended, not yet in code).**
Have the backend refuse to boot in prod if `DODO_PAYMENTS_ENVIRONMENT !== 'live_mode'`, and refuse to boot outside prod if it *is* `live_mode`. That turns a misconfigured deploy into a loud failure instead of accidentally charging real cards from staging, or vice versa.
