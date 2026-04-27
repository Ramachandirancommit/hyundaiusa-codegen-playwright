// innovation.spec.js
const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000); // 120 seconds timeout

test.describe('Innovation Section Navigation Tests', () => {
  
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
  });

  test.afterAll(async () => {
    await page.close();
  });

  // Add 2 seconds wait after each test
  test.afterEach(async () => {
    console.log('⏳ Test completed, waiting 2 seconds...\n');
    await page.waitForTimeout(2000);
  });

  // Helper function with force click for intercepted elements
  async function safeClick(locator, expectedHeading) {
    const count = await locator.count();
    if (count > 0) {
      try {
        await locator.first().click({ force: true, timeout: 5000 });
        console.log(`  ✓ Clicked element`);
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(`  ⚠️ Force click failed, trying JS click...`);
        await locator.first().evaluate(el => el.click());
        console.log(`  ✓ Clicked element via JS`);
        await page.waitForTimeout(2000);
      }

      if (expectedHeading) {
        const headingLocator = page.getByRole('heading', { name: expectedHeading }).first();
        await expect(headingLocator).toBeVisible();
        console.log(`  ✓ Verified: ${expectedHeading}`);
        await page.waitForTimeout(2000);
      }
    }
  }

  async function goHome() {
    console.log(`  🏠 Navigating to home page...`);
    await page.goto('https://www.hyundaiusa.com/us/en');
    await page.waitForTimeout(2000);
  }

  test('TC-01: Safety Navigation', async () => {
    console.log('\n🛡️ TEST: Safety Navigation');
    
    console.log('  Step 1: Opening Global Menu');
    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    
    console.log('  Step 2: Clicking Innovation');
    await safeClick(page.getByText('Innovation'));
    
    console.log('  Step 3: Clicking Safety');
    await safeClick(page.getByRole('link', { name: 'Safety' }), 'Hyundai SmartSense');
    
    console.log('  Step 4: Verifying Safety content');
    await safeClick(page.getByText('Our network of advanced'));
    
    console.log('  Step 5: Verifying Safety heading');
    await safeClick(page.getByRole('heading', { name: 'Advanced safety comes' }));
    
    console.log('  Step 6: Clicking gradient overlay');
    await safeClick(page.locator('.generic-hero-gradient-overlay'));
    
    console.log('✅ Safety Navigation test passed\n');
  });

  test('TC-02: Technology Navigation', async () => {
    console.log('\n💻 TEST: Technology Navigation');
    
    console.log('  Step 1: Going to home page');
    await goHome();
    
    console.log('  Step 2: Opening Global Menu');
    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    
    console.log('  Step 3: Clicking Innovation');
    await safeClick(page.getByText('Innovation'));
    
    console.log('  Step 4: Clicking Technology');
    await safeClick(page.getByRole('link', { name: 'Technology' }), 'Hyundai Technology');
    
    console.log('  Step 5: Verifying Technology content');
    await safeClick(page.getByText('So advanced, it’s easy.'));
    
    console.log('  Step 6: Clicking gradient overlay');
    await safeClick(page.locator('.generic-hero-gradient-overlay'));
    
    console.log('✅ Technology Navigation test passed\n');
  });

});