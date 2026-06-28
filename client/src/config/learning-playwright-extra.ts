import { Crosshair, Radio, Blocks, Server } from 'lucide-react';
import type { LearningTrack } from './learning';

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Playwright — Extra Tracks (Part 1 of 2): P5–P8
 *  Deep-dive tracks that triple the Playwright curriculum. Every lesson keeps
 *  the same two running examples: google.com and "this platform" (the practice
 *  modules with stable data-testid hooks).
 *  Imported by learning-playwright.ts and merged into playwrightTracks.
 * ──────────────────────────────────────────────────────────────────────────
 */

/* ════════════════════════════════════════════════════════════════════════
   TRACK P5 — Playwright Locator Mastery
   ════════════════════════════════════════════════════════════════════════ */

const playwrightLocators: LearningTrack = {
  id: 'playwright-locator-mastery',
  category: 'Playwright',
  title: 'Playwright Locator Mastery',
  subtitle: 'Every way to find an element, in depth',
  description:
    'Go far beyond the basics of locating elements: ARIA roles and accessible names, the text and CSS engines, XPath when you truly need it, filtering and chaining, frames and shadow DOM, tables and virtualized lists, custom selector engines, and a full troubleshooting playbook for strict-mode and timing issues.',
  icon: Crosshair,
  level: 'intermediate',
  tags: ['playwright', 'locators', 'aria', 'css', 'xpath', 'shadow-dom'],
  lessons: [
    {
      id: 'roles-accessible-names',
      title: 'Roles & Accessible Names in Depth',
      summary: 'Master getByRole — the most resilient, user-facing way to locate anything.',
      duration: 14,
      practice: ['buttons', 'forms', 'tabs', 'modals'],
      objectives: [
        'Use every common ARIA role with getByRole',
        'Control matching with name, exact, level and pressed',
        'Read the accessibility tree to choose names',
      ],
      blocks: [
        { kind: 'heading', text: 'Why roles win' },
        {
          kind: 'paragraph',
          text: 'An element’s **role** (button, link, checkbox, heading…) and its **accessible name** rarely change, even through redesigns. `getByRole` targets both, so it survives restyling and doubles as a lightweight accessibility check — if Playwright cannot find the role, neither can a screen reader.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// google.com
await page.getByRole('combobox', { name: 'Search' }).fill('playwright');
await page.getByRole('button', { name: 'Google Search' }).first().click();

// this platform
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('heading', { level: 1, name: 'Buttons' }).waitFor();
await page.getByRole('tab', { name: 'Profile' }).click();
await page.getByRole('checkbox', { name: 'I agree' }).check();`,
        },
        { kind: 'heading', text: 'Name-matching options' },
        {
          kind: 'list',
          items: [
            '`{ name: \'Save\' }` — substring, case-insensitive by default.',
            '`{ name: \'Save\', exact: true }` — exact, case-sensitive match.',
            '`{ name: /save/i }` — a regular expression for flexible matching.',
            '`{ level: 2 }` — heading level for `heading` roles.',
            '`{ pressed: true }` / `{ checked: true }` / `{ selected: true }` — match by state.',
            '`{ expanded: false }` — collapsed disclosure widgets, accordions, menus.',
          ],
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Match a toggle button that is currently pressed
await expect(page.getByRole('button', { name: 'Bold', pressed: true })).toBeVisible();

// A collapsed accordion section on this platform
await page.getByRole('button', { name: 'Shipping', expanded: false }).click();`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Inspect the accessibility tree',
          text: 'Open Chrome DevTools → Elements → Accessibility pane to read an element’s computed role and name. Use those exact values in getByRole instead of guessing.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'No accessible name? Fix the app',
          text: 'If a button has no name (icon-only with no aria-label), `getByRole` cannot target it cleanly. That is a real accessibility bug — add an `aria-label` rather than falling back to a brittle CSS selector.',
        },
      ],
    },
    {
      id: 'text-and-css',
      title: 'The Text & CSS Engines',
      summary: 'Use getByText precisely and unlock Playwright’s CSS extensions like :has and :visible.',
      duration: 13,
      practice: ['search-filter', 'ecommerce', 'tables'],
      objectives: [
        'Match text exactly, partially and by regex',
        'Use Playwright CSS pseudo-classes (:has-text, :visible)',
        'Combine CSS with text for precision',
      ],
      blocks: [
        { kind: 'heading', text: 'The text engine' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.getByText('Add to cart');             // substring, case-insensitive
await page.getByText('Add to cart', { exact: true }); // exact
await page.getByText(/^\\$\\d+\\.\\d{2}$/);              // regex: a price like $9.99`,
        },
        { kind: 'heading', text: 'Playwright’s CSS extensions' },
        {
          kind: 'paragraph',
          text: 'Beyond standard CSS, Playwright adds powerful pseudo-classes that make many XPath tricks unnecessary.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// :has-text — an element containing text
page.locator('article:has-text("Out of stock")');

// :has — an element containing another element
page.locator('tr:has(button[aria-label="Edit"])');

// :visible — only visible matches
page.locator('button:visible');

// text= engine inside a CSS chain
page.locator('.card >> text=Buy now');

// nth-match across the whole page
page.locator(':nth-match(:text("Delete"), 2)');`,
        },
        { kind: 'heading', text: 'Combining for precision' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// The price inside the card that mentions "Pro plan"
const proPrice = page.locator('.pricing-card:has-text("Pro plan") [data-testid="price"]');
await expect(proPrice).toHaveText('$29/mo');`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Prefer getByRole/getByText first',
          text: 'CSS extensions are handy, but role- and label-based locators read better and resist change more. Reach for `:has`/`:visible` when semantics are missing, not as a default.',
        },
      ],
    },
    {
      id: 'xpath-when-needed',
      title: 'XPath in Playwright — When & How',
      summary: 'Use XPath for the rare cases CSS cannot express, and know its trade-offs.',
      duration: 11,
      practice: ['tables', 'iframes'],
      objectives: [
        'Write relative XPath with axes and text',
        'Know when XPath beats CSS (and when it does not)',
        'Avoid the classic XPath anti-patterns',
      ],
      blocks: [
        { kind: 'heading', text: 'XPath still has a place' },
        {
          kind: 'paragraph',
          text: 'Playwright supports XPath via `page.locator(\'xpath=...\')` or a leading `//`. Reach for it only when you must traverse **upward** (to an ancestor) or match on **text plus structure** in ways CSS cannot.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Ancestor: the form that contains the email field
page.locator('xpath=//input[@name="email"]/ancestor::form');

// The row whose first cell is "Alice", then its Edit button
page.locator('//tr[td[normalize-space()="Alice"]]//button[@aria-label="Edit"]');

// Following-sibling: the input after a label
page.locator('//label[normalize-space()="Email"]/following-sibling::input');`,
        },
        { kind: 'heading', text: 'Prefer the Playwright equivalents' },
        {
          kind: 'list',
          items: [
            'Instead of `//tr[td="Alice"]//button`, prefer `getByRole(\'row\', { name: /Alice/ }).getByRole(\'button\', { name: \'Edit\' })`.',
            'Instead of text XPath, prefer `getByText` / `:has-text`.',
            'Use `filter({ has, hasText })` to express "contains" relationships without XPath.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Never paste absolute XPath',
          text: 'Copy-as-XPath from DevTools produces fragile `/html/body/div[3]/...` paths that break instantly. If you use XPath, keep it short, relative and anchored on stable attributes or text.',
        },
      ],
    },
    {
      id: 'filtering-chaining',
      title: 'Filtering, Chaining, and/or',
      summary: 'Compose locators with filter, and(), or() and chaining to pinpoint one element.',
      duration: 14,
      practice: ['tables', 'pagination', 'ecommerce'],
      objectives: [
        'Filter by text and by nested locators',
        'Use locator.and() / locator.or()',
        'Chain to scope searches inside a region',
      ],
      blocks: [
        { kind: 'heading', text: 'filter(): narrow a set' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const rows = page.getByRole('row');
await rows.filter({ hasText: 'Alice' }).getByRole('button', { name: 'Edit' }).click();

// has: contains a child locator
const outOfStock = page.getByTestId('product-card')
  .filter({ has: page.getByText('Out of stock') });
await expect(outOfStock).toHaveCount(0);

// hasNotText: exclude
const active = page.getByRole('listitem').filter({ hasNotText: 'archived' });`,
        },
        { kind: 'heading', text: 'and() / or()' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// and(): an element matching BOTH locators
const primarySave = page.getByRole('button', { name: 'Save' })
  .and(page.locator('.btn-primary'));

// or(): whichever appears — handy for A/B variants or loading states
const ready = page.getByRole('button', { name: 'Continue' })
  .or(page.getByRole('button', { name: 'Next' }));
await ready.click();`,
        },
        { kind: 'heading', text: 'Chaining to scope' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const summary = page.getByRole('region', { name: 'Order summary' });
await expect(summary.getByTestId('total')).toHaveText('$42.00');
await summary.getByRole('button', { name: 'Apply coupon' }).click();`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'or() for race conditions',
          text: 'When a flow can show one of two UIs (a cookie banner that may or may not appear, a tour modal), `locator.or()` lets you wait for "either" and handle whichever wins — without try/catch.',
        },
      ],
    },
    {
      id: 'frames-shadow',
      title: 'Frames & Shadow DOM',
      summary: 'Reach into iframes with frameLocator and pierce open shadow DOM automatically.',
      duration: 12,
      practice: ['iframes', 'nested-frames', 'shadow-dom'],
      objectives: [
        'Scope into single and nested iframes',
        'Locate inside open shadow roots',
        'Know the limits (closed shadow, cross-origin)',
      ],
      blocks: [
        { kind: 'heading', text: 'frameLocator — no context switching' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const pay = page.frameLocator('iframe[title="payment"]');
await pay.getByLabel('Card number').fill('4242 4242 4242 4242');
await pay.getByRole('button', { name: 'Pay' }).click();

// Nested frames simply chain:
page.frameLocator('#outer').frameLocator('#inner').getByText('Deep');`,
        },
        { kind: 'heading', text: 'Shadow DOM is transparent' },
        {
          kind: 'paragraph',
          text: 'Unlike Selenium, Playwright pierces **open** shadow DOM automatically — `getByRole`, `getByText` and CSS all see inside web components with no special API.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Works straight through a custom element's shadow root:
await page.getByRole('button', { name: 'Toggle' }).click();
await page.getByTestId('shadow-content').click();`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'The limits',
          text: 'Closed shadow roots are inaccessible by design, and `>>` does not cross into a frame — use `frameLocator` for frames. For cross-origin frames, Playwright still works, but the parent page cannot read their internals via JS.',
        },
      ],
    },
    {
      id: 'tables-grids-lists',
      title: 'Tables, Grids & Virtualized Lists',
      summary: 'Locate cells, rows and items in data-heavy UIs that paginate or virtualize.',
      duration: 14,
      practice: ['tables', 'pagination', 'infinite-scroll'],
      objectives: [
        'Target a cell by its row’s key',
        'Handle nth, counts and re-renders',
        'Cope with virtualization and lazy lists',
      ],
      blocks: [
        { kind: 'heading', text: 'Row-keyed cell access' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// The role-based way (preferred)
const row = page.getByRole('row', { name: /Alice/ });
await expect(row.getByRole('cell').nth(2)).toHaveText('alice@example.com');
await row.getByRole('button', { name: 'Edit' }).click();`,
        },
        { kind: 'heading', text: 'Counts and iteration' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const rows = page.getByRole('row');
await expect(rows).toHaveCount(11);              // header + 10 data rows
const emails = await page.getByTestId('cell-email').allInnerTexts();
expect(emails).toContain('alice@example.com');`,
        },
        { kind: 'heading', text: 'Virtualized / lazy lists' },
        {
          kind: 'paragraph',
          text: 'Virtualized grids only render visible rows, so an off-screen item is not in the DOM. Scroll it into view, then assert — Playwright will load it as you go. The **Infinite Scroll** module practises this.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `const target = page.getByText('Item 95');
await target.scrollIntoViewIfNeeded();
await expect(target).toBeVisible();`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Re-query after paging or sorting',
          text: 'Locators re-resolve automatically, so you never hit stale elements — but make sure you wait for the new data (an assertion on the new first row) before reading values, or you may read the old page.',
        },
      ],
    },
    {
      id: 'custom-testid-engines',
      title: 'Test IDs & Custom Selector Engines',
      summary: 'Configure the test-id attribute and register your own selector engines.',
      duration: 11,
      objectives: [
        'Change the default testId attribute',
        'Use layout selectors (right-of, near)',
        'Register a custom selector engine',
      ],
      blocks: [
        { kind: 'heading', text: 'Configure your test-id attribute' },
        {
          kind: 'paragraph',
          text: 'By default `getByTestId` matches `data-testid`. If your app uses a different attribute (e.g. `data-test` or `data-qa`), set it once in config and `getByTestId` just works.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: { testIdAttribute: 'data-qa' },
});`,
        },
        { kind: 'heading', text: 'Layout selectors' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Match by spatial relationship when nothing else is stable
page.locator('input:right-of(:text("Email"))');
page.locator('button:near(:text("Total"))');
page.locator('label:left-of(#newsletter)');`,
        },
        { kind: 'heading', text: 'Register a custom engine' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// global-setup or fixture: a "tid" engine for a bespoke attribute scheme
import { selectors } from '@playwright/test';
await selectors.register('tid', () => ({
  query: (root, sel) => root.querySelector(\`[data-track-id="\${sel}"]\`),
  queryAll: (root, sel) => Array.from(root.querySelectorAll(\`[data-track-id="\${sel}"]\`)),
}));
// Usage: page.locator('tid=checkout-button')`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Standardise one hook',
          text: 'Agree on a single test-id attribute across the app (this platform uses data-testid). One convention makes every locator predictable and onboarding trivial.',
        },
      ],
    },
    {
      id: 'locator-troubleshooting',
      title: 'Troubleshooting Locators',
      summary: 'Fix strict-mode violations, ambiguity and timing with the right tools.',
      duration: 12,
      practice: ['random-elements', 'delayed-loading'],
      objectives: [
        'Resolve strict-mode violations correctly',
        'Use Pick Locator and codegen',
        'Diagnose why a locator times out',
      ],
      blocks: [
        { kind: 'heading', text: 'Strict mode is your friend' },
        {
          kind: 'paragraph',
          text: 'When a locator matches multiple elements, Playwright throws a strict-mode violation instead of silently using the first. The fix is to make the locator specific — not to suppress the error.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// ❌ matches several "Delete" buttons
await page.getByRole('button', { name: 'Delete' }).click();

// ✅ scope or disambiguate
await page.getByRole('row', { name: /Bob/ }).getByRole('button', { name: 'Delete' }).click();
await page.getByRole('button', { name: 'Delete' }).first().click();`,
        },
        { kind: 'heading', text: 'Generate and pick locators' },
        {
          kind: 'code',
          language: 'bash',
          code: `npx playwright codegen https://www.google.com   # record resilient locators
npx playwright test --ui                          # then "Pick locator" in UI mode`,
        },
        { kind: 'heading', text: 'When a locator times out' },
        {
          kind: 'list',
          items: [
            'It never matched — wrong role/name/text. Verify with Pick locator.',
            'It matched a hidden element — add `:visible` or assert visibility first.',
            'It matched too late — the data had not loaded; wait on the triggering response or an earlier assertion.',
            'Strict violation — multiple matches; scope or use `.first()/.nth()`.',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Read the error text',
          text: 'Playwright’s timeout errors list what it was waiting for and how many elements matched. That message almost always points straight at the fix.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK P6 — Network, Mocking & API Deep Dive
   ════════════════════════════════════════════════════════════════════════ */

const playwrightNetwork: LearningTrack = {
  id: 'playwright-network-deep',
  category: 'Playwright',
  title: 'Network, Mocking & API Deep Dive',
  subtitle: 'Total control over HTTP, GraphQL & sockets',
  description:
    'Everything the network layer can do: precise route patterns, mocking REST and GraphQL, modifying live responses, recording and replaying HAR, WebSocket and SSE testing, the full request fixture, token/cookie auth flows, and throttling/offline simulation — with assertions on exactly what the app sends.',
  icon: Radio,
  level: 'advanced',
  tags: ['playwright', 'network', 'mocking', 'graphql', 'api', 'websocket'],
  lessons: [
    {
      id: 'route-patterns',
      title: 'Route Patterns & Ordering',
      summary: 'Match exactly the requests you want with globs, regex and predicate functions.',
      duration: 13,
      practice: ['ajax', 'api-testing', 'search-filter'],
      objectives: [
        'Match URLs by glob, regex and function',
        'Understand route order and unrouting',
        'Limit interception with times',
      ],
      blocks: [
        { kind: 'heading', text: 'Three ways to match' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.route('**/api/products*', handler);                 // glob
await page.route(/\\/api\\/products\\?.*page=2/, handler);          // regex
await page.route((url) => url.pathname.endsWith('/checkout'), handler); // predicate`,
        },
        { kind: 'heading', text: 'Order, fallback and cleanup' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Later routes run first; call fallback() to defer to an earlier route
await page.route('**/*', (route) => route.fallback());     // generic logger/guard
await page.route('**/api/cart', (route) => route.fulfill({ json: { items: [] } }));

// Remove a route when done
await page.unroute('**/api/cart');

// Only intercept the first N matches
await page.route('**/api/feed*', handler, { times: 1 });`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Route at the context for whole-suite mocks',
          text: 'Use `context.route(...)` (or in a fixture) to apply a mock to every page in the context — ideal for stubbing analytics or a flaky third-party across all tests.',
        },
      ],
    },
    {
      id: 'mock-rest-graphql',
      title: 'Mocking REST & GraphQL',
      summary: 'Return deterministic data, errors and empty states for both REST and GraphQL.',
      duration: 15,
      practice: ['ecommerce', 'search-filter', 'api-testing'],
      objectives: [
        'Stub REST endpoints with fulfill',
        'Mock GraphQL by inspecting the operation',
        'Force empty, error and slow states',
      ],
      blocks: [
        { kind: 'heading', text: 'REST stubs' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.route('**/api/products*', (route) =>
  route.fulfill({ json: [{ id: 1, name: 'Mocked Widget', price: 9.99 }] }));

await page.route('**/api/products*', (route) =>
  route.fulfill({ status: 500, body: 'Server error' }));   // error state

await page.route('**/api/products*', (route) =>
  route.fulfill({ json: [] }));                              // empty state`,
        },
        { kind: 'heading', text: 'GraphQL: branch on the operation' },
        {
          kind: 'paragraph',
          text: 'GraphQL sends everything to one endpoint, so inspect the POST body to mock a specific query or mutation.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.route('**/graphql', async (route) => {
  const body = route.request().postDataJSON();
  if (body.operationName === 'GetProducts') {
    return route.fulfill({ json: { data: { products: [{ id: '1', name: 'Mock' }] } } });
  }
  return route.fallback();   // let other operations pass through
});`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Keep one real end-to-end path',
          text: 'Mock third-party and edge-case data, but always keep at least one un-mocked happy path so you still catch real backend/integration breakage.',
        },
      ],
    },
    {
      id: 'modify-continue',
      title: 'Modifying Requests & Responses',
      summary: 'Tweak headers, bodies and status on the fly with continue and fetch+fulfill.',
      duration: 13,
      practice: ['api-testing', 'auth-demo'],
      objectives: [
        'Override request headers and postData',
        'Edit a real response before it reaches the app',
        'Abort or delay selected requests',
      ],
      blocks: [
        { kind: 'heading', text: 'Modify the outgoing request' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.route('**/api/**', (route) => {
  const headers = { ...route.request().headers(), 'x-test': 'true' };
  route.continue({ headers });
});`,
        },
        { kind: 'heading', text: 'Edit the real response' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.route('**/api/profile', async (route) => {
  const response = await route.fetch();   // hit the real server
  const json = await response.json();
  json.role = 'admin';                    // flip a flag to test admin UI
  await route.fulfill({ response, json });
});`,
        },
        { kind: 'heading', text: 'Abort and block' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Block images/fonts/analytics to speed up or isolate
await page.route('**/*.{png,jpg,woff2}', (route) => route.abort());
await page.route('**/analytics/**', (route) => route.abort());`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Test the unhappy path cheaply',
          text: 'Flipping a flag or forcing a 403 via response editing lets you exercise admin-only or error UIs without seeding special accounts.',
        },
      ],
    },
    {
      id: 'har-record-replay',
      title: 'Recording & Replaying HAR',
      summary: 'Capture real traffic once and replay it deterministically for fast, offline UI tests.',
      duration: 11,
      practice: ['ecommerce', 'search-filter'],
      objectives: [
        'Record a HAR of real responses',
        'Replay HAR to mock the whole API',
        'Update HAR intentionally',
      ],
      blocks: [
        { kind: 'heading', text: 'Replay from HAR' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Serve recorded responses; record on first run, replay afterwards
await page.routeFromHAR('data/api.har', {
  url: '**/api/**',
  update: false,        // set true once to (re)record from the live server
});
await page.goto('/practice/ecommerce');`,
        },
        { kind: 'heading', text: 'Record via the CLI' },
        {
          kind: 'code',
          language: 'bash',
          code: `npx playwright open --save-har=data/api.har --save-har-glob="**/api/**" https://your-app.test`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'HAR can drift',
          text: 'A recorded HAR freezes the API’s shape. When the backend contract changes, re-record (update: true) and review the diff — otherwise your UI tests pass against stale data.',
        },
      ],
    },
    {
      id: 'websockets-sse',
      title: 'WebSockets & Server-Sent Events',
      summary: 'Observe and assert on real-time messages — exactly what this platform’s socket demo uses.',
      duration: 12,
      practice: ['websocket'],
      objectives: [
        'Listen to WebSocket frames',
        'Assert on streamed messages',
        'Handle SSE/live updates',
      ],
      blocks: [
        { kind: 'heading', text: 'Inspect WebSocket frames' },
        {
          kind: 'code',
          language: 'typescript',
          code: `page.on('websocket', (ws) => {
  console.log('opened', ws.url());
  ws.on('framereceived', (f) => console.log('recv', f.payload));
  ws.on('framesent', (f) => console.log('sent', f.payload));
});

await page.goto('/practice/websocket');
await page.getByTestId('ws-connect').click();
await expect(page.getByTestId('ws-status')).toHaveText('Connected');`,
        },
        { kind: 'heading', text: 'Assert on live UI from a stream' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.getByTestId('ws-subscribe').click();
// Web-first assertion waits for the streamed value to render
await expect(page.getByTestId('ws-last-message')).toContainText('tick');`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Assert on the UI, not just frames',
          text: 'Reading raw frames is great for debugging, but your test’s value is asserting that the **UI** reacts correctly to the stream — keep the user-visible assertion as the source of truth.',
        },
      ],
    },
    {
      id: 'request-context-api',
      title: 'The Request Fixture in Depth',
      summary: 'Use Playwright’s HTTP client for setup, teardown and pure API tests.',
      duration: 13,
      practice: ['api-testing', 'crm', 'employees'],
      objectives: [
        'Send GET/POST/PUT/DELETE with data and params',
        'Send multipart/form-data and headers',
        'Create a reusable authenticated context',
      ],
      blocks: [
        { kind: 'heading', text: 'Full HTTP verbs' },
        {
          kind: 'code',
          language: 'typescript',
          code: `test('CRM customer CRUD via API', async ({ request }) => {
  const create = await request.post('/api/customers', {
    data: { name: 'Acme', tier: 'gold' },
    params: { notify: 'false' },
  });
  expect(create.status()).toBe(201);
  const { id } = await create.json();

  await request.put(\`/api/customers/\${id}\`, { data: { tier: 'platinum' } });
  const got = await request.get(\`/api/customers/\${id}\`);
  expect(await got.json()).toMatchObject({ tier: 'platinum' });

  await request.delete(\`/api/customers/\${id}\`);
});`,
        },
        { kind: 'heading', text: 'Multipart and a shared authed client' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// File upload over the API
await request.post('/api/import', {
  multipart: { file: { name: 'users.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b') } },
});

// A request context preloaded with a token (e.g. in a fixture)
const api = await playwright.request.newContext({
  baseURL: process.env.BASE_URL,
  extraHTTPHeaders: { Authorization: \`Bearer \${token}\` },
});`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Seed with API, verify with UI',
          text: 'Create CRM/Employees records through the API (instant, reliable), then open the page and assert they render. This is the fastest, least flaky way to test data-driven screens on this platform.',
        },
      ],
    },
    {
      id: 'auth-flows',
      title: 'Auth Flows: Tokens, Cookies & OAuth',
      summary: 'Authenticate the fast way and reuse sessions across the whole suite.',
      duration: 14,
      practice: ['auth-demo'],
      objectives: [
        'Log in via the API and persist storage state',
        'Inject cookies and localStorage tokens',
        'Handle OAuth/redirect flows pragmatically',
      ],
      blocks: [
        { kind: 'heading', text: 'API login → storage state' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// global.setup.ts — no UI clicks, just the token
import { test as setup, request } from '@playwright/test';

setup('auth', async ({}) => {
  const ctx = await request.newContext();
  const res = await ctx.post('/api/auth/login', {
    data: { email: 'admin@example.com', password: process.env.PW! },
  });
  const { accessToken } = await res.json();
  await ctx.storageState({ path: 'state/user.json' });   // cookies captured
  process.env.TOKEN = accessToken;
});`,
        },
        { kind: 'heading', text: 'Inject a token into localStorage' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await context.addInitScript((token) => {
  window.localStorage.setItem('accessToken', token);
}, process.env.TOKEN!);`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'OAuth: prefer a test IdP or bypass',
          text: 'Automating a third-party OAuth screen is brittle. Use a test identity provider, a programmatic token grant, or a backend "test login" endpoint guarded to non-prod. Reserve real OAuth UI for one smoke test.',
        },
      ],
    },
    {
      id: 'throttling-offline',
      title: 'Throttling, Offline & Asserting Calls',
      summary: 'Simulate poor networks, offline mode and assert exactly what the app requested.',
      duration: 11,
      practice: ['ajax', 'infinite-scroll'],
      objectives: [
        'Go offline and assert recovery',
        'Delay responses to test loading UI',
        'Assert request payloads and counts',
      ],
      blocks: [
        { kind: 'heading', text: 'Offline & slow responses' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await context.setOffline(true);   // test the offline banner / retry
await context.setOffline(false);

// Add latency to see spinners/skeletons
await page.route('**/api/feed*', async (route) => {
  await new Promise((r) => setTimeout(r, 2000));
  await route.continue();
});`,
        },
        { kind: 'heading', text: 'Assert the request the app made' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const req = page.waitForRequest('**/api/search?*');
await page.getByRole('button', { name: 'Search' }).click();
const url = new URL((await req).url());
expect(url.searchParams.get('q')).toBe('phone');

// Count calls to catch double-submits
let calls = 0;
await page.route('**/api/save', (r) => { calls++; r.continue(); });
await page.getByRole('button', { name: 'Save' }).click();
expect(calls).toBe(1);`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Catch double-submits and N+1 calls',
          text: 'Counting requests is a cheap, powerful assertion: it surfaces accidental double-submits, missing debounces and N+1 fetch loops that pure UI checks miss.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK P7 — Test Architecture & Fixtures
   ════════════════════════════════════════════════════════════════════════ */

const playwrightArchitecture: LearningTrack = {
  id: 'playwright-architecture',
  category: 'Playwright',
  title: 'Test Architecture & Fixtures',
  subtitle: 'Design suites that scale to thousands of tests',
  description:
    'Structure a Playwright codebase that stays fast and maintainable at scale: fixture scopes and options, page objects as fixtures, data factories, custom matchers, tagging and project matrices, global setup/teardown, environment and secret management, and a monorepo-friendly folder strategy.',
  icon: Blocks,
  level: 'advanced',
  tags: ['playwright', 'fixtures', 'architecture', 'pom', 'data', 'scaling'],
  lessons: [
    {
      id: 'fixtures-scopes',
      title: 'Fixture Scopes & Options',
      summary: 'Master test- vs worker-scoped fixtures and option fixtures for configuration.',
      duration: 14,
      practice: ['auth-demo'],
      objectives: [
        'Create test- and worker-scoped fixtures',
        'Expose option fixtures with defaults',
        'Override fixtures per project or describe',
      ],
      blocks: [
        { kind: 'heading', text: 'Test vs worker scope' },
        {
          kind: 'paragraph',
          text: 'A **test** fixture is built fresh per test; a **worker** fixture is built once per worker and shared by all its tests — perfect for expensive, read-only resources like an authenticated API client.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { test as base } from '@playwright/test';

export const test = base.extend<{ cart: Cart }, { apiToken: string }>({
  // worker-scoped: minted once per worker
  apiToken: [async ({}, use) => {
    const token = await mintToken();
    await use(token);
  }, { scope: 'worker' }],

  // test-scoped: fresh per test
  cart: async ({ page }, use) => {
    const cart = new Cart(page);
    await use(cart);
    await cart.clear();      // teardown after use()
  },
});`,
        },
        { kind: 'heading', text: 'Option fixtures' },
        {
          kind: 'code',
          language: 'typescript',
          code: `export const test = base.extend<{ locale: string }>({
  locale: ['en-GB', { option: true }],   // default, overridable in config
});
// playwright.config.ts → projects: [{ name: 'de', use: { locale: 'de-DE' } }]`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Everything after use() is teardown',
          text: 'A fixture’s code before `await use(x)` is setup; after it is cleanup. This guarantees teardown runs even when the test fails — no try/finally needed.',
        },
      ],
    },
    {
      id: 'fixtures-as-pageobjects',
      title: 'Page Objects as Fixtures',
      summary: 'Wire page objects into fixtures so tests get ready instances with zero boilerplate.',
      duration: 12,
      practice: ['auth-demo', 'ecommerce'],
      objectives: [
        'Expose page objects through fixtures',
        'Compose multiple page objects',
        'Keep tests declarative',
      ],
      blocks: [
        { kind: 'heading', text: 'A fixtures module' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { CartPage } from './pages/CartPage';

type Pages = { loginPage: LoginPage; cartPage: CartPage };

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
});
export { expect } from '@playwright/test';`,
        },
        { kind: 'heading', text: 'Declarative tests' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { test, expect } from './fixtures';

test('checkout', async ({ loginPage, cartPage }) => {
  await loginPage.goto();
  await loginPage.login('admin@example.com', 'secret');
  await cartPage.addItem('Pro plan');
  await expect(cartPage.total).toHaveText('$29.00');
});`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Compose, don’t inherit',
          text: 'Build rich tests by composing small fixtures (auth + seeded data + page objects) rather than deep base classes. Refactors stay local and tests read top-to-bottom.',
        },
      ],
    },
    {
      id: 'data-factories',
      title: 'Test Data Factories & Cleanup',
      summary: 'Generate unique, realistic data per test and clean it up automatically.',
      duration: 13,
      practice: ['crm', 'employees', 'forms'],
      objectives: [
        'Build factories with faker',
        'Create data via API in fixtures',
        'Guarantee cleanup and isolation',
      ],
      blocks: [
        { kind: 'heading', text: 'A factory + self-cleaning fixture' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { faker } from '@faker-js/faker';

function newCustomer() {
  return { name: faker.company.name(), email: faker.internet.email().toLowerCase() };
}

export const test = base.extend<{ customer: { id: string; name: string } }>({
  customer: async ({ request }, use) => {
    const res = await request.post('/api/customers', { data: newCustomer() });
    const created = await res.json();
    await use(created);
    await request.delete(\`/api/customers/\${created.id}\`);   // always clean up
  },
});`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Unique data = parallel-safe',
          text: 'Hard-coded names/emails collide the moment tests run in parallel. Generate unique values (faker, timestamps, UUIDs) so every worker is independent.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Clean up via API, not the UI',
          text: 'Deleting through the API in fixture teardown is faster and more reliable than clicking through a delete confirmation, and it runs even when the test fails.',
        },
      ],
    },
    {
      id: 'custom-matchers',
      title: 'Custom Matchers with expect.extend',
      summary: 'Add domain-specific, auto-retrying assertions that read like English.',
      duration: 11,
      objectives: [
        'Write a custom expect matcher',
        'Make it auto-retry like built-ins',
        'Improve failure messages',
      ],
      blocks: [
        { kind: 'heading', text: 'A toHaveCartCount matcher' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { expect as base } from '@playwright/test';

export const expect = base.extend({
  async toHaveCartCount(locator, expected: number) {
    const assertion = base(locator).toHaveText(String(expected));
    try {
      await assertion;
      return { pass: true, message: () => 'cart count matched' };
    } catch {
      const actual = await locator.textContent();
      return {
        pass: false,
        message: () => \`expected cart count \${expected}, got \${actual}\`,
      };
    }
  },
});
// Usage: await expect(page.getByTestId('cart-count')).toHaveCartCount(3);`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Wrap built-ins to inherit retries',
          text: 'Build custom matchers on top of existing web-first matchers (like toHaveText) so they auto-retry. Hand-rolled polling is easy to get subtly wrong.',
        },
      ],
    },
    {
      id: 'tagging-projects',
      title: 'Tags, Grep & Project Matrices',
      summary: 'Select subsets of tests across a browser/device/feature matrix.',
      duration: 12,
      objectives: [
        'Tag tests and run by tag',
        'Build a project matrix',
        'Run smoke vs full suites',
      ],
      blocks: [
        { kind: 'heading', text: 'Tagging' },
        {
          kind: 'code',
          language: 'typescript',
          code: `test('checkout @smoke @critical', async ({ page }) => { /* ... */ });
test('legacy report @slow', async ({ page }) => { /* ... */ });`,
        },
        {
          kind: 'code',
          language: 'bash',
          code: `npx playwright test --grep @smoke            # only smoke
npx playwright test --grep-invert @slow      # skip slow
npx playwright test --grep "@smoke|@critical"`,
        },
        { kind: 'heading', text: 'Project matrix' },
        {
          kind: 'code',
          language: 'typescript',
          code: `projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'Mobile',   use: { ...devices['Pixel 7'] } },
  { name: 'smoke',    grep: /@smoke/, use: { ...devices['Desktop Chrome'] } },
]`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Smoke on every push, full on merge',
          text: 'Run a fast `@smoke` project on each push for quick feedback, and the full matrix on merges/nightly. Tags make this a one-line CI change.',
        },
      ],
    },
    {
      id: 'global-setup-teardown',
      title: 'Global Setup & Teardown',
      summary: 'Seed databases, start services and clean up once around the whole run.',
      duration: 11,
      objectives: [
        'Use globalSetup/globalTeardown',
        'Share state to tests safely',
        'Choose setup project vs global hook',
      ],
      blocks: [
        { kind: 'heading', text: 'Global hooks' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// playwright.config.ts
export default defineConfig({
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
});

// global-setup.ts
export default async function () {
  process.env.RUN_ID = String(Date.now());
  await seedDatabase(process.env.RUN_ID);
}`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Global hook vs setup project',
          text: 'Use a **global hook** for run-wide infra (seed DB, start a mock server). Use a **setup project + dependencies** when you need Playwright fixtures (a browser to log in and save storage state).',
        },
      ],
    },
    {
      id: 'env-config-secrets',
      title: 'Environments, Config & Secrets',
      summary: 'Run the same suite against local, staging and prod-safe targets without edits.',
      duration: 12,
      objectives: [
        'Drive config from environment variables',
        'Layer dotenv files per environment',
        'Keep secrets out of the repo',
      ],
      blocks: [
        { kind: 'heading', text: 'Config from env' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import 'dotenv/config';
export default defineConfig({
  use: { baseURL: process.env.BASE_URL ?? 'http://localhost:5180' },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
});`,
        },
        {
          kind: 'code',
          language: 'bash',
          code: `# .env.staging
BASE_URL=https://staging.example.com
# run it
dotenv -e .env.staging -- npx playwright test`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Secrets live in CI, not git',
          text: 'Keep credentials in git-ignored .env locally and in encrypted CI secrets in the pipeline. Never commit a real password — even a test one.',
        },
      ],
    },
    {
      id: 'scaling-structure',
      title: 'Scaling: Structure & Conventions',
      summary: 'A folder layout and conventions that keep a thousand-test suite navigable.',
      duration: 12,
      objectives: [
        'Adopt a scalable folder layout',
        'Share fixtures and helpers cleanly',
        'Enforce conventions with lint/CI',
      ],
      blocks: [
        { kind: 'heading', text: 'A proven layout' },
        {
          kind: 'code',
          language: 'text',
          code: `tests/
  pages/        # page objects (one per screen/component)
  fixtures/     # base test, worker fixtures, option fixtures
  data/         # factories, faker builders, HAR files
  api/          # pure API specs
  e2e/          # user-journey specs (by feature)
  setup/        # global.setup.ts (auth), global-setup.ts (infra)
  utils/        # tiny pure helpers
playwright.config.ts`,
        },
        {
          kind: 'list',
          items: [
            'One base `test` export (your fixtures) that every spec imports — never import from `@playwright/test` directly in specs.',
            'Group e2e specs by **feature**, not by page, so a feature’s tests live together.',
            'Keep helpers pure and tiny; push stateful logic into fixtures or page objects.',
            'Lint for `test.only`, `page.waitForTimeout` and raw `@playwright/test` imports in CI.',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Make the right thing the easy thing',
          text: 'When the base `test` already provides auth, data and page objects, writing a good test is less typing than writing a bad one — conventions stick when they reduce effort.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK P8 — CI/CD & DevOps
   ════════════════════════════════════════════════════════════════════════ */

const playwrightDevOps: LearningTrack = {
  id: 'playwright-devops',
  category: 'Playwright',
  title: 'Playwright CI/CD & DevOps',
  subtitle: 'Run fast, reliable suites in any pipeline',
  description:
    'Operate Playwright at team scale: a hardened GitHub Actions workflow, sharding and report merging, the official Docker image, GitLab/Azure/Jenkins recipes, reporting pipelines, flaky-test handling in CI, performance and cost tuning, and using tests as deployment gates.',
  icon: Server,
  level: 'advanced',
  tags: ['playwright', 'ci', 'cd', 'docker', 'sharding', 'devops'],
  lessons: [
    {
      id: 'github-actions-advanced',
      title: 'GitHub Actions, Hardened',
      summary: 'A production workflow with caching, artifacts and useful annotations.',
      duration: 14,
      objectives: [
        'Install browsers with OS deps',
        'Cache npm and upload reports',
        'Annotate failures in the PR',
      ],
      blocks: [
        { kind: 'heading', text: 'The workflow' },
        {
          kind: 'code',
          language: 'yaml',
          code: `name: e2e
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: \${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'GitHub reporter for inline annotations',
          text: 'Add the built-in `github` reporter (`reporter: process.env.CI ? \'github\' : \'list\'`) so failures show up as annotations right on the PR diff.',
        },
      ],
    },
    {
      id: 'sharding-merge-reports',
      title: 'Sharding & Merging Reports',
      summary: 'Split the suite across machines and recombine into one HTML report.',
      duration: 13,
      objectives: [
        'Shard with a CI matrix',
        'Emit and upload blob reports',
        'Merge into a single report',
      ],
      blocks: [
        { kind: 'heading', text: 'Matrix sharding' },
        {
          kind: 'code',
          language: 'yaml',
          code: `jobs:
  test:
    strategy:
      fail-fast: false
      matrix: { shard: [1, 2, 3, 4] }
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=\${{ matrix.shard }}/4 --reporter=blob
      - uses: actions/upload-artifact@v4
        with: { name: blob-\${{ matrix.shard }}, path: blob-report/ }`,
        },
        { kind: 'heading', text: 'Merge step' },
        {
          kind: 'code',
          language: 'bash',
          code: `# in a follow-up job that downloads all blob-* artifacts
npx playwright merge-reports --reporter=html ./all-blobs`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Shard count = wall-clock / target',
          text: 'Pick shards so total time ÷ shards meets your feedback target. 4–8 shards usually balances speed against runner cost for mid-sized suites.',
        },
      ],
    },
    {
      id: 'docker-image',
      title: 'The Official Docker Image',
      summary: 'Reproducible runs (and stable visual baselines) with the Playwright container.',
      duration: 11,
      objectives: [
        'Run tests in the official image',
        'Match the image to your version',
        'Use it for visual baseline parity',
      ],
      blocks: [
        { kind: 'heading', text: 'Run in the container' },
        {
          kind: 'code',
          language: 'bash',
          code: `docker run --rm -v "$(pwd):/work" -w /work --ipc=host \\
  mcr.microsoft.com/playwright:v1.48.0-jammy \\
  bash -c "npm ci && npx playwright test"`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Pin the tag to @playwright/test',
          text: 'The image tag must match your installed Playwright version, or you get "browser not found" and snapshot mismatches. Bump them together.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Use --ipc=host for Chromium',
          text: 'Chromium can crash in containers with the default small /dev/shm. `--ipc=host` (or `--shm-size=2g`) avoids the classic "Target closed" crash.',
        },
      ],
    },
    {
      id: 'other-ci',
      title: 'GitLab, Azure & Jenkins',
      summary: 'Drop-in recipes for the other major CI systems.',
      duration: 11,
      objectives: [
        'Configure GitLab CI',
        'Configure Azure Pipelines',
        'Configure Jenkins',
      ],
      blocks: [
        { kind: 'heading', text: 'GitLab CI' },
        {
          kind: 'code',
          language: 'yaml',
          code: `e2e:
  image: mcr.microsoft.com/playwright:v1.48.0-jammy
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths: [playwright-report/]
    expire_in: 1 week`,
        },
        { kind: 'heading', text: 'Azure Pipelines' },
        {
          kind: 'code',
          language: 'yaml',
          code: `steps:
  - task: NodeTool@0
    inputs: { versionSpec: '20.x' }
  - script: npm ci
  - script: npx playwright install --with-deps
  - script: npx playwright test
  - task: PublishTestResults@2
    condition: succeededOrFailed()
    inputs: { testResultsFiles: 'results/junit.xml' }`,
        },
        { kind: 'heading', text: 'Jenkins (declarative)' },
        {
          kind: 'code',
          language: 'text',
          code: `pipeline {
  agent { docker { image 'mcr.microsoft.com/playwright:v1.48.0-jammy'; args '--ipc=host' } }
  stages {
    stage('test') { steps { sh 'npm ci && npx playwright test' } }
  }
  post { always { archiveArtifacts 'playwright-report/**' } }
}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'JUnit everywhere',
          text: 'Emit the `junit` reporter so any CI’s native test panel shows pass/fail trends — it is the lingua franca across GitLab, Azure and Jenkins.',
        },
      ],
    },
    {
      id: 'reporting-pipelines',
      title: 'Reporting Pipelines & Dashboards',
      summary: 'Combine reporters and publish history for trends and triage.',
      duration: 10,
      objectives: [
        'Run multiple reporters',
        'Publish HTML and history',
        'Add Allure for trends',
      ],
      blocks: [
        { kind: 'heading', text: 'Multiple reporters' },
        {
          kind: 'code',
          language: 'typescript',
          code: `reporter: [
  [process.env.CI ? 'github' : 'list'],
  ['html', { open: 'never' }],
  ['junit', { outputFile: 'results/junit.xml' }],
  ['json', { outputFile: 'results/results.json' }],
],`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Allure/Currents for history',
          text: 'The built-in HTML report is per-run. For long-term trends, flaky rates and ownership, add Allure or a hosted dashboard (Currents) as an extra reporter.',
        },
      ],
    },
    {
      id: 'flaky-in-ci',
      title: 'Flaky Tests in CI',
      summary: 'Detect, quarantine and burn down flakiness without ignoring red builds.',
      duration: 12,
      practice: ['random-elements', 'stale-elements'],
      objectives: [
        'Surface flakes with retries + traces',
        'Quarantine without losing visibility',
        'Burn down with data',
      ],
      blocks: [
        { kind: 'heading', text: 'Surface, don’t hide' },
        {
          kind: 'code',
          language: 'typescript',
          code: `retries: process.env.CI ? 2 : 0,
use: { trace: 'on-first-retry' },   // a full trace exactly when it flakes`,
        },
        { kind: 'heading', text: 'Quarantine with a tag' },
        {
          kind: 'code',
          language: 'bash',
          code: `# Block on the stable suite; run @flaky separately, non-blocking
npx playwright test --grep-invert @flaky
npx playwright test --grep @flaky || true`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Quarantine is a loan, not a gift',
          text: 'Tag flakes out of the blocking gate so the team trusts red — but track them and fix root causes. A growing @flaky list is technical debt with interest.',
        },
      ],
    },
    {
      id: 'perf-cost-tuning',
      title: 'Performance & Cost Tuning',
      summary: 'Make suites faster and cheaper with the right workers, sharding and mocks.',
      duration: 11,
      objectives: [
        'Tune workers and parallelism',
        'Cut time with API setup and mocks',
        'Balance speed vs runner cost',
      ],
      blocks: [
        { kind: 'heading', text: 'Levers that actually move the needle' },
        {
          kind: 'list',
          items: [
            '**API setup over UI setup** — log in and seed via API; the single biggest speedup.',
            '**fullyParallel + workers** — saturate CPU; on CI set `workers` to the runner’s cores.',
            '**Sharding** — cut wall-clock time linearly across machines.',
            '**Block heavy third-parties** — abort ads/analytics/fonts you don’t test.',
            '**trace: on-first-retry** — avoid tracing green runs.',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Measure first',
          text: 'Open the HTML report’s duration column or the trace to find the slowest tests. Optimise the top 10% — they usually dominate total time.',
        },
      ],
    },
    {
      id: 'deployment-gating',
      title: 'Tests as Deployment Gates',
      summary: 'Use smoke and full suites to gate merges and deploys, including preview envs.',
      duration: 11,
      objectives: [
        'Gate PRs with smoke tests',
        'Run full suites pre-deploy',
        'Test preview/ephemeral environments',
      ],
      blocks: [
        { kind: 'heading', text: 'A tiered gate' },
        {
          kind: 'list',
          ordered: true,
          items: [
            'On every PR: `@smoke` against a preview deployment — fast, blocking.',
            'On merge to main: full matrix against staging — blocking the deploy.',
            'Nightly: full matrix + visual + a11y against staging — trend tracking.',
            'Post-deploy: a tiny prod smoke (read-only) to confirm the release is healthy.',
          ],
        },
        {
          kind: 'code',
          language: 'yaml',
          code: `# point tests at the PR's preview URL
env:
  BASE_URL: \${{ steps.deploy.outputs.preview_url }}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Read-only smokes in prod',
          text: 'A handful of non-mutating smoke tests (load the homepage, search, open a product) catch broken deploys within seconds without touching real data.',
        },
      ],
    },
  ],
};

/** Extra Playwright tracks, part 1 (P5–P8). */
export const playwrightExtraTracks: LearningTrack[] = [
  playwrightLocators,
  playwrightNetwork,
  playwrightArchitecture,
  playwrightDevOps,
];
