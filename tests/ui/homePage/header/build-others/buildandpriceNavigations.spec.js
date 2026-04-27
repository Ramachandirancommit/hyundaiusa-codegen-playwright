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

  test('Build & Price Navigation', async () => {

    console.log('\n🛠️ Starting Build & Price Navigation test...');

    console.log('  → Clicking Build & Price link');
    await page.getByRole('link', { name: 'Build & Price' }).first().click();
    
    console.log('  → Verifying Build and Search Inventory heading');
    await expect(page.getByRole('heading', { name: 'Build and Search Inventory' }).first()).toBeVisible({ timeout: 10000 });
    
    console.log('  → Clicking Model Results paragraph');
    await page.getByRole('paragraph').filter({ hasText: 'Model Results' }).click();
    
    console.log('  → Clicking Collapse all button');
    await page.getByRole('button', { name: 'Collapse all' }).click();
    
    console.log('  → Clicking Year button');
    await page.getByRole('button', { name: 'Year', exact: true }).click();
    
    console.log('✅ Build & Price Navigation test passed\n');
  });

});