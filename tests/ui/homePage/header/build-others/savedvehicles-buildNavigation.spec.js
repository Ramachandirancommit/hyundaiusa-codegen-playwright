const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Shopping Tools - Saved vehicles build Tests', () => {

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

  test('Saved Vehicles - Global Saved workflow', async () => {

    console.log('\n📋 Starting Saved Vehicles - Global Saved workflow test...');

    console.log('  → Clicking Global Saved button');
    await page.getByRole('button', { name: 'Global Saved' }).click();
    await page.waitForTimeout(1000);
    
    console.log('  → Clicking New inventory tab');
    await page.getByRole('tab', { name: 'New inventory' }).click();
    await page.waitForTimeout(500);
    
    console.log('  → Clicking text area');
    await page.getByText('Builds New inventory Certified used 1-3 of 0 saves Are you sure you want to').click();
    await page.waitForTimeout(500);
    
    console.log('  → Clicking Certified used tab');
    await page.getByRole('tab', { name: 'Certified used' }).click();
    await page.waitForTimeout(500);
    
    console.log('  → Clicking Builds tab');
    await page.getByRole('tab', { name: 'Builds' }).click();
    await page.waitForTimeout(500);
    
    console.log('  → Clicking Start a build link');
    await page.getByRole('link', { name: 'Start a build' }).click();
    await page.waitForTimeout(500);
    
    console.log('  → Checking PALISADE checkbox');
    await page.getByRole('checkbox', { name: 'PALISADE', exact: true }).check();
    await page.waitForTimeout(500);
    
    console.log('  → Navigating to build page');
    await page.goto('https://www.hyundaiusa.com/us/en/build?modelName=J001');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('  → Clicking Build link');
    await page.getByRole('link', { name: 'Build', exact: true }).click();
    await page.waitForTimeout(1000);
    
    console.log('  → Clicking heart anchor');
    // FIX: Use .first() to handle multiple matching elements
    await page.locator('#bv-360-top-nav-heart-anchor-disabled').first().click();
    await page.waitForTimeout(1000);
    
    console.log('  → Clicking PALISADE SE');
    await page.locator('#bv-landing').getByText('PALISADE SE').click();
    await page.waitForTimeout(1000);
    
    console.log('  → Clicking Global Saved button again');
    await page.getByRole('button', { name: 'Global Saved' }).click();
    await page.waitForTimeout(1000);
    
    console.log('  → Clicking PALISADE from saved items');
    await page.getByLabel('/ 1').getByText('PALISADE', { exact: true }).click();
    await page.waitForTimeout(1000);
    
    console.log('  → Clicking Clear all button');
    await page.getByRole('button', { name: 'Clear all' }).click();
    await page.waitForTimeout(500);
    
    console.log('  → Clicking Confirm button');
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(500);
    
    console.log('✅ Saved Vehicles - Global Saved workflow test passed\n');
  });

});