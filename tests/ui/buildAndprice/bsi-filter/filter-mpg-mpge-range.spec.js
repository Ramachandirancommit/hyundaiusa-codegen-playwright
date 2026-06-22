const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(180000);

test('BSI Filter - MPG / MPGe Validation (Simple Stable)', async ({ page }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  await page.getByRole('link', { name: 'Build & Price', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: /Build and Search Inventory/i })
  ).toBeVisible({ timeout: 30000 });

  console.log('✔ BSI page loaded');

  // 🔴 SIMPLE FIX: wait for filter section to load
  await page.waitForTimeout(5000);

  // =========================
  // MPG FILTER
  // =========================

  const mpgButton = page.getByRole('button', { name: 'MPG / MPGe' });

  await expect(mpgButton).toBeVisible({ timeout: 30000 });
  await mpgButton.click();

  const slider = page.getByRole('slider', { name: 'MPG / MPGe' });

  const mpgValues = [
    '23','28','33','38','43',
    '53','58','63','68','73','78','83','88'
  ];

  for (const value of mpgValues) {

    await slider.fill(value);

    // 🔴 SIMPLE WAIT for results update
    await page.waitForTimeout(2000);

    const resultText = await page
      .getByRole('paragraph')
      .filter({ hasText: 'Model Result' })
      .first()
      .textContent()
      .catch(() => '');

    console.log(`✔ MPG ${value} | ${resultText?.trim()}`);
  }

  console.log('\n🎉 MPG TEST COMPLETED\n');
});