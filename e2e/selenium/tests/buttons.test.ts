import assert from 'node:assert/strict';
import { Builder, By, until, type WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';

/**
 * Buttons practice module via Selenium WebDriver (headless Chrome).
 * These interactions are public, so no authentication is required.
 */
describe('Buttons module (Selenium WebDriver)', function () {
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

  it('counts single clicks and reports the last action', async () => {
    await driver.get(`${BASE_URL}/modules/buttons`);

    const button = await driver.wait(
      until.elementLocated(By.css('[data-testid=btn-click]')),
      10_000,
    );
    await button.click();
    await button.click();

    const count = await driver.findElement(By.css('[data-testid=btn-click-count]')).getText();
    assert.equal(count, '2');

    const lastAction = await driver
      .findElement(By.css('[data-testid=btn-last-action]'))
      .getText();
    assert.equal(lastAction, 'single-click');
  });

  it('reflects the pressed state of the toggle button', async () => {
    await driver.get(`${BASE_URL}/modules/buttons`);

    const toggle = await driver.wait(
      until.elementLocated(By.css('[data-testid=btn-toggle]')),
      10_000,
    );
    assert.equal(await toggle.getAttribute('aria-pressed'), 'false');

    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-pressed'), 'true');
  });
});
