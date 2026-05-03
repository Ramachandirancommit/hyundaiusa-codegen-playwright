const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Innovation Section Navigation Tests', () => {
  
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.afterEach(async () => {
    console.log('⏳ Test completed, waiting 2 seconds...\n');
    await page.waitForTimeout(2000);
  });

  async function safeClick(locator) {
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
    }
  }

  test('TC-01: Safety Navigation', async () => {
    console.log('\n🛡️ TEST: Safety Navigation');
    
    console.log('  Step 1: Opening Global Menu');
    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    
    console.log('  Step 2: Clicking Innovation');
    await safeClick(page.getByText('Innovation'));
    
    console.log('  Step 3: Clicking Safety');
    await safeClick(page.getByRole('link', { name: 'Safety' }));
    await page.waitForTimeout(3000);
    
    console.log('  Step 4: Verifying page loaded');
    await expect(page).toHaveURL(/.*safety.*|.*innovation.*/, { timeout: 10000 });
    
    console.log('✅ Safety Navigation test passed\n');
  });

  test('TC-02: Technology Navigation', async () => {
    console.log('\n💻 TEST: Technology Navigation');
    
    console.log('  Step 1: Going to home page');
    await page.goto('https://www.hyundaiusa.com/us/en');
    await page.waitForTimeout(2000);
    
    console.log('  Step 2: Opening Global Menu');
    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    
    console.log('  Step 3: Clicking Innovation');
    await safeClick(page.getByText('Innovation'));
    
    console.log('  Step 4: Clicking Technology');
    await safeClick(page.getByRole('link', { name: 'Technology' }));
    await page.waitForTimeout(3000);
    
    console.log('  Step 5: Verifying page loaded');
    await expect(page).toHaveURL(/.*technology.*|.*innovation.*/, { timeout: 10000 });
    
    console.log('✅ Technology Navigation test passed\n');
  });
});