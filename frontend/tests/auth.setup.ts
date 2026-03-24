import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import fs from 'fs';

const AUTH_FILE = 'playwright/.auth/user.json';
const API_TOKEN_FILE = 'playwright/.auth/api-token.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.completeLogin();
  await page.context().storageState({ path: AUTH_FILE });

  // Extract auth token for API preconditions in frontend tests
  const authToken = await page.evaluate(() => localStorage.getItem('auth_token'));
  fs.writeFileSync(API_TOKEN_FILE, JSON.stringify({ token: authToken }));
});
