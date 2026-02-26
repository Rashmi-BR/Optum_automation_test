import { test, expect, safeJson } from '../utils/api-test';
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
