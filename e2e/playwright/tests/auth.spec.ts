import { test, expect } from '@playwright/test';

/**
 * Authentication flow.
 *
 * Assumes the API has been seeded (`npm run seed`) so the demo account
 * `user@practice.dev` / `User1234!` exists.
 */
test.describe('Authentication', () => {
  test('signs in with the demo account and lands on the dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-email').fill('user@practice.dev');
    await page.getByTestId('login-password').fill('User1234!');
    await page.getByTestId('login-submit').click();

    // The account menu only renders inside the authenticated app shell.
    await expect(page.getByTestId('user-menu')).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('shows an inline error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-email').fill('user@practice.dev');
    await page.getByTestId('login-password').fill('WrongPassword1');
    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('login-error')).toBeVisible();
  });
});
