import assert from 'node:assert/strict';
import { Builder, By, until, type WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';

/**
 * Authentication flow via Selenium WebDriver (headless Chrome).
 *
 * Assumes the API is seeded (`npm run seed`) so the demo account
 * `user@practice.dev` / `User1234!` exists. Selenium Manager (bundled with
 * selenium-webdriver 4.x) auto-provisions a matching ChromeDriver.
 */
describe('Authentication (Selenium WebDriver)', function () {
  this.timeout(60_000);
  let driver: WebDriver;

  before(async () => {
    const options = new Options().addArguments(
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1280,800',
    );
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('signs in with the demo account and lands on the dashboard', async () => {
    await driver.get(`${BASE_URL}/login`);

    await driver.wait(until.elementLocated(By.css('[data-testid=login-email]')), 10_000);
    await driver.findElement(By.css('[data-testid=login-email]')).sendKeys('user@practice.dev');
    await driver.findElement(By.css('[data-testid=login-password]')).sendKeys('User1234!');
    await driver.findElement(By.css('[data-testid=login-submit]')).click();

    const menu = await driver.wait(
      until.elementLocated(By.css('[data-testid=user-menu]')),
      10_000,
    );
    assert.ok(await menu.isDisplayed());
  });

  it('shows an inline error for invalid credentials', async () => {
    await driver.get(`${BASE_URL}/login`);

    const email = await driver.wait(
      until.elementLocated(By.css('[data-testid=login-email]')),
      10_000,
    );
    await email.clear();
    await email.sendKeys('user@practice.dev');
    const password = await driver.findElement(By.css('[data-testid=login-password]'));
    await password.clear();
    await password.sendKeys('WrongPassword1');
    await driver.findElement(By.css('[data-testid=login-submit]')).click();

    const error = await driver.wait(
      until.elementLocated(By.css('[data-testid=login-error]')),
      10_000,
    );
    assert.ok(await error.isDisplayed());
  });
});
