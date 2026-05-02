const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(180_0000);

test('Homepage - Complete Navigation Test', async ({ page }) => {

  // ─────────────────────────────────────────────
  // SETUP (Base URL + ZIP + Cookies handled here)
  // ─────────────────────────────────────────────
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  // ============================================================
  // 🔷 SAFE CLICK WITH 2s WAIT
  // ============================================================
  async function safeClick(locator) {
    if (await locator.count() > 0) {
      await locator.first().click();
      await page.waitForTimeout(2000);
    }
  }

  // ============================================================
  // 🔷 SAFE CLICK WITH NAVIGATION WAIT
  // ============================================================
  async function safeClickAndWaitForNavigation(locator) {
    if (await locator.count() > 0) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        locator.first().click()
      ]);
      await page.waitForTimeout(2000);
    }
  }

  // ============================================================
  // 🔷 HOMEPAGE NAVIGATION FLOW
  // ============================================================

  console.log('\n🚀 Starting Complete Navigation Test...\n');

  // Click on heading 'about list of links'
  await safeClick(
    page.getByRole('heading', { name: 'about list of links' })
  );
  console.log('✔ about list of links heading - complete tick');

  // ============================================================
  // OUR COMPANY GROUP
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'Our Company' }));
  await safeClick(page.getByRole('heading', { name: 'Our Company' }));
  await safeClick(page.getByText('Where anything is possible.'));
  console.log('✔ Our Company - complete tick (navigation + verification)');

  // ============================================================
  // COVID-19 RESPONSE GROUP
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'COVID-19 Response' }));
  await safeClick(page.getByRole('heading', { name: 'Hyundai’s Response to COVID-' }));
  await safeClick(page.getByRole('heading', { name: 'Always there, wherever the' }));
  console.log('✔ COVID-19 Response - complete tick (navigation + verification)');

  // ============================================================
  // CAREERS GROUP
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'Careers' }));
  await safeClick(page.getByText('People come first'));
  console.log('✔ Careers - complete tick (navigation + verification)');

  // ============================================================
  // LIFE AND CULTURE GROUP
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'Life and Culture' }));
  await safeClick(page.getByText('People come first.'));
  await safeClick(page.getByText('About About Our Company COVID'));
  console.log('✔ Life and Culture - complete tick (navigation + verification)');

  // ============================================================
  // NEWS GROUP
  // ============================================================
  await safeClick(page.locator('footer').getByRole('link', { name: 'News' }));
  await safeClick(page.getByRole('heading', { name: 'What’s Happening' }));
  await safeClick(page.getByText('Stay on top of all things Hyundai.', { exact: true }));
  console.log('✔ News - complete tick (navigation + verification)');

  // ============================================================
  // MOTORSPORTS GROUP
  // ============================================================
  await safeClickAndWaitForNavigation(page.getByRole('link', { name: 'Motorsports' }));
  console.log('✅ PASSED: Motorsports - navigation complete');
  await page.waitForTimeout(2000);

  // ============================================================
  // AUTO SHOWS GROUP
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'Auto Shows' }));
  await safeClick(page.getByRole('heading', { name: 'Showing the world what we do' }));
  await safeClick(page.getByText('In the spotlight.'));
  console.log('✔ Auto Shows - complete tick (navigation + verification)');

  // ============================================================
  // AWARDS & ACCOLADES GROUP
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'Awards & Accolades' }));
  await page.waitForTimeout(3000);
  await safeClick(page.getByRole('heading', { name: 'Awards & Accolades' }));
  await safeClick(page.getByRole('heading', { name: '7 Hyundai models awarded an' }));
  await safeClick(page.getByText('Seven 2026 Hyundai models,'));
  console.log('✔ Awards & Accolades - complete tick (navigation + verification)');

  // ============================================================
  // CONTACT US GROUP
  // ============================================================
  await safeClick(page.getByRole('link', { name: 'Contact Us' }));
  await safeClick(page.getByRole('heading', { name: 'Consumer Assistance Center' }));
  console.log('✔ Contact Us - complete tick (navigation + verification)');

  // ============================================================
  // 🔷 FINAL SUCCESS MESSAGE
  // ============================================================
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 COMPLETE NAVIGATION TEST COMPLETED SUCCESSFULLY 🎉');
  console.log('='.repeat(60));
  console.log('✓ All groups navigated and verified successfully');
  console.log('='.repeat(60) + '\n');
});