import { test } from '@playwright/test';

test('capture API headers', async ({ page }) => {
  const capturedHeaders: Record<string, string>[] = [];
  const capturedUrls: string[] = [];

  page.on('request', (req) => {
    if (req.url().includes('api.rallyengage.com') && req.url().includes('/b2c/')) {
      capturedUrls.push(req.url());
      capturedHeaders.push(req.headers());
    }
  });

  await page.goto('/home');
  await page.waitForTimeout(5000);

  if (capturedHeaders.length > 0) {
    console.log(`\n=== Captured ${capturedUrls.length} API requests ===`);
    console.log(`URL: ${capturedUrls[0]}`);
    const headers = capturedHeaders[0];
    for (const [key, value] of Object.entries(headers)) {
      const display = value.length > 120 ? value.substring(0, 120) + '...' : value;
      console.log(`${key}: ${display}`);
    }
  } else {
    console.log('No API requests captured');
  }
});
