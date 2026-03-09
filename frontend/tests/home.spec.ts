import { test, expect, safeJson } from '../utils/api-test';
import type { Page } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { COMMON, HOME } from '../../backend/utils/api-constants';

test.describe('Home Page', () => {
  let homePage: HomePage;
  const apiData: Record<string, any> = {};

  test.beforeEach(async ({ page, api }) => {
    // ── Preconditions: fetch real API data ──
    const [bannersRes, rewardsRes, pointsRes, scoreRes, onboardingRes, focusRes, missionsRes, topPicksRes] =
      await Promise.all([
        api.get(COMMON.banners),
        api.get(HOME.employerRewards),
        api.get(COMMON.userPoints),
        api.get(HOME.healthScore),
        api.get(COMMON.onboardingSteps),
        api.get(COMMON.focusAreas),
        api.get(HOME.missionsHome),
        api.get(HOME.topPicks),
      ]);

    apiData.banners = (await safeJson(bannersRes))?.data;
    apiData.rewards = (await safeJson(rewardsRes))?.data;
    apiData.points = (await safeJson(pointsRes))?.data;
    apiData.healthScore = (await safeJson(scoreRes))?.data;
    apiData.onboarding = (await safeJson(onboardingRes))?.data;
    apiData.focusAreas = (await safeJson(focusRes))?.data;
    apiData.missions = (await safeJson(missionsRes))?.data;
    apiData.topPicks = (await safeJson(topPicksRes))?.data;

    // ── Launch UI ──
    await page.goto('/home');
    homePage = new HomePage(page);
    await homePage.expectHomePageLoaded();
  });

  test('should display navigation tabs', async () => {
    await homePage.expectNavigationTabsVisible();
  });

  test('should display banner section', async ({ page }) => {
    await homePage.expectBannerVisible();
    // Dynamic: verify banner headline matches API data
    if (apiData.banners?.length > 0 && apiData.banners[0].headline) {
      const bannerHeadline = page.locator('[data-testid="banner-headline-0"]');
      await expect(bannerHeadline).toContainText(apiData.banners[0].headline);
    }
  });

  test('should display summary section with rewards and points', async ({ page }) => {
    await homePage.expectSummarySectionVisible();
    // Dynamic: verify actual values from API
    if (apiData.rewards && apiData.points && apiData.healthScore) {
      const summary = page.locator('[data-testid="summary-section"]');
      await expect(summary).toContainText(`${apiData.rewards.rewardsBalanceAmt}`);
      await expect(summary).toContainText(`${apiData.points.pointsBalanceAmt}`);
      await expect(summary).toContainText(`${apiData.healthScore.currentHealthScoreAmt}`);
    }
  });

  test('should display setup guide', async () => {
    await homePage.expectSetupGuideVisible();
  });

  test('should display focus area section', async () => {
    await homePage.expectFocusAreaVisible();
  });

  test('should display missions section', async () => {
    await homePage.expectMissionsSectionVisible();
  });

  test('should display challenges section', async () => {
    await homePage.expectChallengesSectionVisible();
  });

  test('should display top picks section', async () => {
    await homePage.expectTopPicksSectionVisible();
  });

  test('should show token count in header', async () => {
    const tokens = await homePage.getTokensCount();
    expect(Number(tokens)).toBeGreaterThan(0);
  });
});

// ─── Focus Area Setup and Quit ─────────────────────────────
// Uses UAT environment with separate credentials (no API mocking)
test.describe('Focus Area Setup and Quit', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;
  let homePage: HomePage;

  test.beforeAll(async ({ browser }) => {
    // Reuse auth state from setup project — grant geolocation to avoid location popup
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
      permissions: ['geolocation'],
      geolocation: { latitude: 37.7749, longitude: -122.4194 },
    });
    page = await context.newPage();
    await page.goto('/home', { timeout: 60_000 });
    await page.waitForTimeout(3000);

    // Dismiss any in-app location permission dialog if it appears
    for (const btnText of ['Allow', 'OK', 'Accept', 'Continue', 'Got it']) {
      const btn = page.getByText(btnText, { exact: true });
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(1000);
        break;
      }
    }

    // If a previous run left the app on the setup-focus / mission page, go back to home
    if (!page.url().includes('/home')) {
      await page.goto('/home');
      await page.waitForTimeout(3000);
    }

    homePage = new HomePage(page);
    await homePage.expectHomePageLoaded();

    // Cleanup: if focus area is already set, quit it first
    if (await homePage.isFocusAreaSet()) {
      await homePage.quitFocusArea();
      await page.waitForTimeout(3000);
      await page.reload();
      await homePage.expectHomePageLoaded();
    }

    // Cleanup: quit all active missions to avoid enrollment limits
    await homePage.quitAllMissions();
    await page.goto('/home');
    await homePage.expectHomePageLoaded();
  });

  test.afterAll(async () => {
    // Cleanup: navigate to home and quit focus area if still set
    try {
      await page.goto('/home');
      await page.waitForTimeout(3000);
      if (await homePage.isFocusAreaSet()) {
        await homePage.quitFocusArea();
        await page.waitForTimeout(2000);
      }
    } catch {
      // ignore cleanup errors
    }
    await page.close();
  });

  test('Scenario 1: should set up focus area', async () => {
    const focusAreas = ['Move more', 'Improve mood', 'Eat well', 'Drink less alcohol'];

    // 1. Verify "Set Up Focus Area" button is visible
    await homePage.expectSetUpFocusAreaBtnVisible();

    let activated = false;

    for (const area of focusAreas) {
      // 2. Click "Set Up Focus Area" → navigates to /setup-focus
      await homePage.clickSetUpFocusArea();

      // 3. Select a focus area option
      await homePage.selectFocusOption(area);

      // 4. Click "Save and Proceed" → navigates to mission selection page
      await homePage.clickSaveAndProceed();

      // 5. Dismiss the Activities info dialog
      await homePage.dismissActivitiesDialog();

      // 6. Select 3 missions and click Done
      console.log(`[FocusArea] Trying: ${area}`);
      const success = await homePage.selectMissionsAndDone(3);
      console.log(`[FocusArea] ${area} result: ${success}`);
      if (success) {
        activated = true;
        break;
      }

      // Failed (enrollment error or not enough missions) — go back to home and try next focus area
      await page.goto('/home');
      await homePage.expectHomePageLoaded();
    }

    expect(activated, 'Failed to activate any focus area due to enrollment errors').toBe(true);

    // 8. Verify focus area card is visible (already on home page after successful setup)
    await homePage.expectFocusAreaCardVisible();

    // 9. Verify "Set Up Focus Area" button is no longer visible
    await homePage.expectSetUpFocusAreaBtnNotVisible();
  });

  test('Scenario 2: should quit focus area', async () => {
    // 1. Verify focus area card is visible with details
    await homePage.expectFocusAreaCardVisible();

    // 2. Verify "Set Up Focus Area" button NOT visible
    await homePage.expectSetUpFocusAreaBtnNotVisible();

    // 3. Click 3-dot menu
    await homePage.openFocusArea3DotMenu();

    // 4. Click "Quit Focus Area" option → dialog appears
    await homePage.clickQuitOption();

    // 5. Verify quit confirmation dialog
    await homePage.expectQuitConfirmDialogVisible();

    // 6. Confirm quit
    await homePage.confirmQuit();
    await page.waitForTimeout(3000);

    // 7. Verify focus area card is removed
    await page.reload();
    await homePage.expectHomePageLoaded();

    // 8. Verify "Set Up Focus Area" button is visible again
    await homePage.expectSetUpFocusAreaBtnVisible();
  });
});
