import { test as base, expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const TOKEN_FILE = path.resolve('playwright/.auth/api-token.json');

/**
 * Custom test fixture that adds an authenticated `api` request context
 * alongside the standard `page` fixture.
 */
export const test = base.extend<{ api: APIRequestContext }>({
  api: async ({ playwright }, use) => {
    const { token } = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
    const context = await playwright.request.newContext({
      baseURL: 'https://api.rallyengage.com',
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        Referer: 'https://1126.rallyengage.com/',
        'Accept-Language': 'en-US',
      },
    });
    await use(context);
    await context.dispose();
  },
});

export { expect };
