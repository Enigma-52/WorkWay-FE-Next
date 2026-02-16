# Cutover Runbook (Zero Downtime)

## Pre-Cutover Checklist
- Production env vars configured in Vercel.
- Backend API origin reachable from Vercel runtime.
- Route parity validated for all public routes.
- SEO validation complete (metadata, canonical, sitemap, robots).
- Rollback owner assigned.

## Cutover Steps
1. Deploy `workway-next` to Vercel production target.
2. Smoke test:
   - `/api/health`
   - `/`
   - `/companies`
   - one sample `/company/[slug]`, `/domain/[slug]`, `/job/[slug]`
3. Switch domain alias to Next.js deployment.
4. Monitor 5xx, latency, and crawl stats for 30-60 minutes.

## Rollback Steps
1. Repoint domain alias back to legacy frontend deployment.
2. Confirm legacy smoke routes recover.
3. Keep failing Next deployment for debugging; do not delete artifact.
4. Log incident summary and corrective actions before next attempt.

