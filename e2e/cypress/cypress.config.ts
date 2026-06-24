import { defineConfig } from 'cypress';

/**
 * Cypress sample suite. Override the target with `E2E_BASE_URL`
 * (defaults to the Vite dev server). No URL is hardcoded.
 */
export default defineConfig({
  e2e: {
    baseUrl: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
