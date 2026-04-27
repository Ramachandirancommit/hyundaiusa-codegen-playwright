const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Shopping Tools - Search Inventory Tests', () => {

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

  test('Search Inventory Navigation', async () => {

    console.log('\n🔍 Starting Search Inventory Navigation test...');

    console.log('  → Clicking Search Inventory link');
    await page.getByRole('link', { name: 'Search Inventory' }).first().click();
    
    console.log('  → Verifying Search Inventory heading');
    await expect(page.getByRole('heading', { name: 'Search Inventory' }).first()).toBeVisible({ timeout: 10000 });
    
    console.log('  → Clicking dealership only toggle');
    await page.locator('.bsi-filters-toggle-dealership-only-btn').click();
    
    console.log('  → Clicking Collapse all button');
    await page.getByRole('button', { name: 'Collapse all' }).click();
    
    console.log('  → Clicking Year button');
    await page.getByRole('button', { name: 'Year' }).click();

    
    console.log('✅ Search Inventory Navigation test passed\n');
  });

});