# End-to-End Sample Suites

Reference UI automation suites for the Automation Testing Practice Platform, one
per popular framework. They are intentionally small — they exist to demonstrate
stable-selector patterns (`data-testid`) and project wiring you can copy.

| Framework | Language | Folder | Runner script |
| --------- | -------- | ------ | ------------- |
| Playwright | TypeScript | `playwright/` | `npm run test:playwright` |
| Cypress | TypeScript | `cypress/` | `npm run test:cypress` |
| Selenium WebDriver | TypeScript | `selenium/` | `npm run test:selenium` |

## Prerequisites

1. The platform must be running and reachable. By default the suites target the
   Vite dev server at `http://localhost:5173`. Override with the `E2E_BASE_URL`
   environment variable (for example the Docker stack at `http://localhost:8080`).
2. The authentication specs use the seeded demo account
   `user@practice.dev` / `User1234!`. Seed the database first:

   ```bash
   npm run seed         # from the repository root
   ```

3. Install the e2e dependencies (kept separate from the app workspaces):

   ```bash
   cd e2e
   npm install
   ```

## Running

```bash
# From the e2e/ folder

# Playwright (installs browsers on first run)
npm run playwright:install
E2E_BASE_URL=http://localhost:5173 npm run test:playwright

# Cypress (headless)
E2E_BASE_URL=http://localhost:5173 npm run test:cypress
# or interactive
npm run cypress:open

# Selenium WebDriver (Selenium Manager auto-provisions ChromeDriver; needs Chrome)
E2E_BASE_URL=http://localhost:5173 npm run test:selenium
```

On Windows PowerShell, set the variable separately:

```powershell
$env:E2E_BASE_URL = 'http://localhost:5173'; npm run test:playwright
```

## What is covered

- **Authentication** — sign in with the demo account, land on the dashboard, and
  surface an inline error for invalid credentials.
- **Buttons module** — click counting, toggle `aria-pressed` state, and an
  asynchronous action resolving — all asserted through stable `data-testid`s.

Every interactive element in the app exposes a `data-testid` plus appropriate
ARIA attributes, so these patterns extend directly to the other 30+ modules.
