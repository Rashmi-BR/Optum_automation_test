import { test, expect, safeJson } from '../utils/api-test';
import { RewardsPage } from '../pages/rewards.page';
import { COMMON, HOME, REWARDS } from '../../backend/utils/api-constants';

test.describe('Rewards Page', () => {
  let rewardsPage: RewardsPage;
  const apiData: Record<string, any> = {};

  test.beforeEach(async ({ page, api }) => {
    // ── Preconditions: fetch real API data ──
    const [rewardsRes, pointsRes, offersRes, auctionsRes, sweepstakesRes, donationsRes] =
      await Promise.all([
        api.get(HOME.employerRewards),
        api.get(COMMON.userPoints),
        api.get(REWARDS.offers),
        api.get(REWARDS.auctions),
        api.get(REWARDS.sweepstakesPublic),
        api.get(REWARDS.donations),
      ]);

    apiData.rewards = (await safeJson(rewardsRes))?.data;
    apiData.points = (await safeJson(pointsRes))?.data;
    apiData.offers = (await safeJson(offersRes))?.data;
    apiData.auctions = (await safeJson(auctionsRes))?.data;
    apiData.sweepstakes = (await safeJson(sweepstakesRes))?.data;
    apiData.donations = (await safeJson(donationsRes))?.data;

    // ── Launch UI ──
    await page.goto('/rewards');
    rewardsPage = new RewardsPage(page);
    await rewardsPage.expectRewardsPageLoaded();
  });

  test('should display rewards summary', async ({ page }) => {
    await rewardsPage.expectRewardsSummaryVisible();
    // Dynamic: verify rewards balance from API
    if (apiData.rewards) {
      const rewardsSection = page.getByText('Employer Rewards').first().locator('..');
      await expect(rewardsSection).toContainText(`${apiData.rewards.rewardsBalanceAmt}`);
    }
  });

  test('should display points section', async ({ page }) => {
    await rewardsPage.expectPointsSectionVisible();
    // Dynamic: verify points balance from API
    if (apiData.points) {
      const pointsSection = page.getByText('Balance').locator('..');
      await expect(pointsSection).toContainText(`${apiData.points.pointsBalanceAmt}`);
    }
  });

  test('should display redeem section', async () => {
    await rewardsPage.expectRedeemSectionVisible();
  });

  test('should display offers section', async () => {
    await rewardsPage.expectOffersSectionVisible();
    // Dynamic: verify offers exist in API
    if (apiData.offers) {
      expect(apiData.offers.length).toBeGreaterThan(0);
    }
  });

  test('should display auctions section', async () => {
    await rewardsPage.expectAuctionsSectionVisible();
  });

  test('should display sweepstakes section', async () => {
    await rewardsPage.expectSweepstakesSectionVisible();
  });

  test('should display donations section', async () => {
    await rewardsPage.expectDonationsSectionVisible();
    // Dynamic: verify donations exist in API
    if (apiData.donations) {
      expect(apiData.donations.length).toBeGreaterThan(0);
    }
  });
});
