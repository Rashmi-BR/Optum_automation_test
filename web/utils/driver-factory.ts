import type { Page } from '@playwright/test';
import { PlaywrightAdapter } from '@capillary/optum-testing-ui-library';

/**
 * Creates a PlaywrightAdapter wrapping the given Playwright Page.
 * Use this in test files to instantiate platform-agnostic page objects.
 */
export function createDriver(page: Page): PlaywrightAdapter {
    return new PlaywrightAdapter(page);
}
