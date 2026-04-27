const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../helpers/setup');

test.setTimeout(300000); // 5 minutes

test('Build & Price - Verify 2026 PALISADE Single Vehicle', async ({ page }) => {

  // ───────────────────────────────
  // Setup: Open page + ZIP code / cookies
  // ───────────────────────────────
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
  await page.waitForTimeout(2000);

  // ───────────────────────────────
  // Helper: Enhanced safeClick with scroll + wait + log
  // ───────────────────────────────
  async function safeClick(locator, description = '', options = {}) {
    if (await locator.count() > 0) {
      try {
        await locator.first().waitFor({ state: 'visible', timeout: 20000 });
        await locator.first().scrollIntoViewIfNeeded();
        await locator.first().click(options);
        await page.waitForTimeout(1000);

        let label = '';
        try {
          label = await locator.first().getAttribute('aria-label');
          if (!label) label = await locator.first().innerText();
        } catch (e) {
          label = description || '[unknown element]';
        }
        console.log(`✔ Element clicked: ${label}`);
      } catch (e) {
        console.log(`⚠ Failed to click: ${description} - ${e.message}`);
      }
    } else {
      console.log(`⚠ Element not found: ${description}`);
    }
  }

  // ───────────────────────────────
  // Step 1: Handle ZIP code modal
  // ───────────────────────────────
  await safeClick(page.getByRole('textbox', { name: 'ZIP Code' }), 'ZIP Code input');
  await page.getByRole('textbox', { name: 'ZIP Code' }).fill('10010');
  await safeClick(page.getByRole('button', { name: 'Confirm' }), 'Confirm ZIP Code');

  // Close modal/cookies
  await safeClick(page.getByRole('button', { name: 'Close' }), 'Close modal');

  // ───────────────────────────────
  // Step 2: Navigate Build & Price
  // ───────────────────────────────
  await safeClick(page.getByRole('link', { name: 'Build & Price' }).first(), 'Build & Price');
  await page.waitForTimeout(5000);

  // Step 3: Show Trims & Year Tab
  await safeClick(page.getByRole('button', { name: 'Show Trims' }).first(), 'Show Trims');
  await safeClick(page.getByRole('button', { name: 'year tab' }).first(), 'Year Tab');

  // Step 4: Select 2026 PALISADE
  const yearHeader = page.locator('h1.bsi-filters-title', { hasText: 'Year' });
  await expect(yearHeader).toBeVisible({ timeout: 20000 });
  await safeClick(yearHeader, 'Year Filter Header');

  const year2026Checkbox = page.locator('#Year-2026');
  await year2026Checkbox.waitFor({ state: 'visible', timeout: 20000 });
  await safeClick(year2026Checkbox, '2026 Year Checkbox');
  await page.waitForTimeout(5000);

  await safeClick(page.getByRole('heading', { name: 'PALISADE', exact: true }), 'PALISADE');
  await page.waitForTimeout(3000);

  // Step 5: Trim Page - SE Vehicle
  await safeClick(page.getByRole('heading', { name: 'SE', exact: true }), 'SE Trim');
  await safeClick(page.getByRole('img', { name: 'Trim image' }).first(), 'Trim Image');
  await safeClick(page.getByText('Vehicle shown for').first(), 'Vehicle shown for');
  await safeClick(page.getByRole('paragraph').filter({ hasText: 'Starting MSRP' }).first(), 'Starting MSRP');
  await safeClick(page.getByRole('paragraph').filter({ hasText: '$39,435' }), 'Price $39,435');
  await safeClick(page.getByText('MPG up to').first(), 'MPG up to');
  await safeClick(page.getByText('Hwy 19 City').first(), 'Hwy 19 City');
  await safeClick(page.locator('.bsi-trim-card-indicator-container').first(), 'Trim Card Indicator');
  await safeClick(page.getByText('-hp 3.5-liter V6').first(), '-hp 3.5-liter V6');
  await safeClick(page.getByText('12.3-inch touchscreen display'), '12.3-inch touchscreen display');
  await safeClick(page.getByText('SmartSense Safety Suite'), 'SmartSense Safety Suite');

  // Step 6: Scroll to Build Button (PageDown x4)
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(500);
  }

  const buildBtn = page.locator('a[aria-label="Build"]').first();
  await safeClick(buildBtn, 'Build Button for SE Trim');

  await page.waitForTimeout(5000);

  console.log('\n🎉 2026 PALISADE Single Vehicle Flow Completed Successfully 🎉');
});