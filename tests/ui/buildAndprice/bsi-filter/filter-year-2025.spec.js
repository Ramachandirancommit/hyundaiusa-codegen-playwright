const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');
const { year2025 } = require('../../../../testdata/bsi/bsi-filter-data');

test.setTimeout(180_0000);

test('BSI Filter - 2025 Name and Price Validation', async ({ page }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  await page.getByRole('link', { name: 'Build & Price', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: 'Build and Search Inventory' })
  ).toBeVisible({ timeout: 30000 });

  await page.waitForTimeout(3000);

  // Year Filter
  await page.getByRole('button', { name: 'Year', exact: true }).click();

  await page.waitForTimeout(2000);

  await page.getByRole('checkbox', { name: '2025' }).check();

  await page.waitForTimeout(5000);

  await page.goto('https://www.hyundaiusa.com/us/en/build?modelYear=2025');

  await page.waitForTimeout(5000);

  await page.getByRole('paragraph')
    .filter({ hasText: 'Model Results' })
    .first()
    .click();

  await page.waitForTimeout(5000);

  await page.waitForSelector(
    '#bsi-vehicle-cards .bsi-model-card-container'
  );

  const cards = page.locator(
    '#bsi-vehicle-cards .bsi-model-card-container'
  );

  const count = await cards.count();

  console.log(`Vehicle cards found: ${count}`);

  const year = '2025';

  for (const vehicle of year2025) {

    const card = cards.filter({
      hasText: vehicle.name
    }).first();

    await card.scrollIntoViewIfNeeded();

    await expect(card).toBeVisible();

    const cardText = await card.textContent();

    const pass =
      cardText.includes(year) &&
      cardText.includes(vehicle.name) &&
      cardText.includes(vehicle.price);

    if (pass) {
      console.log(
        `✔ ${vehicle.name} | ${year} | ${vehicle.price} | PASS`
      );
    } else {
      console.log(
        `✘ ${vehicle.name} | ${year} | ${vehicle.price} | FAIL`
      );
    }

    expect(cardText).toContain(year);
    expect(cardText).toContain(vehicle.name);
    expect(cardText).toContain(vehicle.price);
  }

  console.log(
    '\n🎉 ALL 2025 VEHICLES VALIDATED SUCCESSFULLY 🎉\n'
  );
});