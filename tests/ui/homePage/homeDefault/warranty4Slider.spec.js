// tests/ui/homePage/homeDefault/experience-hyundai.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(60000);

test('Experience Hyundai - Warranty, Benefits, Awards, Online Buying', async ({ page }) => {
  // Setup page with ZIP and cookies
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
  
  // Handle Close button if exists
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 3000 });
  } catch {
    // Close button not present, continue
  }
  
  await page.waitForTimeout(1000);
  
  // Navigate to Experience Hyundai section
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  await page.getByText('Got questions? Our Hyundai').click();
  await page.getByText('Watch Hyundai Showroom Live').click();
  await page.locator('div:nth-child(9) > .ts-v2-top-banner > .ts-v2-top-image.ts-v2-breakpoint-1024 > img').click();
  await page.getByRole('heading', { name: 'Virtual showroom. Real-time' }).click();
  console.log('✅ Navigated to Showroom');
  
  // Return to home
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  await page.waitForTimeout(1000);
  
  // Experience Hyundai section
  await page.getByRole('heading', { name: 'Experience the Hyundai' }).click();
  await page.waitForTimeout(1000);
  
  // Slide 1: America's Best Warranty
  await page.getByText('of 4').first().click();
  await page.getByRole('heading', { name: 'America’s Best Warranty' }).click();
  await page.getByText('Confidence comes with a full').click();
  console.log('✅ Slide 1 - America\'s Best Warranty verified');
  
  // Slide 2: Hyundai Complimentary
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByText('of 4').click();
  await page.getByRole('heading', { name: 'Hyundai Complimentary' }).click();
  await page.getByText('Caring for your new Hyundai').click();
  console.log('✅ Slide 2 - Hyundai Complimentary verified');
  
  // Slide 3: Award Winning
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByText('of 4').click();
  await page.getByRole('heading', { name: 'Award Winning' }).click();
  await page.getByText('Hyundai cars and SUVs are').click();
  console.log('✅ Slide 3 - Award Winning verified');
  
  // Slide 4: Click to Buy
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByText('of 4').click();
  await page.getByRole('heading', { name: 'Click to Buy⁠' }).click();
  await page.getByText('Shop completely online and').click();
  console.log('✅ Slide 4 - Click to Buy verified');
  
  console.log('✅ Experience Hyundai test passed!');
});