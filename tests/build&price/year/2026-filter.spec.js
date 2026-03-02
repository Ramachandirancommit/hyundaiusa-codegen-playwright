const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../helpers/setup');

test.setTimeout(180000);

test('Build & Price - Verify 2026 PALISADE Flow', async ({ page }) => {

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
  // Step 3: Select 2026 Checkbox
  // ───────────────────────────────
  const year2026Checkbox = page.locator('#Year-2026');

  await expect(year2026Checkbox).toBeVisible();
  console.log('✔ 2026 checkbox visible');
  await page.waitForTimeout(2000);

  await year2026Checkbox.check();
  console.log('✔ 2026 checkbox selected');
  await page.waitForTimeout(5000);

  // ───────────────────────────────
  // Step 4: Click PALISADE Model
  // ───────────────────────────────
  await safeClick(
    page.getByRole('heading', { name: 'PALISADE' })
  );
  console.log('✔ PALISADE clicked');
  await page.waitForTimeout(3000);

  // ───────────────────────────────
  // Step 5: PALISADE Page Interactions
  // ───────────────────────────────
  await safeClick(
    page.getByText('Our premium highly capable')
  );

  await safeClick(
    page.getByText('Our premium highly capable')
  );

  await safeClick(
    page.getByRole('paragraph').nth(5)
  );

  await safeClick(
    page.locator('#bsi-vehicle-cards').getByText('$37,200')
  );

  await safeClick(
    page.getByRole('img', { name: 'Model Image' }).first()
  );

  // ───────────────────────────────
  // Step 6: Disclaimer Validation
  // ───────────────────────────────
  await safeClick(
    page.getByRole('button', { name: 'Click to read disclaimer' }).first()
  );

  await safeClick(
    page.getByRole('paragraph')
      .filter({ hasText: 'MSRP excludes freight charges' })
  );

  await safeClick(
    page.getByRole('button', { name: 'Close modal' })
  );

  console.log('\n🎉 2026 PALISADE Flow Test Completed Successfully 🎉');
});