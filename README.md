<div align="center">

# 🧪 Automation Testing Practice Platform

### A production-grade **MERN** playground for practicing every kind of UI & API test automation.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-license)

**20+ practice modules · async & dynamic challenges · real CRUD business apps · JWT auth · WebSockets · file uploads**

[Features](#-features) · [Architecture](#️-architecture) · [Flows](#-application-flows) · [Quick Start](#-quick-start) · [Deployment](#️-deployment-vercel--render--uptimerobot) · [Docs](#-documentation)

</div>

---

## ✨ Overview

The **Automation Testing Practice Platform** gives QA & SDET engineers a single, realistic place to
practice **UI and API automation** — from simple buttons and inputs to drag‑and‑drop, tables, modals,
file uploads, WebSockets, Shadow DOM, iframes, and deliberately flaky/dynamic pages — plus full CRUD
business apps (**e‑commerce, banking, CRM, employee portal**) backed by a real API, database, and JWT auth.

> 🎯 **Every interactive element exposes a stable `data-testid` and proper ARIA attributes**, so your
> selectors stay rock‑solid across refactors and styling changes.

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#️-architecture)
- [Application Flows](#-application-flows)
  - [Authentication flow](#authentication-flow)
  - [User flow](#user-flow)
  - [Admin flow](#admin-flow)
  - [Employee (HR) flow](#employee-hr-flow)
  - [E‑commerce flow](#e-commerce-flow)
  - [Banking flow](#banking-flow)
  - [CRM flow](#crm-lead-lifecycle)
- [Database Schema](#️-database-schema)
- [Deployment](#️-deployment-vercel--render--uptimerobot)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Demo Accounts](#-demo-accounts)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [License](#-license)

---

## 🚀 Features

### 🧩 Practice modules (20+)

| | | | |
| --- | --- | --- | --- |
| ✅ Buttons | ✅ Inputs | ✅ Checkboxes | ✅ Radios |
| ✅ Dropdowns | ✅ Sliders | ✅ Date Picker | ✅ Tables |
| ✅ Modals | ✅ Drag & Drop | ✅ Mouse Actions | ✅ Keyboard |
| ✅ File Upload | ✅ Infinite Scroll | ✅ Iframes | ✅ Nested Frames |
| ✅ Shadow DOM | ✅ WebSockets | ✅ API Testing | ✅ Auth Demo |

### 🌀 Async & dynamic challenges

Autocomplete, multi‑step wizards, dynamic IDs, and flaky endpoints — for practicing **resilient waits & retries**.

### 🏢 Business workflows (real CRUD + DB)

| Workflow | What you practice |
| -------- | ----------------- |
| 🛒 **E‑commerce** | Product catalog, cart, orders, order status transitions |
| 🏦 **Banking** | Accounts, transfers, validation & error states |
| 👥 **CRM** | Customers, lead → active → inactive lifecycle |
| 👔 **Employees** | HR portal: paginated list, search, full CRUD |

---

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph Client["🖥️ Browser"]
        SPA["React 18 SPA<br/>Redux Toolkit · TanStack Query"]
    end
    subgraph Server["⚙️ Node.js API (Express)"]
        REST["REST controllers"]
        WS["Socket.IO gateway"]
        SVC["Service layer"]
        REPO["Repository layer"]
    end
    DB[("🍃 MongoDB")]

    SPA -->|HTTPS /api| REST
    SPA <-->|WebSocket| WS
    REST --> SVC --> REPO --> DB
    WS --> SVC
```

The backend follows a strict **controller → service → repository** flow with Zod validation, JWT auth,
Helmet, rate limiting, and a centralized error handler. See **[docs/architecture.md](docs/architecture.md)** for detail.

---

## 🔁 Application Flows

### Authentication flow

```mermaid
sequenceDiagram
    actor U as User
    participant C as React SPA
    participant A as API (Express)
    participant DB as MongoDB
    U->>C: Enter email + password
    C->>A: POST /api/auth/login
    A->>DB: Find user + bcrypt compare
    DB-->>A: User record
    A-->>C: 200 · httpOnly cookies (access + refresh) · accessToken
    C->>A: GET /api/auth/me
    A-->>C: Current user
    C-->>U: Redirect to dashboard
    Note over C,A: On 401, the SPA silently calls POST /api/auth/refresh
```

### User flow

```mermaid
flowchart TD
    Start([Visit app]) --> Auth{Authenticated?}
    Auth -- No --> SignIn[Sign in / Register]
    SignIn --> Dash[Dashboard]
    Auth -- Yes --> Dash
    Dash --> Modules[20+ Practice Modules]
    Dash --> Challenges[Async / Dynamic Challenges]
    Dash --> Workflows[Business Workflows]
    Workflows --> Shop[🛒 E-commerce]
    Workflows --> Bank[🏦 Banking]
    Workflows --> Crm[👥 CRM]
    Workflows --> Emp[👔 Employees]
```

### Admin flow

```mermaid
flowchart TD
    A([Sign in as admin]) --> D[Dashboard]
    D --> All[Everything a user can do]
    D --> UM[User Management<br/>/api/users]
    D --> TD[Test-Data Generator<br/>/api/admin/test-data]
    UM --> CU[Create / Update / Delete users]
    TD --> Gen[Bulk-generate users · products · orders · customers · employees]
```

### Employee (HR) flow

```mermaid
flowchart LR
    E([Employees page]) --> L[List + search + paginate]
    L --> C[Add employee] --> API1[(POST /api/employees)]
    L --> U[Edit employee] --> API2[(PUT /api/employees/:id)]
    L --> D[Delete employee] --> API3[(DELETE /api/employees/:id)]
```

### E‑commerce flow

```mermaid
flowchart LR
    P[Browse products] --> Cart[Add to cart]
    Cart --> Place[Place order]
    Place --> API[(POST /api/orders)]
    API --> S[Status: pending → paid → shipped → delivered]
```

### Banking flow

```mermaid
flowchart TD
    Acc[Select account] --> Amt[Enter amount]
    Amt --> T[Transfer]
    T --> V{Sufficient balance?}
    V -- Yes --> OK[Update balances · show receipt]
    V -- No --> Err[Show validation error]
```

### CRM lead lifecycle

```mermaid
stateDiagram-v2
    [*] --> lead
    lead --> active: convert
    active --> inactive: churn
    inactive --> active: re-engage
    active --> [*]
```

> 📄 **Want a single shareable file with all of these?** Open **[docs/flows.html](docs/flows.html)** in a
> browser and press **Ctrl/Cmd + P → Save as PDF**. It contains every flow, diagram, and the demo logins.

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USER {
        string id PK
        string email UK
        string role "user | admin"
    }
    PRODUCT { string id PK
        string sku UK
        number price }
    ORDER { string id PK
        string orderNumber UK
        string status }
    ORDER_ITEM { string product FK
        number quantity }
    CUSTOMER { string id PK
        string status }
    EMPLOYEE { string id PK
        string employeeId UK }
    ORDER ||--o{ ORDER_ITEM : embeds
    ORDER_ITEM }o--|| PRODUCT : references
```

Full field‑level schema, indexes, and TTL rules: **[docs/database-schema.md](docs/database-schema.md)**.

---

## ☁️ Deployment (Vercel + Render + UptimeRobot)

```mermaid
flowchart LR
    Dev[👩‍💻 You] -->|git push| GH[(GitHub repo)]
    GH -->|auto deploy| V[▲ Vercel<br/>React SPA]
    GH -->|auto deploy| R[Render<br/>Express API]
    User((🌍 User)) -->|HTTPS| V
    V -->|/api over HTTPS| R
    R -->|mongodb+srv| Atlas[(🍃 MongoDB Atlas)]
    UR[⏰ UptimeRobot] -->|ping /api/health every 5 min| R
```

| Piece | Platform | Notes |
| ----- | -------- | ----- |
| Frontend | **Vercel** | Set `VITE_API_URL=https://<your-api>.onrender.com/api` |
| Backend | **Render** | Set `NODE_ENV=production`, `MONGODB_URI`, JWT secrets, `FRONTEND_URL=<vercel-url>` |
| Database | **MongoDB Atlas** | Whitelist `0.0.0.0/0` so Render can connect |
| Keep‑alive | **UptimeRobot** | HTTP monitor on `https://<your-api>.onrender.com/api/health`, 5‑min interval |

Config files are included: [`render.yaml`](render.yaml) and [`vercel.json`](vercel.json).

---

## 🧰 Tech Stack

| Layer | Technology |
| ----- | ---------- |
| **Frontend** | React 18 · TypeScript · Vite · Redux Toolkit · TanStack Query · React Router · Tailwind CSS · ShadCN UI · Framer Motion · Axios |
| **Backend** | Node.js · Express · TypeScript · Mongoose · Zod · JWT · Socket.IO · Multer · Winston |
| **Database** | MongoDB (Atlas in production, Docker locally) |
| **Testing** | Jest + Supertest (API) · Vitest + RTL (UI) · Playwright / Cypress / Selenium (e2e) |
| **DevOps** | Docker · Docker Compose · Nginx · GitHub Actions · Vercel · Render |

---

## ⚡ Quick Start

> Requires **Node.js ≥ 20**. Use **MongoDB Atlas** (recommended) or a local MongoDB.

```bash
# 1. Install all workspace dependencies
npm install

# 2. Create env files (then edit with your values)
cp .env.example server/.env
cp .env.example client/.env

# 3. Seed demo data (creates the demo accounts below)
npm run seed

# 4. Run backend + frontend together
npm run dev
```

| Surface | URL |
| ------- | --- |
| 🌐 Web | http://localhost:5173 |
| ❤️ API health | http://localhost:5000/api/health |

<details>
<summary><b>Run with Docker instead</b></summary>

```bash
cp .env.example .env
npm run docker:up   # MongoDB + API + Nginx-served frontend
```
</details>

---

## 🔑 Demo Accounts

Created by `npm run seed`. Use these to explore every flow:

| Role | Email | Password | Unlocks |
| ---- | ----- | -------- | ------- |
| 👤 **User** | `user@practice.dev` | `User1234!` | All practice modules, challenges & business workflows |
| 🛡️ **Admin** | `admin@practice.dev` | `Admin123!` | Everything above **+ user management + test‑data generator** |

> ⚠️ These are **seed defaults for demo/practice use**. The login screen no longer displays them.
> **Change them in [`server/src/seeders/index.ts`](server/src/seeders/index.ts) before any public deployment.**

---

## 🧪 Testing

| Command | What it runs |
| ------- | ------------ |
| `npm run test:server` | Jest + Supertest API/integration tests |
| `npm run test:client` | Vitest + React Testing Library UI tests |
| `npm run lint` | ESLint across both workspaces |
| `npm run typecheck` | TypeScript checks across both workspaces |

Reference end‑to‑end suites live in [`e2e/`](e2e/README.md): **Playwright**, **Cypress**, and **Selenium WebDriver** —
each demonstrating the same login + module flows with stable `data-testid` selectors.

---

## 📁 Project Structure

```
.
├── client/      # React + Vite front end (TypeScript)
├── server/      # Express + Mongoose API (controller → service → repository)
├── e2e/         # Playwright, Cypress & Selenium reference suites
├── docs/        # Architecture, schema, API, deployment & flow docs (+ flows.html)
├── render.yaml  # Render (backend) blueprint
├── vercel.json  # Vercel (frontend) build config
└── package.json # npm workspaces root
```

---

## 📚 Documentation

| Doc | Description |
| --- | ----------- |
| [🏗️ Architecture](docs/architecture.md) | System design, layers & request lifecycle |
| [🗄️ Database schema](docs/database-schema.md) | Collections, fields, indexes & ERD |
| [🔌 API reference](docs/api.md) | Every endpoint, payloads & response envelope |
| [📄 Flows (HTML → PDF)](docs/flows.html) | **All flows & diagrams in one shareable file** |
| [💻 Local setup](docs/deployment-local.md) | Run on your machine |
| [🐳 Docker](docs/deployment-docker.md) | Containerized stack |
| [☁️ Azure](docs/deployment-azure.md) · [☁️ AWS](docs/deployment-aws.md) | Cloud deployment paths |
| [🔒 Security](docs/security.md) | Auth, hardening & OWASP mapping |
| [🧪 Test automation examples](docs/test-automation-examples.md) | Selector patterns & sample tests |

---

## 📄 License

Released under the **MIT License**.

<div align="center">

**Built for QA & SDET engineers — happy automating! 🚀**

</div>
