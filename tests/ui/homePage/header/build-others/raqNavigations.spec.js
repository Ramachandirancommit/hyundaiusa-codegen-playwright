const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Shopping Tools - Request a Quote Tests', () => {

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

  test('Request a Quote Navigation', async () => {

    console.log('\n📋 Starting Request a Quote Navigation test...');

    console.log('  → Navigating to home page');
    await page.goto('https://www.hyundaiusa.com/us/en');
    
    console.log('  → Clicking Request a Quote link');
    await page.locator('#global-site-header').getByRole('link', { name: 'Request a Quote', exact: true }).click();
    
    console.log('  → Verifying Request a Quote heading');
    await expect(page.getByRole('heading', { name: 'Request a Quote' })).toBeVisible();
    
    console.log('  → Clicking Select a vehicle option');
    await page.getByText('Select a vehicle', { exact: true }).click();
    
    console.log('  → Clicking Choose a dealer option');
    await page.getByText('Choose a dealer Select up to').click();
    
    console.log('  → Clicking Enter your info option');
    await page.getByText('Enter your info').click();
    
    console.log('✅ Request a Quote Navigation test passed\n');
  });

});