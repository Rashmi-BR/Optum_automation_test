import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { exploreCredentials } from '../utils/test-data';
import fs from 'fs';

const authFile = 'playwright/.auth/explore-user.json';
const apiTokenFile = 'playwright/.auth/explore-api-token.json';

setup('authenticate for explore', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goToWelcome();
  await loginPage.clickContinueWithHealthsafeId();
  await page.waitForTimeout(3000);

  await page.locator('#username').click();
  await page.locator('#username').fill('');
  await page.locator('#username').pressSequentially(exploreCredentials.email, { delay: 50 });
  await page.waitForTimeout(500);

  await page.locator('#login-pwd').click();
  await page.locator('#login-pwd').fill('');
  await page.locator('#login-pwd').pressSequentially(exploreCredentials.password, { delay: 50 });
  await page.waitForTimeout(500);

  await loginPage.clickSignIn();
  await loginPage.clickTextMe();
  await loginPage.fillOtp(exploreCredentials.otp);
  await loginPage.clickConfirm();
  await page.waitForURL('**/home', { timeout: 30_000 });

  await page.context().storageState({ path: authFile });

  const authToken = await page.evaluate(() => localStorage.getItem('auth_token'));
  fs.writeFileSync(apiTokenFile, JSON.stringify({ token: authToken }));
});
