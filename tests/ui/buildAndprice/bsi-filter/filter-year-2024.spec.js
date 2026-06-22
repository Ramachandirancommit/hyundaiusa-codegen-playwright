const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');
const { year2024 } = require('../../../../testdata/bsi/bsi-filter-data');

test.setTimeout(180_0000);

test('BSI Filter - 2024 Vehicle Validation (UI Filter)', async ({ page }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  await page.getByRole('link', { name: 'Build & Price', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: 'Build and Search Inventory' })
  ).toBeVisible({ timeout: 30000 });

  await page.waitForTimeout(3000);

  // =========================
  // YEAR FILTER (UI ONLY)
  // =========================
  await page.getByRole('button', { name: 'Year', exact: true }).click();
  await page.waitForTimeout(2000);

  const year2024Checkbox = page.getByRole('checkbox', { name: '2024' });

  await expect(year2024Checkbox).toBeVisible();
  await expect(year2024Checkbox).toBeDisabled();

  console.log('✔ 2024 YEAR AVAILABLE (READ ONLY MODE) - Default 20 vehicles validation started');

  await page.waitForTimeout(3000);

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
  console.log(`Vehicle cards found: ${count}`);

  const year = '2024';

  // =========================
  // VALIDATION LOOP (COMMON STYLE)
  // =========================
  for (const vehicle of year2024) {

    const card = cards.filter({
      hasText: vehicle.name
    }).first();

    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();

    const cardText = await card.textContent();

    const pass =
      cardText.includes(vehicle.name) &&
      cardText.includes(vehicle.price);

    if (pass) {
      console.log(`✔ ${vehicle.name} | ${vehicle.price} | PASS`);
    } else {
      console.log(`✘ ${vehicle.name} | ${vehicle.price} | FAIL`);
    }

    expect(cardText).toContain(vehicle.name);
    expect(cardText).toContain(vehicle.price);
  }

  console.log('\n🎉 ALL 2024 VEHICLES VALIDATED SUCCESSFULLY 🎉\n');
});