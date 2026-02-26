import { test, expect, safeJson } from '../utils/api-test';
import { BenefitsPage } from '../pages/benefits.page';
import { BENEFITS } from '../../backend/utils/api-constants';

test.describe('Benefits Page', () => {
  let benefitsPage: BenefitsPage;
  const apiData: Record<string, any> = {};

  test.beforeEach(async ({ page, api }) => {
    // ── Preconditions: fetch real API data ──
    const resourcesRes = await api.get(BENEFITS.resources);
    apiData.resources = (await safeJson(resourcesRes))?.data;

    // ── Launch UI ──
    await page.goto('/benefits');
    benefitsPage = new BenefitsPage(page);
    await benefitsPage.expectBenefitsPageLoaded();
  });

  test('should display all resource links', async ({ page }) => {
    await benefitsPage.expectAllResourceLinksVisible();
    // Dynamic: verify resource names from API appear on page
    if (apiData.resources) {
      for (const resource of apiData.resources) {
        if (resource.name) {
          await expect(page.getByText(resource.name)).toBeVisible();
        }
      }
    }
  });
});
