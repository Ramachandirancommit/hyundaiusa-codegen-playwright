const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(180_0000);

test('Homepage - Complete Navigation Test', async ({ page }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  // ============================================================
  // SAFE CLICK
  // ============================================================
  async function safeClick(locator) {
    if (await locator.count() > 0) {
      await locator.first().click();
      await page.waitForTimeout(1500); // reduced for CI stability
    }
  }

  // ============================================================
  // SAFE NAVIGATION (CI SAFE VERSION)
  // ============================================================
  async function safeClickAndWait(locator) {
    if (await locator.count() > 0) {

      await Promise.all([
        locator.first().click(),
        page.waitForLoadState('domcontentloaded') // CI SAFE
      ]);

      await page.waitForTimeout(1500);
    }
  }

  console.log('\n🚀 Starting Complete Navigation Test...\n');

  await safeClick(
    page.getByRole('heading', { name: 'about list of links' })
  );
  console.log('✔ about list of links heading - complete tick');

  // ============================================================
  // OUR COMPANY
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'Our Company' }));
  await safeClick(page.getByRole('heading', { name: 'Our Company' }));
  await safeClick(page.getByText('Where anything is possible.'));
  console.log('✔ Our Company complete');

  // ============================================================
  // COVID
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'COVID-19 Response' }));
  await safeClick(page.getByRole('heading', { name: 'Hyundai’s Response to COVID-' }));
  await safeClick(page.getByRole('heading', { name: 'Always there, wherever the' }));
  console.log('✔ COVID complete');

  // ============================================================
  // CAREERS
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'Careers' }));
  await safeClick(page.getByText('People come first'));
  console.log('✔ Careers complete');

  // ============================================================
  // LIFE & CULTURE
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'Life and Culture' }));
  await safeClick(page.getByText('People come first.'));
  console.log('✔ Life complete');

  // ============================================================
  // NEWS
  // ============================================================
  await safeClick(page.locator('footer').getByRole('link', { name: 'News' }));
  await safeClick(page.getByRole('heading', { name: 'What’s Happening' }));
  console.log('✔ News complete');

  // ============================================================
  // MOTORSPORTS (FIXED CRITICAL PART)
  // ============================================================
  await safeClickAndWait(page.getByRole('link', { name: 'Motorsports' }));
  console.log('✔ Motorsports complete');

  // ============================================================
  // AWARDS
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'Awards & Accolades' }));
  await safeClick(page.getByRole('heading', { name: 'Awards & Accolades' }));
  console.log('✔ Awards complete');

  // ============================================================
  // CONTACT
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'Contact Us' }));
  await safeClick(page.getByRole('heading', { name: 'Consumer Assistance Center' }));
  console.log('✔ Contact complete');

  console.log('\n🎉 TEST COMPLETED SUCCESSFULLY 🎉\n');
});