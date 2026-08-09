# ---------- BUILD STAGE ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Build arguments needed during Next.js build
    ARG BACKEND_API_URL
    ARG NEXT_PUBLIC_SITE_URL
    ARG NEXT_PUBLIC_BACKEND_API_URL
    ARG NEXT_PUBLIC_API_URL
    # NEXT_PUBLIC_* vars are inlined into the client JS bundle at build time —
    # setting them anywhere else (docker-compose's runtime `environment:`,
    # the container's shell env at startup) has no effect once the app is
    # built. Both of these MUST be passed as --build-arg on every build.
    ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
    ARG NEXT_PUBLIC_PAYMENTS_ENABLED

    ENV BACKEND_API_URL=$BACKEND_API_URL
    ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
    ENV NEXT_PUBLIC_BACKEND_API_URL=$NEXT_PUBLIC_BACKEND_API_URL
    ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
    ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
    ENV NEXT_PUBLIC_PAYMENTS_ENABLED=$NEXT_PUBLIC_PAYMENTS_ENABLED
    
    # Install dependencies (cached if package.json unchanged)
    COPY package*.json ./
    RUN npm ci
    
    # Copy project files
    COPY . .
    
    # Build Next.js app
    RUN npm run build
    
    
    # ---------- RUNTIME STAGE ----------
    FROM node:20-alpine
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=3000
    
    # Copy minimal runtime artifacts (standalone output already prunes node_modules)
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static

    EXPOSE 3000

    CMD ["node", "server.js"]