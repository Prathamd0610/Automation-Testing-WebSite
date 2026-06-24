# ── Stage 1: build the TypeScript server ─────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies using the workspace lockfile for reproducible builds.
COPY package.json package-lock.json tsconfig.base.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/
RUN npm ci

# Compile the server to plain JS in server/dist.
COPY server ./server
RUN npm run build --workspace server

# ── Stage 2: production runtime (prod deps only, non-root) ───────────────────
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Create an unprivileged user to run the process.
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# Install production-only dependencies.
COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/
RUN npm ci --workspace server --include-workspace-root --omit=dev && npm cache clean --force

# Copy the compiled output and prepare the uploads directory.
COPY --from=builder /app/server/dist ./server/dist
RUN mkdir -p /app/server/uploads && chown -R nodejs:nodejs /app

USER nodejs
WORKDIR /app/server
EXPOSE 5000

# Liveness probe hits the app's own health endpoint.
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
