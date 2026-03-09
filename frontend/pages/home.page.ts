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

  // Focus Area — SET state
  private focusAreaWrapper = () => this.page.locator('[data-testid="focus-area-web-wrapper"]');
  private focusAreaContent = () => this.page.locator('[data-testid="focus-area-web-content"]');
  private focusAreaName = () => this.page.locator('[data-testid*="focus-area-hz-wrapper-title--"]');
  private focusAreaLevel = () => this.page.locator('[data-testid*="focus-area-hz-wrapper-label--"]');
  private focusAreaActivitiesCount = () => this.page.locator('[data-testid="footer-column-count--Activities"]');
  private focusAreaOngoingCount = () => this.page.locator('[data-testid="footer-column-count--Ongoing"]');
  private focusAreaCompletedCount = () => this.page.locator('[data-testid="footer-column-count--Completed"]');
  private focusArea3DotMenu = () => this.page.locator('[data-testid*="focus-area-wrapper-progress-pressable"]');

  // Focus Area — Quit flow
  private quitFocusAreaOption = () => this.page.locator('[data-testid="test:id/web-your-focus-area-quit-challenge"]');
  private quitConfirmBtn = () => this.page.locator('[data-testid="Quit "]');
  private quitCloseBtn = () => this.page.locator('[data-testid="Close"]');
  private quitDialogTitle = () => this.page.locator('[data-testid="Do you want to quit this focus area?"]');

  // Focus Area — Setup page
  private saveAndProceedBtn = () => this.page.locator('[data-testid="Save and Proceed"]');
  private gotItBtn = () => this.page.getByText('Got It', { exact: true });
  private doneBtn = () => this.page.getByText('Done', { exact: true });

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

  // ─── Focus Area actions ───────────────────────────────────

  async isFocusAreaSet(): Promise<boolean> {
    await this.focusAreaTitle().scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);
    // If the "Set Up Focus Area" button is visible, focus area is NOT set
    const setupBtnVisible = await this.setupFocusAreaBtn().isVisible();
    return !setupBtnVisible;
  }

  async clickSetUpFocusArea() {
    await this.setupFocusAreaBtn().scrollIntoViewIfNeeded();
    await this.setupFocusAreaBtn().click();
    await this.page.waitForURL('**/setup-focus');
  }

  async selectFocusOption(name: string) {
    await this.page.locator(`[data-testid="setup-focus-${name}"]`).click();
  }

  async clickSaveAndProceed() {
    await this.saveAndProceedBtn().click();
  }

  async dismissActivitiesDialog() {
    await this.gotItBtn().waitFor({ state: 'visible', timeout: 10_000 });
    await this.gotItBtn().click();
    await this.page.waitForTimeout(1000);
  }

  async selectMissionByName(name: string) {
    // SPA keeps home page DOM alive, so multiple text matches may exist.
    // Iterate to find the first visible one.
    const matches = this.page.getByText(name);
    const count = await matches.count();
    for (let i = 0; i < count; i++) {
      const el = matches.nth(i);
      if (await el.isVisible()) {
        await el.scrollIntoViewIfNeeded();
        await el.click();
        await this.page.waitForTimeout(500);
        return;
      }
    }
    // Fallback: click the last one (most recently rendered in SPA)
    await matches.last().click();
  }

  private async getVisibleMissionCardCenters(): Promise<{ x: number; y: number }[]> {
    return this.page.evaluate(() => {
      const results: { x: number; y: number }[] = [];
      const allDivs = document.querySelectorAll('div');

      for (const el of allDivs) {
        const style = window.getComputedStyle(el);
        if (style.cursor !== 'pointer') continue;

        const rect = el.getBoundingClientRect();
        // Mission card: reasonably sized clickable container
        if (rect.width < 200 || rect.height < 80) continue;
        // Must be below header + title area
        if (rect.top < 200) continue;
        // Must be at least partially in viewport
        if (rect.top > window.innerHeight) continue;

        const cx = rect.left + rect.width / 2;
        const cy = Math.min(rect.top + rect.height / 2, window.innerHeight - 10);
        const topEl = document.elementFromPoint(cx, cy);
        if (topEl && (el.contains(topEl) || el === topEl)) {
          results.push({ x: cx, y: cy });
        }
      }
      return results;
    });
  }

  async selectFirstNMissions(count: number) {
    await this.page.waitForTimeout(3000);

    const cardCenters = await this.getVisibleMissionCardCenters();
    const toClick = Math.min(count, cardCenters.length);
    for (let i = 0; i < toClick; i++) {
      await this.page.mouse.click(cardCenters[i].x, cardCenters[i].y);
      await this.page.waitForTimeout(1000);
    }
  }

  async selectMissionsAndDone(count: number): Promise<boolean> {
    // Try selecting missions and clicking Done.
    // Returns true if activation succeeded, false if enrollment error or not enough missions.
    const maxAttempts = 4;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await this.page.waitForTimeout(2000);

      // On first attempt, try clicking "View More Missions" to expand the full list
      if (attempt === 0) {
        const viewMore = this.page.getByText('View More Missions');
        if (await viewMore.isVisible().catch(() => false)) {
          await viewMore.click();
          await this.page.waitForTimeout(2000);
        }
      }

      // Select missions from the currently visible cards
      const cards = await this.getVisibleMissionCardCenters();
      console.log(`[selectMissionsAndDone] Attempt ${attempt}: found ${cards.length} cards`);
      if (cards.length < count) {
        // Scroll down and try once more to find cards
        await this.page.mouse.wheel(0, 400);
        await this.page.waitForTimeout(1000);
        const retryCards = await this.getVisibleMissionCardCenters();
        console.log(`[selectMissionsAndDone] After scroll: found ${retryCards.length} cards`);
        if (retryCards.length < count) {
          return false; // Not enough missions available in this category
        }
        // Use the retry results
        const toClick = Math.min(count, retryCards.length);
        for (let i = 0; i < toClick; i++) {
          await this.page.mouse.click(retryCards[i].x, retryCards[i].y);
          await this.page.waitForTimeout(800);
        }
      } else {
        const toClick = Math.min(count, cards.length);
        for (let i = 0; i < toClick; i++) {
          await this.page.mouse.click(cards[i].x, cards[i].y);
          await this.page.waitForTimeout(800);
        }
      }

      // Click Done
      await this.clickDone();
      await this.page.waitForTimeout(3000);

      // Check for enrollment error
      const errorVisible = await this.page.getByText('Unable to enroll').isVisible().catch(() => false);
      if (!errorVisible) {
        // Navigate back to home and check if focus area was set up
        await this.page.goto('/home');
        await this.page.waitForTimeout(3000);
        if (await this.isFocusAreaSet()) {
          return true; // Success
        }
        return false;
      }

      // Unselect the current missions (click them again to toggle off)
      const currentCards = await this.getVisibleMissionCardCenters();
      for (let i = 0; i < Math.min(count, currentCards.length); i++) {
        await this.page.mouse.click(currentCards[i].x, currentCards[i].y);
        await this.page.waitForTimeout(500);
      }

      // Scroll down to reveal new mission cards for the next attempt
      await this.page.mouse.wheel(0, 500);
      await this.page.waitForTimeout(1000);
    }

    return false; // All attempts failed
  }

  async isEnrollmentErrorVisible(): Promise<boolean> {
    return this.page.getByText('Unable to enroll').isVisible().catch(() => false);
  }

  async clickDone() {
    // SPA keeps home page DOM alive — multiple "Done" texts may exist.
    // Find and click the one that is truly visible and interactable.
    const allDone = this.page.getByText('Done', { exact: true });
    const count = await allDone.count();
    for (let i = 0; i < count; i++) {
      const btn = allDone.nth(i);
      if (await btn.isVisible()) {
        await btn.click();
        return;
      }
    }
    // Fallback: click the last one (most recently rendered in SPA)
    await allDone.last().click();
  }

  async clickGetStarted() {
    const btn = this.page.getByText('Get Started', { exact: true });
    await btn.waitFor({ state: 'visible', timeout: 10_000 });
    await btn.click();
  }

  async openFocusArea3DotMenu() {
    await this.focusArea3DotMenu().scrollIntoViewIfNeeded();
    await this.focusArea3DotMenu().click();
  }

  async clickQuitOption() {
    await this.quitFocusAreaOption().click();
  }

  async confirmQuit() {
    await this.quitConfirmBtn().click();
  }

  async quitFocusArea() {
    await this.openFocusArea3DotMenu();
    await this.clickQuitOption();
    await this.confirmQuit();
    await this.page.waitForTimeout(2000);
  }

  async quitAllMissions() {
    // Navigate to /your-focus-area to see all active missions
    await this.page.goto('/your-focus-area');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);

    // Quit via the 3-dot menu on the focus area page if available
    const dots = this.page.locator('[data-testid="test:id/web-your-focus-area-quit-challenge-dots"]');
    if (await dots.isVisible().catch(() => false)) {
      await dots.click();
      await this.page.waitForTimeout(1000);

      const quitOption = this.page.locator('[data-testid="test:id/web-your-focus-area-quit-challenge"]');
      if (await quitOption.isVisible().catch(() => false)) {
        await quitOption.click();
        await this.page.waitForTimeout(2000);

        // Confirm quit dialog if it appears
        const quitBtn = this.page.locator('[data-testid="Quit "]');
        if (await quitBtn.isVisible().catch(() => false)) {
          await quitBtn.click();
          await this.page.waitForTimeout(3000);
        }
      }
    }

    // Now quit individual missions one by one from the mission detail page
    const maxMissions = 25;
    for (let i = 0; i < maxMissions; i++) {
      await this.page.goto('/your-focus-area');
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);

      // Check if any missions remain
      const navArrows = this.page.locator('[data-testid*="home-mission__navigate"]');
      const count = await navArrows.count();
      if (count === 0) break; // No more missions

      // Click the first mission's navigate arrow
      await navArrows.first().click();
      await this.page.waitForTimeout(2000);

      // Click the 3-dot menu on the mission detail page
      // Look for any dots/menu near the top right of the page
      const allDots = this.page.locator('[data-testid*="dots"]');
      const dotsCount = await allDots.count();

      let dotClicked = false;
      for (let d = 0; d < dotsCount; d++) {
        const dot = allDots.nth(d);
        if (await dot.isVisible()) {
          const testId = await dot.getAttribute('data-testid') || '';
          // Skip the focus area page dots (they're from the SPA background)
          if (testId.includes('focus-area')) continue;
          await dot.click();
          dotClicked = true;
          await this.page.waitForTimeout(1000);
          break;
        }
      }

      if (!dotClicked) {
        // Try clicking the "..." text directly
        const ellipsis = this.page.getByText('...');
        if (await ellipsis.first().isVisible().catch(() => false)) {
          await ellipsis.first().click();
          dotClicked = true;
          await this.page.waitForTimeout(1000);
        }
      }

      if (!dotClicked) break; // Can't find menu, stop trying

      // Look for quit/leave option in the menu
      const quitMission = this.page.getByText('Quit', { exact: false }).or(
        this.page.getByText('Leave', { exact: false })
      );
      if (await quitMission.first().isVisible().catch(() => false)) {
        await quitMission.first().click();
        await this.page.waitForTimeout(2000);

        // Confirm dialog if present
        const confirmBtn = this.page.getByText('Quit', { exact: true }).or(
          this.page.getByText('Yes', { exact: true })
        ).or(this.page.getByText('Confirm', { exact: true }));
        if (await confirmBtn.first().isVisible().catch(() => false)) {
          await confirmBtn.first().click();
          await this.page.waitForTimeout(2000);
        }
      } else {
        break; // No quit option found, stop trying
      }
    }
  }

  // ─── Focus Area assertions ────────────────────────────────

  async expectFocusAreaCardVisible() {
    await this.focusAreaWrapper().scrollIntoViewIfNeeded();
    await expect(this.focusAreaContent()).toBeVisible();
    await expect(this.focusAreaName()).toBeVisible();
    await expect(this.focusAreaLevel()).toBeVisible();
    await expect(this.focusAreaActivitiesCount()).toBeVisible();
    await expect(this.focusAreaOngoingCount()).toBeVisible();
    await expect(this.focusAreaCompletedCount()).toBeVisible();
  }

  async expectSetUpFocusAreaBtnVisible() {
    await this.focusAreaTitle().scrollIntoViewIfNeeded();
    await expect(this.setupFocusAreaBtn()).toBeVisible();
  }

  async expectSetUpFocusAreaBtnNotVisible() {
    await expect(this.setupFocusAreaBtn()).not.toBeVisible();
  }

  async expectQuitConfirmDialogVisible() {
    await expect(this.quitDialogTitle()).toBeVisible();
    await expect(this.quitConfirmBtn()).toBeVisible();
    await expect(this.quitCloseBtn()).toBeVisible();
  }

  async expectMissionSelectionPromptVisible() {
    await expect(
      this.page.getByText(/select at least 3 missions/i),
    ).toBeVisible();
  }
}
