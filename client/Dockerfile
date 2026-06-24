# ── Stage 1: build the Vite production bundle ────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Build-time configuration. Defaults to a same-origin "/api" base so the bundle
# works behind the bundled Nginx reverse proxy with no hardcoded host names.
ARG VITE_API_URL=/api
ARG VITE_APP_NAME="Automation Testing Practice Platform"
ARG VITE_ENVIRONMENT=production
ENV VITE_API_URL=$VITE_API_URL \
    VITE_APP_NAME=$VITE_APP_NAME \
    VITE_ENVIRONMENT=$VITE_ENVIRONMENT

COPY package.json package-lock.json tsconfig.base.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN npm ci

COPY client ./client
RUN npm run build --workspace client

# ── Stage 2: serve the static bundle with Nginx ──────────────────────────────
FROM nginx:1.27-alpine AS runtime
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/client/dist /usr/share/nginx/html
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
