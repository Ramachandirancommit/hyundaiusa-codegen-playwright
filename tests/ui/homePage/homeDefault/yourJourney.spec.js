// tests/ui/homePage/homeDefault/journey-carousel.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Journey Carousel Navigation Tests', () => {

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

  test('Journey Carousel Navigation', async () => {

    console.log('\n📋 Starting Journey Carousel Navigation test...');

    await page.getByRole('heading', { name: 'Your journey starts here.' }).click();
    await page.waitForTimeout(300);
    
    await page.getByText('Got questions? Our Hyundai').click();
    await page.waitForTimeout(300);
    
    await page.getByText('Watch Hyundai Showroom Live').click();
    await page.waitForTimeout(300);
    
    await page.getByRole('link', { name: 'See vehicle lineup' }).click();
    await page.waitForTimeout(300);
    
    await page.getByText('Live hosted walkarounds').click();
    await page.waitForTimeout(300);
    
    await page.getByRole('heading', { name: 'Virtual showroom. Real-time' }).click();
    
    console.log('✅ Journey Carousel Navigation test passed\n');
  });

});