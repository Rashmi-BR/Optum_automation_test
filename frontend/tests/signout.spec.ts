import { test, expect } from '@playwright/test';
import { SignoutPage } from '../pages/signout.page';

test.describe('Signout Flow', () => {
  test('should display signout page with correct content', async ({ page }) => {
    await page.goto('/signout');
    const signoutPage = new SignoutPage(page);
    await signoutPage.expectSignoutPageVisible();
  });

  test('should navigate back to welcome from signout', async ({ page }) => {
    await page.goto('/signout');
    const signoutPage = new SignoutPage(page);
    await signoutPage.clickReturnHome();
    await expect(page).toHaveURL(/.*\/welcome/);
  });
});
