// tests/ui/homePage/homeDefault/vehicle-carousel.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(200000);

test.describe('Vehicle Carousel Navigation Tests', () => {

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
    console.log('✓ Setup complete - ready for tests\n');
  });

  test.afterAll(async () => {
    await page.close();
    console.log('✓ Browser closed');
  });

  test('Vehicle Carousel Tab Navigation', async () => {

    console.log('\n📋 Starting Vehicle Carousel Tab Navigation test...');

    await page.getByRole('tab', { name: 'Performance (2)' }).click();
    await page.waitForTimeout(300);
    
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(5).click();
    await page.waitForTimeout(300);
    
    await page.getByRole('tab', { name: 'Electrified (12)' }).click();
    await page.waitForTimeout(300);
    
    await page.getByRole('tab', { name: 'SUVs (15)' }).click();
    await page.waitForTimeout(300);
    
    await page.getByRole('tab', { name: 'Sedans (6)' }).click();
    await page.waitForTimeout(300);
    
    await page.getByRole('tab', { name: 'Performance (2)' }).click();
    await page.waitForTimeout(300);
    
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(5).click();
    await page.waitForTimeout(300);
    
    await page.getByRole('link', { name: 'placeholder 2025 PALISADE' }).click();
    await page.waitForTimeout(300);
    
    await page.getByText('IONIQ 5 N').first().click();
    
    console.log('✅ Vehicle Carousel Tab Navigation test passed\n');
  });

});