// const { test, expect } = require('@playwright/test');
// const { pageSetup } = require('../../../../helpers/setup');

// test('test', async ({ page }) => {
//   // Use the helper for initial setup (navigation, ZIP, cookies)
//   await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
  
//   // Now continue with the banner verification flow
//   // NOTE: The 'Close' button might not be needed after pageSetup
//   // Try commenting it out or making it optional
  
//   // Option 1: Skip the Close button if it doesn't exist
//   try {
//     await page.getByRole('button', { name: 'Close' }).click({ timeout: 3000 });
//   } catch {
//     console.log('Test completed.');
//   }
  
//   await page.getByRole('button', { name: 'Go to slide' }).first().click();
//   await page.getByRole('heading', { name: 'Make every day feel epic. The' }).click();
//   await page.getByText('Winner of the 2026 North American Utility Vehicleof the Year™ award.').click();
//   await page.getByRole('button', { name: 'Go to slide' }).first().click();
//   await page.getByLabel('1 / 4').getByRole('link', { name: 'Learn more' }).click();
//   await page.getByRole('heading', { name: 'PALISADE Hybrid', exact: true }).click();
// });

// tests/ui/homePage/homeDefault/banner.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

// Increase timeout for all tests
test.setTimeout(60000);

// Test 1: First Banner - PALISADE Hybrid
test('Banner 1 - PALISADE Hybrid', async ({ page }) => {
  // Setup page with ZIP and cookies
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
  
  // Handle Close button if exists
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 3000 });
  } catch {
    // Close button not present, continue
  }
  
  // Banner 1 verification flow
  await page.getByRole('button', { name: 'Go to slide' }).first().click();
  await page.getByRole('heading', { name: 'Make every day feel epic. The' }).click();
  await page.getByText('Winner of the 2026 North American Utility Vehicle of the Year™ award.').click();
  await page.getByRole('button', { name: 'Go to slide' }).first().click();
  await page.getByLabel('1 / 4').getByRole('link', { name: 'Learn more' }).click();
  
  // Assert final page
  await expect(page.getByRole('heading', { name: 'PALISADE Hybrid', exact: true })).toBeVisible();
  console.log('✅ Banner 1 test passed');
});

// Test 2: Second Banner - IONIQ 6 N
test('Banner 2 - IONIQ 6 N', async ({ page }) => {
  // Setup page with ZIP and cookies
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
  
  // Handle Close button if exists
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 3000 });
  } catch {
    // Close button not present, continue
  }
  
  // Banner 2 verification flow
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  await page.getByRole('button', { name: 'Go to slide' }).nth(1).click();
  await page.getByRole('heading', { name: 'Not all trophies are won on' }).click();
  await page.getByText('The 2027 IONIQ 6 N was').click();
  await page.getByLabel('2 / 4').getByRole('link', { name: 'Learn more' }).click();
  
  // Assert that navigation worked
  await expect(page).not.toHaveURL('https://www.hyundaiusa.com/us/en');
  console.log('✅ Banner 2 test passed');
});

// Test 3: Third Banner - Special Offers
test('Banner 3 - Special Offers', async ({ page }) => {
  // Setup page with ZIP and cookies
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
  
  // Handle Close button if exists
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 3000 });
  } catch {
    // Close button not present, continue
  }
  
  // Banner 3 verification flow
  await page.getByRole('button', { name: 'Go to slide' }).nth(2).click();
  await page.locator('.hero-image-title').click();
  await page.getByText('For well-qualified buyers only.').click();
  await page.getByRole('link', { name: 'See offers - about' }).click();
  
  // Assert offers page is loaded
  await expect(page).toHaveURL(/.*offers.*/i);
  console.log('✅ Banner 3 test passed');
});

// Test 4: Fourth Banner - EV Lineup
test('Banner 4 - EV Lineup', async ({ page }) => {
  // Setup page with ZIP and cookies
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
  
  // Handle Close button if exists
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 3000 });
  } catch {
    // Close button not present, continue
  }
  
  // Banner 4 verification flow
  await page.getByRole('button', { name: 'Go to slide' }).nth(3).click();
  await page.getByText('Love at first charge.').click();
  await page.getByText('Our most electric EV lineup.').click();
  await page.getByLabel('4 / 4').getByRole('link', { name: 'Learn more' }).click();
  
  // Assert EV page is loaded
  await expect(page).toHaveURL(/.*electric.*/i);
  console.log('✅ Banner 4 test passed');
});