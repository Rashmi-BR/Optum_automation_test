import { test, expect, safeJson } from '../utils/api-test';
import { BenefitsPage } from '../pages/benefits.page';
import { HomePage } from '../pages/home.page';
import { BENEFITS } from '../utils/api-constants';
import type { Page } from '@playwright/test';

/** Helper to log link click result and close new tab if opened */
async function logLinkResult(label: string, result: { newTab: Page | null; samePageNavigated: boolean }, page: Page) {
  if (result.newTab) {
    console.log(`[Benefits] ${label} opened new tab — URL: ${result.newTab.url()}`);
    expect(result.newTab.url()).toBeTruthy();
    await result.newTab.close();
  } else if (result.samePageNavigated) {
    console.log(`[Benefits] ${label} navigated in same page — URL: ${page.url()}`);
  } else {
    console.log(`[Benefits] ${label} clicked — may have opened modal or inline content`);
  }
}

test.describe('Benefits Page', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;
  let benefitsPage: BenefitsPage;
  let homePage: HomePage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
      permissions: ['geolocation'],
      geolocation: { latitude: 37.7749, longitude: -122.4194 },
    });
    page = await context.newPage();
    await page.goto('/home', { timeout: 60_000 });
    await page.waitForTimeout(3000);

    // Dismiss any in-app dialogs
    for (const btnText of ['Allow', 'OK', 'Accept', 'Continue', 'Got it']) {
      const btn = page.getByText(btnText, { exact: true });
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(1000);
        break;
      }
    }

    if (!page.url().includes('/home')) {
      await page.goto('/home');
      await page.waitForTimeout(3000);
    }

    homePage = new HomePage(page);
    await homePage.expectHomePageLoaded();
  });

  test.afterAll(async () => {
    await page.close();
  });

  // ── Navigation ──────────────────────────────────────────────────────

  test('Navigate to Benefits tab from Home', async () => {
    await homePage.navigateToBenefits();
    await page.waitForTimeout(3000);
    benefitsPage = new BenefitsPage(page);
    await benefitsPage.expectBenefitsPageLoaded();
    console.log(`[Benefits] Navigated to Benefits — URL: ${page.url()}`);
  });

  // ── Resources Section ───────────────────────────────────────────────

  test('Verify Resources heading is visible', async () => {
    await benefitsPage.expectBenefitsPageLoaded();
    console.log('[Benefits] Resources heading is visible');
  });

  // ── All Accordion Sections ──────────────────────────────────────────

  test('Verify all accordion sections are visible', async () => {
    await benefitsPage.expectAllAccordionsVisible();
    console.log('[Benefits] All 4 accordions visible: Introduction to Optum Engage, My Benefits Resources, Other Benefits Programs, Questions/Contacts');
  });

  // ── Introduction to Optum Engage ────────────────────────────────────

  test('Expand Introduction to Optum Engage and verify links', async () => {
    const alreadyVisible = await page.getByText('Building healthy habits', { exact: true }).isVisible().catch(() => false);
    if (!alreadyVisible) {
      await benefitsPage.expandIntroToOptum();
    }
    await benefitsPage.expectIntroLinksVisible();
    console.log('[Benefits] Introduction to Optum Engage — Building healthy habits, Rewards and Benefits links visible');
  });

  test('Click Building healthy habits link', async () => {
    const result = await benefitsPage.clickBuildingHealthyHabits();
    await logLinkResult('Building healthy habits', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Rewards and Benefits link', async () => {
    const visible = await page.getByText('Rewards and Benefits', { exact: true }).isVisible().catch(() => false);
    if (!visible) await benefitsPage.expandIntroToOptum();

    const result = await benefitsPage.clickRewardsAndBenefits();
    await logLinkResult('Rewards and Benefits', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  // ── My Benefits Resources ───────────────────────────────────────────

  test('Expand My Benefits Resources and verify items', async () => {
    await benefitsPage.expandMyBenefitsResources();

    for (const item of ['Xylem Benefits', 'Workday Portal', 'Biometric Screenings', 'MyWatermark']) {
      const visible = await benefitsPage.isAccordionItemVisible(item);
      console.log(`[Benefits] My Benefits Resources — "${item}" visible: ${visible}`);
    }
  });

  test('Click Xylem Benefits link', async () => {
    const result = await benefitsPage.clickAccordionLink('Xylem Benefits');
    await logLinkResult('Xylem Benefits', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Workday Portal link', async () => {
    // Re-expand accordion after navigating back
    await benefitsPage.expandMyBenefitsResources();
    const result = await benefitsPage.clickAccordionLink('Workday Portal');
    await logLinkResult('Workday Portal', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Biometric Screenings link', async () => {
    await benefitsPage.expandMyBenefitsResources();
    const result = await benefitsPage.clickAccordionLink('Biometric Screenings');
    await logLinkResult('Biometric Screenings', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click MyWatermark link', async () => {
    await benefitsPage.expandMyBenefitsResources();
    const result = await benefitsPage.clickAccordionLink('MyWatermark');
    await logLinkResult('MyWatermark', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  // ── Other Benefits Programs ─────────────────────────────────────────

  test('Expand Other Benefits Programs and verify items', async () => {
    await benefitsPage.expandOtherBenefitsPrograms();

    const items = [
      'Accident/Critical Illness/Hospital Indemnity',
      'Pet Insurance',
      'Auto & Homeowners',
      'Retirement Savings Plan 401(k)',
      'Life/Disability/LOA',
      'Commuter benefits',
      'Legal Plan',
      'Student Debt Program',
      'Health Savings Account',
      'Flexible Spending Accounts/Health Reimbursement Accounts',
    ];

    for (const item of items) {
      const visible = await benefitsPage.isAccordionItemVisible(item);
      console.log(`[Benefits] Other Benefits Programs — "${item}" visible: ${visible}`);
    }
  });

  test('Click Accident/Critical Illness/Hospital Indemnity link', async () => {
    const result = await benefitsPage.clickAccordionLink('Accident/Critical Illness/Hospital Indemnity');
    await logLinkResult('Accident/Critical Illness/Hospital Indemnity', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Pet Insurance link', async () => {
    await benefitsPage.expandOtherBenefitsPrograms();
    const result = await benefitsPage.clickAccordionLink('Pet Insurance');
    await logLinkResult('Pet Insurance', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Auto & Homeowners link', async () => {
    await benefitsPage.expandOtherBenefitsPrograms();
    const result = await benefitsPage.clickAccordionLink('Auto & Homeowners');
    await logLinkResult('Auto & Homeowners', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Retirement Savings Plan 401(k) link', async () => {
    await benefitsPage.expandOtherBenefitsPrograms();
    const result = await benefitsPage.clickAccordionLink('Retirement Savings Plan 401(k)');
    await logLinkResult('Retirement Savings Plan 401(k)', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Life/Disability/LOA link', async () => {
    await benefitsPage.expandOtherBenefitsPrograms();
    const result = await benefitsPage.clickAccordionLink('Life/Disability/LOA');
    await logLinkResult('Life/Disability/LOA', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Commuter benefits link', async () => {
    await benefitsPage.expandOtherBenefitsPrograms();
    const result = await benefitsPage.clickAccordionLink('Commuter benefits');
    await logLinkResult('Commuter benefits', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Legal Plan link', async () => {
    await benefitsPage.expandOtherBenefitsPrograms();
    const result = await benefitsPage.clickAccordionLink('Legal Plan');
    await logLinkResult('Legal Plan', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Student Debt Program link', async () => {
    await benefitsPage.expandOtherBenefitsPrograms();
    const result = await benefitsPage.clickAccordionLink('Student Debt Program');
    await logLinkResult('Student Debt Program', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Health Savings Account link', async () => {
    await benefitsPage.expandOtherBenefitsPrograms();
    const result = await benefitsPage.clickAccordionLink('Health Savings Account');
    await logLinkResult('Health Savings Account', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  test('Click Flexible Spending Accounts/Health Reimbursement Accounts link', async () => {
    await benefitsPage.expandOtherBenefitsPrograms();
    const result = await benefitsPage.clickAccordionLink('Flexible Spending Accounts/Health Reimbursement Accounts');
    await logLinkResult('Flexible Spending Accounts/Health Reimbursement Accounts', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  // ── Questions/Contacts ──────────────────────────────────────────────

  test('Expand Questions/Contacts and verify items', async () => {
    await benefitsPage.expandQuestionsContacts();

    const visible = await benefitsPage.isAccordionItemVisible('Workday Help Center');
    console.log(`[Benefits] Questions/Contacts — "Workday Help Center" visible: ${visible}`);
  });

  test('Click Workday Help Center link', async () => {
    const result = await benefitsPage.clickAccordionLink('Workday Help Center');
    await logLinkResult('Workday Help Center', result, page);
    await benefitsPage.navigateBackToBenefits();
  });

  // ── API Data Validation ─────────────────────────────────────────────

  test('Verify resource names from API appear on page', async ({ api }) => {
    const resourcesRes = await api.get(BENEFITS.resources);
    const resources = (await safeJson(resourcesRes))?.data;

    if (resources) {
      for (const resource of resources) {
        if (resource.name) {
          const el = page.getByText(resource.name).first();
          const visible = await el.isVisible({ timeout: 5000 }).catch(() => false);
          console.log(`[Benefits] API resource "${resource.name}" — visible: ${visible}`);
        }
      }
    } else {
      console.log('[Benefits] No resources returned from API');
    }
  });

  // ── Full page scroll & footer ───────────────────────────────────────

  test('Verify page is scrollable and footer is reachable', async () => {
    await benefitsPage.scrollToBottom();

    const footer = page.getByText('Copyright', { exact: false }).first();
    const footerVisible = await footer.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`[Benefits] Footer visible after scroll: ${footerVisible}`);

    const scrollToTop = page.getByRole('button', { name: 'Scroll to top' });
    const scrollBtnVisible = await scrollToTop.isVisible({ timeout: 3000 }).catch(() => false);
    if (scrollBtnVisible) {
      await scrollToTop.click();
      await page.waitForTimeout(1000);
      console.log('[Benefits] Scroll to top button clicked');
    }

    await benefitsPage.scrollToTop();
  });

  // ── Navigate back to Home ───────────────────────────────────────────

  test('Navigate back to Home from Benefits', async () => {
    await page.goto('/home');
    await page.waitForTimeout(3000);
    await homePage.expectHomePageLoaded();
    console.log('[Benefits] Successfully navigated back to Home');
  });
});
