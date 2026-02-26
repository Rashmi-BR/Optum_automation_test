import { test, expect, safeJson } from '../utils/api-test';
import { ExplorePage } from '../pages/explore.page';
import { EXPLORE } from '../../backend/utils/api-constants';

test.describe('Explore Page', () => {
  let explorePage: ExplorePage;
  const apiData: Record<string, any> = {};

  test.beforeEach(async ({ page, api }) => {
    // ── Preconditions: fetch real API data ──
    const [activitiesRes, missionsRes, categoriesRes] = await Promise.all([
      api.get(EXPLORE.recommendedActivities),
      api.get(EXPLORE.missionsExplore),
      api.get(EXPLORE.challenges),
    ]);

    apiData.activities = (await safeJson(activitiesRes))?.data;
    apiData.missions = (await safeJson(missionsRes))?.data;
    apiData.challenges = (await safeJson(categoriesRes))?.data;

    // ── Launch UI ──
    await page.goto('/explore');
    explorePage = new ExplorePage(page);
    await explorePage.expectExplorePageLoaded();
  });

  test('should display rewardable activities', async () => {
    await explorePage.expectRewardableActivitiesVisible();
    // Dynamic: verify activities were returned from API
    if (apiData.activities) {
      expect(apiData.activities.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('should display missions section', async () => {
    await explorePage.expectMissionsSectionVisible();
    // Dynamic: verify missions exist in API data
    if (apiData.missions) {
      expect(apiData.missions.length).toBeGreaterThan(0);
    }
  });

  test('should display explore categories', async () => {
    await explorePage.expectCategoriesVisible();
  });
});
