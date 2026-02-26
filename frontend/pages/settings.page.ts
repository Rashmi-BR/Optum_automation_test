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

  // Account details
  private emailHeading = () => this.page.getByRole('heading', { name: 'Email Address' });
  private usernameHeading = () => this.page.getByRole('heading', { name: 'Username' });
  private avatarHeading = () => this.page.getByRole('heading', { name: 'Avatar' });

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
}
