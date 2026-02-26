import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import fs from 'fs';

const authFile = 'playwright/.auth/user.json';
const apiTokenFile = 'playwright/.auth/api-token.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.completeLogin();
  await page.context().storageState({ path: authFile });

  // Extract auth token for API preconditions in frontend tests
  const authToken = await page.evaluate(() => localStorage.getItem('auth_token'));
  fs.writeFileSync(apiTokenFile, JSON.stringify({ token: authToken }));
});
