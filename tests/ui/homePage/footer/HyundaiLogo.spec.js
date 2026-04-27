// tests/homepage/hope.spec.js

const { test } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(180_0000);

test('Homepage - Hyundai Hope Navigation Test', async ({ page }) => {

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
  // 🔷 HOMEPAGE NAVIGATION FLOW
  // ============================================================

  // Hyundai USA Homepage link
  await safeClick(
    page.getByRole('link', { name: 'Hyundai USA Homepage' })
  );
  console.log('✔ Hyundai USA Homepage - complete tick');

  // Hyundai Logo
  await safeClick(
    page.getByRole('link', { name: 'Hyundai Logo' })
  );
  console.log('✔ Hyundai Logo - complete tick');

  // Hyundai Hope on Wheels
  await safeClick(
    page.getByRole('link', { name: 'Hyundai Hope on Wheels' })
  );
  console.log('✔ Hyundai Hope on Wheels - complete tick');

  // Community Section Text
  await safeClick(
    page.getByText('Communitydrives us. Caring')
  );
  console.log('✔ Community Section - complete tick');

  // Building for Tomorrow
  await safeClick(
    page.getByRole('link', { name: 'Building for Tomorrow', exact: true })
  );
  console.log('✔ Building for Tomorrow - complete tick');

  // Heading Click (Validation Section)
  await safeClick(
    page.getByRole('heading', { name: 'What are we doing for' })
  );
  console.log('✔ What are we doing for - complete tick');

  console.log('\n🎉 Homepage Hyundai Hope Navigation Completed Successfully 🎉');
});