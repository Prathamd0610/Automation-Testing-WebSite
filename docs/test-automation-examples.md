# Test Automation Examples

This platform is designed to be automated. Every interactive element exposes a
stable `data-testid` and appropriate ARIA attributes, so selectors stay robust
across refactors and styling changes. This guide shows how to drive the app with
the three bundled e2e suites and how to exercise the API directly.

## Selector conventions

- **Prefer `data-testid`.** Locate by test id rather than CSS classes or text
  that may change.
- **State lives in attributes.** Toggle-style controls expose `aria-pressed`;
  result panels use `role="status"` with `aria-live="polite"` so values are both
  announced and assertable.
- **Result mirrors.** Many modules render a result panel whose `data-testid`
  reflects the latest action (e.g. `btn-last-action`, `btn-click-count`).

### Example: the Buttons module (`/modules/buttons`)

| Test id | Meaning |
| ------- | ------- |
| `btn-click` | Single-click button (increments `btn-click-count`) |
| `btn-double-click` | Sets `btn-last-action` to `double-click` |
| `btn-right-click` | Sets `btn-last-action` to `right-click` |
| `btn-async` | Shows a spinner, then `btn-last-action` = `async-complete` |
| `btn-toggle` | Toggles `aria-pressed` and `toggle-on`/`toggle-off` |
| `btn-click-count` | Live click counter |
| `btn-last-action` | Last action performed |

## Running the bundled suites

The reference suites live in [`e2e/`](../e2e/README.md). They target a running
instance via `E2E_BASE_URL` (default `http://localhost:5173`) and use the seeded
demo account `user@practice.dev` / `User1234!` (run `npm run seed` first).

```bash
cd e2e
npm install

# Playwright
npm run playwright:install
E2E_BASE_URL=http://localhost:5173 npm run test:playwright

# Cypress
E2E_BASE_URL=http://localhost:5173 npm run test:cypress

# Selenium WebDriver (headless Chrome)
E2E_BASE_URL=http://localhost:5173 npm run test:selenium
```

## UI automation snippets

### Playwright (TypeScript)

```ts
import { test, expect } from '@playwright/test';

test('counts single clicks', async ({ page }) => {
  await page.goto('/modules/buttons');
  await page.getByTestId('btn-click').click();
  await page.getByTestId('btn-click').click();
  await expect(page.getByTestId('btn-click-count')).toHaveText('2');
  await expect(page.getByTestId('btn-last-action')).toHaveText('single-click');
});
```

### Cypress (TypeScript)

```ts
describe('Buttons module', () => {
  it('toggles pressed state', () => {
    cy.visit('/modules/buttons');
    cy.get('[data-testid=btn-toggle]').as('toggle');
    cy.get('@toggle').should('have.attr', 'aria-pressed', 'false');
    cy.get('@toggle').click().should('have.attr', 'aria-pressed', 'true');
  });
});
```

### Selenium WebDriver (TypeScript)

```ts
import { Builder, By, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import assert from 'node:assert/strict';

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new Options().addArguments('--headless=new'))
  .build();

await driver.get(`${process.env.E2E_BASE_URL}/modules/buttons`);
const toggle = await driver.wait(
  until.elementLocated(By.css('[data-testid=btn-toggle]')),
  10_000,
);
assert.equal(await toggle.getAttribute('aria-pressed'), 'false');
await toggle.click();
assert.equal(await toggle.getAttribute('aria-pressed'), 'true');
await driver.quit();
```

## Handling async and flaky scenarios

The platform deliberately includes timing and flakiness so you can practice
resilient automation:

- **Async actions** — assert on the eventual state with a generous timeout
  rather than fixed sleeps:

  ```ts
  await page.getByTestId('btn-async').click();
  await expect(page.getByTestId('btn-last-action'))
    .toHaveText('async-complete', { timeout: 5_000 });
  ```

- **Deterministic flakiness** — the API `flaky` endpoint fails until a threshold
  is met, perfect for testing retry logic:

  ```bash
  curl 'http://localhost:5000/api/playground/flaky?key=demo&threshold=2'  # 503
  curl 'http://localhost:5000/api/playground/flaky?key=demo&threshold=2'  # 200
  ```

- **Controllable delays / status codes** — `/api/playground/delay/:ms` and
  `/api/playground/status/:code` let you simulate slow or error responses.

## API automation

The REST API returns a consistent envelope (`{ success, message, data, meta? }`),
which makes assertions simple. The backend's own suite uses **Supertest**:

```ts
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

it('creates a product and returns an id (not _id)', async () => {
  const res = await request(app)
    .post('/api/products')
    .send({ name: 'Trail Pack', sku: 'tw-1001', category: 'Outdoors', price: 129.99 });

  expect(res.status).toBe(201);
  expect(typeof res.body.data.id).toBe('string');
  expect(res.body.data._id).toBeUndefined();
  expect(res.body.data.sku).toBe('TW-1001'); // stored uppercased
});
```

See the [API reference](api.md) for every endpoint, the
[playground endpoints](api.md#playground-practice-endpoints) for chaos-style
practice, and [`e2e/README.md`](../e2e/README.md) for suite-specific details.

## Tips

- Start from the seeded data (`npm run seed`) for predictable assertions.
- Run automation against the single-origin Docker build (`http://localhost:8080`)
  to mirror production routing — set `E2E_BASE_URL` accordingly.
- Use the WebSocket modules (`chat:*`, `counter:*`) to practice realtime
  assertions; see [API reference → WebSocket events](api.md#websocket-events).
