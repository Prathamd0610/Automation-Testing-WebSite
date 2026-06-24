# Local Setup

Run the platform on your machine without Docker (except optionally for MongoDB).

## Prerequisites

| Tool | Version |
| ---- | ------- |
| Node.js | ≥ 20 |
| npm | ≥ 10 |
| MongoDB | 6 or 7 (local install, or `docker compose up mongo`) |

## 1. Install dependencies

The repository is an npm-workspaces monorepo (`client` + `server`). A single
install at the root wires both:

```bash
npm install
```

## 2. Create environment files

```bash
cp .env.example .env
cp .env.example server/.env
cp .env.example client/.env
```

Edit the values as needed. The essentials:

**Server** (`server/.env`):

| Variable | Required | Default | Notes |
| -------- | -------- | ------- | ----- |
| `PORT` | no | `5000` | API port |
| `MONGODB_URI` | **yes** | — | e.g. `mongodb://localhost:27017/automation_practice` |
| `JWT_SECRET` | **yes** | — | ≥ 16 chars |
| `JWT_REFRESH_SECRET` | **yes** | — | ≥ 16 chars |
| `JWT_ACCESS_EXPIRES_IN` | no | `15m` | |
| `JWT_REFRESH_EXPIRES_IN` | no | `7d` | |
| `FRONTEND_URL` | no | `http://localhost:5173` | CORS + Socket.IO origin |
| `LOG_LEVEL` | no | `info` | |
| `MAX_UPLOAD_BYTES` | no | `5242880` | 5 MB |

**Client** (`client/.env`):

| Variable | Default | Notes |
| -------- | ------- | ----- |
| `VITE_API_URL` | `http://localhost:5000/api` | Must include the `/api` suffix |
| `VITE_APP_NAME` | `Automation Testing Practice Platform` | |
| `VITE_ENVIRONMENT` | `development` | |

> The backend validates its environment with Zod at startup and exits
> immediately if a required variable is missing or invalid.

## 3. Start MongoDB

Either use a local MongoDB service, or start just the database container:

```bash
docker compose up -d mongo
```

## 4. Seed demo data (optional)

```bash
npm run seed
```

Creates the demo accounts (`admin@practice.dev` / `Admin123!` and
`user@practice.dev` / `User1234!`) plus sample business data.

## 5. Run the app

```bash
npm run dev
```

| Surface | URL |
| ------- | --- |
| Web (Vite) | http://localhost:5173 |
| API health | http://localhost:5000/api/health |

## Useful scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Client + server in watch mode |
| `npm run build` | Build both workspaces |
| `npm run typecheck` | Type-check both workspaces |
| `npm run lint` | Lint both workspaces |
| `npm run test` | Run server + client tests |
| `npm run test:server` | Jest + Supertest (API) |
| `npm run test:client` | Vitest + React Testing Library (UI) |
| `npm run seed` | Seed demo data |
| `npm run format` | Prettier write |

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| Server exits on start with a config error | A required env var is missing/invalid — check `server/.env`. |
| `401` on every request from the browser | Ensure `FRONTEND_URL` matches the web origin so credentialed CORS + cookies work. |
| CORS error in the console | `VITE_API_URL` origin and the API's `FRONTEND_URL` must agree. |
| WebSocket won't connect | Confirm `VITE_API_URL` includes `/api` so `apiOrigin` resolves correctly. |
| Mongo connection refused | Start MongoDB (`docker compose up -d mongo`) and verify `MONGODB_URI`. |

For containerized runs see [Docker deployment](deployment-docker.md).
