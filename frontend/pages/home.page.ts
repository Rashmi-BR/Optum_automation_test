import { type Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  // Header
  private tokensBtn = () => this.page.locator('[data-testid="Tokens"]');
  private avatar = () => this.page.locator('[data-testid="test:id/web-header-avatar"]');

  // Navigation tabs
  private homeTab = () => this.page.locator('[data-testid="Home"]');
  private exploreTab = () => this.page.locator('[data-testid="Explore"]');
  private benefitsTab = () => this.page.locator('[data-testid="Benefits"]');
  private rewardsTab = () => this.page.locator('[data-testid="Rewards"]');

  // Summary section
  private summarySection = () => this.page.locator('[data-testid="summary-section"]');
  private summaryTitle = () => this.page.locator('[data-testid="section-title__Summary"]');

  // Banner
  private bannerHeadline = () => this.page.locator('[data-testid="banner-headline-0"]');

  // Setup Guide
  private setupGuideTitle = () => this.page.locator('[data-testid="section-title__Setup Guide"]');

  // Focus Area
  private focusAreaTitle = () => this.page.locator('[data-testid="section-title__Focus Area"]');
  private setupFocusAreaBtn = () => this.page.locator('[data-testid="Set Up Focus Area"]');

  // Missions
  private missionsTitle = () => this.page.locator('[data-testid="section-title__Check in to your missions"]');

  // Challenges
  private challengesTitle = () => this.page.locator('[data-testid="section-title__Your challenges"]');

  // Top picks
  private topPicksTitle = () => this.page.locator('[data-testid="section-title__Top picks"]');

  // Take Health Survey
  private takeHealthSurveyBtn = () => this.page.locator('[data-testid="card-button-component-Take Health Survey"]');

  // Scroll to top
  private scrollToTopBtn = () => this.page.locator('[data-testid="Scroll to top"]');

  async navigateToExplore() {
    await this.exploreTab().click();
    await this.page.waitForURL('**/explore');
  }

  async navigateToBenefits() {
    await this.benefitsTab().click();
    await this.page.waitForURL('**/benefits');
  }

  async navigateToRewards() {
    await this.rewardsTab().click();
    await this.page.waitForURL('**/rewards');
  }

  async navigateToHome() {
    await this.homeTab().click();
    await this.page.waitForURL('**/home');
  }

  async openProfile() {
    await this.avatar().click();
    await this.page.waitForURL('**/settings/**');
  }

  async getTokensCount(): Promise<string> {
    return (await this.tokensBtn().textContent()) || '';
  }

  // Assertions
  async expectHomePageLoaded() {
    await expect(this.summarySection()).toBeVisible();
    await expect(this.summaryTitle()).toBeVisible();
    await expect(this.tokensBtn()).toBeVisible();
  }

  async expectBannerVisible() {
    await expect(this.bannerHeadline()).toBeVisible();
  }

  async expectSummarySectionVisible() {
    await expect(this.summarySection()).toBeVisible();
    await expect(this.summarySection().getByText('Employer Rewards')).toBeVisible();
    await expect(this.summarySection().getByText('Points')).toBeVisible();
    await expect(this.summarySection().getByText('Health Score')).toBeVisible();
  }

  async expectSetupGuideVisible() {
    await expect(this.setupGuideTitle()).toBeVisible();
  }

  async expectFocusAreaVisible() {
    await expect(this.focusAreaTitle()).toBeVisible();
  }

  async expectMissionsSectionVisible() {
    await expect(this.missionsTitle()).toBeVisible();
  }

  async expectChallengesSectionVisible() {
    await expect(this.challengesTitle()).toBeVisible();
  }

  async expectTopPicksSectionVisible() {
    await expect(this.topPicksTitle()).toBeVisible();
  }

  async expectNavigationTabsVisible() {
    await expect(this.homeTab()).toBeVisible();
    await expect(this.exploreTab()).toBeVisible();
    await expect(this.benefitsTab()).toBeVisible();
    await expect(this.rewardsTab()).toBeVisible();
  }
}
