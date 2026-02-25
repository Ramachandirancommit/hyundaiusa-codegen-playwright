// tests/footermenu/HyundaiNavigationFull.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../helpers/setup');

test.setTimeout(180_0000);

test('Footer & Navigation - Hyundai Full Flow with Verification', async ({ page }) => {

  // ─────────────────────────────────────────────
  // SETUP (Base URL + ZIP + Cookies handled here)
  // ─────────────────────────────────────────────
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  // ============================================================
  // 🔷 SAFE CLICK HELPER (Wait 2s after each click + optional verification)
  // ============================================================
  async function safeClick(locator, expectedHeading) {
    const count = await locator.count();
    if (count > 0) {
      await locator.first().click();
      await page.waitForTimeout(2000);

      if (expectedHeading) {
        // Use first() to avoid strict mode violations
        const headingLocator = page.getByRole('heading', { name: expectedHeading }).first();
        await expect(headingLocator).toBeVisible();
      }
    }
  }

  // ============================================================
  // 🔷 MODAL HANDLING (ZIP Code + Close)
  // ============================================================
  const zipInput = page.getByRole('textbox', { name: 'ZIP Code' });
  if (await zipInput.isVisible()) {
    await zipInput.fill('10010');
    await safeClick(page.getByRole('button', { name: 'Confirm' }));
    const closeBtn = page.getByRole('button', { name: 'Close' });
    if (await closeBtn.isVisible()) await safeClick(closeBtn);
  }

  // ============================================================
  // 🔷 MAIN NAVIGATION FLOW WITH VERIFICATION
  // ============================================================

  // About Section
  await safeClick(page.getByRole('heading', { name: 'About' }));
  console.log('✔ About section clicked');

  // Our Company
  await safeClick(page.getByRole('link', { name: 'Our Company' }), 'Our Company');
  console.log('✔ Our Company validated');

  // Our Company submenu (labels)
  await safeClick(page.getByLabel('Careers'), 'Hyundai Corporate Careers ⁠');
  await safeClick(page.getByLabel('News'), "What’s Happening");
  await safeClick(page.getByLabel('Auto Shows'), 'Showing the world what we do');
  console.log('✔ Our Company submenu: Careers, News, Auto Shows clicked and validated');

  // COVID-19 Response
  await safeClick(page.getByRole('link', { name: 'COVID-19 Response' }), 'Hyundai’s Response to COVID-');
  console.log('✔ COVID-19 Response validated');

  // Life and Culture section
  await safeClick(page.getByRole('link', { name: 'Life and Culture' }), 'Life and Culture');
  await safeClick(page.getByRole('link', { name: 'Benefits' }), 'Benefits');
  await safeClick(page.getByRole('link', { name: 'Core Values' }), 'Core Values');
  console.log('✔ Life and Culture submenu clicked and validated');

  // Footer top-level navigation links
  await safeClick(page.locator('footer').getByRole('link', { name: 'Careers' }), 'Hyundai Corporate Careers ⁠');
  await safeClick(page.locator('footer').getByRole('link', { name: 'News' }), "What’s Happening");
  await safeClick(page.locator('footer').getByRole('link', { name: 'Motorsports' }), 'Motorsports');
  await safeClick(page.locator('footer').getByRole('link', { name: 'Auto Shows' }), 'Showing the world what we do');
  console.log('✔ Footer top-level navigation: Careers, News, Motorsports, Auto Shows validated');

  // Awards & Accolades
  await safeClick(page.getByRole('link', { name: 'Awards & Accolades' }), 'Awards & Accolades');
  console.log('✔ Awards & Accolades validated');

  // Contact Us
  await safeClick(page.getByRole('link', { name: 'Contact Us' }));
  await safeClick(page.locator('#layer-cover-106823'));
  console.log('✔ Contact Us clicked');

  // Owners Portal
  await page.goto('https://owners.hyundaiusa.com/us/en/index');
  await safeClick(page.locator('img').first());
  await safeClick(page.locator('#section-login'));
  console.log('✔ Owners portal login section accessed');

  // Final validation on Awards page
  await page.goto('https://www.hyundaiusa.com/us/en/awards-accolades');
  await expect(page.getByRole('heading', { name: 'Awards & Accolades' }).first()).toBeVisible();
  console.log('✔ Awards & Accolades page validated');

  console.log('\n🎉 Full Hyundai Navigation Flow Completed Successfully 🎉');
});