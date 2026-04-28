// tests/ui/homePage/homeDefault/hyundai-showroom-live.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(60000);

test('Hyundai Showroom Live Flow', async ({ page }) => {
  // Setup
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
  
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 3000 });
  } catch {}
  
  await page.waitForTimeout(1000);
  
  // Navigate to Showroom Live
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  await page.getByText('Got questions? Our Hyundai').click();
  await page.getByText('Watch Hyundai Showroom Live').click();
  await page.locator('div:nth-child(9) > .ts-v2-top-banner > .ts-v2-top-image.ts-v2-breakpoint-1024 > img').click();
  
  // Verify
  await expect(page.getByRole('heading', { name: 'Virtual showroom. Real-time' })).toBeVisible();
  
  console.log('✅ Hyundai Showroom Live test passed!');
});