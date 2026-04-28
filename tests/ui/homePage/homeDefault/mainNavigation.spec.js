// tests/ui/homePage/homeDefault/navigation.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

// Increase timeout for all tests
test.setTimeout(900000);

test('Navigation Menu - Build & Price, Inventory, Quote, Savings', async ({ page }) => {
  // Setup page with ZIP and cookies
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
  
  // Handle Close button if exists
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 3000 });
  } catch {
    // Close button not present, continue
  }
  
  // Test 1: Click Hyundai Logo (go to home)
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  await page.waitForTimeout(6000);
  
  // Test 2: Click Build & Price
  await page.getByRole('link', { name: 'Build & Price ⁠ Configure ⁠' }).click();
  await page.waitForTimeout(6000);
  
  // Verify Build page loaded
  await expect(page.getByRole('heading', { name: 'Build and Search Inventory' })).toBeVisible();
  console.log('✅ Build & Price page verified');
  
  // Go back to home via logo
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  await page.waitForTimeout(6000);
  
  // Test 3: Click Inventory
  await page.getByRole('link', { name: 'Hyundai inventory ⁠ Check' }).click();
  await page.waitForTimeout(6000);
  
  // Verify Inventory page loaded
  await expect(page.getByRole('heading', { name: 'Search Inventory' })).toBeVisible();
  console.log('✅ Inventory page verified');
  
  // Go back to home via logo
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  await page.waitForTimeout(6000);
  
  // Test 4: Click Price Quote
  await page.getByRole('link', { name: 'Price quote ⁠ Get your price ⁠' }).click();
  await page.waitForTimeout(6000);
  
  // Verify Quote page loaded
  await expect(page.getByRole('heading', { name: 'Request a Quote' })).toBeVisible();
  console.log('✅ Price Quote page verified');
  
  // Go back to home via logo
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  await page.waitForTimeout(6000);
  
  // Test 5: Click Local Savings/Offers
  await page.getByRole('link', { name: 'Local savings ⁠ See offers ⁠' }).click();
  await page.waitForTimeout(6000);
  
  // Verify Offers page loaded
  await expect(page.getByText('Hyundai Deals and Special')).toBeVisible();
  console.log('✅ Local Savings page verified');
  
  // Test 6: Click Special Programs
  await page.getByRole('link', { name: 'Special Programs' }).click();
  await page.waitForTimeout(6000);
  
  // Verify Special Programs page loaded
  await expect(page.getByRole('heading', { name: 'Special Programs' })).toBeVisible();
  console.log('✅ Special Programs page verified');
  
  console.log('✅ All navigation tests passed!');
});