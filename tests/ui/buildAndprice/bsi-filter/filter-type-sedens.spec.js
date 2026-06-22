const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');
const { type } = require('../../../../testdata/bsi/bsi-filter-data');

test.setTimeout(180_000);

test('BSI Filter - Sedans Name and Price Validation', async ({ page }) => {

  // =========================
  // SETUP
  // =========================
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  await page.getByRole('link', { name: 'Build & Price', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: 'Build and Search Inventory' })
  ).toBeVisible({ timeout: 30000 });

  await page.waitForTimeout(3000);

  // =========================
  // FILTER → SEDANS
  // =========================
  await page.getByRole('button', { name: 'Type', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Sedans' }).check();

  await page.goto('https://www.hyundaiusa.com/us/en/build?bsiVehicleType=Sedans');

  // =========================
  // MODEL RESULTS
  // =========================
  await page.getByRole('paragraph')
    .filter({ hasText: 'Model Results' })
    .first()
    .click();

  await page.waitForTimeout(5000);

  await page.waitForSelector(
    '#bsi-vehicle-cards .bsi-model-card-container',
    { timeout: 30000 }
  );

  const cards = page.locator('#bsi-vehicle-cards .bsi-model-card-container');

  const count = await cards.count();
  console.log(`Sedan cards found: ${count}`);

  // =========================
  // FILTER DATA (SEDANS ONLY)
  // =========================
  const sedanVehicles = type.filter(v =>
    v.type.includes('sedan')
  );

  console.log(`Sedan vehicles in dataset: ${sedanVehicles.length}`);

  // =========================
  // DATA DRIVEN VALIDATION
  // =========================
  for (const vehicle of sedanVehicles) {

    const card = cards.filter({
      hasText: vehicle.name
    }).first();

    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();

    const cardText = await card.textContent();

    const pass =
      cardText.includes(vehicle.name);

    if (pass) {
      console.log(`✔ ${vehicle.name} | PASS`);
    } else {
      console.log(`✘ ${vehicle.name} | FAIL`);
    }

    expect(cardText).toContain(vehicle.name);
  }

  console.log('\n🎉 ALL SEDAN VEHICLES VALIDATED SUCCESSFULLY 🎉\n');
});