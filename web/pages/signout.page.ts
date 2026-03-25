import { type Page, expect } from '@playwright/test';

export class SignoutPage {
  constructor(private page: Page) {}

  private thankYouHeading = () => this.page.getByRole('heading', { name: 'Thank you for visiting!' });
  private sessionEndedText = () => this.page.getByText('Your secure session has ended');
  private returnHomeBtn = () => this.page.getByText('Return Home');

  async clickReturnHome() {
    await this.returnHomeBtn().click();
    await this.page.waitForURL('**/welcome');
  }

  async expectSignoutPageVisible() {
    await expect(this.thankYouHeading()).toBeVisible();
    await expect(this.sessionEndedText()).toBeVisible();
    await expect(this.returnHomeBtn()).toBeVisible();
  }
}
