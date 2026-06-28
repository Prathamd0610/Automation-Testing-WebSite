import { Drama, Workflow, Network, Gauge } from 'lucide-react';
import type { LearningTrack } from './learning';
import { playwrightExtraTracks } from './learning-playwright-extra';
import { playwrightProTracks } from './learning-playwright-pro';

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Playwright Learning Tracks (TypeScript / Node.js)
 *  A complete, beginner → expert curriculum that mirrors the depth of the
 *  Selenium tracks. Every lesson uses real, copy-paste runnable code and two
 *  running examples throughout:
 *    • google.com — a public site everyone can open.
 *    • "this platform" — the practice modules on this site, which expose
 *      stable `data-testid` hooks (e.g. [data-testid="btn-submit"]).
 *  These tracks are imported by `learning.ts` and appended to LEARNING_TRACKS.
 * ──────────────────────────────────────────────────────────────────────────
 */

/* ════════════════════════════════════════════════════════════════════════
   TRACK P1 — Playwright Fundamentals
   ════════════════════════════════════════════════════════════════════════ */

const playwrightFundamentals: LearningTrack = {
  id: 'playwright-fundamentals',
  category: 'Playwright',
  title: 'Playwright Fundamentals',
  subtitle: 'Modern browser automation from zero',
  description:
    'Start from absolute zero with Microsoft Playwright and TypeScript — install it, write your first test, master role-based locators, web-first assertions and the auto-waiting engine that makes Playwright tests fast and stable.',
  icon: Drama,
  level: 'beginner',
  tags: ['playwright', 'typescript', 'locators', 'assertions', 'auto-waiting'],
  lessons: [
    {
      id: 'introduction',
      title: 'What is Playwright & Why It Is Different',
      summary:
        'Understand what Playwright is, how it differs from Selenium, and why its architecture makes tests fast and reliable.',
      duration: 9,
      objectives: [
        'Explain what Playwright does and who builds it',
        'Contrast Playwright with Selenium at a high level',
        'Describe the browser / context / page model',
      ],
      blocks: [
        { kind: 'heading', text: 'What is Playwright?' },
        {
          kind: 'paragraph',
          text: '**Playwright** is an open-source end-to-end testing framework from **Microsoft**. With a single API you can drive **Chromium** (Chrome/Edge), **Firefox** and **WebKit** (Safari) on Windows, macOS and Linux, headless or headed. You write tests in **TypeScript/JavaScript**, Python, Java or .NET — this track uses TypeScript, which is the most popular and best-documented binding.',
        },
        {
          kind: 'paragraph',
          text: 'Think of any flow you do by hand — open google.com, type a search, press Enter, check the results; or on **this platform**, log in and submit a form. Playwright performs exactly those steps in code, in milliseconds, on every commit.',
        },
        { kind: 'heading', text: 'How is it different from Selenium?' },
        {
          kind: 'list',
          items: [
            '**Auto-waiting**: Playwright waits for elements to be visible, enabled and stable *before* every action. No more `Thread.sleep` or hand-written waits for most cases.',
            '**Web-first assertions**: `expect(locator).toBeVisible()` retries automatically until it passes or times out — killing a whole class of flaky tests.',
            '**One process, no driver binaries**: Playwright talks to browsers over the **DevTools/CDP** and WebKit/Firefox protocols directly. There is no separate `chromedriver` to version-match.',
            '**Browser contexts**: each test gets an isolated, incognito-like context in milliseconds — fresh cookies and storage with no full browser restart.',
            '**Batteries included**: trace viewer, video, screenshots, network mocking, mobile emulation and an HTML reporter ship in the box.',
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Playwright vs Selenium is not "better/worse"',
          text: 'Selenium follows the **W3C WebDriver** standard and supports a huge range of languages, grids and real-device clouds. Playwright optimises for speed and developer experience on the three main engines. Senior testers learn **both** and pick per project.',
        },
        { kind: 'heading', text: 'The mental model: Browser → Context → Page' },
        {
          kind: 'paragraph',
          text: 'Three objects matter from day one:',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '**Browser** — a launched engine (Chromium/Firefox/WebKit). Heavy; launched once and reused.',
            '**BrowserContext** — an isolated session inside the browser, like a fresh incognito window with its own cookies, localStorage and cache. Cheap to create; one per test gives perfect isolation.',
            '**Page** — a single tab inside a context. Most of your code calls methods on `page` (e.g. `page.goto`, `page.getByRole`).',
          ],
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { chromium } from '@playwright/test';

const browser = await chromium.launch();          // 1. engine
const context = await browser.newContext();        // 2. isolated session
const page = await context.newPage();              // 3. a tab

await page.goto('https://www.google.com');
console.log(await page.title());                   // "Google"

await browser.close();`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'You rarely write the three lines above',
          text: 'The Playwright Test runner gives every test a ready-made `page` fixture, so you just write `async ({ page }) => { ... }`. You will see this in the very next lessons.',
        },
      ],
    },
    {
      id: 'setup',
      title: 'Installing Playwright & Project Setup',
      summary: 'Scaffold a Playwright project, install browsers and understand the files it generates.',
      duration: 11,
      objectives: [
        'Initialise a Playwright project with npm',
        'Install the bundled browsers',
        'Understand the generated config and folders',
      ],
      blocks: [
        { kind: 'heading', text: 'Prerequisites' },
        {
          kind: 'paragraph',
          text: 'You need **Node.js 18 or newer**. Verify it, then create a project folder:',
        },
        { kind: 'code', language: 'bash', code: 'node -v   # v20.x.x\nmkdir pw-demo && cd pw-demo' },
        { kind: 'heading', text: 'Step 1 — Initialise Playwright' },
        {
          kind: 'paragraph',
          text: 'The official initialiser scaffolds everything — config, example tests, a GitHub Actions workflow and the browsers:',
        },
        { kind: 'code', language: 'bash', code: 'npm init playwright@latest' },
        {
          kind: 'paragraph',
          text: 'It asks a few questions: TypeScript or JavaScript (**choose TypeScript**), the tests folder name (`tests`), whether to add a GitHub Actions workflow (**yes** for CI later), and whether to install browsers (**yes**).',
        },
        { kind: 'heading', text: 'Step 2 — What it generated' },
        {
          kind: 'list',
          items: [
            '`playwright.config.ts` — the central config (browsers, baseURL, timeouts, reporters).',
            '`tests/` — your test files, e.g. `example.spec.ts`.',
            '`tests-examples/` — a fuller demo suite you can delete later.',
            '`package.json` — now depends on `@playwright/test`.',
            '`.github/workflows/playwright.yml` — ready-made CI.',
          ],
        },
        { kind: 'heading', text: 'Step 3 — Install / update browsers' },
        {
          kind: 'paragraph',
          text: 'Playwright downloads its **own** patched browser builds (not your system Chrome) so tests are reproducible everywhere. Re-run this any time:',
        },
        { kind: 'code', language: 'bash', code: '# all three engines\nnpx playwright install\n\n# or just one, plus the OS libraries CI needs\nnpx playwright install --with-deps chromium' },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Add to .gitignore',
          text: 'Never commit `node_modules/`, `test-results/`, `playwright-report/` or `blob-report/`. The browsers live in a global cache, not your repo.',
        },
        { kind: 'heading', text: 'Step 4 — Run the example test' },
        { kind: 'code', language: 'bash', code: 'npx playwright test            # run headless\nnpx playwright test --headed   # watch the browser\nnpx playwright show-report     # open the HTML report' },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Install the VS Code extension',
          text: 'The official **Playwright Test for VS Code** extension lets you run/debug single tests from the gutter, pick locators visually and record new tests. It is the fastest way to work day-to-day.',
        },
      ],
    },
    {
      id: 'first-test',
      title: 'Your First Playwright Test',
      summary: 'Write, run and understand a complete test against google.com and this platform.',
      duration: 10,
      practice: ['buttons', 'inputs', 'auth-demo'],
      objectives: [
        'Write a test with the test() + expect() API',
        'Navigate, interact and assert',
        'Understand the test lifecycle and the page fixture',
      ],
      blocks: [
        { kind: 'heading', text: 'A complete first test' },
        {
          kind: 'paragraph',
          text: 'Create `tests/first.spec.ts`. This opens google.com, checks the title, performs a search and asserts the results appeared — all with **no manual waits**.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { test, expect } from '@playwright/test';

test('google search shows results', async ({ page }) => {
  // 1. Navigate
  await page.goto('https://www.google.com');

  // 2. Assert the page loaded
  await expect(page).toHaveTitle(/Google/);

  // 3. Interact: type a query and submit
  const box = page.getByRole('combobox', { name: 'Search' });
  await box.fill('playwright automation');
  await box.press('Enter');

  // 4. Assert results rendered
  await expect(page).toHaveTitle(/playwright automation/);
  await expect(page.getByRole('link').first()).toBeVisible();
});`,
        },
        { kind: 'heading', text: 'Line by line' },
        {
          kind: 'list',
          ordered: true,
          items: [
            '`test(name, fn)` registers a test. The runner injects fixtures via the `{ page }` argument.',
            '`async / await` — every Playwright action returns a Promise; always `await` it.',
            '`page.goto(url)` waits for the `load` event by default.',
            '`getByRole(...)` finds elements the way users and screen readers do (covered next lesson).',
            '`expect(...)` web-first assertions auto-retry until they pass or time out.',
          ],
        },
        { kind: 'heading', text: 'The same idea on this platform' },
        {
          kind: 'paragraph',
          text: 'Because the practice modules expose `data-testid` hooks, the test is short and stable. Point `baseURL` at the running app, then:',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `test('can submit the buttons demo', async ({ page }) => {
  await page.goto('/practice/buttons');

  await page.getByTestId('btn-click').click();
  await expect(page.getByTestId('click-result')).toHaveText('Clicked!');
});`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'No driver, no setup, no teardown',
          text: 'You never created or closed a browser. The runner launches the browser, gives each test a fresh isolated `page`, and tears everything down for you — even if the test fails.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Run just this file',
          text: 'Use `npx playwright test first --headed` to watch it, or click the green ▶ in the VS Code gutter to run a single test.',
        },
      ],
    },
    {
      id: 'test-runner',
      title: 'The Test Runner & Project Structure',
      summary: 'Learn how tests are organised with describe blocks, the config, projects and CLI flags.',
      duration: 12,
      objectives: [
        'Group tests with test.describe',
        'Run, filter and debug from the CLI',
        'Read the most important config options',
      ],
      blocks: [
        { kind: 'heading', text: 'Structuring tests' },
        {
          kind: 'paragraph',
          text: 'A spec file holds one or more tests. Group related tests with `test.describe`, and share setup with hooks (full hooks lesson comes later).',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('rejects a wrong password', async ({ page }) => {
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('wrong');
    await page.getByTestId('login-submit').click();
    await expect(page.getByRole('alert')).toContainText('Invalid');
  });

  test('accepts valid credentials', async ({ page }) => {
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('secret');
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/dashboard/);
  });
});`,
        },
        { kind: 'heading', text: 'The most useful CLI flags' },
        {
          kind: 'code',
          language: 'bash',
          code: `npx playwright test                      # everything
npx playwright test login.spec.ts        # one file
npx playwright test -g "wrong password"  # by title (grep)
npx playwright test --project=firefox    # one browser
npx playwright test --headed --workers=1 # watch, no parallelism
npx playwright test --debug              # step with the Inspector
npx playwright test --ui                 # the interactive UI mode`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'UI mode is a superpower',
          text: '`--ui` opens a time-travel runner: watch each step, see DOM snapshots before/after, inspect the network and re-run on save. It is the best way to develop and debug tests.',
        },
        { kind: 'heading', text: 'The config that drives everything' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,                 // run files in parallel
  retries: process.env.CI ? 2 : 0,     // retry only on CI
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5180',  // page.goto('/login') resolves here
    trace: 'on-first-retry',           // capture a trace when a test retries
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});`,
        },
        {
          kind: 'list',
          items: [
            '`baseURL` — lets every test use relative paths like `/login` instead of full URLs.',
            '`projects` — the **same** tests run across browsers/devices; filter with `--project`.',
            '`trace` / `screenshot` / `video` — diagnostics captured automatically (later track).',
            '`retries` — re-run a failing test N times; pair with traces to debug flakes.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'baseURL points at YOUR app',
          text: 'For this platform, set `baseURL` to where the client runs (for example `http://localhost:5180`). For google.com examples, use the full `https://www.google.com` URL instead of a relative path.',
        },
      ],
    },
    {
      id: 'locators',
      title: 'Locators: The Playwright Way',
      summary: 'Master role-, text-, label- and test-id locators — the resilient, user-facing way to find elements.',
      duration: 15,
      practice: ['inputs', 'buttons', 'dropdowns', 'forms'],
      objectives: [
        'Use getByRole, getByText, getByLabel, getByPlaceholder and getByTestId',
        'Understand why locators are lazy and auto-retrying',
        'Pick the most resilient locator for each case',
      ],
      blocks: [
        { kind: 'heading', text: 'A locator is a recipe, not an element' },
        {
          kind: 'paragraph',
          text: 'In Selenium, `findElement` returns an element immediately and it can go **stale**. In Playwright, `page.getByRole(...)` returns a **Locator** — a lazy description that is re-resolved every time you use it. That single design choice removes almost all `StaleElementReferenceException`-style failures.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Nothing is found yet — this is just a recipe:
const search = page.getByRole('combobox', { name: 'Search' });

// Resolved fresh on each action, with auto-waiting:
await search.fill('cats');
await search.press('Enter');`,
        },
        { kind: 'heading', text: 'The recommended locators (in priority order)' },
        {
          kind: 'list',
          ordered: true,
          items: [
            '`getByRole(role, { name })` — **preferred**. Finds by ARIA role + accessible name, exactly how users/AT perceive the page.',
            '`getByLabel(text)` — form fields by their `<label>`. Best for inputs.',
            '`getByPlaceholder(text)` — inputs by placeholder.',
            '`getByText(text)` — non-interactive text (paragraphs, spans).',
            '`getByAltText` / `getByTitle` — images and elements with a title.',
            '`getByTestId(id)` — escape hatch when nothing semantic exists. Matches `data-testid` by default.',
          ],
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// google.com search box (a combobox with accessible name "Search")
await page.getByRole('combobox', { name: 'Search' }).fill('playwright');

// A button by its visible text / role
await page.getByRole('button', { name: 'Google Search' }).first().click();

// This platform — form fields by label, action by test id
await page.getByLabel('Email').fill('admin@example.com');
await page.getByLabel('Password').fill('secret');
await page.getByTestId('login-submit').click();`,
        },
        { kind: 'heading', text: 'Why getByRole beats CSS/XPath' },
        {
          kind: 'list',
          items: [
            'It survives restyling and DOM reshuffles — classes and `div` nesting change far more often than roles and labels.',
            'It doubles as a lightweight **accessibility** check: if Playwright cannot find the role/name, neither can a screen-reader user.',
            'It reads like a sentence: `getByRole(\'button\', { name: \'Submit\' })`.',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Let Playwright write locators for you',
          text: 'Run `npx playwright codegen https://www.google.com`. Click around and Playwright generates resilient `getByRole`/`getByLabel` locators live. Use it to learn, then refine by hand.',
        },
        { kind: 'heading', text: 'When you still need CSS or XPath' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.locator('#email').fill('a@b.com');               // CSS id
await page.locator('css=button.primary').click();           // explicit CSS
await page.locator('xpath=//button[text()="Save"]').click(); // XPath
await page.locator('[data-testid="row-3"] >> text=Edit').click(); // chaining`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Avoid brittle selectors',
          text: 'Deep CSS like `div > div:nth-child(3) > span` and absolute XPath break on the smallest layout change. Reach for `getByRole`/`getByTestId` first; use CSS/XPath only as a last resort.',
        },
      ],
    },
    {
      id: 'actions',
      title: 'Actions & Interactions',
      summary: 'Click, fill, type, check, select, hover, press keys and upload — the full interaction toolkit.',
      duration: 13,
      practice: ['inputs', 'buttons', 'checkboxes', 'radios', 'dropdowns', 'keyboard', 'file-upload'],
      objectives: [
        'Use fill, click, check, selectOption and press',
        'Handle keyboard and mouse interactions',
        'Know when to use type vs fill',
      ],
      blocks: [
        { kind: 'heading', text: 'The everyday actions' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Text inputs
await page.getByLabel('Email').fill('user@example.com'); // clears + sets instantly
await page.getByLabel('Email').clear();                   // empty it

// Buttons & links
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('link', { name: 'Dashboard' }).click();

// Checkboxes & radios — assert state by intent
await page.getByLabel('I agree').check();
await page.getByLabel('I agree').uncheck();
await page.getByRole('radio', { name: 'Express' }).check();

// Native <select>
await page.getByLabel('Country').selectOption('IN');
await page.getByLabel('Country').selectOption({ label: 'India' });`,
        },
        { kind: 'heading', text: 'fill vs type vs pressSequentially' },
        {
          kind: 'list',
          items: [
            '`fill(value)` — the default. Sets the value in one step and fires the right events. Use it almost always.',
            '`pressSequentially(text, { delay })` — types **character by character**, firing `keydown` per key. Use only when the UI reacts to each keystroke (e.g. an autocomplete that filters as you type).',
            '`press(key)` — a single key or chord: `press(\'Enter\')`, `press(\'Control+A\')`, `press(\'ArrowDown\')`.',
          ],
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Autocomplete on this platform: type slowly so suggestions filter
const ac = page.getByTestId('autocomplete-input');
await ac.pressSequentially('lon', { delay: 100 });
await page.getByRole('option', { name: 'London' }).click();

// google.com: type and submit with Enter
const box = page.getByRole('combobox', { name: 'Search' });
await box.fill('playwright keyboard');
await box.press('Enter');`,
        },
        { kind: 'heading', text: 'Mouse, hover and drag' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.getByText('Account').hover();            // open a hover menu
await page.getByRole('button', { name: 'Logout' }).click();

// Double click / right click
await page.getByTestId('cell-A1').dblclick();
await page.getByTestId('cell-A1').click({ button: 'right' });

// Drag and drop
await page.getByTestId('drag-source').dragTo(page.getByTestId('drop-target'));`,
        },
        { kind: 'heading', text: 'File upload' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.getByTestId('file-input').setInputFiles('data/resume.pdf');
await page.getByTestId('file-input').setInputFiles([]);           // clear
await page.getByTestId('file-input').setInputFiles(['a.png', 'b.png']); // multiple`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Actions auto-wait for actionability',
          text: 'Before clicking, Playwright waits until the element is **attached, visible, stable, enabled and unobscured**. You almost never need an explicit wait before an action.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'force clicks hide bugs',
          text: 'If a click fails because something overlaps the element, prefer fixing the test (scroll, close the overlay, wait for an animation) over `click({ force: true })`. Forcing bypasses the very checks that catch real UI defects.',
        },
      ],
    },
    {
      id: 'assertions',
      title: 'Web-First Assertions',
      summary: 'Use auto-retrying expect() matchers to write assertions that are stable by construction.',
      duration: 12,
      practice: ['ajax', 'delayed-loading', 'toasts'],
      objectives: [
        'Use locator assertions like toBeVisible and toHaveText',
        'Understand auto-retry vs non-retrying assertions',
        'Assert on page, response and values',
      ],
      blocks: [
        { kind: 'heading', text: 'Assertions that wait' },
        {
          kind: 'paragraph',
          text: 'A **web-first assertion** takes a *locator* (not a value) and **retries** until the condition is true or the timeout expires. This is the single biggest reason Playwright suites are stable: you assert the end state and Playwright waits for the app to get there.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Retries until visible — no manual wait needed
await expect(page.getByTestId('result')).toBeVisible();

// Retries until the text matches
await expect(page.getByTestId('result')).toHaveText('Loaded!');
await expect(page.getByTestId('result')).toContainText('Loaded');

// State
await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
await expect(page.getByLabel('I agree')).toBeChecked();

// Counts and values
await expect(page.getByRole('listitem')).toHaveCount(5);
await expect(page.getByLabel('Email')).toHaveValue('a@b.com');

// Page-level
await expect(page).toHaveURL(/dashboard/);
await expect(page).toHaveTitle(/Google/);`,
        },
        { kind: 'heading', text: 'Retrying vs non-retrying' },
        {
          kind: 'list',
          items: [
            '**Retrying** (use these for UI): `expect(locator).toBeVisible()`, `toHaveText`, `toHaveCount`, `toHaveURL`, `expect(response).toBeOK()`.',
            '**Non-retrying** (plain values, evaluated once): `expect(1 + 1).toBe(2)`, `expect(name).toEqual(\'Alice\')`. Use for data you already have in a variable.',
          ],
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// google.com: assert the results page updated after a search
await page.getByRole('combobox', { name: 'Search' }).fill('playwright');
await page.keyboard.press('Enter');
await expect(page).toHaveTitle(/playwright/);
await expect(page.getByRole('link').first()).toBeVisible();`,
        },
        { kind: 'heading', text: 'Soft assertions: keep going after a failure' },
        {
          kind: 'paragraph',
          text: 'A normal `expect` stops the test on first failure. `expect.soft` records the failure but **continues**, so one run surfaces every problem on the page.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `await expect.soft(page.getByTestId('total')).toHaveText('$42.00');
await expect.soft(page.getByTestId('tax')).toHaveText('$2.00');
await expect.soft(page.getByTestId('items')).toHaveCount(3);
// Test is marked failed at the end if any soft expect failed.`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Tune the timeout per assertion',
          text: 'Pass a timeout for genuinely slow conditions: `await expect(locator).toBeVisible({ timeout: 15000 })`. Keep the global `expect` timeout modest so real bugs fail fast.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Do not assert on a value you read too early',
          text: 'Avoid `expect(await locator.textContent()).toBe(...)` for dynamic content — it reads once and will flake. Prefer `await expect(locator).toHaveText(...)`, which retries.',
        },
      ],
    },
    {
      id: 'auto-waiting',
      title: 'Auto-Waiting & Actionability',
      summary: 'Understand the engine that waits for elements so you stop writing sleeps and flaky waits.',
      duration: 11,
      practice: ['spinners', 'delayed-loading', 'ajax', 'stale-elements'],
      objectives: [
        'List the actionability checks Playwright runs',
        'Know the few cases where you still wait explicitly',
        'Diagnose timeouts with the right tools',
      ],
      blocks: [
        { kind: 'heading', text: 'What "auto-waiting" actually checks' },
        {
          kind: 'paragraph',
          text: 'Before an action like `click()`, Playwright keeps polling until the target element passes all relevant **actionability** checks, or the timeout expires:',
        },
        {
          kind: 'list',
          items: [
            '**Attached** to the DOM.',
            '**Visible** (non-empty box, not `display:none`/`visibility:hidden`).',
            '**Stable** — not animating; its box is unchanged across two frames.',
            '**Enabled** — not `disabled`.',
            '**Receives events** — not covered by another element at the click point.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'This is why a spinner overlay "just works": Playwright waits for the button underneath to be clickable instead of clicking the spinner. On this platform, the **Spinners** and **Delayed Loading** modules let you feel this directly.',
        },
        { kind: 'heading', text: 'The few times you wait on purpose' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Wait for a network response your click triggers
const [resp] = await Promise.all([
  page.waitForResponse('**/api/search?*'),
  page.getByRole('button', { name: 'Search' }).click(),
]);
expect(resp.ok()).toBeTruthy();

// Wait for the URL/route to settle after navigation
await page.waitForURL('**/dashboard');

// Poll arbitrary app state (use sparingly)
await expect.poll(async () => {
  return await page.getByTestId('cart-count').textContent();
}).toBe('3');`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Avoid waitForTimeout',
          text: '`page.waitForTimeout(3000)` is the Playwright equivalent of `Thread.sleep` — it is only acceptable for debugging. In real tests, wait for a **condition** (a locator, a response, a URL), never a fixed duration.',
        },
        { kind: 'heading', text: 'networkidle is usually the wrong tool' },
        {
          kind: 'paragraph',
          text: 'Beginners reach for `waitForLoadState(\'networkidle\')`. On modern apps with polling, analytics and websockets, the network is never idle, so it flakes. Prefer asserting on the **element you care about** — `await expect(page.getByTestId(\'result\')).toBeVisible()`.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'When a click times out, read the error',
          text: 'Playwright prints exactly which actionability check failed (e.g. "element is not visible" or "intercepts pointer events"). That message tells you whether to wait for an overlay to close, scroll, or fix the locator.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK P2 — Playwright Essentials (intermediate)
   ════════════════════════════════════════════════════════════════════════ */

const playwrightEssentials: LearningTrack = {
  id: 'playwright-essentials',
  category: 'Playwright',
  title: 'Playwright Essentials',
  subtitle: 'Locators, forms, fixtures & the Page Object Model',
  description:
    'Level up from scripts to a real suite: filter and chain locators, handle every form control, dialogs, frames and tabs, master fixtures and hooks, configure projects, and structure tests with the Page Object Model.',
  icon: Workflow,
  level: 'intermediate',
  tags: ['playwright', 'fixtures', 'pom', 'frames', 'config'],
  lessons: [
    {
      id: 'locator-deep-dive',
      title: 'Locator Deep Dive: Filter, Chain & Narrow',
      summary: 'Pinpoint one element among many with filtering, chaining, nth, has and hasText.',
      duration: 14,
      practice: ['tables', 'pagination', 'search-filter', 'ecommerce'],
      objectives: [
        'Filter locators by text and by child locators',
        'Chain locators to scope a search',
        'Handle lists with first/last/nth and strictness',
      ],
      blocks: [
        { kind: 'heading', text: 'Strictness: a feature, not a bug' },
        {
          kind: 'paragraph',
          text: 'If a locator matches **more than one** element, Playwright throws a *strict mode violation* instead of silently using the first. This forces you to write precise locators and catches ambiguous UI early.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Throws if there are several "Delete" buttons:
await page.getByRole('button', { name: 'Delete' }).click();

// Disambiguate explicitly:
await page.getByRole('button', { name: 'Delete' }).first().click();
await page.getByRole('button', { name: 'Delete' }).nth(2).click();
await page.getByRole('button', { name: 'Delete' }).last().click();`,
        },
        { kind: 'heading', text: 'Filtering' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// A row that contains specific text
const row = page.getByRole('row').filter({ hasText: 'Alice' });
await row.getByRole('button', { name: 'Edit' }).click();

// A card that contains a given child locator
const card = page.getByTestId('product-card')
  .filter({ has: page.getByText('Out of stock') });
await expect(card).toHaveCount(0); // assert none are out of stock

// Exclude matches
const active = page.getByRole('listitem').filter({ hasNotText: 'archived' });`,
        },
        { kind: 'heading', text: 'Chaining to scope' },
        {
          kind: 'paragraph',
          text: 'Chaining searches **inside** a previous locator — the cleanest way to target an element within a specific section, card or row.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `const checkout = page.getByRole('region', { name: 'Order summary' });
await expect(checkout.getByTestId('total')).toHaveText('$42.00');

// On this platform's data table: the Edit button in Bob's row
await page.getByRole('row', { name: /Bob/ })
  .getByRole('button', { name: 'Edit' })
  .click();`,
        },
        { kind: 'heading', text: 'Iterating a list' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const items = page.getByRole('listitem');
await expect(items).toHaveCount(3);

// Read all texts at once
const texts = await items.allTextContents();
expect(texts).toContain('Free shipping');

// Loop with index
for (let i = 0; i < await items.count(); i++) {
  await expect(items.nth(i)).toBeVisible();
}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'getByRole options pay off here',
          text: 'Many ambiguities vanish with role options: `getByRole(\'button\', { name: \'Save\', exact: true })`, `getByRole(\'checkbox\', { checked: true })`, `getByRole(\'heading\', { level: 2 })`.',
        },
      ],
    },
    {
      id: 'forms',
      title: 'Forms: Inputs, Dropdowns, Checkboxes & Files',
      summary: 'Drive every form control reliably, including custom (non-native) dropdowns.',
      duration: 13,
      practice: ['forms', 'inputs', 'dropdowns', 'checkboxes', 'radios', 'date-picker', 'sliders', 'file-upload'],
      objectives: [
        'Handle native selects vs custom dropdowns',
        'Set checkboxes, radios, sliders and date pickers',
        'Upload and clear files',
      ],
      blocks: [
        { kind: 'heading', text: 'Native <select>' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const country = page.getByLabel('Country');
await country.selectOption('IN');                 // by value
await country.selectOption({ label: 'India' });   // by visible text
await country.selectOption({ index: 2 });         // by index
await country.selectOption(['red', 'blue']);      // multi-select`,
        },
        { kind: 'heading', text: 'Custom dropdowns (React/Material/Headless UI)' },
        {
          kind: 'paragraph',
          text: 'Custom dropdowns are not `<select>` — they are `<div>`/`<ul>` widgets. The pattern is always: **click to open, then click the option**. `getByRole(\'option\')` usually works because good widgets expose the `option` role.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.getByTestId('country-trigger').click();          // open
await page.getByRole('option', { name: 'India' }).click();   // choose
await expect(page.getByTestId('country-trigger')).toHaveText('India');`,
        },
        { kind: 'heading', text: 'Checkboxes, radios, switches' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.getByLabel('Subscribe').check();
await expect(page.getByLabel('Subscribe')).toBeChecked();

await page.getByRole('radio', { name: 'Express delivery' }).check();
await page.getByRole('switch', { name: 'Dark mode' }).click();`,
        },
        { kind: 'heading', text: 'Sliders, date pickers and tricky inputs' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Range slider — set value via keyboard for determinism
const slider = page.getByRole('slider', { name: 'Volume' });
await slider.focus();
await slider.press('Home');                 // jump to min
for (let i = 0; i < 7; i++) await slider.press('ArrowRight');

// Date input: many are plain inputs — fill the ISO value
await page.getByLabel('Start date').fill('2026-06-28');

// Calendar widget: open and click the day
await page.getByTestId('date-trigger').click();
await page.getByRole('button', { name: '28', exact: true }).click();`,
        },
        { kind: 'heading', text: 'File upload & the filechooser event' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Direct (input[type=file] present)
await page.getByTestId('file-input').setInputFiles('data/photo.png');

// When a custom button opens the OS dialog, catch the chooser:
const [chooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.getByRole('button', { name: 'Upload' }).click(),
]);
await chooser.setFiles('data/photo.png');`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Assert intent, not mechanics',
          text: 'After choosing a custom dropdown option, assert the **visible result** (`toHaveText(\'India\')`) rather than internal classes. Your test should verify what the user sees.',
        },
      ],
    },
    {
      id: 'dialogs-frames-tabs',
      title: 'Dialogs, Frames, Tabs & Downloads',
      summary: 'Handle native dialogs, iframes, popups/new tabs and file downloads the Playwright way.',
      duration: 13,
      practice: ['alerts', 'iframes', 'nested-frames', 'modals'],
      objectives: [
        'Accept/dismiss native dialogs with page.on(dialog)',
        'Reach into iframes with frameLocator',
        'Handle popups, new tabs and downloads',
      ],
      blocks: [
        { kind: 'heading', text: 'Native dialogs (alert / confirm / prompt)' },
        {
          kind: 'paragraph',
          text: 'Playwright **auto-dismisses** dialogs by default so they cannot block a test. To interact, register a handler **before** the action that triggers it.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `page.on('dialog', async (dialog) => {
  console.log(dialog.type(), dialog.message());
  await dialog.accept();          // OK; use dialog.dismiss() for Cancel
  // For prompts: await dialog.accept('my answer');
});

await page.getByTestId('trigger-confirm').click();`,
        },
        { kind: 'heading', text: 'iframes with frameLocator' },
        {
          kind: 'paragraph',
          text: 'Unlike Selenium, you do **not** switch context. You scope into the frame with `frameLocator` and keep chaining locators normally.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `const frame = page.frameLocator('iframe[title="payment"]');
await frame.getByLabel('Card number').fill('4242 4242 4242 4242');
await frame.getByRole('button', { name: 'Pay' }).click();

// Nested frames just chain:
page.frameLocator('#outer').frameLocator('#inner').getByText('Deep');`,
        },
        { kind: 'heading', text: 'Popups and new tabs' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: 'Open report' }).click(),
]);
await popup.waitForLoadState();
await expect(popup).toHaveTitle(/Report/);
await popup.close();`,
        },
        { kind: 'heading', text: 'Downloads' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Export CSV' }).click(),
]);
console.log(await download.suggestedFilename());   // report.csv
await download.saveAs('downloads/report.csv');`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'New tabs share the context',
          text: 'A popup is a new `Page` in the **same** BrowserContext, so it shares cookies and login state — exactly what you want when a flow opens a second tab.',
        },
      ],
    },
    {
      id: 'fixtures-hooks',
      title: 'Fixtures & Test Hooks',
      summary: 'Use built-in fixtures, beforeEach/afterEach hooks and write your own custom fixtures.',
      duration: 14,
      practice: ['auth-demo', 'wizard'],
      objectives: [
        'Use page, context, request and browser fixtures',
        'Share setup with hooks',
        'Author a custom fixture (e.g. a logged-in page)',
      ],
      blocks: [
        { kind: 'heading', text: 'Built-in fixtures' },
        {
          kind: 'paragraph',
          text: 'Fixtures are dependency-injected per test. The most used are `page` (a fresh tab), `context` (the isolated session), `request` (an API client) and `browser` (shared). You receive only what you destructure.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `test('isolated by default', async ({ page, context }) => {
  await context.addCookies([{ name: 'lang', value: 'en', url: 'https://www.google.com' }]);
  await page.goto('https://www.google.com');
});`,
        },
        { kind: 'heading', text: 'Hooks' },
        {
          kind: 'code',
          language: 'typescript',
          code: `test.describe('Dashboard', () => {
  test.beforeAll(async () => { /* one-time: seed data */ });
  test.beforeEach(async ({ page }) => { await page.goto('/dashboard'); });
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: \`fail-\${testInfo.title}.png\` });
    }
  });
  test.afterAll(async () => { /* cleanup */ });
});`,
        },
        { kind: 'heading', text: 'Custom fixtures: a logged-in page' },
        {
          kind: 'paragraph',
          text: 'The killer feature. Extract repeated setup (like logging in) into a fixture so every test that needs it just asks for `loggedInPage`.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// fixtures.ts
import { test as base } from '@playwright/test';

export const test = base.extend<{ loggedInPage: import('@playwright/test').Page }>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('admin@example.com');
    await page.getByTestId('login-password').fill('secret');
    await page.getByTestId('login-submit').click();
    await page.waitForURL('**/dashboard');
    await use(page);            // hand the ready page to the test
  },
});
export { expect } from '@playwright/test';`,
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// a test that reuses it
import { test, expect } from './fixtures';

test('shows my name', async ({ loggedInPage }) => {
  await expect(loggedInPage.getByTestId('user-name')).toHaveText('Admin');
});`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Fixtures > copy-pasted beforeEach',
          text: 'Fixtures compose, run only when requested, and clean up after themselves (everything after `await use()` is teardown). They are the idiomatic way to share state in Playwright.',
        },
      ],
    },
    {
      id: 'config',
      title: 'Configuration & Projects',
      summary: 'Master playwright.config.ts: projects, dependencies, timeouts, baseURL and environments.',
      duration: 12,
      objectives: [
        'Configure multi-browser and multi-device projects',
        'Use project dependencies for global setup',
        'Tune timeouts, retries and reporters per environment',
      ],
      blocks: [
        { kind: 'heading', text: 'Projects: same tests, many environments' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,                 // per-test budget
  expect: { timeout: 5_000 },      // per-assertion budget
  use: { baseURL: process.env.BASE_URL ?? 'http://localhost:5180' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
  ],
});`,
        },
        { kind: 'heading', text: 'Project dependencies: run setup first' },
        {
          kind: 'paragraph',
          text: 'A common senior pattern: a `setup` project authenticates once and saves storage state; every other project depends on it and reuses the session (full auth lesson in the Advanced track).',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `projects: [
  { name: 'setup', testMatch: /global\\.setup\\.ts/ },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'state/user.json' },
    dependencies: ['setup'],      // setup runs and finishes first
  },
],`,
        },
        { kind: 'heading', text: 'Web server: boot the app for tests' },
        {
          kind: 'paragraph',
          text: 'Let Playwright start (and wait for) your app before the suite — perfect for local runs and CI of this platform.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `webServer: {
  command: 'npm run dev',
  url: 'http://localhost:5180',
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
},`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Two timeouts, two jobs',
          text: 'The **test** timeout (default 30s) bounds the whole test; the **expect** timeout (default 5s) bounds one assertion/action. Raising the test timeout will not help a single slow assertion — raise the right one.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Drive config from env',
          text: 'Read `process.env` for `baseURL`, retries and workers so the same config runs locally and in CI without edits: `retries: process.env.CI ? 2 : 0`.',
        },
      ],
    },
    {
      id: 'pom',
      title: 'The Page Object Model in Playwright',
      summary: 'Structure tests with page objects built around locators for clean, maintainable suites.',
      duration: 14,
      practice: ['auth-demo', 'ecommerce', 'wizard'],
      objectives: [
        'Build a page object exposing locators and actions',
        'Return page objects to model navigation',
        'Keep assertions in tests, mechanics in pages',
      ],
      blocks: [
        { kind: 'heading', text: 'Why POM still matters' },
        {
          kind: 'paragraph',
          text: 'Locators are resilient, but flows still repeat. A **page object** centralises the locators and user-intent methods for a screen so a UI change touches one file, and tests read like English.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// pages/LoginPage.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.getByTestId('login-email');
    this.password = page.getByTestId('login-password');
    this.submit = page.getByTestId('login-submit');
    this.error = page.getByRole('alert');
  }

  async goto() { await this.page.goto('/login'); }

  async login(user: string, pass: string) {
    await this.email.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }

  async expectError(text: string) {
    await expect(this.error).toContainText(text);
  }
}`,
        },
        { kind: 'heading', text: 'The test becomes tiny' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('rejects bad credentials', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('admin@example.com', 'wrong');
  await login.expectError('Invalid credentials');
});`,
        },
        { kind: 'heading', text: 'Best practices' },
        {
          kind: 'list',
          items: [
            'Expose **Locators** as readonly fields — never raw selector strings in tests.',
            'Methods model **intent** (`login`, `addToCart`), not clicks and fills.',
            'Keep assertions in tests; the exception is small `expect*` helpers like `expectError` for readability.',
            'Return the next page object from navigations to model real flow (e.g. `login()` returns a `DashboardPage`).',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Combine POM with a fixture',
          text: 'Expose page objects as fixtures (`{ loginPage }`) so tests get a ready instance without `new` boilerplate — the cleanest Playwright architecture.',
        },
      ],
    },
    {
      id: 'artifacts',
      title: 'Screenshots, Video & Trace',
      summary: 'Capture the diagnostics that make failures obvious: screenshots, video and the trace.',
      duration: 11,
      objectives: [
        'Capture element/full-page screenshots',
        'Record video and traces on failure',
        'Open and read a trace',
      ],
      blocks: [
        { kind: 'heading', text: 'Screenshots' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.screenshot({ path: 'home.png', fullPage: true });
await page.getByTestId('invoice').screenshot({ path: 'invoice.png' });
// In config: capture automatically on failure
// use: { screenshot: 'only-on-failure' }`,
        },
        { kind: 'heading', text: 'Video' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// playwright.config.ts
use: {
  video: 'retain-on-failure',   // 'on' | 'off' | 'on-first-retry'
}`,
        },
        { kind: 'heading', text: 'Trace — the time machine' },
        {
          kind: 'paragraph',
          text: 'A **trace** records every action, DOM snapshot, console log and network call. Opening it is like stepping through the test after the fact — the single best debugging tool Playwright offers.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// config: capture a trace when a test retries
use: { trace: 'on-first-retry' }   // or 'retain-on-failure'`,
        },
        {
          kind: 'code',
          language: 'bash',
          code: `# open the trace the report links to
npx playwright show-trace test-results/<...>/trace.zip`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'on-first-retry is the sweet spot',
          text: 'Tracing every run is slow and large. `on-first-retry` records nothing on green runs and a full trace exactly when a test flakes — zero overhead, maximum signal.',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Attach extras to the report',
          text: 'Use `testInfo.attach(\'data\', { body, contentType })` to attach JSON, logs or images to the HTML report for richer failure context.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK P3 — Playwright Advanced (network, auth, visual, parallel)
   ════════════════════════════════════════════════════════════════════════ */

const playwrightAdvanced: LearningTrack = {
  id: 'playwright-advanced',
  category: 'Playwright',
  title: 'Advanced Playwright',
  subtitle: 'Auth, network, API, visual & parallelism',
  description:
    'The techniques senior SDETs use daily: reuse authentication via storage state, intercept and mock the network, test APIs alongside the UI, do visual and component testing, and run fast with parallelism, sharding and smart retries.',
  icon: Network,
  level: 'advanced',
  tags: ['playwright', 'network', 'auth', 'visual', 'api', 'parallel'],
  lessons: [
    {
      id: 'auth-state',
      title: 'Authentication & Storage State',
      summary: 'Log in once, reuse the session everywhere — the standard way to make auth fast and stable.',
      duration: 14,
      practice: ['auth-demo'],
      objectives: [
        'Save and reuse storageState',
        'Authenticate once in a setup project',
        'Handle multiple roles and token-based auth',
      ],
      blocks: [
        { kind: 'heading', text: 'The problem' },
        {
          kind: 'paragraph',
          text: 'Logging in through the UI in every test is slow and brittle. The fix: authenticate **once**, save the cookies + localStorage to a file (**storage state**), and start every other test already logged in.',
        },
        { kind: 'heading', text: 'Step 1 — a setup project that logs in' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// global.setup.ts
import { test as setup, expect } from '@playwright/test';

const userFile = 'state/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('admin@example.com');
  await page.getByTestId('login-password').fill('secret');
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('user-name')).toBeVisible();

  await page.context().storageState({ path: userFile });   // save session
});`,
        },
        { kind: 'heading', text: 'Step 2 — reuse it via config' },
        {
          kind: 'code',
          language: 'typescript',
          code: `projects: [
  { name: 'setup', testMatch: /global\\.setup\\.ts/ },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'state/user.json' },
    dependencies: ['setup'],
  },
],`,
        },
        {
          kind: 'paragraph',
          text: 'Now every test in the `chromium` project starts authenticated — no login steps, no flake, often seconds faster per test.',
        },
        { kind: 'heading', text: 'Multiple roles' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Save one state file per role in setup (admin.json, user.json),
// then opt-in per test or per describe block:
test.use({ storageState: 'state/admin.json' });

test('admin sees the user manager', async ({ page }) => {
  await page.goto('/admin/users');
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
});`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Token / API login is even faster',
          text: 'If your app issues a JWT, log in via the API with the `request` fixture and write the token into storage state — skipping the UI entirely. Fast and rock-solid.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Never commit real secrets',
          text: 'Keep credentials in environment variables and add `state/` to `.gitignore`. Storage-state files contain live session tokens.',
        },
      ],
    },
    {
      id: 'network-mocking',
      title: 'Network Interception & Mocking',
      summary: 'Intercept, stub, modify and block requests to test edge cases deterministically.',
      duration: 16,
      practice: ['ajax', 'api-testing', 'search-filter', 'infinite-scroll'],
      objectives: [
        'Mock API responses with route.fulfill',
        'Modify or abort requests',
        'Assert on requests and replay with HAR',
      ],
      blocks: [
        { kind: 'heading', text: 'Why mock the network?' },
        {
          kind: 'paragraph',
          text: 'To test the **frontend** in isolation you control its data: force an empty state, an error, a slow response or a huge list — none of which you can reliably trigger through a real backend. `page.route` intercepts matching requests before they leave the browser.',
        },
        { kind: 'heading', text: 'Stub a JSON response' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.route('**/api/products*', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Mocked Widget', price: 9.99 }]),
  });
});

await page.goto('/practice/ecommerce');
await expect(page.getByText('Mocked Widget')).toBeVisible();`,
        },
        { kind: 'heading', text: 'Force errors, empty and slow states' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// 500 error → assert the UI shows a friendly message
await page.route('**/api/products*', (r) =>
  r.fulfill({ status: 500, body: 'Server error' }));

// Empty list → assert the empty state renders
await page.route('**/api/products*', (r) =>
  r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));

// Abort to simulate offline / blocked third-parties (ads, analytics)
await page.route('**/*.{png,jpg,svg}', (r) => r.abort());`,
        },
        { kind: 'heading', text: 'Modify a real response' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.route('**/api/profile', async (route) => {
  const response = await route.fetch();        // let it hit the server
  const json = await response.json();
  json.name = 'QA Override';                    // tweak the payload
  await route.fulfill({ response, json });
});`,
        },
        { kind: 'heading', text: 'Assert that a request happened' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const reqPromise = page.waitForRequest('**/api/search?*');
await page.getByRole('button', { name: 'Search' }).click();
const req = await reqPromise;
expect(new URL(req.url()).searchParams.get('q')).toBe('phone');`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Record once, replay forever with HAR',
          text: 'Capture real traffic to a HAR file, then serve it back deterministically: `await page.routeFromHAR(\'data/api.har\', { update: false })`. Great for stable, offline UI tests.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Mock at the edge, not everything',
          text: 'Mock third-party and flaky dependencies; keep at least one true end-to-end path unmocked so you still catch real integration breakage.',
        },
      ],
    },
    {
      id: 'api-testing',
      title: 'API Testing & Hybrid UI+API',
      summary: 'Use the request fixture to test REST endpoints and to set up/verify UI tests fast.',
      duration: 14,
      practice: ['api-testing', 'auth-demo'],
      objectives: [
        'Call APIs with the request fixture',
        'Assert status, headers and bodies',
        'Mix API setup with UI assertions',
      ],
      blocks: [
        { kind: 'heading', text: 'Pure API tests' },
        {
          kind: 'paragraph',
          text: 'Playwright ships a full HTTP client (`request`) with the same auto-config (baseURL, storage state). You can test an API with zero browser.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { test, expect } from '@playwright/test';

test('GET /api/health is ok', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
  expect(res.status()).toBe(200);
  expect(await res.json()).toMatchObject({ status: 'ok' });
});

test('POST /api/auth/login returns a token', async ({ request }) => {
  const res = await request.post('/api/auth/login', {
    data: { email: 'admin@example.com', password: 'secret' },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.accessToken).toBeTruthy();
});`,
        },
        { kind: 'heading', text: 'Hybrid: seed via API, verify via UI' },
        {
          kind: 'paragraph',
          text: 'The senior pattern that makes suites fast: create the data you need over the API (instant, reliable), then open the UI and assert it renders. No clicking through creation wizards.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `test('new resource appears in the list', async ({ request, page }) => {
  // 1. Arrange — create via API
  const create = await request.post('/api/resources', {
    data: { title: 'Playwright Guide', type: 'doc' },
  });
  const { id } = await create.json();

  // 2. Act + Assert — verify in the UI
  await page.goto('/resources');
  await expect(page.getByTestId(\`resource-\${id}\`)).toContainText('Playwright Guide');

  // 3. Cleanup
  await request.delete(\`/api/resources/\${id}\`);
});`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Reuse auth for the API client',
          text: 'Create a request context with a token: `await playwright.request.newContext({ extraHTTPHeaders: { Authorization: \`Bearer \${token}\` } })` and share it across API tests.',
        },
      ],
    },
    {
      id: 'visual-testing',
      title: 'Visual Regression Testing',
      summary: 'Catch unintended UI changes with pixel snapshots and toHaveScreenshot.',
      duration: 12,
      practice: ['ecommerce', 'tables'],
      objectives: [
        'Create and compare visual snapshots',
        'Mask dynamic regions and set thresholds',
        'Update baselines intentionally',
      ],
      blocks: [
        { kind: 'heading', text: 'Snapshot assertions' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// First run writes the baseline; later runs compare against it
await expect(page).toHaveScreenshot('dashboard.png');

// Element-level is more stable than full page
await expect(page.getByTestId('invoice')).toHaveScreenshot('invoice.png');`,
        },
        { kind: 'heading', text: 'Tame flakiness: mask, threshold, animations' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await expect(page).toHaveScreenshot('home.png', {
  mask: [page.getByTestId('current-time'), page.getByRole('img', { name: 'avatar' })],
  maxDiffPixelRatio: 0.01,    // allow tiny anti-aliasing differences
  animations: 'disabled',     // freeze CSS animations/transitions
});`,
        },
        { kind: 'heading', text: 'Updating baselines on purpose' },
        {
          kind: 'code',
          language: 'bash',
          code: `# After an intended UI change, regenerate snapshots:
npx playwright test --update-snapshots
# Review the new PNGs in git before committing.`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Pin the rendering environment',
          text: 'Fonts and GPU differ across OSes, so a Mac baseline fails on Linux CI. Generate and compare snapshots in the **same** environment — usually the Docker image used in CI.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Start small',
          text: 'Snapshot a few high-value, stable components (an invoice, an empty state) rather than whole noisy pages. Visual tests pay off when they are targeted.',
        },
      ],
    },
    {
      id: 'component-testing',
      title: 'Component Testing',
      summary: 'Test React/Vue/Svelte components in a real browser, in isolation, without a full app.',
      duration: 12,
      objectives: [
        'Mount a component with the experimental CT runner',
        'Pass props and assert behaviour',
        'Decide when component vs e2e is right',
      ],
      blocks: [
        { kind: 'heading', text: 'What component testing buys you' },
        {
          kind: 'paragraph',
          text: 'Component tests **mount** a single component in a real browser and drive it with Playwright locators — faster and more focused than full e2e, more realistic than jsdom unit tests. Ideal for design-system pieces like a `Button` or `DatePicker`.',
        },
        { kind: 'code', language: 'bash', code: 'npm init playwright@latest -- --ct   # adds component-testing config' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('fires onClick', async ({ mount }) => {
  let clicks = 0;
  const component = await mount(<Button onClick={() => clicks++}>Buy</Button>);
  await component.getByRole('button', { name: 'Buy' }).click();
  expect(clicks).toBe(1);
});

test('renders the disabled state', async ({ mount }) => {
  const component = await mount(<Button disabled>Buy</Button>);
  await expect(component.getByRole('button')).toBeDisabled();
});`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Component vs end-to-end',
          text: 'Use **component** tests for a widget\u2019s states and props in isolation; use **e2e** for journeys that cross pages, routing and the backend. A healthy suite has both, with far more component/integration tests than slow e2e.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'It is still experimental',
          text: 'Playwright CT is powerful but labelled experimental and the API can shift between releases. Pin your Playwright version and read the changelog before upgrading.',
        },
      ],
    },
    {
      id: 'parallelism',
      title: 'Parallelism, Workers & Sharding',
      summary: 'Run suites fast and safely with parallel workers and CI sharding.',
      duration: 13,
      objectives: [
        'Control parallelism with workers and fullyParallel',
        'Serialise tests that must not overlap',
        'Shard a suite across CI machines',
      ],
      blocks: [
        { kind: 'heading', text: 'How Playwright parallelises' },
        {
          kind: 'paragraph',
          text: 'Playwright runs test **files** in parallel across worker processes. With `fullyParallel: true`, tests **within** a file run in parallel too. Each worker has its own browser and isolated state, so well-written tests do not interfere.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// config
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,  // undefined = ~half your CPU cores
});`,
        },
        { kind: 'heading', text: 'When tests must NOT run in parallel' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Force a file/describe to run one test at a time, in order
test.describe.configure({ mode: 'serial' });

test.describe('checkout wizard', () => {
  test('step 1', async ({ page }) => { /* ... */ });
  test('step 2 depends on step 1', async ({ page }) => { /* ... */ });
});`,
        },
        { kind: 'heading', text: 'Sharding across machines' },
        {
          kind: 'paragraph',
          text: 'Split the suite across N CI machines, then merge their blob reports into one HTML report.',
        },
        {
          kind: 'code',
          language: 'bash',
          code: `# machine 1 of 4, 2 of 4, ...
npx playwright test --shard=1/4
npx playwright test --shard=2/4

# later, merge the blob reports
npx playwright merge-reports --reporter=html ./all-blob-reports`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Parallelism exposes shared-state bugs',
          text: 'Tests that share a database row, a fixed username or a file will collide under parallelism. Generate unique data per test (timestamps, UUIDs) and prefer per-test isolation over `serial`.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'serial vs default',
          text: 'In `serial` mode, if one test fails the rest are skipped. Reserve it for genuinely dependent steps; for everything else keep tests independent so a single failure does not cascade.',
        },
      ],
    },
    {
      id: 'retries-flakiness',
      title: 'Retries, Flakiness & Test Isolation',
      summary: 'Diagnose and eliminate flaky tests — the problem senior testers fight most.',
      duration: 14,
      practice: ['random-elements', 'stale-elements', 'spinners', 'ajax'],
      objectives: [
        'Configure retries and read the flaky report',
        'Find root causes with traces',
        'Apply isolation and determinism patterns',
      ],
      blocks: [
        { kind: 'heading', text: 'Retries surface flakes, they do not fix them' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// config
retries: process.env.CI ? 2 : 0,
use: { trace: 'on-first-retry' },   // capture exactly when it flakes`,
        },
        {
          kind: 'paragraph',
          text: 'A test that fails then passes on retry is reported as **flaky**. Treat every flaky test as a bug: open the retry\u2019s trace, find the race, and fix the test or the app.',
        },
        { kind: 'heading', text: 'The usual root causes' },
        {
          kind: 'list',
          items: [
            'Asserting on a value read too early — use auto-retrying `expect(locator)` instead of `await locator.textContent()`.',
            '`waitForTimeout`/`networkidle` instead of waiting for a concrete condition.',
            'Shared state across tests (same user, same row) under parallelism.',
            'Animations/toasts that move the click target — disable animations or wait for stability.',
            'Time, randomness and timezones — freeze them (see Emulation).',
          ],
        },
        { kind: 'heading', text: 'Determinism patterns' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// 1. Unique data per test
const email = \`user_\${Date.now()}@example.com\`;

// 2. Wait for the response the action triggers, not a sleep
await Promise.all([
  page.waitForResponse('**/api/save'),
  page.getByRole('button', { name: 'Save' }).click(),
]);

// 3. Poll app state instead of guessing
await expect.poll(() => page.getByTestId('status').textContent()).toBe('Done');`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Quarantine, then fix',
          text: 'Tag a known-flaky test (e.g. @flaky) and exclude it from the blocking CI gate while you fix it — but track it. Never let a flaky test train your team to ignore red builds.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'High retries hide rot',
          text: 'Retries of 1\u20132 are a safety net. If you need 4+ to go green, the suite is sick — invest in root-causing, not bigger retry counts.',
        },
      ],
    },
    {
      id: 'emulation',
      title: 'Emulation: Mobile, Geolocation, Time & Permissions',
      summary: 'Emulate devices, locales, timezones, geolocation, permissions and offline mode.',
      duration: 12,
      objectives: [
        'Emulate mobile devices and viewports',
        'Set geolocation, locale, timezone and permissions',
        'Freeze time and simulate offline',
      ],
      blocks: [
        { kind: 'heading', text: 'Devices and viewport' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { devices } from '@playwright/test';

// In config as a project:
{ name: 'Pixel 7', use: { ...devices['Pixel 7'] } }

// Ad-hoc context:
const context = await browser.newContext({
  ...devices['iPhone 14'],
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});`,
        },
        { kind: 'heading', text: 'Locale, timezone, geolocation, permissions' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const context = await browser.newContext({
  locale: 'de-DE',
  timezoneId: 'Europe/Berlin',
  geolocation: { latitude: 52.52, longitude: 13.405 }, // Berlin
  permissions: ['geolocation'],
  colorScheme: 'dark',
});
// google.com in German with a Berlin location & dark mode
await context.newPage().then((p) => p.goto('https://www.google.com'));`,
        },
        { kind: 'heading', text: 'Freeze time for deterministic UI' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Pin "now" so date-dependent UI is stable
await page.clock.setFixedTime(new Date('2026-06-28T10:00:00Z'));
// Or install a controllable clock and fast-forward:
await page.clock.install({ time: new Date('2026-06-28T10:00:00Z') });
await page.clock.fastForward('01:00');   // jump an hour`,
        },
        { kind: 'heading', text: 'Offline & network conditions' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await context.setOffline(true);   // test offline banners / retries
await context.setOffline(false);`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Emulation catches real regional bugs',
          text: 'Date formats, currency, RTL layouts and "near me" features break by locale/timezone. Add a German or Arabic project to your matrix to catch these before users do.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK P4 — Playwright Expert & Real-World CI
   ════════════════════════════════════════════════════════════════════════ */

const playwrightExpert: LearningTrack = {
  id: 'playwright-expert',
  category: 'Playwright',
  title: 'Playwright Expert & CI',
  subtitle: 'Debugging, CI/CD, reporting, a11y & migration',
  description:
    'The expert layer: master the trace viewer and debugging, wire Playwright into CI/CD with sharding and Docker, choose reporters, manage test data, automate accessibility checks, apply advanced architecture patterns, and migrate a Selenium suite to Playwright.',
  icon: Gauge,
  level: 'advanced',
  tags: ['playwright', 'ci', 'debugging', 'reporters', 'accessibility', 'migration'],
  lessons: [
    {
      id: 'trace-debugging',
      title: 'Debugging: Trace Viewer, Inspector & Codegen',
      summary: 'Use every Playwright debugging tool to find the cause of a failure fast.',
      duration: 13,
      objectives: [
        'Time-travel through a trace',
        'Step tests with the Inspector and UI mode',
        'Generate and refine locators with codegen',
      ],
      blocks: [
        { kind: 'heading', text: 'The toolbox' },
        {
          kind: 'list',
          items: [
            '**UI mode** (`--ui`) — interactive runner with time-travel, watch mode and a network panel. Your default while developing.',
            '**Trace viewer** — post-mortem of a CI failure: snapshots, actions, console and network for every step.',
            '**Inspector** (`--debug` / `PWDEBUG=1`) — pause execution, step actions and try locators live.',
            '**Codegen** (`codegen`) — record clicks into resilient locator code.',
          ],
        },
        { kind: 'heading', text: 'Reading a trace' },
        {
          kind: 'code',
          language: 'bash',
          code: `npx playwright test --trace on           # force a trace for every test
npx playwright show-trace trace.zip      # open a specific trace
# In the report, click the trace icon next to a failed test.`,
        },
        {
          kind: 'paragraph',
          text: 'The timeline shows each action with **before/after DOM snapshots** you can hover and inspect. The Network and Console tabs line up with the exact moment of failure — usually the bug is obvious within seconds.',
        },
        { kind: 'heading', text: 'Pause and step' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Drop a breakpoint anywhere:
await page.pause();   // opens the Inspector; step, resume, try locators`,
        },
        { kind: 'heading', text: 'Codegen against any site' },
        {
          kind: 'code',
          language: 'bash',
          code: `npx playwright codegen https://www.google.com
npx playwright codegen --device="iPhone 14" http://localhost:5180/login`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Pick locators visually',
          text: 'In UI mode or the Inspector, use **Pick locator** to hover the page and copy the exact `getByRole`/`getByTestId` Playwright recommends — faster and more robust than hand-writing selectors.',
        },
      ],
    },
    {
      id: 'ci-cd',
      title: 'CI/CD: GitHub Actions, Docker & Sharding',
      summary: 'Run Playwright reliably in CI with caching, sharding, artifacts and the official image.',
      duration: 15,
      objectives: [
        'Write a GitHub Actions workflow',
        'Use the official Docker image',
        'Shard across runners and publish reports',
      ],
      blocks: [
        { kind: 'heading', text: 'A solid GitHub Actions workflow' },
        {
          kind: 'code',
          language: 'yaml',
          code: `name: e2e
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
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
          retention-days: 7`,
        },
        { kind: 'heading', text: 'Shard across runners' },
        {
          kind: 'code',
          language: 'yaml',
          code: `jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
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
        { kind: 'heading', text: 'The official Docker image' },
        {
          kind: 'code',
          language: 'bash',
          code: `# Browsers + OS deps preinstalled — matches your snapshots' environment
docker run --rm -v $(pwd):/work -w /work \\
  mcr.microsoft.com/playwright:v1.48.0-jammy \\
  bash -c "npm ci && npx playwright test"`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Pin the image to your Playwright version',
          text: 'The Docker tag must match the `@playwright/test` version in `package.json`. A mismatch causes "browser not found" or subtle snapshot diffs.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Always upload the report on failure',
          text: 'Use `if: !cancelled()` so the HTML report and traces are uploaded even when tests fail — that artifact is how you debug CI-only failures.',
        },
      ],
    },
    {
      id: 'reporters',
      title: 'Reporters & Test Results',
      summary: 'Choose and combine reporters: HTML, list, JUnit, JSON, blob and custom.',
      duration: 10,
      objectives: [
        'Configure multiple reporters',
        'Emit JUnit/JSON for CI dashboards',
        'Add steps and annotations for richer reports',
      ],
      blocks: [
        { kind: 'heading', text: 'Built-in reporters' },
        {
          kind: 'code',
          language: 'typescript',
          code: `export default defineConfig({
  reporter: [
    ['list'],                                   // readable console output
    ['html', { open: 'never' }],                // rich local report
    ['junit', { outputFile: 'results/junit.xml' }], // CI test tabs
    ['json', { outputFile: 'results/results.json' }],
  ],
});`,
        },
        {
          kind: 'list',
          items: [
            '`list` / `line` / `dot` — console output, increasingly terse.',
            '`html` — the interactive local report with traces and screenshots.',
            '`junit` — for Jenkins/GitLab/Azure test panels.',
            '`json` — machine-readable for custom dashboards.',
            '`blob` — intermediate output for sharded runs you later merge.',
          ],
        },
        { kind: 'heading', text: 'Group with test.step' },
        {
          kind: 'code',
          language: 'typescript',
          code: `test('checkout', async ({ page }) => {
  await test.step('add item to cart', async () => {
    await page.getByRole('button', { name: 'Add to cart' }).click();
  });
  await test.step('pay', async () => {
    await page.getByRole('button', { name: 'Pay' }).click();
    await expect(page.getByText('Thank you')).toBeVisible();
  });
});`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Annotations document intent',
          text: 'Use `test.fixme`, `test.skip(condition, reason)` and `test.fail()` to record known issues with a reason — they show up in the report instead of being silently disabled.',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Third-party reporters exist',
          text: 'Allure, Currents and monocart add history, trends and flaky analytics on top of Playwright. Add them as reporters when you need long-term dashboards.',
        },
      ],
    },
    {
      id: 'test-data',
      title: 'Test Data, Faker & Environments',
      summary: 'Generate data, parameterise tests and manage secrets/environments cleanly.',
      duration: 12,
      objectives: [
        'Generate realistic data with faker',
        'Create data-driven tests',
        'Manage env vars and secrets safely',
      ],
      blocks: [
        { kind: 'heading', text: 'Realistic, unique data' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { faker } from '@faker-js/faker';

const user = {
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password({ length: 12 }),
};`,
        },
        { kind: 'heading', text: 'Data-driven tests' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const cases = [
  { input: '', error: 'Email is required' },
  { input: 'not-an-email', error: 'Enter a valid email' },
  { input: 'a@b.com', error: '' },
];

for (const { input, error } of cases) {
  test(\`email validation: "\${input}"\`, async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Email').fill(input);
    await page.getByRole('button', { name: 'Continue' }).click();
    if (error) await expect(page.getByRole('alert')).toContainText(error);
    else await expect(page.getByRole('alert')).toHaveCount(0);
  });
}`,
        },
        { kind: 'heading', text: 'Environments & secrets' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import 'dotenv/config';   // load .env locally

export default defineConfig({
  use: { baseURL: process.env.BASE_URL ?? 'http://localhost:5180' },
});

// In tests, read secrets from env — never hard-code them:
const password = process.env.TEST_USER_PASSWORD!;`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Keep secrets out of git',
          text: 'Put credentials in `.env` (git-ignored) locally and in encrypted **CI secrets** in the pipeline. A leaked test password is still a leaked password.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Seed via API, assert via UI',
          text: 'Combine faker with the `request` fixture to create unique data over the API before each UI test — fast, isolated and parallel-safe.',
        },
      ],
    },
    {
      id: 'accessibility',
      title: 'Accessibility Testing',
      summary: 'Automate a11y checks with axe-core and role-based assertions.',
      duration: 11,
      objectives: [
        'Scan pages with @axe-core/playwright',
        'Scope and triage violations',
        'Combine a11y with role-based locators',
      ],
      blocks: [
        { kind: 'heading', text: 'Scan with axe-core' },
        {
          kind: 'code',
          language: 'bash',
          code: 'npm i -D @axe-core/playwright',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page has no critical a11y violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});`,
        },
        { kind: 'heading', text: 'Scope and triage' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const results = await new AxeBuilder({ page })
  .include('#main')                       // scan one region
  .exclude('.third-party-widget')         // ignore code you do not own
  .analyze();

// Attach details to the report for the team to fix
test.info().attach('axe', {
  body: JSON.stringify(results.violations, null, 2),
  contentType: 'application/json',
});`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Automation finds ~30\u201340% of issues',
          text: 'axe catches contrast, missing labels and ARIA misuse, but not everything. Pair it with manual keyboard and screen-reader passes for real coverage.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'getByRole is a11y insurance',
          text: 'Because your locators rely on roles and accessible names, writing tests already nudges the app toward being accessible — broken semantics make tests fail first.',
        },
      ],
    },
    {
      id: 'advanced-patterns',
      title: 'Advanced Patterns & Architecture',
      summary: 'Global setup/teardown, worker fixtures, tags, soft assertions and scalable structure.',
      duration: 14,
      objectives: [
        'Use global setup/teardown and worker-scoped fixtures',
        'Tag and select tests at scale',
        'Structure a large, maintainable suite',
      ],
      blocks: [
        { kind: 'heading', text: 'Global setup & teardown' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// config
export default defineConfig({
  globalSetup: './global-setup.ts',     // run once before everything
  globalTeardown: './global-teardown.ts',
});

// global-setup.ts — seed a DB, start a service, mint a token
export default async function () {
  process.env.RUN_ID = String(Date.now());
}`,
        },
        { kind: 'heading', text: 'Worker-scoped fixtures' },
        {
          kind: 'paragraph',
          text: 'A worker fixture is created **once per worker** and shared by all tests on that worker — perfect for an expensive, read-only resource like an authenticated API client or a seeded account.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `export const test = base.extend<{}, { apiToken: string }>({
  apiToken: [async ({}, use) => {
    const token = await mintToken();      // expensive, do it once per worker
    await use(token);
  }, { scope: 'worker' }],
});`,
        },
        { kind: 'heading', text: 'Tags and selective runs' },
        {
          kind: 'code',
          language: 'typescript',
          code: `test('checkout @smoke @critical', async ({ page }) => { /* ... */ });

// Run only smoke tests:  npx playwright test --grep @smoke
// Skip slow ones:        npx playwright test --grep-invert @slow`,
        },
        { kind: 'heading', text: 'A scalable folder layout' },
        {
          kind: 'code',
          language: 'text',
          code: `tests/
  pages/         # page objects
  fixtures/      # custom + worker fixtures
  data/          # factories, faker builders, HAR files
  api/           # pure API specs
  e2e/           # user-journey specs
  setup/         # global.setup.ts (auth), global-setup.ts
playwright.config.ts`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Compose, don\u2019t inherit',
          text: 'Build big behaviours by composing small fixtures (auth + seeded data + page objects) rather than deep base-class hierarchies. It keeps tests readable and refactors local.',
        },
      ],
    },
    {
      id: 'migration-realworld',
      title: 'Migrating from Selenium & Real-World Problems',
      summary: 'Map Selenium concepts to Playwright and solve the issues senior testers hit in production suites.',
      duration: 15,
      practice: ['stale-elements', 'shadow-dom', 'iframes', 'infinite-scroll', 'auth-demo'],
      objectives: [
        'Translate Selenium patterns to Playwright',
        'Solve shadow DOM, tabs and stale-element problems',
        'Plan a pragmatic, incremental migration',
      ],
      blocks: [
        { kind: 'heading', text: 'Concept map: Selenium → Playwright' },
        {
          kind: 'list',
          items: [
            '`driver.findElement(By.css(...))` → `page.locator(...)` / `page.getByRole(...)` (lazy, auto-retrying).',
            '`WebDriverWait + ExpectedConditions` → built-in auto-waiting + `expect(locator)` assertions.',
            '`Select` class → `selectOption(...)`.',
            '`driver.switchTo().frame(...)` → `page.frameLocator(...)` (no context switching).',
            '`driver.switchTo().window(...)` → `waitForEvent(\'popup\')` returning a new `Page`.',
            '`Actions` (hover/drag) → `hover()`, `dragTo()`.',
            '`JavascriptExecutor` → `page.evaluate(...)`.',
            'Thread-local driver + Grid → workers + projects + sharding (built in).',
          ],
        },
        { kind: 'heading', text: 'Shadow DOM just works' },
        {
          kind: 'paragraph',
          text: 'A daily Selenium headache — piercing shadow roots — needs no special API in Playwright. `getByRole`/`getByText`/CSS pierce **open** shadow DOM automatically.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// No getShadowRoot() gymnastics — this finds it inside a web component:
await page.getByRole('button', { name: 'Toggle' }).click();
await page.getByTestId('shadow-content').click();`,
        },
        { kind: 'heading', text: 'Stale elements disappear' },
        {
          kind: 'paragraph',
          text: 'Because a Locator re-resolves on every use, the classic `StaleElementReferenceException` after a re-render simply does not occur — re-using the same locator after the DOM updates is fine.',
        },
        { kind: 'heading', text: 'Infinite scroll & lazy lists' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Scroll the target into view; Playwright loads more as needed
const target = page.getByText('Item 95');
await target.scrollIntoViewIfNeeded();
await expect(target).toBeVisible();`,
        },
        { kind: 'heading', text: 'A pragmatic migration plan' },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Run Playwright **alongside** Selenium; do not rewrite everything at once.',
            'Port the **flakiest** and **slowest** suites first — that is where Playwright pays back immediately.',
            'Add `data-testid` hooks as you touch each screen to make locators rock-solid.',
            'Move shared setup (auth, seeding) to fixtures + storage state.',
            'Wire CI sharding, then retire the Selenium jobs suite by suite.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Keep Selenium where it wins',
          text: 'Need IE11, a specific real-device cloud, or a non-supported browser? Selenium/WebDriver still leads there. Migrate for speed and stability, not dogma.',
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Practise the hard cases here',
          text: 'The Shadow DOM, iFrames, Stale Elements, Infinite Scroll and Auth practice modules on this platform reproduce exactly these real-world problems — port a Selenium test of each to Playwright to feel the difference.',
        },
      ],
    },
  ],
};

/** All Playwright tracks, in catalog order (beginner → expert). */
export const playwrightTracks: LearningTrack[] = [
  playwrightFundamentals,
  playwrightEssentials,
  playwrightAdvanced,
  playwrightExpert,
  ...playwrightExtraTracks,
  ...playwrightProTracks,
];
