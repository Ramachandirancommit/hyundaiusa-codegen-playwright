const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Shopping Tools - Saved inventory Tests', () => {

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
    
    console.log('  → Clicking New inventory button');
    await page.getByRole('button', { name: 'New inventory' }).click();
    
    console.log('  → Clicking Search new inventory link');
    await page.getByRole('link', { name: 'Search new inventory' }).click();
    
    console.log('  → Checking ELANTRA 99+ checkbox');
    await page.getByRole('checkbox', { name: 'ELANTRA 99+' }).check();
    
    console.log('  → Navigating to inventory search page');
    await page.goto('https://www.hyundaiusa.com/us/en/inventory-search/vehicles-list?modelName=4001');
    
    console.log('  → Checking SE 99+ checkbox');
    await page.getByRole('checkbox', { name: 'SE 99+' }).check();
    
    console.log('  → Navigating to SE inventory page');
    await page.goto('https://www.hyundaiusa.com/us/en/inventory-search/vehicles-list?modelName=4001_SE');
    
    console.log('  → Saving vehicle to saved items');
    await page.locator('#bsi-save-button-heart-disabled-KMHLL4DG1TU152414').click();
    
    console.log('  → Clicking Global Saved button');
    await page.getByRole('button', { name: 'Global Saved' }).click();
    
    console.log('  → Clicking New inventory tab');
    await page.getByRole('tab', { name: 'New inventory' }).click();
    
    console.log('  → Clicking ELANTRA from saved items');
    await page.getByLabel('/ 1').getByText('ELANTRA', { exact: true }).click();
    
    console.log('  → Clicking Clear all button');
    await page.locator('#saved').getByRole('button', { name: 'Clear all' }).click();
    
    console.log('  → Clicking Confirm button');
    await page.getByRole('button', { name: 'Confirm' }).click();
    
    console.log('✅ Saved Vehicles - Global Saved workflow test passed\n');
  });

});