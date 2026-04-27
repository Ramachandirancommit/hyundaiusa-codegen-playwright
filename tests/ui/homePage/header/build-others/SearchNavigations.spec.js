const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Shopping Tools - Global Search Tests', () => {

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
    console.log('✓ Setup complete - ready for tests\n');
  });

  test.afterAll(async () => {
    await page.close();
    console.log('✓ Browser closed');
  });

  test('Global Search Features Navigation', async () => {

    console.log('\n🔍 Starting Global Search Features Navigation test...');

    console.log('  → Navigating to home page');
    await page.goto('https://www.hyundaiusa.com/us/en');
    
    console.log('  → Opening Global Search');
    await page.getByRole('button', { name: 'Global Search' }).click();
    
    console.log('  → Searching for "lease"');
    await page.getByRole('searchbox', { name: 'Search Hyundai vehicles,' }).click();
    await page.getByRole('searchbox', { name: 'Search Hyundai vehicles,' }).fill('lease');
    
    console.log('  → Clicking Special Finance Offers link');
    await page.getByRole('link', { name: 'Special Finance Offers |' }).first().click();
    
    console.log('  → Verifying Featured Offers');
    await page.getByText('Featured Offers').click();
    
    console.log('  → Clicking search bar');
    await page.locator('.g-sr-search-bar').click();
    
    console.log('  → Verifying Featured Offers again');
    await page.getByText('Featured Offers').click();
    
    console.log('  → Opening Global Search');
    await page.getByRole('button', { name: 'Global Search' }).click();
    
    console.log('  → Searching for "bluelink"');
    await page.getByRole('searchbox', { name: 'Search Hyundai vehicles,' }).click();
    await page.getByRole('searchbox', { name: 'Search Hyundai vehicles,' }).fill('bluelink');
    
    console.log('  → Clicking Bluelink+ link');
    await page.getByRole('link', { name: 'Bluelink+ | Vehicle' }).click();
    
    console.log('  → Verifying 50 results');
    await page.getByText('50', { exact: true }).click();
    
    console.log('  → Verifying results for Bluelink');
    await page.getByText('results for Bluelink |').click();
    
    console.log('  → Clicking Blue Link Service Subscriber link');
    await page.getByRole('link', { name: 'Blue Link Service Subscriber' }).click();
    
    console.log('  → Verifying Privacy Notice');
    await expect(page.getByText('Hyundai Motor America Privacy Notice', { exact: true })).toBeVisible();
    
    console.log('✅ Global Search Features Navigation test passed\n');
  });

});