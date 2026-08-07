# WorkWay Next

SSR frontend for [WorkWay](https://www.workway.dev) — job discovery, built with the Next.js App Router. Migrated from a legacy React Router app, with SEO-first metadata and server rendering.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- SSR data fetching against the WorkWay backend API
- GA4 + Mixpanel analytics

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

- `BACKEND_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_MIXPANEL_TOKEN`
- `AUTH_SECRET`, `AUTH_TRUST_HOST`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GOOGLE_SITE_VERIFICATION` (optional)

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | start dev server |
| `npm run build` | production build |
| `npm run start` | run production server |
| `npm run lint` | lint codebase |

## Production

Live at **[workway.dev](https://www.workway.dev)**.
