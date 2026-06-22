const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');
const { vehicles } = require('../../../../testdata/bsi/vehicles-data');

test.setTimeout(180000);

test('BSI Filter - Compact SUV Validation', async ({ page }) => {

  // =========================
  // SETUP
  // =========================
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  await page.getByRole('link', {
    name: 'Build & Price',
    exact: true
  }).click();

  await expect(
    page.getByRole('heading', {
      name: 'Build and Search Inventory'
    })
  ).toBeVisible({ timeout: 30000 });

  console.log('Redirected to Build and Search Inventory page 🎉');

  // =========================
  // APPLY FILTER
  // =========================
  await page.locator(
    'div:nth-child(5) > div > .bsi-filters-header > .bsi-filters-expand-icon'
  ).click();

  await page.locator(
    '.bsi-filters-sub-title-container > .bsi-filters-expand-icon'
  ).first().click();

  await page.getByText('Compact SUVs', { exact: true }).click();

  console.log('Compact SUVs filter applied 🎯');

  await page.waitForTimeout(5000);

  // =========================
  // MODEL RESULTS
  // =========================
  const cards = page.locator('#bsi-vehicle-cards .bsi-model-card-container');

  await page.waitForSelector('#bsi-vehicle-cards .bsi-model-card-container', {
    timeout: 30000
  });

  const cardCount = await cards.count();

  const compactSUVs = vehicles.filter(v => v.size === 'compact-suv');

  console.log(`Compact SUV vehicles in dataset: ${compactSUVs.length}`);
  console.log(`Compact SUV cards found: ${cardCount}`);

  expect(cardCount).toBe(compactSUVs.length);

  // =========================
  // SIMPLE VALIDATION ONLY (NAME + PRICE)
  // =========================
  console.log('\n==============================');
  console.log('COMPACT SUV VALIDATION RESULTS');
  console.log('==============================\n');

  for (const vehicle of compactSUVs) {

    const card = cards.filter({
      hasText: vehicle.name
    }).first();

    await expect(card).toBeVisible();

    const text = await card.textContent();

    expect(text).toContain(vehicle.name);
    expect(text).toContain(vehicle.price);

    console.log(`✔ ${vehicle.name.padEnd(25)} | ${vehicle.price.padEnd(8)} | PASS`);
  }

  console.log('\n🎉 ALL COMPACT SUV VEHICLES VALIDATED SUCCESSFULLY 🎉\n');
});