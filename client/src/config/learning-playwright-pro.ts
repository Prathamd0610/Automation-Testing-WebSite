import { Eye, Bug, NotebookText, Trophy } from 'lucide-react';
import type { LearningTrack } from './learning';

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  Playwright — Extra Tracks (Part 2 of 2): P9–P12
 *  Visual/accessibility, reliability/debugging, real-world recipes and an
 *  expert/interview capstone. Same running examples: google.com and this
 *  platform's practice modules (stable data-testid hooks).
 * ──────────────────────────────────────────────────────────────────────────
 */

/* ════════════════════════════════════════════════════════════════════════
   TRACK P9 — Visual, Accessibility & UX Testing
   ════════════════════════════════════════════════════════════════════════ */

const playwrightVisual: LearningTrack = {
  id: 'playwright-visual-a11y',
  category: 'Playwright',
  title: 'Visual, Accessibility & UX',
  subtitle: 'Pixels, semantics, focus and locales',
  description:
    'Test what users see and how they navigate: pixel snapshots with masking and thresholds, cross-platform baselines, axe-core accessibility scans, keyboard and focus-order testing, responsive/device coverage, internationalisation and RTL, plus dark mode and reduced-motion.',
  icon: Eye,
  level: 'advanced',
  tags: ['playwright', 'visual', 'accessibility', 'i18n', 'responsive'],
  lessons: [
    {
      id: 'snapshot-deep',
      title: 'Visual Snapshots in Depth',
      summary: 'Create stable pixel baselines and compare them with the right options.',
      duration: 13,
      practice: ['ecommerce', 'tables'],
      objectives: [
        'Snapshot pages and elements',
        'Tune thresholds and clipping',
        'Update baselines intentionally',
      ],
      blocks: [
        { kind: 'heading', text: 'Page and element snapshots' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await expect(page).toHaveScreenshot('dashboard.png');
await expect(page.getByTestId('invoice')).toHaveScreenshot('invoice.png', {
  maxDiffPixelRatio: 0.01,
});`,
        },
        { kind: 'heading', text: 'Update on purpose' },
        {
          kind: 'code',
          language: 'bash',
          code: `npx playwright test --update-snapshots   # then review the PNG diff in git`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Element snapshots beat full-page',
          text: 'Snapshot a stable component (an invoice, a card) rather than a whole noisy page. Smaller, intentional baselines flake far less and review faster.',
        },
      ],
    },
    {
      id: 'masking-stability',
      title: 'Masking, Animations & Fonts',
      summary: 'Eliminate the usual sources of visual flakiness.',
      duration: 12,
      objectives: [
        'Mask dynamic regions',
        'Freeze animations and the clock',
        'Stabilise fonts and rendering',
      ],
      blocks: [
        { kind: 'heading', text: 'Mask, disable, freeze' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.clock.setFixedTime(new Date('2026-06-28T10:00:00Z'));   // stable dates
await expect(page).toHaveScreenshot('home.png', {
  mask: [page.getByTestId('current-time'), page.getByRole('img', { name: 'avatar' })],
  animations: 'disabled',
  caret: 'hide',
});`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Fonts must be loaded',
          text: 'Snapshots taken before web fonts load differ from later runs. Wait for `document.fonts.ready` (or assert text is visible) before the screenshot, and bundle fonts so CI matches.',
        },
      ],
    },
    {
      id: 'cross-platform-baselines',
      title: 'Cross-Platform Baselines',
      summary: 'Make visual tests pass on the same OS they were generated on.',
      duration: 10,
      objectives: [
        'Understand OS rendering differences',
        'Generate baselines in Docker',
        'Organise per-platform snapshots',
      ],
      blocks: [
        { kind: 'heading', text: 'Why a Mac baseline fails on Linux CI' },
        {
          kind: 'paragraph',
          text: 'Font rendering and anti-aliasing differ across operating systems, so a baseline captured on macOS will not match Linux CI pixel-for-pixel. Generate and compare in the **same** environment — almost always the CI Docker image.',
        },
        {
          kind: 'code',
          language: 'bash',
          code: `# Generate baselines inside the official image so they match CI
docker run --rm -v "$(pwd):/work" -w /work --ipc=host \\
  mcr.microsoft.com/playwright:v1.48.0-jammy \\
  bash -c "npm ci && npx playwright test --update-snapshots"`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Playwright names snapshots per platform',
          text: 'Snapshots get an OS suffix (e.g. -linux.png), so you can keep platform-specific baselines side by side if you really must run visual tests on multiple OSes.',
        },
      ],
    },
    {
      id: 'axe-deep',
      title: 'Accessibility with axe-core',
      summary: 'Scan for WCAG violations, scope the scan and triage results.',
      duration: 12,
      objectives: [
        'Run AxeBuilder scans',
        'Scope with include/exclude and tags',
        'Attach results for the team',
      ],
      blocks: [
        { kind: 'heading', text: 'A scoped, tagged scan' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import AxeBuilder from '@axe-core/playwright';

test('no critical a11y issues', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .include('#main')
    .exclude('.third-party-widget')
    .analyze();
  test.info().attach('axe', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
  expect(results.violations).toEqual([]);
});`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Automation catches ~30–40%',
          text: 'axe finds contrast, missing labels and ARIA misuse, but not everything. Pair it with manual keyboard and screen-reader passes for real coverage.',
        },
      ],
    },
    {
      id: 'keyboard-focus',
      title: 'Keyboard & Focus Testing',
      summary: 'Verify tab order, focus traps and skip links — what real keyboard users rely on.',
      duration: 12,
      practice: ['modals', 'wizard', 'forms'],
      objectives: [
        'Assert focus and tab order',
        'Test modal focus traps',
        'Drive flows with the keyboard only',
      ],
      blocks: [
        { kind: 'heading', text: 'Assert what is focused' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.keyboard.press('Tab');
await expect(page.getByLabel('Email')).toBeFocused();
await page.keyboard.press('Tab');
await expect(page.getByLabel('Password')).toBeFocused();`,
        },
        { kind: 'heading', text: 'Focus trap in a modal' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.getByRole('button', { name: 'Open dialog' }).click();
const dialog = page.getByRole('dialog');
await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
// Tabbing should cycle within the dialog, never escape to the page behind it
await page.keyboard.press('Escape');
await expect(dialog).toBeHidden();`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Keyboard tests are a11y tests',
          text: 'A flow you can complete with Tab/Enter/Escape is usable by keyboard and screen-reader users. These tests catch focus bugs axe cannot see.',
        },
      ],
    },
    {
      id: 'responsive-devices',
      title: 'Responsive & Device Coverage',
      summary: 'Run the same tests across viewports and emulated devices.',
      duration: 11,
      objectives: [
        'Set viewports and device descriptors',
        'Assert responsive layout differences',
        'Build a device matrix',
      ],
      blocks: [
        { kind: 'heading', text: 'Viewports and devices' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { devices } from '@playwright/test';

test.use({ viewport: { width: 375, height: 667 } });   // small phone
test('mobile shows the hamburger', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeHidden();
});

// Or as a project: { name: 'Pixel 7', use: { ...devices['Pixel 7'] } }`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Test the breakpoint behaviour, not pixels',
          text: 'Assert that the hamburger appears and the desktop nav hides — behaviour that proves the breakpoint works — rather than exact pixel positions that change with copy.',
        },
      ],
    },
    {
      id: 'i18n-rtl',
      title: 'Internationalisation & RTL',
      summary: 'Catch locale, currency, date and right-to-left layout bugs before users do.',
      duration: 12,
      objectives: [
        'Emulate locale and timezone',
        'Test RTL layouts',
        'Assert localized formats',
      ],
      blocks: [
        { kind: 'heading', text: 'Locale, timezone, currency' },
        {
          kind: 'code',
          language: 'typescript',
          code: `test.use({ locale: 'de-DE', timezoneId: 'Europe/Berlin' });
test('German number & date formats', async ({ page }) => {
  await page.goto('/checkout');
  await expect(page.getByTestId('total')).toHaveText('1.299,00 €');  // de-DE format
});

// google.com in German
test('google in German', async ({ page }) => {
  await page.goto('https://www.google.com');
  await expect(page.getByRole('button', { name: /Akzeptieren|Alle ablehnen/ })).toBeVisible();
});`,
        },
        { kind: 'heading', text: 'Right-to-left' },
        {
          kind: 'code',
          language: 'typescript',
          code: `test.use({ locale: 'ar-EG' });
test('layout flips to RTL', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'i18n bugs hide in formatting',
          text: 'Dates (MM/DD vs DD.MM), decimal separators, currency placement and pluralisation break by locale. A German and an Arabic project in your matrix catch most of these.',
        },
      ],
    },
    {
      id: 'dark-mode-themes',
      title: 'Dark Mode, Themes & Motion',
      summary: 'Test colour schemes, theme toggles and reduced-motion preferences.',
      duration: 10,
      practice: ['switches'],
      objectives: [
        'Emulate prefers-color-scheme',
        'Test a theme toggle',
        'Respect reduced motion',
      ],
      blocks: [
        { kind: 'heading', text: 'Emulate the OS preference' },
        {
          kind: 'code',
          language: 'typescript',
          code: `test.use({ colorScheme: 'dark' });
test('dark theme applied', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/dark/);
});

// Reduced motion
test.use({ reducedMotion: 'reduce' });`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Toggle and persistence',
          text: 'Test both the OS preference and the in-app toggle — then reload and assert the choice persisted (localStorage). This platform’s theme switch is a good target.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK P10 — Reliability, Debugging & Performance
   ════════════════════════════════════════════════════════════════════════ */

const playwrightReliability: LearningTrack = {
  id: 'playwright-reliability',
  category: 'Playwright',
  title: 'Reliability, Debugging & Performance',
  subtitle: 'Kill flakiness and find causes fast',
  description:
    'The deep mechanics of stable tests: how auto-waiting actually decides actionability, root-causing flakiness, mastering the trace viewer and inspector, every timeout type, test isolation and state leaks, capturing performance metrics, and keeping long runs stable.',
  icon: Bug,
  level: 'advanced',
  tags: ['playwright', 'flaky', 'debugging', 'trace', 'performance'],
  lessons: [
    {
      id: 'actionability-internals',
      title: 'Auto-Waiting Internals',
      summary: 'Understand exactly what Playwright checks before every action.',
      duration: 12,
      practice: ['spinners', 'delayed-loading'],
      objectives: [
        'List the actionability checks',
        'Predict why an action waits or fails',
        'Avoid force-clicks',
      ],
      blocks: [
        { kind: 'heading', text: 'The checks, in order' },
        {
          kind: 'list',
          items: [
            '**Attached** to the DOM.',
            '**Visible** — non-empty box, not display:none/visibility:hidden.',
            '**Stable** — bounding box unchanged across two animation frames.',
            '**Enabled** — not [disabled].',
            '**Receives events** — not covered by another element at the action point.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Each action retries these until they pass or the timeout expires. That is why clicking a button under a fading spinner "just works" — Playwright waits for the button, not the spinner.',
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'force:true bypasses the checks',
          text: '`click({ force: true })` skips actionability — it hides exactly the bugs (overlays, disabled states) these checks catch. Fix the test instead: close the overlay, wait, or scroll.',
        },
      ],
    },
    {
      id: 'flakiness-patterns',
      title: 'Flakiness: Patterns & Fixes',
      summary: 'A field guide to the causes of flaky tests and their concrete fixes.',
      duration: 14,
      practice: ['random-elements', 'stale-elements', 'ajax'],
      objectives: [
        'Recognise the common flake patterns',
        'Apply the determinism fix for each',
        'Prove the fix with repeats',
      ],
      blocks: [
        { kind: 'heading', text: 'Pattern → fix' },
        {
          kind: 'list',
          items: [
            'Read-too-early → use `await expect(locator).toHaveText(...)` (retries), not `await locator.textContent()`.',
            'Fixed sleeps / networkidle → wait for a concrete locator or the triggering response.',
            'Shared state under parallelism → unique data per test (faker/UUID).',
            'Animations moving the target → `animations: \'disabled\'` or wait for stability.',
            'Time/timezone/random → `page.clock` and seeded data.',
            'Race between two UIs → `locator.or(...)`.',
          ],
        },
        { kind: 'heading', text: 'Prove it is fixed' },
        {
          kind: 'code',
          language: 'bash',
          code: `npx playwright test flaky.spec.ts --repeat-each=20 --workers=4`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Reproduce before you fix',
          text: '`--repeat-each` plus high `--workers` reliably reproduces races locally. Make it fail consistently first, then fix, then confirm 20 green runs.',
        },
      ],
    },
    {
      id: 'trace-mastery',
      title: 'Trace Viewer Mastery',
      summary: 'Read a trace like an expert to find the cause of any failure in seconds.',
      duration: 12,
      objectives: [
        'Open and navigate a trace',
        'Use snapshots, network and console tabs',
        'Capture traces efficiently',
      ],
      blocks: [
        { kind: 'heading', text: 'Capture and open' },
        {
          kind: 'code',
          language: 'bash',
          code: `# config: use: { trace: 'on-first-retry' }
npx playwright show-trace test-results/<...>/trace.zip`,
        },
        { kind: 'heading', text: 'What to look at' },
        {
          kind: 'list',
          items: [
            '**Timeline** — hover each action to see before/after DOM snapshots.',
            '**Action log** — the exact locator and why it waited.',
            '**Network** — the request/response at the moment of failure.',
            '**Console** — JS errors that broke the page.',
            '**Source** — the line of test code for each step.',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'on-first-retry is the sweet spot',
          text: 'Tracing every run is slow and large. `on-first-retry` records nothing on green runs and a full trace exactly when a test flakes.',
        },
      ],
    },
    {
      id: 'inspector-uimode',
      title: 'Inspector, UI Mode & VS Code',
      summary: 'Use the interactive tools to develop and debug tests quickly.',
      duration: 11,
      objectives: [
        'Step with the Inspector',
        'Time-travel in UI mode',
        'Debug from the VS Code extension',
      ],
      blocks: [
        { kind: 'heading', text: 'Pause and step' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.pause();   // opens the Inspector: step, resume, try locators live`,
        },
        {
          kind: 'code',
          language: 'bash',
          code: `npx playwright test --debug   # Inspector for the whole run
npx playwright test --ui      # time-travel UI mode with watch`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'The VS Code extension is fastest',
          text: 'Run/debug a single test from the gutter, set breakpoints in test code, and use "Pick locator" to copy resilient selectors — the tightest day-to-day loop.',
        },
      ],
    },
    {
      id: 'timeouts-deep',
      title: 'Every Timeout, Explained',
      summary: 'Know which timeout governs each wait so you raise the right one.',
      duration: 11,
      objectives: [
        'Distinguish test, expect, action and navigation timeouts',
        'Set them globally and per call',
        'Avoid masking bugs with big timeouts',
      ],
      blocks: [
        { kind: 'heading', text: 'The four you’ll touch' },
        {
          kind: 'code',
          language: 'typescript',
          code: `export default defineConfig({
  timeout: 30_000,                  // whole test
  expect: { timeout: 5_000 },       // one assertion
  use: {
    actionTimeout: 10_000,          // one action (click/fill)
    navigationTimeout: 15_000,      // goto / waitForURL
  },
});

// Per-call override for a genuinely slow case
await expect(page.getByTestId('report')).toBeVisible({ timeout: 20_000 });`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Raise the specific one',
          text: 'A slow single assertion needs a bigger **expect** (or per-call) timeout — not a bigger test timeout. Blanket-raising the test timeout just makes real failures take longer to surface.',
        },
      ],
    },
    {
      id: 'isolation-state',
      title: 'Test Isolation & State',
      summary: 'Keep every test independent with fresh contexts and clean data.',
      duration: 11,
      objectives: [
        'Leverage per-test context isolation',
        'Reset app and server state',
        'Avoid cross-test leakage',
      ],
      blocks: [
        { kind: 'heading', text: 'Isolation is the default' },
        {
          kind: 'paragraph',
          text: 'Each test gets a fresh `BrowserContext` — clean cookies, storage and cache — so UI state never leaks between tests. The leaks that remain are usually **server-side** (shared rows) or **module-level** globals in your test code.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// Reset server state per test via the API (fast + reliable)
test.beforeEach(async ({ request }) => {
  await request.post('/api/test/reset');   // a non-prod-only reset endpoint
});`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'No shared mutable module state',
          text: 'A `let current` at module scope shared by tests will leak under parallelism. Keep per-test state inside fixtures or the test body.',
        },
      ],
    },
    {
      id: 'web-vitals-metrics',
      title: 'Performance Metrics in Tests',
      summary: 'Capture page metrics and Web Vitals alongside functional checks.',
      duration: 11,
      objectives: [
        'Read navigation and paint timings',
        'Assert simple performance budgets',
        'Use CDP for deeper metrics',
      ],
      blocks: [
        { kind: 'heading', text: 'Timings from the page' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const nav = await page.evaluate(() => {
  const t = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  return { domContentLoaded: t.domContentLoadedEventEnd, load: t.loadEventEnd };
});
expect(nav.load).toBeLessThan(4000);   // a coarse budget`,
        },
        { kind: 'heading', text: 'CDP for Chromium' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const client = await page.context().newCDPSession(page);
await client.send('Performance.enable');
const { metrics } = await client.send('Performance.getMetrics');`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Functional tests aren’t load tests',
          text: 'Use these for coarse budgets and regressions, not precise benchmarking. For real performance testing use dedicated tools (Lighthouse CI, k6).',
        },
      ],
    },
    {
      id: 'stability-longruns',
      title: 'Stability in Long Runs',
      summary: 'Keep big, long-running suites healthy and leak-free.',
      duration: 10,
      objectives: [
        'Avoid resource leaks',
        'Clean up contexts and listeners',
        'Soak-test the suite',
      ],
      blocks: [
        { kind: 'heading', text: 'Clean up what you create' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// If you manually create contexts/pages, close them
const context = await browser.newContext();
try {
  const page = await context.newPage();
  // ...
} finally {
  await context.close();   // frees memory; prevents handle buildup
}`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Soak with --repeat-each',
          text: 'Run the suite (or its heaviest specs) with `--repeat-each=10` overnight to surface slow leaks and order-dependent flakes before they hit CI.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK P11 — Real-World Recipes
   ════════════════════════════════════════════════════════════════════════ */

const playwrightRecipes: LearningTrack = {
  id: 'playwright-recipes',
  category: 'Playwright',
  title: 'Playwright Real-World Recipes',
  subtitle: 'Copy-paste solutions for daily scenarios',
  description:
    'Battle-tested recipes for the flows you automate every week: login patterns, file upload/download, a full e-commerce checkout, data grids with sorting and pagination, multi-tab and window handling, OTP/2FA flows, payment iframes, and drag-and-drop/canvas — all runnable on this platform’s practice modules.',
  icon: NotebookText,
  level: 'advanced',
  tags: ['playwright', 'recipes', 'checkout', 'files', 'otp', 'iframes'],
  lessons: [
    {
      id: 'login-recipes',
      title: 'Login Recipes',
      summary: 'Every practical way to get past auth — fast and reliably.',
      duration: 12,
      practice: ['auth-demo'],
      objectives: ['Reuse storage state', 'Log in via API', 'Handle "remember me" and expiry'],
      blocks: [
        { kind: 'heading', text: 'Three reliable patterns' },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Storage state from a setup project — start every test logged in.',
            'API login → inject token/cookie — fastest, no UI.',
            'One real UI-login smoke test — proves the actual form still works.',
          ],
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `// API login then reuse (in a fixture)
const res = await request.post('/api/auth/login', {
  data: { email: 'admin@example.com', password: process.env.PW! },
});
const { accessToken } = await res.json();
await context.addInitScript((t) => localStorage.setItem('accessToken', t), accessToken);
await page.goto('/dashboard');   // already authenticated`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Keep one UI login',
          text: 'Speed everything up with token/state reuse, but keep a single end-to-end login test so a broken login form still fails the build.',
        },
      ],
    },
    {
      id: 'file-recipes',
      title: 'File Upload & Download Recipes',
      summary: 'Upload via input or chooser, and verify real downloads — pairs with the new Download module.',
      duration: 12,
      practice: ['file-upload', 'download'],
      objectives: ['Upload by input and by chooser', 'Save and assert downloads', 'Handle generated files'],
      blocks: [
        { kind: 'heading', text: 'Upload' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.getByTestId('file-input').setInputFiles('data/photo.png');

// When a custom button opens the OS dialog:
const [chooser] = await Promise.all([
  page.waitForEvent('filechooser'),
  page.getByRole('button', { name: 'Upload' }).click(),
]);
await chooser.setFiles(['a.png', 'b.png']);`,
        },
        { kind: 'heading', text: 'Download & verify' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// On this platform's Download module
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByTestId('download-csv').click(),
]);
expect(download.suggestedFilename()).toBe('users.csv');
const path = await download.path();          // saved temp path
const text = require('fs').readFileSync(path!, 'utf8');
expect(text).toContain('id,name,role');`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Assert content, not just the click',
          text: 'Reading the downloaded file’s bytes (header row, row count) proves the export is correct — far stronger than only checking that a download started.',
        },
      ],
    },
    {
      id: 'ecommerce-journey',
      title: 'Full E-commerce Checkout',
      summary: 'A complete browse → cart → checkout journey on the practice store.',
      duration: 14,
      practice: ['ecommerce', 'stepper'],
      objectives: ['Add items and adjust quantity', 'Apply a coupon', 'Complete and verify the order'],
      blocks: [
        { kind: 'heading', text: 'The journey' },
        {
          kind: 'code',
          language: 'typescript',
          code: `test('checkout happy path', async ({ page }) => {
  await page.goto('/workflows/ecommerce');

  await page.getByTestId('product-pro-plan').getByRole('button', { name: 'Add to cart' }).click();
  await page.getByTestId('cart-button').click();

  // adjust quantity with the stepper widget
  await page.getByTestId('stepper-increment').click();
  await expect(page.getByTestId('cart-total')).toHaveText('$58.00');

  await page.getByLabel('Coupon').fill('SAVE10');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByTestId('cart-total')).toHaveText('$52.20');

  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible();
});`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Assert money at each step',
          text: 'Totals are where checkout bugs hide. Assert the subtotal, discount and total after each change rather than only at the end.',
        },
      ],
    },
    {
      id: 'tables-pagination-recipes',
      title: 'Data Grids: Sort, Filter, Paginate',
      summary: 'Validate the behaviours every admin table needs.',
      duration: 12,
      practice: ['tables', 'pagination', 'search-filter'],
      objectives: ['Assert sort order', 'Filter and verify', 'Walk pages to find a row'],
      blocks: [
        { kind: 'heading', text: 'Sort and verify' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.getByRole('button', { name: 'Sort by amount' }).click();
const amounts = (await page.getByTestId('cell-amount').allInnerTexts())
  .map((t) => Number(t.replace('$', '')));
expect(amounts).toEqual([...amounts].sort((a, b) => a - b));`,
        },
        { kind: 'heading', text: 'Find across pages' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const target = page.getByRole('row', { name: /Target User/ });
while ((await target.count()) === 0) {
  const next = page.getByTestId('page-next');
  if (await next.isDisabled()) break;
  await next.click();
  await expect(page.getByTestId('table-loading')).toBeHidden();
}
await expect(target).toBeVisible();`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Wait for the re-render',
          text: 'After sort/filter/paginate, wait for a loading flag to clear (or the new first row) before asserting — otherwise you read the previous page’s data.',
        },
      ],
    },
    {
      id: 'multitab-windows',
      title: 'Multi-Tab & Window Handling',
      summary: 'Drive popups, new tabs and target=_blank links cleanly.',
      duration: 11,
      practice: ['iframes'],
      objectives: ['Capture popups', 'Work across tabs', 'Close and return'],
      blocks: [
        { kind: 'heading', text: 'Capture a popup' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: 'Open report' }).click(),
]);
await popup.waitForLoadState();
await expect(popup).toHaveTitle(/Report/);
await popup.close();   // back to the original page automatically`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Popups share the context',
          text: 'A popup is a new Page in the same context, so it inherits cookies and login — exactly what you want for "open in new tab" flows.',
        },
      ],
    },
    {
      id: 'otp-2fa-email',
      title: 'OTP / 2FA Flows',
      summary: 'Automate one-time-code entry — runnable on the new OTP practice module.',
      duration: 12,
      practice: ['otp-input', 'auth-demo'],
      objectives: ['Type into segmented OTP inputs', 'Fetch codes from a test inbox/API', 'Assert verification'],
      blocks: [
        { kind: 'heading', text: 'Fill segmented OTP boxes' },
        {
          kind: 'code',
          language: 'typescript',
          code: `// This platform's OTP module: six boxes that auto-advance
await page.goto('/modules/otp-input');
const code = '123456';
for (let i = 0; i < code.length; i++) {
  await page.getByTestId(\`otp-\${i}\`).fill(code[i]);
}
await page.getByTestId('otp-verify').click();
await expect(page.getByTestId('otp-status')).toContainText('Verified');`,
        },
        { kind: 'heading', text: 'Get the real code from a test channel' },
        {
          kind: 'paragraph',
          text: 'In real apps, fetch the code from a **test mailbox API** (Mailosaur, Mailpit) or a backend test endpoint — never hard-code a production code.',
        },
        {
          kind: 'code',
          language: 'typescript',
          code: `const res = await request.get('/api/test/last-otp?user=alice@example.com');
const { code } = await res.json();
await page.getByLabel('Verification code').fill(code);`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Never automate real SMS/email blindly',
          text: 'Use a dedicated test inbox or a guarded test-only endpoint to retrieve codes. Scraping a real personal inbox is brittle and a security risk.',
        },
      ],
    },
    {
      id: 'payment-iframes',
      title: 'Payment Iframes',
      summary: 'Fill Stripe-style card fields that live inside cross-origin iframes.',
      duration: 11,
      objectives: ['Scope into payment frames', 'Fill card fields', 'Assert success/decline'],
      blocks: [
        { kind: 'heading', text: 'frameLocator for the card fields' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const card = page.frameLocator('iframe[title="Secure card payment"]');
await card.getByPlaceholder('Card number').fill('4242 4242 4242 4242');
await card.getByPlaceholder('MM / YY').fill('12 / 30');
await card.getByPlaceholder('CVC').fill('123');
await page.getByRole('button', { name: 'Pay' }).click();
await expect(page.getByText('Payment successful')).toBeVisible();`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Use the provider’s test cards',
          text: 'Payment SDKs ship test card numbers for success, decline and 3-D Secure. Drive those in a sandbox key — never real card data.',
        },
      ],
    },
    {
      id: 'drag-canvas',
      title: 'Drag-and-Drop & Canvas',
      summary: 'Handle HTML5 drag-and-drop and pixel canvases that have no DOM to query.',
      duration: 11,
      practice: ['drag-drop', 'canvas', 'sortable-list'],
      objectives: ['Use dragTo and manual mouse drags', 'Interact with canvas by coordinates', 'Assert results'],
      blocks: [
        { kind: 'heading', text: 'Drag-and-drop' },
        {
          kind: 'code',
          language: 'typescript',
          code: `await page.getByTestId('drag-source').dragTo(page.getByTestId('drop-target'));

// Manual drag for stubborn HTML5 DnD:
const src = page.getByTestId('drag-source');
const dst = page.getByTestId('drop-target');
await src.hover();
await page.mouse.down();
await dst.hover();
await page.mouse.up();`,
        },
        { kind: 'heading', text: 'Canvas: act by coordinates' },
        {
          kind: 'code',
          language: 'typescript',
          code: `const canvas = page.getByTestId('canvas');
const box = await canvas.boundingBox();
await page.mouse.move(box!.x + 30, box!.y + 30);
await page.mouse.down();
await page.mouse.move(box!.x + 120, box!.y + 90);
await page.mouse.up();
// Canvas has no DOM — assert via an exported value, the app's state, or a screenshot.
await expect(canvas).toHaveScreenshot('drawing.png');`,
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Canvas needs a non-DOM oracle',
          text: 'You can’t query pixels as elements. Assert on what the app exposes (a data attribute, an export, a count) or fall back to a visual snapshot.',
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   TRACK P12 — Expert Scenarios & Interview Prep
   ════════════════════════════════════════════════════════════════════════ */

const playwrightExpert2: LearningTrack = {
  id: 'playwright-expert-scenarios',
  category: 'Playwright',
  title: 'Expert Scenarios & Interview Prep',
  subtitle: 'Senior-level judgement & a capstone',
  description:
    'The judgement calls senior SDETs are hired for: common interview questions, a deep Selenium-vs-Playwright comparison, strategies for thousand-test suites, the test pyramid and what to automate, mobile-web strategy, component-testing patterns, API contract testing, and a capstone that assembles a complete framework.',
  icon: Trophy,
  level: 'advanced',
  tags: ['playwright', 'interview', 'strategy', 'contract', 'capstone'],
  lessons: [
    {
      id: 'interview-qa',
      title: 'Common Interview Questions',
      summary: 'Crisp, correct answers to the questions teams actually ask.',
      duration: 13,
      objectives: ['Explain auto-waiting and locators', 'Discuss isolation and parallelism', 'Justify architecture choices'],
      blocks: [
        { kind: 'heading', text: 'Sample questions & sharp answers' },
        {
          kind: 'list',
          items: [
            '“Why are Playwright tests less flaky?” → lazy auto-retrying locators + web-first assertions + actionability checks + per-test context isolation.',
            '“Locator vs ElementHandle?” → prefer Locators (re-resolved, no staleness); ElementHandles are eager and legacy.',
            '“How do you reuse login?” → storage state from a setup project, or API login injecting a token.',
            '“fill vs type?” → `fill` sets value in one step; `pressSequentially` types key-by-key for inputs that react to each keystroke.',
            '“How do you handle a flaky test?” → reproduce with --repeat-each, open the on-first-retry trace, fix the race, confirm green repeats.',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Answer with trade-offs',
          text: 'Senior answers name the trade-off, not just the API. “I’d mock the third-party but keep one real e2e path” shows judgement interviewers look for.',
        },
      ],
    },
    {
      id: 'selenium-vs-pw-deep',
      title: 'Selenium vs Playwright, Deeply',
      summary: 'A nuanced comparison so you can choose (and defend) the right tool.',
      duration: 12,
      objectives: ['Compare architecture', 'Compare ergonomics', 'Know where each wins'],
      blocks: [
        { kind: 'heading', text: 'Architecture' },
        {
          kind: 'list',
          items: [
            'Selenium → W3C WebDriver, separate driver process, huge language/grid/device ecosystem.',
            'Playwright → direct CDP/protocol control, one process, batteries-included (trace, mock, video).',
            'Playwright auto-waits by default; Selenium needs explicit waits.',
            'Playwright contexts give millisecond isolation; Selenium reuses one browser session.',
          ],
        },
        { kind: 'heading', text: 'Where each wins' },
        {
          kind: 'list',
          items: [
            'Choose **Playwright** for speed, stability, modern web apps, network mocking and DX.',
            'Choose **Selenium** for the widest browser/version support, real-device clouds, and large existing Java/C#/Python ecosystems.',
            'Many teams run both: Playwright for the fast core, Selenium where its reach is required.',
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Not a holy war',
          text: 'Both are excellent. The senior move is matching the tool to the project’s browsers, team skills and constraints — and being able to migrate between them (see the Expert track’s migration lesson).',
        },
      ],
    },
    {
      id: 'scaling-suites',
      title: 'Strategies for 1000+ Tests',
      summary: 'Keep a huge suite fast, stable and maintainable.',
      duration: 12,
      objectives: ['Parallelise and shard', 'Tier the suite', 'Govern quality'],
      blocks: [
        { kind: 'heading', text: 'The playbook' },
        {
          kind: 'list',
          ordered: true,
          items: [
            'API setup over UI setup everywhere — the biggest time saver.',
            'fullyParallel + shard across machines; merge reports.',
            'Tier: @smoke on push, full on merge, nightly visual/a11y.',
            'Fixtures + factories for isolation; no shared mutable state.',
            'Lint gates: no test.only, no waitForTimeout, single base test import.',
            'Track flaky rate and slowest tests; fix the top offenders weekly.',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Treat the suite as a product',
          text: 'A 1000-test suite needs an owner, metrics (duration, flaky %, coverage) and a backlog. Quality engineering, not just test writing.',
        },
      ],
    },
    {
      id: 'test-strategy',
      title: 'Test Strategy & the Pyramid',
      summary: 'Decide what to automate at which level for the best ROI.',
      duration: 11,
      objectives: ['Apply the test pyramid/trophy', 'Pick e2e candidates', 'Avoid over-automation'],
      blocks: [
        { kind: 'heading', text: 'Levels and ratios' },
        {
          kind: 'list',
          items: [
            'Many fast **unit/component** tests (Playwright CT for UI pieces).',
            'A solid layer of **integration/API** tests (request fixture).',
            'A thin layer of **e2e** journeys for critical revenue paths.',
          ],
        },
        { kind: 'heading', text: 'What earns an e2e test' },
        {
          kind: 'list',
          items: [
            'Crosses pages, routing and the backend (login, checkout, signup).',
            'High business value / revenue impact.',
            'Hard to cover credibly at a lower level.',
          ],
        },
        {
          kind: 'callout',
          tone: 'warning',
          title: 'Don’t e2e everything',
          text: 'E2e tests are the slowest and most fragile. Push edge cases down to component/API tests and reserve e2e for the few journeys that must never break.',
        },
      ],
    },
    {
      id: 'mobile-strategy',
      title: 'Mobile-Web Strategy',
      summary: 'Decide how much mobile emulation you need and how to run it.',
      duration: 10,
      objectives: ['Emulate devices effectively', 'Know emulation’s limits', 'Build a mobile matrix'],
      blocks: [
        { kind: 'heading', text: 'Emulation covers most of it' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { devices } from '@playwright/test';
projects: [
  { name: 'Pixel 7', use: { ...devices['Pixel 7'] } },
  { name: 'iPhone 14', use: { ...devices['iPhone 14'] } },
]`,
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Emulation ≠ real devices',
          text: 'Device descriptors set viewport, touch and UA, and WebKit approximates Safari well — but they are not real hardware. For native-app or true-Safari guarantees, add a real-device cloud for a small smoke set.',
        },
      ],
    },
    {
      id: 'component-deep',
      title: 'Component Testing Patterns',
      summary: 'Test UI components in isolation for fast, focused coverage.',
      duration: 11,
      objectives: ['Mount and drive components', 'Test states and events', 'Choose CT vs e2e'],
      blocks: [
        { kind: 'heading', text: 'Mount, interact, assert' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { test, expect } from '@playwright/experimental-ct-react';
import { Rating } from './Rating';

test('emits the selected value', async ({ mount }) => {
  let value = 0;
  const cmp = await mount(<Rating onChange={(v) => (value = v)} />);
  await cmp.getByTestId('star-4').click();
  expect(value).toBe(4);
});`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'CT for states, e2e for journeys',
          text: 'Cover a component’s props/states/edge cases with fast CT; reserve e2e for flows that cross components, routing and the backend.',
        },
      ],
    },
    {
      id: 'contract-testing',
      title: 'API Contract Testing',
      summary: 'Validate response schemas so UI tests fail fast when the backend changes shape.',
      duration: 11,
      practice: ['api-testing'],
      objectives: ['Assert response schemas', 'Catch breaking changes early', 'Combine with UI tests'],
      blocks: [
        { kind: 'heading', text: 'Schema-validate a response' },
        {
          kind: 'code',
          language: 'typescript',
          code: `import { z } from 'zod';

const Customer = z.object({
  id: z.string(),
  name: z.string(),
  tier: z.enum(['gold', 'platinum']),
  createdAt: z.string(),
});

test('GET /api/customers/:id matches the contract', async ({ request }) => {
  const res = await request.get('/api/customers/1');
  expect(res.ok()).toBeTruthy();
  Customer.parse(await res.json());   // throws (fails the test) on shape drift
});`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Contracts protect the UI suite',
          text: 'A schema check fails the instant the backend changes a field name or type — pinpointing the cause far faster than a dozen confused UI failures downstream.',
        },
      ],
    },
    {
      id: 'capstone',
      title: 'Capstone: Assemble a Framework',
      summary: 'Combine everything into a production-grade Playwright framework.',
      duration: 16,
      practice: ['auth-demo', 'ecommerce', 'crm', 'api-testing'],
      objectives: ['Wire fixtures, POM and data', 'Add CI, reporting and gating', 'Ship a maintainable suite'],
      blocks: [
        { kind: 'heading', text: 'The pieces, assembled' },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Config: projects (browsers + @smoke), baseURL from env, retries on CI, trace on-first-retry, webServer.',
            'Auth: setup project logs in via API → storage state reused everywhere.',
            'Fixtures: page objects + data factories (faker) with API cleanup, worker-scoped API client.',
            'Specs: api/ contract tests, e2e/ journeys by feature, all importing one base test.',
            'Quality: custom matchers, tags, lint gates (no only/waitForTimeout).',
            'CI: GitHub Actions, sharded, blob → merged HTML, artifacts on failure, smoke gate on PRs.',
          ],
        },
        {
          kind: 'code',
          language: 'text',
          code: `framework/
  playwright.config.ts        # projects, webServer, reporters
  fixtures/base.ts            # the single test you import everywhere
  pages/                      # LoginPage, CartPage, CrmPage...
  data/                       # factories + faker builders
  setup/global.setup.ts       # API login -> storageState
  api/                        # contract + endpoint specs
  e2e/                        # journeys by feature
  .github/workflows/e2e.yml   # sharded CI + merged report`,
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'You’ve built the real thing',
          text: 'This is exactly how mature teams run Playwright. Practise each layer against this platform’s modules, then drop the same structure into a real project.',
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Keep learning',
          text: 'Pair this with the Selenium tracks to be tool-agnostic — the senior engineers in demand can pick the right tool and migrate between them.',
        },
      ],
    },
  ],
};

/** Extra Playwright tracks, part 2 (P9–P12). */
export const playwrightProTracks: LearningTrack[] = [
  playwrightVisual,
  playwrightReliability,
  playwrightRecipes,
  playwrightExpert2,
];
