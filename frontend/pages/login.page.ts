import { type Page, expect } from '@playwright/test';
import { credentials } from '../utils/test-data';

export class LoginPage {
  constructor(private page: Page) {}

  // Welcome page
  private continueBtn = () => this.page.getByText('Continue with Healthsafe ID');

  // HealthSafe ID login
  private usernameInput = () => this.page.locator('#username');
  private passwordInput = () => this.page.locator('#login-pwd');
  private signInBtn = () => this.page.locator('#btnLogin');

  // OTP verification
  private proceedBtn = () => this.page.locator('#btnProceed');
  private otpInput = () => this.page.locator('#phoneCode');

  async goToWelcome() {
    await this.page.goto('/welcome');
    await this.continueBtn().waitFor({ state: 'visible' });
  }

  async clickContinueWithHealthsafeId() {
    await this.continueBtn().click();
    await this.usernameInput().waitFor({ state: 'visible', timeout: 15_000 });
  }

  async fillUsername(email: string) {
    await this.usernameInput().fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput().fill(password);
  }

  async clickSignIn() {
    await this.signInBtn().click();
    await this.proceedBtn().waitFor({ state: 'visible', timeout: 20_000 });
  }

  async clickTextMe() {
    await this.proceedBtn().click();
    await this.otpInput().waitFor({ state: 'visible', timeout: 15_000 });
  }

  async fillOtp(otp: string) {
    await this.otpInput().fill(otp);
  }

  async clickConfirm() {
    await this.proceedBtn().click();
  }

  async completeLogin() {
    await this.goToWelcome();
    await this.clickContinueWithHealthsafeId();
    await this.page.waitForTimeout(2000);
    await this.fillUsername(credentials.email);
    await this.fillPassword(credentials.password);
    await this.clickSignIn();
    await this.clickTextMe();
    await this.fillOtp(credentials.otp);
    await this.clickConfirm();
    await this.page.waitForURL('**/home', { timeout: 30_000 });
  }

  // Assertions
  async expectWelcomePageVisible() {
    await expect(this.continueBtn()).toBeVisible();
    await expect(this.page.getByText('Get rewarded for getting healthy')).toBeVisible();
  }

  async expectLoginFormVisible() {
    await expect(this.usernameInput()).toBeVisible();
    await expect(this.passwordInput()).toBeVisible();
    await expect(this.signInBtn()).toBeVisible();
  }

  async expectOtpPageVisible() {
    await expect(this.page.getByText('Check your text messages!')).toBeVisible();
    await expect(this.otpInput()).toBeVisible();
  }

  async expectIdentityConfirmationVisible() {
    await expect(this.page.getByText('Confirm your identity')).toBeVisible();
    await expect(this.proceedBtn()).toBeVisible();
  }
}
