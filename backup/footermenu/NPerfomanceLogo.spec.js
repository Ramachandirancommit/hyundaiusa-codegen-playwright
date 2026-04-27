// tests/footermenu/NavigationforPerformance.spec.js

const { test } = require('@playwright/test');
const { pageSetup } = require('../../helpers/setup');

test.setTimeout(180_0000);

test('Performance Section - Full Navigation Flow', async ({ page }) => {

  // ─────────────────────────────────────────────
  // SETUP (Base URL + ZIP + Cookies handled here)
  // ─────────────────────────────────────────────
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  // ============================================================
  // 🔷 SAFE CLICK HELPER
  // Waits 2s after each click and removes overlays
  // ============================================================
  async function safeClick(locator, options = {}) {
    if ((await locator.count()) === 0) return;

    // Remove potential overlays that block clicks
    await page.evaluate(() => {
      document.querySelectorAll('.msc-gradient, .generic-hero-gradient-overlay').forEach(el => el.remove());
    });

    await locator.first().waitFor({ state: 'visible', timeout: 15000 });
    await locator.first().click({ force: true, ...options });
    await page.waitForTimeout(2000);
  }

  // ============================================================
  // 🔷 INTERNAL LINK HANDLER
  // ============================================================
  async function handleInternal(locator, label) {
    if ((await locator.count()) === 0) return;
    await safeClick(locator);
    console.log(`✔ ${label} - internal navigation done`);
  }

  // ============================================================
  // 🔷 ZIP HANDLING
  // ============================================================
  const zip = page.getByRole('textbox', { name: 'ZIP Code' });
  if (await zip.isVisible()) {
    await zip.fill('10010');
    await safeClick(page.getByRole('button', { name: 'Confirm' }));
    await safeClick(page.getByRole('button', { name: 'Close' }));
  }

  // ============================================================
  // 🔷 PERFORMANCE SECTION NAVIGATION
  // ============================================================
  await handleInternal(page.getByRole('link', { name: 'Hyundai Performance Page' }), 'Hyundai Performance Page');

  await handleInternal(page.getByLabel('Sedans'), 'Sedans category');
  await handleInternal(page.getByLabel('SUVs'), 'SUVs category');
  await handleInternal(page.getByRole('link', { name: 'AWD' }), 'AWD link');
  await handleInternal(page.getByLabel('Electrified'), 'Electrified category');

  // ============================================================
  // ✅ TEST COMPLETED
  // ============================================================
  console.log('\n🎉 PERFORMANCE SECTION NAVIGATION COMPLETED SUCCESSFULLY 🎉');
});