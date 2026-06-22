const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(180000);

test('BSI Filter - Exterior Colors Validation', async ({ page }) => {

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

  // =====================================
  // OPEN EXTERIOR COLORS FILTER
  // =====================================

  await page.getByRole('button', {
    name: 'Exterior Colors'
  }).click();

  // =====================================
  // COLOR VALIDATION FLOW
  // =====================================

  const colorSteps = [
    { color: 'Black', vehicles: [['PALISADE', '$39,435']] },
    { color: 'Gray', vehicles: [['PALISADE', '$39,435']] },
    { color: 'White', vehicles: [['PALISADE', '$39,435']] },
    { color: 'Silver', vehicles: [['PALISADE', '$41,940']] },
    { color: 'Blue', vehicles: [['PALISADE', '$39,435']] },
    { color: 'Brown', vehicles: [['PALISADE', '$41,940']] },
    { color: 'Green', vehicles: [['PALISADE', '$54,560']] },
    { color: 'Red', vehicles: [['PALISADE', '$39,435']] },
    { color: 'Orange', vehicles: [['SANTA FE', '$42,040']] },
    { color: 'Yellow', vehicles: [['KONA', '$25,500']] }
  ];

  for (const step of colorSteps) {

    console.log(`\n========== ${step.color.toUpperCase()} ==========\n`);

    await page.getByRole('button', {
      name: step.color
    }).click();

    await validateVehicles(page, step.vehicles);

    console.log(`\n🎉 ${step.color.toUpperCase()} VALIDATION COMPLETED 🎉\n`);
  }

});

async function validateVehicles(page, vehicles) {

  await page.waitForTimeout(3000);

  // =====================================
  // MODEL RESULTS COUNT
  // =====================================

  const resultsLocator = page
    .getByRole('paragraph')
    .filter({ hasText: 'Model Results' })
    .first();

  await expect(resultsLocator).toBeVisible();

  const resultsText = await resultsLocator.textContent();

  console.log(`📊 ${resultsText?.trim()}`);

  // =====================================
  // VEHICLE NAME + PRICE VALIDATION
  // =====================================

  const cards = page.locator(
    '#bsi-vehicle-cards .bsi-model-card-container'
  );

  await expect(cards.first()).toBeVisible({
    timeout: 30000
  });

  for (const [name, price] of vehicles) {

    const card = cards.filter({
      hasText: name
    }).first();

    await expect(card).toBeVisible();

    const text = await card.textContent();

    expect(text).toContain(name);
    expect(text).toContain(price);

    console.log(`✔ Vehicle: ${name}`);
    console.log(`✔ Price: ${price}`);
  }
}