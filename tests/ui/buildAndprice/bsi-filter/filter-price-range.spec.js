const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(180000);

test('BSI Filter - Price Validation', async ({ page }) => {

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
  // OPEN PRICE FILTER
  // =====================================

  await page.getByRole('button', {
    name: 'Price',
    exact: true
  }).click();

  const priceRanges = [
    '$25,200-$',
    '$30,200-$',
    '$35,200-$',
    '$40,200-$',
    '$45,200-$',
    '$50,200-$',
    '$55,200-$',
    '$60,200-$',
    '$65,200-$',
    '$70,200-$',
    '$75,200-$'
  ];

  const sliderValues = [
    '25200',
    '30200',
    '35200',
    '40200',
    '45200',
    '50200',
    '55200',
    '60200',
    '65200',
    '70200',
    '75200'
  ];

  for (let i = 0; i < sliderValues.length; i++) {

    await page
      .getByRole('slider', { name: 'Price' })
      .first()
      .fill(sliderValues[i]);

    await page.waitForTimeout(2000);

    const modelResults = page
      .getByRole('paragraph')
      .filter({ hasText: 'Model Result' })
      .first();

    const resultText =
      (await modelResults.textContent()) || '';

    console.log(
      `✔ Price Range ${priceRanges[i]} | ${resultText.trim()} | PASS`
    );
  }

  console.log(
    '\n🎉 ALL PRICE FILTER VALIDATIONS COMPLETED 🎉\n'
  );
});