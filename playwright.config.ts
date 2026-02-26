import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  timeout: 90_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: 'https://1126.rallyengage.com',
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
    // ── Frontend projects ─────────────────────────────────────
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      testDir: './frontend/tests',
    },
    {
      name: 'login',
      testMatch: /login\.spec\.ts/,
      testDir: './frontend/tests',
    },
    {
      name: 'chromium',
      testDir: './frontend/tests',
      testIgnore: /login\.spec\.ts|auth\.setup\.ts/,
      use: {
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // ── Backend API projects ──────────────────────────────────
    {
      name: 'api-setup',
      testMatch: /api-auth\.setup\.ts/,
      testDir: './backend/tests',
    },
    {
      name: 'api',
      testDir: './backend/tests',
      testMatch: /\.api\.spec\.ts/,
      use: {
        baseURL: 'https://api.rallyengage.com',
        storageState: 'playwright/.auth/api-user.json',
      },
      dependencies: ['api-setup'],
    },
  ],
});
