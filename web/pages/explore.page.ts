import { type Page, expect } from '@playwright/test';

export class ExplorePage {
  constructor(private page: Page) {}

  private rewardableActivitiesText = () => this.page.getByText('Rewardable Activities');
  private viewAllActivities = () => this.page.getByText('View All').first();
  private missionsHeading = () => this.page.getByRole('heading', { name: 'Missions' });
  private recommendedTab = () => this.page.getByText('Recommended');
  private challengesSection = () => this.page.locator('[data-testid="section-title__Your challenges"]');
  private categoriesHeading = () => this.page.getByTestId('explore-category-text-title-undefined').first();

  async expectExplorePageLoaded() {
    await expect(this.rewardableActivitiesText()).toBeVisible();
  }

  async expectRewardableActivitiesVisible() {
    await expect(this.rewardableActivitiesText()).toBeVisible();
    await expect(this.page.getByText('Congratulations! You have earned your limit!')).toBeVisible();
  }

  async expectMissionsSectionVisible() {
    await expect(this.missionsHeading()).toBeVisible();
  }

  async expectCategoriesVisible() {
    await this.categoriesHeading().scrollIntoViewIfNeeded();
    await expect(this.categoriesHeading()).toBeVisible();
  }
}
