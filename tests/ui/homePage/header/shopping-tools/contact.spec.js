const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Shopping Tools - Contact Tests', () => {

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

  test('FAQs and Contact Navigation', async () => {

    console.log('\n📞 Starting FAQs and Contact Navigation test...');

    // Click Shopping Tools and navigate through menus
    console.log('  → Opening Shopping Tools menu');
    await page.getByRole('button', { name: 'Shopping Tools' }).first().click();
    
    console.log('  → Clicking Contact');
    await page.getByText('Contact', { exact: true }).first().click();
    
    console.log('  → Clicking FAQs');
    await page.getByRole('link', { name: 'FAQs ⁠' }).first().click();
    
    console.log('  → Verifying Frequently Asked Questions heading');
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' }).first()).toBeVisible();
    
    console.log('  → Verifying Popular Questions heading');
    await expect(page.getByRole('heading', { name: 'Popular Questions Popular' }).first()).toBeVisible();
    
    console.log('  → Re-opening Shopping Tools menu');
    await page.getByRole('button', { name: 'Shopping Tools' }).first().click();
    
    // Handle popup
    console.log('  → Waiting for popup');
    const page9Promise = page.waitForEvent('popup');
    
    console.log('  → Clicking Contact Hyundai link');
    await page.getByRole('link', { name: 'Contact Hyundai ⁠' }).first().click();
    
    const page9 = await page9Promise;
    console.log('  ✓ Popup opened');
    
    // Verify popup content
    console.log('  → Verifying New Message heading in popup');
    await expect(page9.getByRole('heading', { name: 'New Message' }).first()).toBeVisible();
    console.log('  ✓ New Message heading verified');

    // Clean up
    await page9.close();
    console.log('  ✓ Popup closed');

    console.log('✅ FAQs and Contact Navigation test passed\n');
  });

});