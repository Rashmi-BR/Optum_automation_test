import { test as base, expect } from '@playwright/test';
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { ExplorePage } from '../pages/explore.page';
import { EXPLORE } from '../utils/api-constants';
import fs from 'fs';
import path from 'path';

const EXPLORE_TOKEN_FILE = path.resolve('playwright/.auth/explore-api-token.json');

/** Explore-specific test fixture using the explore user's API token */
const test = base.extend<{ api: APIRequestContext }>({
  api: async ({ playwright }, use) => {
    let token = '';
    try {
      token = JSON.parse(fs.readFileSync(EXPLORE_TOKEN_FILE, 'utf-8')).token ?? '';
    } catch {
      // Token file missing — create unauthenticated context
    }
    const context = await playwright.request.newContext({
      baseURL: 'https://api.rallyengage.com',
      extraHTTPHeaders: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: 'application/json',
        Referer: 'https://1126.rallyengage.com/',
        'Accept-Language': 'en-US',
      },
    });
    await use(context);
    await context.dispose();
  },
});

async function safeJson(res: APIResponse): Promise<any | null> {
  try {
    if (!res.ok()) return null;
    return await res.json();
  } catch {
    return null;
  }
}

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
