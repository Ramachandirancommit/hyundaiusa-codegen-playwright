// tests/ui/homePage/homeDefault/warranty-carousel.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Warranty Carousel Navigation Tests', () => {

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

  test('Warranty Carousel - 4 Slides Navigation', async () => {

    console.log('\n📋 Starting Warranty Carousel Navigation test...');

    // Slide 1
    await page.getByRole('heading', { name: 'America’s Best Warranty' }).click();
    await page.getByText('Confidence comes with a full').click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(300);
    
    // Slide 2
    await page.getByRole('heading', { name: 'Shopper Assurance' }).click();
    await page.getByText('With transparent pricing,').click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(300);
    
    // Slide 3
    await page.getByRole('heading', { name: 'Award Winning' }).click();
    await page.getByText('Hyundai cars and SUVs are').click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(300);
    
    // Slide 4
    await page.getByRole('heading', { name: 'Click to Buy⁠' }).click();
    await page.getByText('Shop completely online and').click();
    
    console.log('✅ Warranty Carousel Navigation test passed\n');
  });

});