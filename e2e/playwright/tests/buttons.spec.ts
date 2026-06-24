import { test, expect } from '@playwright/test';

/**
 * Buttons practice module. These interactions are public (no authentication),
 * which makes the module a good smoke test for the static app shell.
 */
test.describe('Buttons module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modules/buttons');
  });

  test('counts single clicks and reports the last action', async ({ page }) => {
    await page.getByTestId('btn-click').click();
    await page.getByTestId('btn-click').click();

    await expect(page.getByTestId('btn-click-count')).toHaveText('2');
    await expect(page.getByTestId('btn-last-action')).toHaveText('single-click');
  });

  test('reflects the pressed state of the toggle button', async ({ page }) => {
    const toggle = page.getByTestId('btn-toggle');

    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  test('resolves an asynchronous action', async ({ page }) => {
    await page.getByTestId('btn-async').click();

    await expect(page.getByTestId('btn-last-action')).toHaveText('async-complete', {
      timeout: 5_000,
    });
  });
});
