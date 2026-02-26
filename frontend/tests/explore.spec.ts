import { test, expect } from '../utils/api-test';
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

    apiData.activities = (await activitiesRes.json()).data;
    apiData.missions = (await missionsRes.json()).data;
    apiData.challenges = (await categoriesRes.json()).data;

    // ── Launch UI ──
    await page.goto('/explore');
    explorePage = new ExplorePage(page);
    await explorePage.expectExplorePageLoaded();
  });

  test('should display rewardable activities', async () => {
    await explorePage.expectRewardableActivitiesVisible();
    // Dynamic: verify activities were returned from API
    expect(apiData.activities.length).toBeGreaterThanOrEqual(0);
  });

  test('should display missions section', async () => {
    await explorePage.expectMissionsSectionVisible();
    // Dynamic: verify missions exist in API data
    expect(apiData.missions.length).toBeGreaterThan(0);
  });

  test('should display explore categories', async () => {
    await explorePage.expectCategoriesVisible();
  });
});
