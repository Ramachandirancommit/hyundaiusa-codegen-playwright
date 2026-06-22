const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');
const { type } = require('../../../../testdata/bsi/bsi-filter-data');

test.setTimeout(180_000);

test('BSI Filter - Electrified Name Validation (Data Driven)', async ({ page }) => {

  // =========================
  // SETUP
  // =========================
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  await page.getByRole('link', { name: 'Build & Price', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: 'Build and Search Inventory' })
  ).toBeVisible({ timeout: 30000 });

  await page.waitForTimeout(3000);

  console.log(
    'Redirected to Build and Search Inventory page successfully 🎉'
  );

  // =========================
  // FILTER → ELECTRIFIED
  // =========================
  await page.getByRole('button', { name: 'Type', exact: true }).click();

  await page.getByRole('checkbox', {
    name: 'Electrified'
  }).check();

  await page.waitForTimeout(5000);

  console.log(
    'Electrified checked, and redirected to Electrified vehicles card list 🎉'
  );

  // =========================
  // MODEL RESULTS
  // =========================
  const modelResults = page
    .getByRole('paragraph')
    .filter({ hasText: 'Model Results' })
    .first();

  const modelResultsText =
    (await modelResults.textContent()) || '';

  const resultCount = Number(
    modelResultsText.match(/\d+/)?.[0] || 0
  );

  console.log(`${resultCount} Model Results found`);

  await modelResults.click();

  await page.waitForTimeout(5000);

  await page.waitForSelector(
    '#bsi-vehicle-cards .bsi-model-card-container',
    { timeout: 30000 }
  );

  const cards = page.locator(
    '#bsi-vehicle-cards .bsi-model-card-container'
  );

  const count = await cards.count();

  console.log(`Electrified cards found: ${count}`);

  // =========================
  // FILTER ELECTRIFIED VEHICLES FROM DATA
  // =========================
  const electrifiedVehicles = type.filter(vehicle =>
    vehicle.type.includes('electrified')
  );

  console.log(
    `Electrified vehicles in dataset: ${electrifiedVehicles.length}`
  );

  expect(count).toBe(electrifiedVehicles.length);

  // =========================
  // DATA DRIVEN VALIDATION
  // =========================
  for (const vehicle of electrifiedVehicles) {

    const card = cards.filter({
      hasText: vehicle.name
    }).first();

    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();

    const cardText = await card.textContent();

    if (cardText.includes(vehicle.name)) {
      console.log(`✔ ${vehicle.name} | PASS`);
    } else {
      console.log(`✘ ${vehicle.name} | FAIL`);
    }

    expect(cardText).toContain(vehicle.name);
  }

  console.log(
    '\n🎉 ALL ELECTRIFIED VEHICLES VALIDATED SUCCESSFULLY 🎉\n'
  );
});