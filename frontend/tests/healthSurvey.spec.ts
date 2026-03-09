import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { SettingsPage } from '../pages/settings.page';
import { HealthSurveyPage } from '../pages/healthSurvey.page';

test.describe('Health Survey Completion', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;
  let homePage: HomePage;
  let settingsPage: SettingsPage;
  let healthSurveyPage: HealthSurveyPage;

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
    healthSurveyPage = new HealthSurveyPage(page);
    await homePage.expectHomePageLoaded();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Navigate to Health Survey via Profile → Settings sidebar', async () => {
    // Open profile / settings
    await homePage.openProfile();
    await page.waitForTimeout(2000);

    // Click Health Survey in the sidebar
    await settingsPage.clickHealthSurvey();
  });

  test('Handle survey state and select English', async () => {
    test.setTimeout(300_000);
    await page.waitForTimeout(3000);

    if (await healthSurveyPage.isSurveyComplete()) {
      // Survey is 100% complete — click Retake
      console.log('[HealthSurvey] Survey complete — clicking Retake');
      await healthSurveyPage.clickRetakeSurvey();
    } else {
      // Survey is in-progress — complete it first
      console.log('[HealthSurvey] Survey in-progress — completing it first');
      const entered = await healthSurveyPage.enterSurvey();
      console.log(`[HealthSurvey] Enter result: ${entered}`);

      if (entered !== 'already_complete') {
        const completed = await healthSurveyPage.completeSurveyLoop(50);
        expect(completed, 'Survey should reach 100% before retaking').toBe(true);
      }

      // Now click Retake
      await healthSurveyPage.clickRetakeSurvey();
    }

    // Select English language and enter the survey
    await healthSurveyPage.selectLanguage('English');
    const entered = await healthSurveyPage.enterSurvey();
    console.log(`[HealthSurvey] Enter result after retake: ${entered}`);
  });

  test('Complete English survey until 100%', async () => {
    test.setTimeout(300_000);

    const completed = await healthSurveyPage.completeSurveyLoop(50);
    expect(completed, 'English survey should reach 100%').toBe(true);
  });

  test('Verify English is selected on the survey page', async () => {
    await healthSurveyPage.verifyEnglishSelected();
  });
});

test.describe('Spanish Health Survey Completion', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;
  let homePage: HomePage;
  let settingsPage: SettingsPage;
  let healthSurveyPage: HealthSurveyPage;

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
    healthSurveyPage = new HealthSurveyPage(page);
    await homePage.expectHomePageLoaded();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Navigate to Health Survey via Profile → Settings sidebar', async () => {
    await homePage.openProfile();
    await page.waitForTimeout(2000);
    await settingsPage.clickHealthSurvey();
  });

  test('Handle survey state and select Español', async () => {
    test.setTimeout(300_000);
    await page.waitForTimeout(3000);

    if (await healthSurveyPage.isSurveyComplete()) {
      // Survey is 100% complete — click Retake
      console.log('[SpanishSurvey] Survey complete — clicking Retake');
      await healthSurveyPage.clickRetakeSurvey();
    } else {
      // Survey is in-progress — complete it in English first
      console.log('[SpanishSurvey] Survey in-progress — completing English first');
      const entered = await healthSurveyPage.enterSurvey();
      console.log(`[SpanishSurvey] Enter result: ${entered}`);

      if (entered !== 'already_complete') {
        const completed = await healthSurveyPage.completeSurveyLoop(50);
        expect(completed, 'English survey should reach 100% before switching to Spanish').toBe(true);
      }

      // Now click Retake
      await healthSurveyPage.clickRetakeSurvey();
    }

    // Select Español language and enter the survey
    await healthSurveyPage.selectLanguage('Español');
    const entered = await healthSurveyPage.enterSurvey();
    console.log(`[SpanishSurvey] Enter result after retake: ${entered}`);
  });

  test('Complete Spanish survey until 100%', async () => {
    test.setTimeout(300_000);

    const completed = await healthSurveyPage.completeSurveyLoop(50);
    expect(completed, 'Spanish survey should reach 100%').toBe(true);
  });

  test('Verify Español is selected on the survey page', async () => {
    await healthSurveyPage.verifyEspanolSelected();
  });
});
