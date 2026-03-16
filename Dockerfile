# ---------- BUILD STAGE ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Build arguments needed during Next.js build
    ARG BACKEND_API_URL
    ARG NEXT_PUBLIC_SITE_URL
    ARG NEXT_PUBLIC_BACKEND_API_URL

    ENV BACKEND_API_URL=$BACKEND_API_URL
    ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
    ENV NEXT_PUBLIC_BACKEND_API_URL=$NEXT_PUBLIC_BACKEND_API_URL
    
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
    
    # Copy minimal runtime artifacts
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/next.config.* ./
    
    EXPOSE 3000
    
    CMD ["npm", "start"]