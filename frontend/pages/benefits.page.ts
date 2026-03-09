import { type Page, expect } from '@playwright/test';

export class BenefitsPage {
  constructor(private page: Page) {}

  // Resources heading
  private resourcesHeading = () => this.page.getByTestId('benefits-other-benefits-parent-label');

  // Accordion items
  private introToOptumAccordion = () => this.page.getByTestId("Introduction to Optum Engage 'Accordion Item'");
  private myBenefitsResourcesAccordion = () => this.page.getByTestId("My Benefits Resources 'Accordion Item'");
  private otherBenefitsProgramsAccordion = () => this.page.getByTestId("Other Benefits Programs 'Accordion Item'");
  private questionsContactsAccordion = () => this.page.getByTestId("Questions/Contacts 'Accordion Item'");

  // Links under Introduction to Optum Engage
  private buildingHealthyHabits = () => this.page.getByText('Building healthy habits', { exact: true });
  private rewardsAndBenefits = () => this.page.getByText('Rewards and Benefits', { exact: true });

  async expectBenefitsPageLoaded() {
    await expect(this.resourcesHeading()).toBeVisible({ timeout: 15_000 });
  }

  // --- Accordion section visibility ---

  async expectAllAccordionsVisible() {
    await expect(this.introToOptumAccordion()).toBeVisible();
    await expect(this.myBenefitsResourcesAccordion()).toBeVisible();
    await expect(this.otherBenefitsProgramsAccordion()).toBeVisible();
    await expect(this.questionsContactsAccordion()).toBeVisible();
  }

  // --- Expand/collapse accordions ---

  async expandAccordion(accordion: () => ReturnType<Page['getByTestId']>) {
    await accordion().scrollIntoViewIfNeeded();
    await accordion().click();
    await this.page.waitForTimeout(2000);
  }

  async expandIntroToOptum() {
    await this.expandAccordion(this.introToOptumAccordion);
  }

  async expandMyBenefitsResources() {
    await this.expandAccordion(this.myBenefitsResourcesAccordion);
  }

  async expandOtherBenefitsPrograms() {
    await this.expandAccordion(this.otherBenefitsProgramsAccordion);
  }

  async expandQuestionsContacts() {
    await this.expandAccordion(this.questionsContactsAccordion);
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
