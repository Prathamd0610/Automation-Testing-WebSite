# Security

Security controls implemented across the platform, mapped to the
[OWASP Top 10](https://owasp.org/www-project-top-ten/). This is a practice
application, but it is built with production-grade defaults.

## Authentication & sessions

- **JWT access + refresh tokens.** Access tokens are short-lived (default
  `15m`); refresh tokens last `7d`.
- **`httpOnly` cookies.** Tokens are delivered in `httpOnly` cookies
  (`access_token`, `refresh_token`) so they are not readable by JavaScript,
  mitigating token theft via XSS. A `Bearer` header is also accepted for API
  clients.
- **Production cookie hardening.** In `production`, cookies are `Secure` and
  `SameSite=None` (HTTPS required). In development they fall back to `Lax`/
  insecure so local HTTP works.
- **Refresh token rotation.** Only a hash of the refresh token
  (`refreshTokenHash`) is stored, never the token itself, and it is excluded from
  all responses.

## Password storage

- Hashed with **bcrypt (12 rounds)** on save.
- Policy: minimum 8 characters with at least one lowercase, one uppercase, and
  one digit.
- The `password` field uses `select: false` and is stripped by the model's
  `toJSON` transform — it can never appear in an API response.

## Input validation & injection defense

| Control | Library | Protects against |
| ------- | ------- | ---------------- |
| Schema validation of body/params/query | **Zod** | Malformed input, type confusion |
| NoSQL operator stripping | **express-mongo-sanitize** | MongoDB query injection (`$`/`.` keys) |
| Parameter pollution guard | **hpp** | Duplicated query params |
| Custom body sanitizer | in-house middleware | Unexpected payload shapes |
| ObjectId format check | regex `^[0-9a-fA-F]{24}$` | Malformed id lookups |

## HTTP hardening

- **Helmet** sets standard security headers; cross-origin resource policy is set
  for the API.
- **CORS** is locked to `FRONTEND_URL` with credentials enabled — only the known
  web origin may make credentialed requests.
- **Body size limits** of 1 MB on JSON and URL-encoded parsers.
- **Nginx** (production) adds `X-Frame-Options: SAMEORIGIN`,
  `X-Content-Type-Options: nosniff`, and a `Referrer-Policy`, and serves hashed
  assets with an immutable cache policy.

## Rate limiting (brute-force / DoS mitigation)

| Scope | Limit |
| ----- | ----- |
| Global (`/api`) | 1000 / 15 min |
| Auth (`/api/auth`) | 20 / 15 min |
| Test-data generator | 50 / 5 min |

## File upload safety

- **MIME whitelist:** `image/png`, `image/jpeg`, `image/gif`, `image/webp`,
  `application/pdf`, `text/plain`, `text/csv`, `application/json`.
- **Size cap** via `MAX_UPLOAD_BYTES` (default 5 MB) and a **max of 10 files**
  per request.
- Stored files are renamed to `{timestamp}-{randomId}.{ext}` to avoid path
  traversal and collisions; they are served read-only from `/uploads`.

## Authorization

- Role-based access (`user` / `admin`).
- **Admin-only** surfaces: user management (`/api/users`) and the test-data
  generator (`/api/admin/test-data/generate`).
- Other CRUD resources are intentionally public so they can be practiced
  against without authentication.

## Configuration & secrets

- **Fail-fast env validation** (`server/src/config/env.ts`, Zod) rejects missing
  or weak configuration at startup; JWT secrets must be ≥ 16 characters.
- The production Compose file **requires** secrets via `${VAR:?...}` and never
  ships real credentials.
- No secrets are logged or returned in responses.

## Auditing & observability

- An **`AuditLog`** collection records mutations and expires entries after
  **90 days** (TTL index).
- Winston structured logging, plus `/api/health` and `/api/metrics` endpoints.

## OWASP Top 10 (2021) mapping

| Risk | Mitigation in this project |
| ---- | -------------------------- |
| A01 Broken Access Control | Role checks on admin routes; ObjectId validation; CORS allow-list |
| A02 Cryptographic Failures | bcrypt password hashing; `httpOnly`/`Secure` cookies; secrets via env/secret stores |
| A03 Injection | Zod validation; `express-mongo-sanitize`; parameterized Mongoose queries |
| A04 Insecure Design | Layered architecture, least-privilege public/admin split, rate limits |
| A05 Security Misconfiguration | Helmet, fail-fast env validation, non-root container user |
| A06 Vulnerable Components | Pinned dependencies; CI build; npm workspaces lockfile |
| A07 Identification & Auth Failures | Password policy, auth rate limiting, short-lived tokens, refresh rotation |
| A08 Data Integrity Failures | Strict schema validation; signed JWTs |
| A09 Logging & Monitoring Failures | Winston logging, audit log, metrics/health endpoints |
| A10 SSRF | No server-side fetching of user-supplied URLs |

## Reporting

This is a practice/demo project. If you adapt it for real use, route any
vulnerability reports through your own responsible-disclosure process and rotate
the demo seed credentials immediately.
