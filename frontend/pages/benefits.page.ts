import { type Page, expect } from '@playwright/test';

export class BenefitsPage {
  constructor(private page: Page) {}

  private resourcesHeading = () => this.page.getByText('Resources');
  private introToOptum = () => this.page.getByText('Introduction to Optum Engage');
  private buildingHealthyHabits = () => this.page.getByText('Building healthy habits');
  private rewardsAndBenefits = () => this.page.getByText('Rewards and Benefits');
  private nationwideBenefits = () => this.page.getByText('Nationwide Benefits');

  async expectBenefitsPageLoaded() {
    await expect(this.resourcesHeading()).toBeVisible();
  }

  async expectAllResourceLinksVisible() {
    await expect(this.introToOptum()).toBeVisible();
    await expect(this.buildingHealthyHabits()).toBeVisible();
    await expect(this.rewardsAndBenefits()).toBeVisible();
    await expect(this.nationwideBenefits()).toBeVisible();
  }
}
