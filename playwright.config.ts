import { defineConfig, devices } from '@playwright/test';
import { ENV, CURRENT_ENV } from './web/utils/env-config';

console.log(`Running tests against: ${CURRENT_ENV} (${ENV.baseURL})`);

export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  timeout: 90_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: ENV.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled'],
    },
  },

  projects: [
    // ── Web projects ─────────────────────────────────────
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      testDir: './web/tests',
    },
    {
      name: 'login',
      testMatch: /login\.spec\.ts/,
      testDir: './web/tests',
    },
    {
      name: 'explore-setup',
      testMatch: /auth-explore\.setup\.ts/,
      testDir: './web/tests',
    },
    {
      name: 'explore',
      testDir: './web/tests',
      testMatch: /explore\.spec\.ts/,
      use: {
        storageState: 'playwright/.auth/explore-user.json',
      },
      dependencies: ['explore-setup'],
    },
    {
      name: 'chromium',
      testDir: './web/tests',
      testIgnore: /login\.spec\.ts|auth\.setup\.ts|auth-explore\.setup\.ts|explore\.spec\.ts/,
      use: {
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
