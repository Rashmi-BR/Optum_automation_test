import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login Flow - Welcome Page', () => {
  test('should display welcome page with Continue button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goToWelcome();
    await loginPage.expectWelcomePageVisible();
  });

  test('should navigate to HealthSafe ID login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goToWelcome();
    await loginPage.clickContinueWithHealthsafeId();
    await loginPage.expectLoginFormVisible();
  });
});

test.describe.configure({ mode: 'serial' });

test.describe('Login Flow - Full Authentication', () => {
  let page: Page;
  let loginPage: LoginPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    await loginPage.goToWelcome();
    await loginPage.clickContinueWithHealthsafeId();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should show identity confirmation after entering credentials', async () => {
    await loginPage.fillUsername('FNYXBWMYTSDS.LNWVRFSGNC@invalid.com');
    await loginPage.fillPassword('Password12345');
    await loginPage.clickSignIn();
    await loginPage.expectIdentityConfirmationVisible();
  });

  test('should show OTP input after clicking Text me', async () => {
    await loginPage.clickTextMe();
    await loginPage.expectOtpPageVisible();
  });

  test('should complete OTP and land on home page', async () => {
    await loginPage.fillOtp('987654');
    await loginPage.clickConfirm();
    await page.waitForURL('**/home', { timeout: 30_000 });
    await expect(page).toHaveURL(/.*\/home/);
  });
});
