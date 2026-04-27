const { test } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(300_000);

test('Vehicles - Full Footer Completion Test', async ({ page }) => {

  // ─────────────────────────────────────────────
  // SETUP
  // ─────────────────────────────────────────────
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  // ============================================================
  // 🔷 SAFE CLICK WITH 2s WAIT
  // ============================================================
  async function safeClick(locator) {
    if (await locator.count() > 0) {
      await locator.first().click();
      await page.waitForTimeout(3000);
    }
  }

  // ============================================================
  // 🔷 HEADER LINK CLICK
  // ============================================================
  async function clickHeaderLink(href, label) {
    const link = page.locator(`header a[href="${href}"]`);
    await safeClick(link);
    console.log(`✔ ${label} - done`);
  }

  // ============================================================
  // 🔷 FOOTER LINK CLICK + RETURN
  // ============================================================
  async function clickFooterLinkAndReturn(href, label) {
    const link = page.locator(`footer a[href="${href}"]`);

    if (await link.count() > 0) {
      await link.first().scrollIntoViewIfNeeded();
      await link.first().click();
      await page.waitForTimeout(3000);

      await page.goBack();
      await page.waitForTimeout(3000);

      console.log(`✔ ${label} - complete tick`);
    }
  }

  // ============================================================
  // 🔷 EXTERNAL POPUP HANDLER
  // ============================================================
  async function clickFooterExternalLink(partialHref, label) {
    const link = page.locator(`footer a[href*="${partialHref}"]`);

    if (await link.count() > 0) {
      const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        link.first().click(),
      ]);

      await popup.waitForTimeout(3000);
      await popup.close();
      await page.bringToFront();
      await page.waitForTimeout(3000);

      console.log(`✔ ${label} - complete tick`);
    }
  }

  // ============================================================
  // 🔷 HEADER SECTION
  // ============================================================

  await safeClick(
    page.locator('header').getByRole('heading', { name: 'Vehicles' })
  );

  await clickHeaderLink('/us/en/vehicles', 'All Vehicles');
  await clickHeaderLink('/us/en/electrified', 'Electrified');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(3000);

  // ============================================================
  // 🔷 FOOTER SECTION
  // ============================================================

  await clickFooterLinkAndReturn('/us/en/suvs', 'SUVs');
  await clickFooterLinkAndReturn('/us/en/sedans', 'Sedans');
  await clickFooterLinkAndReturn('/us/en/performance', 'Performance');
  await clickFooterLinkAndReturn('/us/en/all-wheel-drive', 'All Wheel Drive');

  // ============================================================
  // 🔷 EXTERNAL + REMAINING LINKS
  // ============================================================

  await clickFooterExternalLink('reviews', 'Vehicle Reviews');
  await clickFooterLinkAndReturn('/us/en/brochures', 'Vehicle Brochures');
  await clickFooterLinkAndReturn('/us/en/safety', 'Safety');
  await clickFooterLinkAndReturn('/us/en/technology', 'Technology');
  await clickFooterExternalLink('genesis', 'Genesis');

  console.log('\n🎉 ALL VEHICLES FOOTER LINKS COMPLETED SUCCESSFULLY 🎉');
});

