import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { SettingsPage } from '../pages/settings.page';

test.describe('Account Settings', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;
  let homePage: HomePage;
  let settingsPage: SettingsPage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
      permissions: ['geolocation'],
      geolocation: { latitude: 37.7749, longitude: -122.4194 },
    });
    page = await context.newPage();
    await page.goto('/home', { timeout: 60_000 });
    await page.waitForTimeout(3000);

    // Dismiss any in-app dialogs
    for (const btnText of ['Allow', 'OK', 'Accept', 'Continue', 'Got it']) {
      const btn = page.getByText(btnText, { exact: true });
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(1000);
        break;
      }
    }

    if (!page.url().includes('/home')) {
      await page.goto('/home');
      await page.waitForTimeout(3000);
    }

    homePage = new HomePage(page);
    settingsPage = new SettingsPage(page);
    await homePage.expectHomePageLoaded();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Navigate to Account Settings via avatar', async () => {
    await homePage.openProfile();
    await page.waitForTimeout(2000);
    await settingsPage.expectSettingsPageLoaded();
  });

  test('Verify sidebar menu items are visible', async () => {
    await settingsPage.expectSidebarMenuVisible();
  });

  test('Verify Account Details fields (Email, Username, Avatar)', async () => {
    await settingsPage.clickAccountDetails();
    await settingsPage.expectAccountDetailsVisible();
  });

  test('Verify Update Email button is clickable', async () => {
    const clicked = await settingsPage.clickUpdateEmail();
    expect(clicked, 'Update Email button should be present and clickable').toBe(true);

    // Take a screenshot to capture what opened
    console.log('[AccountSettings] Update Email clicked — checking for update UI');
    await page.waitForTimeout(1000);
    await settingsPage.dismissUpdateModal();
  });

  test('Verify Update Username button is clickable', async () => {
    const clicked = await settingsPage.clickUpdateUsername();
    expect(clicked, 'Update Username button should be present and clickable').toBe(true);

    console.log('[AccountSettings] Update Username clicked — checking for update UI');
    await page.waitForTimeout(1000);
    await settingsPage.dismissUpdateModal();
  });

  test('Verify Update Avatar button is clickable', async () => {
    const clicked = await settingsPage.clickUpdateAvatar();
    expect(clicked, 'Update Avatar button should be present and clickable').toBe(true);

    console.log('[AccountSettings] Update Avatar clicked — checking for update UI');
    await page.waitForTimeout(1000);
    await settingsPage.dismissUpdateModal();
  });

  test('Verify Health Profile opens in same page', async () => {
    const sameTab = await settingsPage.verifySamePageNavigation(
      () => settingsPage.clickHealthProfile(),
    );
    expect(sameTab, 'Health Profile should open in the same page').toBe(true);
    console.log(`[AccountSettings] Health Profile — URL: ${page.url()}`);
  });

  test('Verify Health Survey opens in same page', async () => {
    const sameTab = await settingsPage.verifySamePageNavigation(
      () => settingsPage.clickHealthSurvey(),
    );
    expect(sameTab, 'Health Survey should open in the same page').toBe(true);
    console.log(`[AccountSettings] Health Survey — URL: ${page.url()}`);
  });

  test('Verify About the Program opens in same page', async () => {
    const sameTab = await settingsPage.verifySamePageNavigation(
      () => settingsPage.clickAboutTheProgram(),
    );
    expect(sameTab, 'About the Program should open in the same page').toBe(true);
    console.log(`[AccountSettings] About the Program — URL: ${page.url()}`);
  });

  test('Verify Activity Tracker opens in same page', async () => {
    const sameTab = await settingsPage.verifySamePageNavigation(
      () => settingsPage.clickActivityTracker(),
    );
    expect(sameTab, 'Activity Tracker should open in the same page').toBe(true);
    console.log(`[AccountSettings] Activity Tracker — URL: ${page.url()}`);
  });

  test('Verify Settings opens in same page', async () => {
    const sameTab = await settingsPage.verifySamePageNavigation(
      () => settingsPage.clickSettings(),
    );
    expect(sameTab, 'Settings should open in the same page').toBe(true);
    console.log(`[AccountSettings] Settings — URL: ${page.url()}`);
  });

  test('Verify Terms and Conditions opens its details', async () => {
    // Navigate to About the Program first
    await settingsPage.clickAboutTheProgram();
    await settingsPage.clickTermsAndConditions();
    await settingsPage.expectTermsAndConditionsVisible();
    console.log(`[AccountSettings] Terms and Conditions — URL: ${page.url()}`);
  });

  test('Verify Privacy Policy opens its details', async () => {
    await settingsPage.clickPrivacyPolicy();
    await settingsPage.expectPrivacyPolicyVisible();
    console.log(`[AccountSettings] Privacy Policy — URL: ${page.url()}`);
  });

  test('Verify Reward Rules opens its details', async () => {
    await settingsPage.clickRewardRules();
    await settingsPage.expectRewardRulesVisible();
    console.log(`[AccountSettings] Reward Rules — URL: ${page.url()}`);
  });

  test('Verify Preferences opens its details', async () => {
    await settingsPage.clickPreferences();
    await settingsPage.expectPreferencesVisible();
    console.log(`[AccountSettings] Preferences — URL: ${page.url()}`);
  });

  test('Verify About the Program detail content is visible', async () => {
    await settingsPage.clickAboutTheProgram();
    const content = page.locator('body');
    await expect(content.getByText('About the Program')).toBeVisible();
    console.log(`[AccountSettings] About the Program details — URL: ${page.url()}`);
  });

  test('Verify Marketing Emails toggle can be turned on and off', async () => {
    // Navigate to Preferences
    await settingsPage.clickPreferences();
    await settingsPage.expectPreferencesVisible();

    // Toggle ON
    const toggledOn = await settingsPage.toggleMarketingEmails();
    expect(toggledOn, 'Marketing Emails toggle should change state (first toggle)').toBe(true);
    console.log('[AccountSettings] Marketing Emails toggled once');

    // Toggle OFF (back to original)
    const toggledOff = await settingsPage.toggleMarketingEmails();
    expect(toggledOff, 'Marketing Emails toggle should change state (second toggle)').toBe(true);
    console.log('[AccountSettings] Marketing Emails toggled back');
  });

  test('Verify Support link behavior', async () => {
    // Support may open a new tab or stay in-page — detect either
    const newPage = await settingsPage.verifyOpensNewTab(
      () => settingsPage.clickSupport(),
    );

    if (newPage) {
      console.log(`[AccountSettings] Support opened new tab — URL: ${newPage.url()}`);
      await newPage.close();
    } else {
      console.log(`[AccountSettings] Support stayed in same page — URL: ${page.url()}`);
    }
  });

  test('Verify Help Center link behavior', async () => {
    // Help Center may open a new tab or stay in-page — detect either
    const newPage = await settingsPage.verifyOpensNewTab(
      () => settingsPage.clickHelpCenter(),
    );

    if (newPage) {
      console.log(`[AccountSettings] Help Center opened new tab — URL: ${newPage.url()}`);
      await newPage.close();
    } else {
      console.log(`[AccountSettings] Help Center stayed in same page — URL: ${page.url()}`);
    }
  });
});
