import { type Page, expect } from '@playwright/test';

export class BenefitsPage {
  constructor(private page: Page) {}

  // Page heading
  private yourBenefitsHeading = () => this.page.getByText('Your Benefits').first();

  // Resources section
  private resourcesHeading = () => this.page.getByText('Resources', { exact: true }).first();

  // Accordion items
  private moreBenefitResources = () => this.page.getByText('More Benefit Resources').first();

  // Links under More Benefit Resources
  private buildingHealthyHabits = () => this.page.getByText('Building healthy habits', { exact: true });
  private rewardsAndBenefits = () => this.page.getByText('Rewards and Benefits', { exact: true });

  async expectBenefitsPageLoaded() {
    await expect(this.yourBenefitsHeading()).toBeVisible({ timeout: 15_000 });
  }

  // --- Section visibility ---

  async expectAllAccordionsVisible() {
    await expect(this.moreBenefitResources()).toBeVisible();
  }

  // --- Expand/collapse accordions ---

  async expandAccordion(accordion: () => ReturnType<Page['getByTestId']>) {
    await accordion().scrollIntoViewIfNeeded();
    await accordion().click();
    await this.page.waitForTimeout(2000);
  }

  async expandMoreBenefitResources() {
    await this.expandAccordion(this.moreBenefitResources);
  }

  // --- Verify links under Introduction to Optum Engage ---

  async expectIntroLinksVisible() {
    await expect(this.buildingHealthyHabits()).toBeVisible();
    await expect(this.rewardsAndBenefits()).toBeVisible();
  }

  // --- Click a link and detect navigation behavior ---

  async clickLinkAndDetect(clickFn: () => Promise<void>): Promise<{ newTab: Page | null; samePageNavigated: boolean }> {
    const context = this.page.context();
    const urlBefore = this.page.url();

    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 10_000 }).catch(() => null),
      clickFn(),
    ]);

    if (newPage) {
      await newPage.waitForLoadState('domcontentloaded').catch(() => {});
      return { newTab: newPage, samePageNavigated: false };
    }

    await this.page.waitForTimeout(3000);
    const urlAfter = this.page.url();
    return { newTab: null, samePageNavigated: urlAfter !== urlBefore };
  }

  async clickBuildingHealthyHabits() {
    return this.clickLinkAndDetect(() => this.buildingHealthyHabits().click());
  }

  async clickRewardsAndBenefits() {
    return this.clickLinkAndDetect(() => this.rewardsAndBenefits().click());
  }

  // --- Click any text link inside an accordion ---

  async clickAccordionLink(linkText: string): Promise<{ newTab: Page | null; samePageNavigated: boolean }> {
    const link = this.page.getByText(linkText, { exact: true }).first();
    await link.scrollIntoViewIfNeeded();
    return this.clickLinkAndDetect(() => link.click());
  }

  // --- Check if an accordion item text is visible ---

  async isAccordionItemVisible(text: string): Promise<boolean> {
    return this.page.getByText(text, { exact: true }).first().isVisible({ timeout: 3000 }).catch(() => false);
  }

  // --- Navigation helpers ---

  async navigateBackToBenefits() {
    await this.page.goto('/benefits');
    await this.page.waitForTimeout(3000);
    await this.expectBenefitsPageLoaded();
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(2000);
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(1000);
  }
}
