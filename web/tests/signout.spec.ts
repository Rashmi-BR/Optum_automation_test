import { test, expect } from '@playwright/test';
import { SignoutPage } from '@capillary/optum-testing-ui-library';
import { createDriver } from '../utils/driver-factory';

test.describe('Signout Flow', () => {
  test('should display signout page with correct content', async ({ page }) => {
    await page.goto('/signout');
    const signoutPage = new SignoutPage(createDriver(page));
    await signoutPage.expectSignoutPageVisible();
  });

  test('should navigate back to welcome from signout', async ({ page }) => {
    await page.goto('/signout');
    const signoutPage = new SignoutPage(createDriver(page));
    await signoutPage.clickReturnHome();
    await expect(page).toHaveURL(/.*\/welcome/);
  });
});
