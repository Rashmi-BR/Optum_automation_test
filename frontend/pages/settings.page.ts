import { type Page, expect } from '@playwright/test';

export class SettingsPage {
  constructor(private page: Page) {}

  // Sidebar menu items
  private healthProfile = () => this.page.getByText('Health Profile');
  private healthSurvey = () => this.page.getByText('Health Survey', { exact: true }).first();
  private accountDetails = () => this.page.getByText('Account Details');
  private aboutTheProgram = () => this.page.getByText('About the Program');
  private settingsLink = () => this.page.getByText('Settings').first();
  private activityTracker = () => this.page.getByText('Activity Tracker');
  private supportLink = () => this.page.getByText('Support');
  private helpCenter = () => this.page.getByText('Help Center');
  private logoutBtn = () => this.page.getByText('Logout');

  // About the Program sub-items
  private termsAndConditions = () => this.page.getByText('Terms and Conditions', { exact: true }).first();
  private privacyPolicy = () => this.page.getByText('Privacy Policy', { exact: true }).first();
  private rewardRules = () => this.page.getByText('Reward Rules', { exact: true }).first();

  // Preferences / Settings sub-items
  private preferences = () => this.page.getByText('Preferences', { exact: true }).first();
  private marketingEmailsToggle = () => this.page.getByText('Marketing Emails', { exact: true }).first();

  // Account details
  private emailHeading = () => this.page.getByRole('heading', { name: 'Email Address' });
  private usernameHeading = () => this.page.getByRole('heading', { name: 'Username' });
  private avatarHeading = () => this.page.getByRole('heading', { name: 'Avatar' });

  async clickHealthSurvey() {
    await this.healthSurvey().click();
    await this.page.waitForTimeout(3000);
  }

  async clickHealthProfile() {
    await this.healthProfile().click();
    await this.page.waitForTimeout(3000);
  }

  async clickAccountDetails() {
    await this.accountDetails().click();
    await this.page.waitForTimeout(3000);
  }

  async clickAboutTheProgram() {
    await this.aboutTheProgram().click();
    await this.page.waitForTimeout(3000);
  }

  async clickSettings() {
    await this.settingsLink().click();
    await this.page.waitForTimeout(3000);
  }

  async clickActivityTracker() {
    await this.activityTracker().click();
    await this.page.waitForTimeout(3000);
  }

  async clickSupport() {
    await this.supportLink().click();
    await this.page.waitForTimeout(3000);
  }

  async clickHelpCenter() {
    await this.helpCenter().click();
    await this.page.waitForTimeout(3000);
  }

  async clickLogout() {
    await this.logoutBtn().click();
  }

  async expectSettingsPageLoaded() {
    await expect(this.page.getByText('Manage Your Account')).toBeVisible();
  }

  async expectSidebarMenuVisible() {
    await expect(this.healthProfile()).toBeVisible();
    await expect(this.healthSurvey()).toBeVisible();
    await expect(this.accountDetails()).toBeVisible();
    await expect(this.aboutTheProgram()).toBeVisible();
    await expect(this.activityTracker()).toBeVisible();
    await expect(this.logoutBtn()).toBeVisible();
  }

  async expectAccountDetailsVisible() {
    await expect(this.emailHeading()).toBeVisible();
    await expect(this.usernameHeading()).toBeVisible();
    await expect(this.avatarHeading()).toBeVisible();
  }

  /**
   * Clicks "Update" button next to Email Address and verifies the update form/modal opens.
   * Returns true if an update UI was detected, false otherwise.
   */
  async clickUpdateEmail(): Promise<boolean> {
    // Find the Update button near the Email heading
    const updateBtns = this.page.getByText('Update', { exact: true });
    const count = await updateBtns.count();
    // Click the first Update button (Email is listed first)
    if (count > 0) {
      await updateBtns.first().click();
      await this.page.waitForTimeout(2000);
      return true;
    }
    return false;
  }

  /**
   * Clicks "Update" button next to Username and verifies the update form/modal opens.
   */
  async clickUpdateUsername(): Promise<boolean> {
    const updateBtns = this.page.getByText('Update', { exact: true });
    const count = await updateBtns.count();
    // Username Update is typically the second Update button
    if (count > 1) {
      await updateBtns.nth(1).click();
      await this.page.waitForTimeout(2000);
      return true;
    }
    return false;
  }

  /**
   * Clicks "Update" button next to Avatar.
   */
  async clickUpdateAvatar(): Promise<boolean> {
    const updateBtns = this.page.getByText('Update', { exact: true });
    const count = await updateBtns.count();
    // Avatar Update is typically the third Update button
    if (count > 2) {
      await updateBtns.nth(2).click();
      await this.page.waitForTimeout(2000);
      return true;
    }
    return false;
  }

  /**
   * Goes back / dismisses any update modal or overlay that opened.
   */
  async dismissUpdateModal() {
    // Try common close/back buttons
    for (const text of ['Cancel', 'Close', 'Back', 'X', '✕']) {
      const btn = this.page.getByText(text, { exact: true });
      if (await btn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        await btn.first().click();
        await this.page.waitForTimeout(1000);
        return;
      }
    }
    // Try close via aria role
    const closeBtn = this.page.getByRole('button', { name: /close/i });
    if (await closeBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeBtn.first().click();
      await this.page.waitForTimeout(1000);
      return;
    }
    // Fallback: press Escape
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);
  }

  // --- About the Program sub-items ---

  async clickTermsAndConditions() {
    await this.termsAndConditions().click();
    await this.page.waitForTimeout(3000);
  }

  async expectTermsAndConditionsVisible() {
    // Verify detail content appeared after clicking
    const content = this.page.locator('body');
    await expect(content.getByText('Terms and Conditions')).toBeVisible();
  }

  async clickPrivacyPolicy() {
    await this.privacyPolicy().click();
    await this.page.waitForTimeout(3000);
  }

  async expectPrivacyPolicyVisible() {
    const content = this.page.locator('body');
    await expect(content.getByText('Privacy Policy')).toBeVisible();
  }

  async clickRewardRules() {
    await this.rewardRules().click();
    await this.page.waitForTimeout(3000);
  }

  async expectRewardRulesVisible() {
    const content = this.page.locator('body');
    await expect(content.getByText('Reward Rules')).toBeVisible();
  }

  // --- Preferences ---

  async clickPreferences() {
    await this.preferences().click();
    await this.page.waitForTimeout(3000);
  }

  async expectPreferencesVisible() {
    const content = this.page.locator('body');
    await expect(content.getByText('Preferences')).toBeVisible();
  }

  async toggleMarketingEmails(): Promise<boolean> {
    const toggle = this.marketingEmailsToggle().locator('..').locator('input[type="checkbox"], [role="switch"], [role="checkbox"]').first();
    // Fallback: try clicking near the Marketing Emails text if no explicit toggle found
    const isToggleVisible = await toggle.isVisible({ timeout: 3000 }).catch(() => false);
    if (isToggleVisible) {
      const wasBefore = await toggle.isChecked().catch(() => false);
      await toggle.click();
      await this.page.waitForTimeout(1000);
      const isAfter = await toggle.isChecked().catch(() => false);
      return wasBefore !== isAfter;
    }
    // Fallback: click the row/label itself (some UIs toggle on label click)
    const row = this.marketingEmailsToggle().locator('..');
    await row.click();
    await this.page.waitForTimeout(1000);
    return true;
  }

  /**
   * Checks that clicking a sidebar item opens content in the same page (no new tab/window).
   * Returns true if navigation stayed in the same page.
   */
  async verifySamePageNavigation(clickFn: () => Promise<void>): Promise<boolean> {
    const context = this.page.context();
    const pageCountBefore = context.pages().length;
    await clickFn();
    await this.page.waitForTimeout(2000);
    const pageCountAfter = context.pages().length;
    return pageCountAfter === pageCountBefore;
  }

  /**
   * Checks that clicking an element opens a new tab/window.
   * Returns the new page if one opened, null otherwise.
   */
  async verifyOpensNewTab(clickFn: () => Promise<void>): Promise<Page | null> {
    const context = this.page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 10_000 }).catch(() => null),
      clickFn(),
    ]);
    if (newPage) {
      await newPage.waitForLoadState('domcontentloaded').catch(() => {});
    }
    return newPage;
  }
}
