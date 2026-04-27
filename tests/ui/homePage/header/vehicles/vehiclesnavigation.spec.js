const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Hyundai Vehicles Navigation and Tabs Tests', () => {

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

  test('Vehicles Menu and Tab Navigation', async () => {

    console.log('\n🚗 Starting Vehicles Menu and Tab Navigation test...');

    // Navigate to Vehicles menu
    console.log('  → Opening Vehicles menu');
    await page.getByRole('button', { name: 'Vehicles' }).first().click();
    console.log('  ✓ Vehicles menu opened');

    // Navigate through different tabs
    console.log('  → Clicking Electrified tab');
    await page.getByRole('tab', { name: 'Electrified', exact: true }).click();
    console.log('  ✓ Electrified tab clicked');
    
    console.log('  → Clicking SUVs tab');
    await page.getByRole('tab', { name: 'SUVs', exact: true }).click();
    console.log('  ✓ SUVs tab clicked');
    
    console.log('  → Clicking Sedans tab');
    await page.getByRole('tab', { name: 'Sedans', exact: true }).click();
    console.log('  ✓ Sedans tab clicked');
    
    console.log('  → Clicking Performance tab');
    await page.getByRole('tab', { name: 'Performance', exact: true }).click();
    console.log('  ✓ Performance tab clicked');
    
    console.log('  → Clicking Future Vehicles tab');
    await page.getByRole('tab', { name: 'Future Vehicles' }).click();
    console.log('  ✓ Future Vehicles tab clicked');

    // Navigate to Compare All Vehicles
    console.log('  → Clicking Compare All Vehicles link');
    await page.getByRole('link', { name: 'Compare All Vehicles' }).click();
    console.log('  ✓ Compare All Vehicles link clicked');
    
    console.log('  → Verifying Compare vehicles text');
    await page.getByText('Compare vehicles', { exact: true }).click();
    await page.getByText('Select up to 3 vehicles to').click();
    console.log('  ✓ Compare vehicles text verified');
    
    console.log('  → Clicking SUVs section');
    await page.locator('#SUVs').getByText('SUVs').click();
    console.log('  ✓ SUVs section clicked');

    // Navigate to Certified Used Vehicles
    console.log('  → Opening Vehicles menu');
    await page.getByRole('button', { name: 'Vehicles' }).first().click();
    console.log('  ✓ Vehicles menu opened');
    
    console.log('  → Clicking Certified Used Vehicles link');
    await page.getByRole('link', { name: 'Certified Used Vehicles', exact: true }).click();
    console.log('  ✓ Certified Used Vehicles link clicked');
    
    console.log('  → Clicking hero image');
    await page.locator('.generic-hero-v2-image-title').click();
    console.log('  ✓ Hero image clicked');

    // Navigate to Electrified Advantages
    console.log('  → Opening Vehicles menu');
    await page.getByRole('button', { name: 'Vehicles', exact: true }).first().click();
    console.log('  ✓ Vehicles menu opened');
    
    console.log('  → Clicking Electrified Advantages link');
    await page.getByRole('link', { name: 'Electrified Advantages', exact: true }).click();
    console.log('  ✓ Electrified Advantages link clicked');
    
    console.log('  → Verifying Electrified Vehicles text');
    await page.getByText('Hyundai Electrified Vehicles').click();
    await page.getByText('America’s Most Awarded EV').click();
    console.log('  ✓ Electrified Vehicles text verified');

    // Final Vehicles menu click
    console.log('  → Opening Vehicles menu');
    await page.getByRole('button', { name: 'Vehicles', exact: true }).first().click();
    console.log('  ✓ Vehicles menu opened');

    console.log('✅ Vehicles Menu and Tab Navigation test passed\n');
  });

});