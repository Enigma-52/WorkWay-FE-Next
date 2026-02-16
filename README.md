# WorkWay Next

Next.js App Router SSR frontend for WorkWay, migrated from the legacy React Router app with SEO-first metadata, server rendering, and Vercel deployment support.

## Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- SSR data fetching against WorkWay backend APIs
- GA4 + Mixpanel analytics

## Local Setup
```bash
npm install
cp .env.example .env
npm run dev
```

## Required Environment Variables
- `BACKEND_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_MIXPANEL_TOKEN`
- `GOOGLE_SITE_VERIFICATION` (optional)

## Scripts
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint codebase

## Production
- Primary domain: `https://www.workway.dev`
- Backend API: `https://workway-be-4w3lv.ondigitalocean.app`
- Deployed on Vercel
