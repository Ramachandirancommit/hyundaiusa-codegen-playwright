// tests/ui/homePage/homeDefault/vehicle-categories.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(60000);

test('Vehicle Categories - IONIQ 5, SONATA, Hyundai Pay', async ({ page }) => {
  // Setup page with ZIP and cookies
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
  
  // Handle Close button if exists
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 3000 });
  } catch {
    // Close button not present, continue
  }
  
  await page.waitForTimeout(1000);
  
  // Click on first category image
  await page.locator('.ts-bg-image-container').first().click();
  await page.waitForTimeout(1000);
  
  // Click on center category
  await page.locator('.ts-inner-container-center > .ts-bg-image-container').click();
  await page.waitForTimeout(1000);
  
  // Click on right category
  await page.locator('.ts-inner-container-right > .ts-bg-image-container').click();
  await page.waitForTimeout(1000);
  
  // Verify IONIQ 5 section
  await page.getByRole('heading', { name: 'IONIQ 5' }).click();
  await expect(page.getByText('Go the distance with an EPA-')).toBeVisible();
  console.log('✅ IONIQ 5 section verified');
  
  // Verify SONATA section
  await page.getByRole('heading', { name: 'SONATA' }).click();
  await expect(page.getByText('Cutting-edge tech and')).toBeVisible();
  console.log('✅ SONATA section verified');
  
  // Verify Hyundai Pay section
  await page.getByRole('heading', { name: 'Hyundai Pay' }).click();
  await expect(page.getByText('Introducing a quick and easy')).toBeVisible();
  console.log('✅ Hyundai Pay section verified');
  
  console.log('✅ All vehicle categories test passed!');
});