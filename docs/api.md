# API Reference

REST API for the Automation Testing Practice Platform.

- **Base URL:** `{server}/api` (local default `http://localhost:5000/api`)
- **Content type:** `application/json` (file upload uses `multipart/form-data`)
- **Auth:** JWT via `httpOnly` cookies **or** `Authorization: Bearer <token>`

## Response envelope

Every successful response shares one shape:

```json
{
  "success": true,
  "message": "Created",
  "data": { "id": "65f0...", "name": "Widget" }
}
```

List endpoints add a `meta` block:

```json
{
  "success": true,
  "data": [ { "id": "65f0..." } ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

Errors use:

```json
{ "success": false, "message": "Validation failed: email is required" }
```

## Common query parameters (list endpoints)

| Param | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `page` | number | 1 | 1-based page index |
| `limit` | number | 20 | Items per page |
| `sort` | string | `-createdAt` | Sort expression, e.g. `name` or `-price` |
| `search` | string | — | Free-text search where supported |

Resource IDs are validated as 24-character hex ObjectIds; a malformed id returns
`400`, a well-formed but missing id returns `404`.

---

## Authentication

Base path `/api/auth`. Login/refresh set `access_token` (15 min) and
`refresh_token` (7 days) `httpOnly` cookies; tokens are also returned in the body.

| Method | Path | Auth | Body |
| ------ | ---- | ---- | ---- |
| POST | `/auth/register` | Public | `{ name, email, password }` → `201` |
| POST | `/auth/login` | Public | `{ email, password }` → `200` |
| POST | `/auth/refresh` | Public | `{ refreshToken? }` or cookie → `200` |
| POST | `/auth/logout` | Optional | — → `200` |
| GET | `/auth/me` | Authenticated | — → `200` |

**Password policy:** minimum 8 characters, with at least one lowercase, one
uppercase, and one digit.

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"Secret123"}'
```

```json
// 201 Created
{
  "success": true,
  "message": "Registered",
  "data": {
    "user": { "id": "65f0...", "name": "Ada Lovelace", "email": "ada@example.com", "role": "user" },
    "accessToken": "eyJhbGciOi..."
  }
}
```

Common auth errors: duplicate email → `409`, invalid payload → `400`, wrong
credentials → `401`, missing/expired token on `/me` → `401`.

---

## CRUD resources

The following resources share an identical CRUD surface via the
`buildCrudRouter` factory. Replace `{resource}` with the base path.

| Method | Path | Success | Notes |
| ------ | ---- | ------- | ----- |
| GET | `/{resource}` | `200` | Paginated list (`data` + `meta`) |
| GET | `/{resource}/:id` | `200` | Single document |
| POST | `/{resource}` | `201` | `message: "Created"` |
| PUT | `/{resource}/:id` | `200` | Full/partial update |
| PATCH | `/{resource}/:id` | `200` | Partial update |
| DELETE | `/{resource}/:id` | `200` | `data: null`, `message: "Deleted"` |

| Resource | Base path | Auth |
| -------- | --------- | ---- |
| Products | `/api/products` | Public |
| Customers | `/api/customers` | Public |
| Employees | `/api/employees` | Public |
| Tasks | `/api/tasks` | Public |
| Orders | `/api/orders` | Public |
| Notifications | `/api/notifications` | Public |
| Files | `/api/files` | Public |
| **Users** | `/api/users` | **Admin only** |

See [Database schema](database-schema.md) for each resource's fields and
validation rules. Example create payloads:

```jsonc
// POST /api/products
{ "name": "Trail Pack", "sku": "tw-1001", "category": "Outdoors", "price": 129.99 }
// sku is stored uppercased -> "TW-1001"

// POST /api/customers
{ "name": "Globex", "email": "ops@globex.test", "phone": "+1-555-0100", "status": "lead" }

// POST /api/employees
{ "employeeId": "e-204", "firstName": "Grace", "lastName": "Hopper",
  "email": "grace@corp.test", "department": "R&D", "position": "Engineer",
  "salary": 120000, "hireDate": "2023-02-01" }

// POST /api/tasks
{ "title": "Write regression suite", "priority": "high", "status": "todo" }

// POST /api/orders
{ "customerName": "Ada", "customerEmail": "ada@example.com",
  "items": [ { "product": "65f0...", "name": "Trail Pack", "price": 129.99, "quantity": 1 } ],
  "subtotal": 129.99, "total": 140.39 }
```

---

## Notifications

Base path `/api/notifications` (CRUD list/create/delete plus):

| Method | Path | Success | Description |
| ------ | ---- | ------- | ----------- |
| POST | `/notifications/read-all` | `200` | Mark all as read |
| PATCH | `/notifications/:id/read` | `200` | Mark one as read |

---

## Files

Base path `/api/files`. Uploads are `multipart/form-data` with a `files` field
(array). Stored files are served from `/uploads/<storedName>`.

| Method | Path | Success | Notes |
| ------ | ---- | ------- | ----- |
| POST | `/files` | `201` | Up to 10 files; size capped by `MAX_UPLOAD_BYTES` (default 5 MB) |
| GET | `/files` | `200` | Paginated metadata list |
| GET | `/files/:id` | `200` | Single file metadata |
| DELETE | `/files/:id` | `200` | Removes metadata + stored file |

**Allowed MIME types:** `image/png`, `image/jpeg`, `image/gif`, `image/webp`,
`application/pdf`, `text/plain`, `text/csv`, `application/json`.

```bash
curl -X POST http://localhost:5000/api/files \
  -F 'files=@./report.pdf' -F 'files=@./avatar.png'
```

---

## Health & metrics

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/api/health` | `{ status: "ok", database: "connected" }` |
| GET | `/api/metrics` | Request counters and uptime |

---

## Admin: test data generator

| Method | Path | Auth | Body | Success |
| ------ | ---- | ---- | ---- | ------- |
| POST | `/api/admin/test-data/generate` | Admin | `{ kind, count? }` | `201` |

`kind` is one of `users`, `products`, `orders`, `employees`, `customers`. Rate
limited to 50 requests per 5 minutes.

---

## Playground (practice endpoints)

Base path `/api/playground`. These endpoints exist purely to practice API
automation — deterministic echoes, controllable status codes, delays, and
flakiness.

| Method | Path | Behaviour |
| ------ | ---- | --------- |
| GET/POST/PUT/PATCH/DELETE | `/playground/echo` | Echoes `{ method, path, headers, query, body, timestamp }`. GET → `200`, POST → `201`. |
| GET | `/playground/status/:code` | Responds with the requested HTTP status `code`. |
| GET | `/playground/delay/:ms` | Waits `ms` (capped at 10 000) then `200 { delayedMs }`. |
| GET | `/playground/random` | `200` ~80% of the time, `500` ~20%. |
| GET/POST | `/playground/flaky?key=&threshold=` | Fails with `503` until the attempt count for `key` reaches `threshold` (min 2), then `200`. |

```bash
# Deterministic flaky endpoint: fails once, then succeeds
curl 'http://localhost:5000/api/playground/flaky?key=run-1&threshold=2'  # 503
curl 'http://localhost:5000/api/playground/flaky?key=run-1&threshold=2'  # 200
```

---

## WebSocket events

Socket.IO is served at `/socket.io` and shares the API's CORS configuration
(`FRONTEND_URL`, credentialed).

| Event | Direction | Payload |
| ----- | --------- | ------- |
| `connection:ack` | server → client | `{ id, message }` |
| `presence:count` | server → client | `{ online }` (on connect/disconnect) |
| `chat:send` | client → server | `{ user, text }` (text ≤ 500 chars) |
| `chat:message` | server → client | `{ id, user, text, timestamp }` (broadcast) |
| `counter:subscribe` | client → server | — (starts a 1 Hz push) |
| `counter:tick` | server → client | `{ value, timestamp }` |
| `counter:unsubscribe` | client → server | — (stops the push) |

---

## Rate limiting

| Scope | Limit |
| ----- | ----- |
| Global (`/api`) | 1000 requests / 15 min |
| Auth (`/api/auth`) | 20 requests / 15 min |
| Test-data generator | 50 requests / 5 min |

Rate limiting is disabled when `NODE_ENV=test`.
