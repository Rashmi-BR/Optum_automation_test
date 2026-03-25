import { test as setup } from '@playwright/test';
import { LoginPage } from '@capillary/optum-testing-ui-library';
import { createDriver } from '../utils/driver-factory';
import { credentials } from '../utils/test-data';
import fs from 'fs';

const AUTH_FILE = 'playwright/.auth/user.json';
const API_TOKEN_FILE = 'playwright/.auth/api-token.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(createDriver(page));
  await loginPage.completeLogin(credentials);
  await page.context().storageState({ path: AUTH_FILE });

  // Extract auth token for API preconditions in web tests
  const authToken = await page.evaluate(() => localStorage.getItem('auth_token'));
  fs.writeFileSync(API_TOKEN_FILE, JSON.stringify({ token: authToken }));
});
