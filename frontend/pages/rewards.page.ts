import { type Page, expect } from '@playwright/test';

export class RewardsPage {
  constructor(private page: Page) {}

  private rewardsHeading = () => this.page.getByText('Rewards').first();
  private employerRewards = () => this.page.getByText('Employer Rewards').first();
  private totalEarnedLabel = () => this.page.getByText('Total Earned').first();
  private pointsBalance = () => this.page.getByText('Balance');
  private redeemSection = () => this.page.getByText('Redeem your points');
  private offersSection = () => this.page.getByText('Offers');
  private auctionsSection = () => this.page.getByText('Auctions');
  private sweepstakesSection = () => this.page.getByText('Sweepstakes', { exact: true }).first();
  private donationsSection = () => this.page.getByText('Donations');

  async expectRewardsPageLoaded() {
    await expect(this.employerRewards()).toBeVisible();
  }

  async expectRewardsSummaryVisible() {
    await expect(this.employerRewards()).toBeVisible();
    await expect(this.totalEarnedLabel()).toBeVisible();
  }

  async expectPointsSectionVisible() {
    await expect(this.pointsBalance()).toBeVisible();
  }

  async expectRedeemSectionVisible() {
    await expect(this.redeemSection()).toBeVisible();
  }

  async expectOffersSectionVisible() {
    await expect(this.offersSection()).toBeVisible();
  }

  async expectAuctionsSectionVisible() {
    await expect(this.auctionsSection()).toBeVisible();
  }

  async expectSweepstakesSectionVisible() {
    await expect(this.sweepstakesSection()).toBeVisible();
  }

  async expectDonationsSectionVisible() {
    await expect(this.donationsSection()).toBeVisible();
  }
}
