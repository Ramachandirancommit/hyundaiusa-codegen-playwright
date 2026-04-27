// tests/build&price/year/2024-filter.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../helpers/setup');

test.setTimeout(180000);

test('Build & Price - Verify 2024 Year Disabled', async ({ page }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
  await page.waitForTimeout(2000); // 🔎 Observe homepage

  async function safeClick(locator) {
    if (await locator.count() > 0) {
      await locator.first().click();
      await page.waitForTimeout(2000); // 🔎 Observe click result
    }
  }

  // ───────────────────────────────
  // Step 1: Click Build & Price
  // ───────────────────────────────
  await safeClick(
    page.getByRole('link', { name: 'Build & Price' })
  );
  console.log('✔ Build & Price clicked');
  await page.waitForTimeout(5000);

  // ───────────────────────────────
  // Step 2: Expand Year Filter
  // ───────────────────────────────
  const yearHeader = page.locator('h1.bsi-filters-title', { hasText: 'Year' });

  await expect(yearHeader).toBeVisible();
  console.log('✔ Year header visible');
  await page.waitForTimeout(2000);

  await yearHeader.click();
  console.log('✔ Year filter expanded');
  await page.waitForTimeout(2000);

  // ───────────────────────────────
  // Step 3: Verify 2024 Checkbox Disabled
  // ───────────────────────────────
  const year2024Checkbox = page.locator('#Year-2024');

  await expect(year2024Checkbox).toBeVisible();
  console.log('✔ 2024 checkbox visible');
  await page.waitForTimeout(2000);

  await expect(year2024Checkbox).toBeDisabled();
  console.log('✔ 2024 checkbox is disabled');
  await page.waitForTimeout(2000);

  // Attempt clicking disabled checkbox (for validation purpose)
  await year2024Checkbox.click({ force: true });
  console.log('✔ Attempted forced click on disabled checkbox');
  await page.waitForTimeout(2000);

  // ───────────────────────────────
  // Step 4: Verify 2024 Label Behavior
  // ───────────────────────────────
  const year2024Label = page.locator('label[for="Year-2024"]');

  await expect(year2024Label).toBeVisible();
  console.log('✔ 2024 label visible');
  await page.waitForTimeout(2000);

  const cursorStyle = await year2024Label.evaluate(el =>
    window.getComputedStyle(el).cursor
  );

  console.log('Cursor Style:', cursorStyle);
  await page.waitForTimeout(2000);

  if (cursorStyle === 'default') {
    console.log('✔ Label is non-clickable (correct behavior)');
  } else {
    console.log('❌ Label appears clickable');
  }

  await page.waitForTimeout(2000);

  console.log('\n🎉 2024 Disabled Year Test Completed Successfully 🎉');
});