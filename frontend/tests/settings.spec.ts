import { test, expect } from '../utils/api-test';
import { HomePage } from '../pages/home.page';
import { SettingsPage } from '../pages/settings.page';
import { SETTINGS } from '../../backend/utils/api-constants';

test.describe('Settings Page', () => {
  let settingsPage: SettingsPage;
  const apiData: Record<string, any> = {};

  test.beforeEach(async ({ page, api }) => {
    // ── Preconditions: fetch real API data ──
    const avatarsRes = await api.get(SETTINGS.avatars);
    const avatarsBody = await avatarsRes.json();
    apiData.avatars = avatarsBody.data;

    // ── Launch UI ──
    await page.goto('/home');
    const homePage = new HomePage(page);
    await homePage.openProfile();
    settingsPage = new SettingsPage(page);
  });

  test('should display settings page after clicking avatar', async () => {
    await settingsPage.expectSettingsPageLoaded();
  });

  test('should display sidebar menu items', async () => {
    await settingsPage.expectSidebarMenuVisible();
  });

  test('should display account details', async () => {
    await settingsPage.expectAccountDetailsVisible();
    // Dynamic: verify avatars loaded from API
    expect(apiData.avatars.length).toBeGreaterThan(0);
  });
});
