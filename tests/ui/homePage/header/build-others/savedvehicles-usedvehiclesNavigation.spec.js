const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Shopping Tools - Saved Vehicles Tests', () => {

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

  test('Saved Vehicles - Global Saved Certified workflow', async () => {

    console.log('\n📋 Starting Saved Vehicles - Global Saved Certified workflow test...');

    console.log('  → Clicking Global Saved button');
    await page.getByRole('button', { name: 'Global Saved' }).click();
    
    console.log('  → Clicking Certified used tab');
    await page.getByRole('tab', { name: 'Certified used' }).click();
    
    console.log('  → Clicking Search certified used link');
    await page.getByRole('link', { name: 'Search certified used', exact: true }).click();
    
    console.log('  → Waiting for popup window');
    const page2Promise = page.waitForEvent('popup');
    
    console.log('  → Clicking Search Certified Inventory link');
    await page.getByRole('link', { name: 'Search Certified Inventory', exact: true }).click();
    const page2 = await page2Promise;
    
    console.log('  → Saving vehicle 2020 Elantra Gt');
    await page2.getByRole('checkbox', { name: 'save vehicle 2020 Elantra Gt' }).click();
    
    console.log('  → Clicking on 2020 Elantra Gt text');
    await page2.getByText('2020 Elantra Gt', { exact: true }).click();
    
    console.log('  → Clicking Global Saved button on popup');
    await page2.getByRole('button', { name: 'Global Saved' }).click();
    
    console.log('  → Clicking Certified used tab on popup');
    await page2.getByRole('tab', { name: 'Certified used' }).click();
    
    console.log('  → Clicking Elantra Gt from saved items');
    await page2.getByLabel('/ 1').getByText('Elantra Gt').click();
    
    console.log('  → Clicking Clear all button');
    await page2.getByRole('button', { name: 'Clear all' }).click();
    
    console.log('  → Clicking Confirm button');
    await page2.getByRole('button', { name: 'Confirm' }).click();
    
    console.log('✅ Saved Vehicles - Global Saved Certified workflow test passed\n');
  });

});