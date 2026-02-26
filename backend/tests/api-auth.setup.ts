import { test as setup } from '@playwright/test';
import { LoginPage } from '../../frontend/pages/login.page';
import fs from 'fs';

const apiAuthFile = 'playwright/.auth/api-user.json';
const apiTokenFile = 'playwright/.auth/api-token.json';

setup('authenticate for API tests', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.completeLogin();

  // Save browser storage state (cookies + localStorage)
  await page.context().storageState({ path: apiAuthFile });

  // Extract auth token from localStorage for API requests
  const authToken = await page.evaluate(() => localStorage.getItem('auth_token'));
  fs.writeFileSync(apiTokenFile, JSON.stringify({ token: authToken }));
});
