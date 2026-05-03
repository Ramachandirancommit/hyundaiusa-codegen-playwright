const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Shopping Tools - Build & Price Tests', () => {

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

  test('Build & Price - Navigation workflow', async () => {

    console.log('\n📋 Starting Build & Price - Navigation workflow test...');

    console.log('  → Clicking Build & Price link');
    // Use .first() to click the first matching element
    await page.getByRole('link', { name: 'Build & Price' }).first().click();
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
    
    console.log('  → Clicking Build and Search Inventory div');
    // Click the div with class 'bsi-filters-main-title'
    await page.locator('.bsi-filters-main-title').click();
    await page.waitForTimeout(1500);
    
    console.log('  → Clicking paragraph with Model Results text');
    await page.getByRole('paragraph').filter({ hasText: 'Model Results' }).click();
    await page.waitForTimeout(1500);
    
    console.log('  → Clicking PALISADE heading');
    await page.getByRole('heading', { name: 'PALISADE', exact: true }).click();
    await page.waitForTimeout(1500);
    
    console.log('  → Clicking first instance of utility vehicle text');
    await page.getByText('North American Utility Vehicle of the Year™ .icon-info-medium .path-stroke {').first().click();
    await page.waitForTimeout(1500);
    
    console.log('✅ Build & Price - Navigation workflow test passed\n');
  });

});