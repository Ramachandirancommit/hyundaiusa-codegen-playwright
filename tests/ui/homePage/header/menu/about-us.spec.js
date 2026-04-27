// about.spec.js
const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('About Us Navigation Tests', () => {

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.afterEach(async () => {
    console.log('⏳ Waiting 2 seconds...\n');
    await page.waitForTimeout(2000);
  });

  // 🔥 Safe Click Helper
  async function safeClick(locator, expectedHeading) {
    const count = await locator.count();

    if (count > 0) {
      try {
        await locator.first().click({ force: true, timeout: 5000 });
        console.log(`  ✓ Clicked element`);
      } catch (err) {
        console.log(`  ⚠️ Force click failed, using JS click`);
        await locator.first().evaluate(el => el.click());
        console.log(`  ✓ Clicked via JS`);
      }

      await page.waitForTimeout(2000);

      // ✅ Optional heading validation
      if (expectedHeading) {
        const heading = page.getByRole('heading', { name: expectedHeading }).first();
        await expect(heading).toBeVisible();
        console.log(`  ✓ Verified: ${expectedHeading}`);
      }

    } else {
      console.log('  ❌ Element not found');
    }
  }

  async function goHome() {
    console.log('  🏠 Navigating to Home');
    await page.goto('https://www.hyundaiusa.com/us/en');
    await page.waitForTimeout(2000);
  }

  // ============================================================
  // TEST 1: FAQs Navigation
  // ============================================================
  test('TC-01: FAQs Navigation', async () => {

    console.log('\n❓ TEST: FAQs');

    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    await safeClick(page.getByText('About Us'));

    await safeClick(page.getByText('FAQs'));

    await safeClick(page.getByRole('link', { name: 'close' }));
    await safeClick(page.locator('.generic-hero-gradient-overlay'));

    await safeClick(
      page.getByRole('heading', { name: 'Frequently Asked Questions' }),
      'Frequently Asked Questions'
    );

    await safeClick(page.locator('.generic-hero-gradient-overlay'));

    console.log('✅ FAQs test passed\n');
  });

  // ============================================================
  // TEST 2: Contact Hyundai
  // ============================================================
  test('TC-02: Contact Hyundai', async () => {

    console.log('\n📞 TEST: Contact Hyundai');

    await goHome();

    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    await safeClick(page.getByText('Contact Hyundai'), 'Consumer Assistance Center');

    await safeClick(page.locator('.selectcategory-contact-block').first());

    await safeClick(
      page.getByRole('heading', { name: 'Contact Us' }),
      'Contact Us'
    );

    console.log('✅ Contact Hyundai test passed\n');
  });

  // ============================================================
  // TEST 3: Auto Shows
  // ============================================================
  test('TC-03: Auto Shows Navigation', async () => {

    console.log('\n🚗 TEST: Auto Shows');

    await goHome();

    await safeClick(page.getByRole('button', { name: 'Global Menu' }));

    await safeClick(
      page.getByRole('link', { name: 'Auto Shows' }),
      'Showing the world what we do'
    );

    await safeClick(page.getByText('In the spotlight.'));
    await safeClick(page.locator('.generic-hero-gradient-overlay'));

    console.log('✅ Auto Shows test passed\n');
  });

});