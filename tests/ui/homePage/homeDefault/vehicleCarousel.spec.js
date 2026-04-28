// tests/ui/homePage/homeDefault/vehicles-filter.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(60000);

test('Vehicles Filter Flow', async ({ page }) => {
  // Setup
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
  
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 3000 });
  } catch {}
  
  await page.waitForTimeout(1000);
  
  // Electrified
  await page.getByRole('tab', { name: 'Electrified (12)' }).click();
  await page.getByRole('link', { name: 'placeholder 2026 IONIQ 9 ⁠' }).click();
  await page.getByRole('heading', { name: 'IONIQ 9', exact: true }).locator('font').click();
  await page.getByRole('paragraph').filter({ hasText: /^2026$/ }).click();
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  
  // SUVs
  await page.getByText('Electrified (12) SUVs (15)').click();
  await page.getByRole('link', { name: 'placeholder 2026 IONIQ 9 ⁠' }).click();
  await page.getByRole('heading', { name: 'IONIQ 9', exact: true }).locator('font').click();
  await page.getByText('0% APR for 72 months + $3,000').click();
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  
  // Sedans
  await page.getByRole('button', { name: 'Sedans (6)' }).click();
  await page.getByRole('link', { name: 'placeholder 2026 ELANTRA ⁠' }).click();
  await page.getByRole('heading', { name: 'ELANTRA', exact: true }).click();
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  
  // Performance
  await page.getByRole('button', { name: 'Performance (2)' }).click();
  await page.getByRole('link', { name: 'placeholder 2026 ELANTRA N ⁠' }).click();
  await page.getByRole('paragraph').filter({ hasText: /^2026$/ }).click();
  await page.getByRole('heading', { name: 'ELANTRA N', exact: true }).click();
  
  console.log('✅ All vehicles filter tests passed!');
});