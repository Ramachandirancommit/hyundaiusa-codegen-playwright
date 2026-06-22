const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

const bsiData = require('../../../../testdata/bsi/bsi-filter-data');
const vehicles = bsiData.model;

test.setTimeout(540_000);

test('BSI Model Validation - Name, Price & Image (Data Driven)', async ({
  page
}) => {
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  await page.waitForTimeout(5000);

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

  if (!Array.isArray(vehicles)) {
    throw new Error('vehicles is not an array. Check bsi-filter-data.js export.');
  }

  for (const vehicle of vehicles) {
    console.log(`\n====================================`);
    console.log(`🔍 Validating ${vehicle.name}`);
    console.log(`====================================`);

    await page.goto(
      `https://www.hyundaiusa.com/us/en/build?modelName=${vehicle.modelName}`,
      {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      }
    );

    await page.waitForSelector(
      '#bsi-vehicle-cards .bsi-model-card-container',
      { timeout: 30000 }
    );

    const cards = page.locator('#bsi-vehicle-cards .bsi-model-card-container');

    const card = cards.filter({ hasText: vehicle.name }).first();

    await expect(card).toBeVisible();

    // =========================
    // NAME VALIDATION
    // =========================
    const cardText = (await card.textContent()) || '';

    expect(cardText).toContain(vehicle.name);

    console.log(`✔ Name Validation Passed`);
    console.log(`   Expected : ${vehicle.name}`);

    // =========================
    // PRICE VALIDATION
    // =========================
    await expect(card).toContainText(vehicle.price);

    console.log(`✔ Price Validation Passed`);
    console.log(`   Expected : ${vehicle.price}`);

    // =========================
    // IMAGE VALIDATION
    // =========================
    const image = card.locator('img').first();

    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    await expect(image).toBeVisible({ timeout: 15000 });

    console.log(`✔ Image Validation Passed`);

    // =========================
    // CARD VALIDATION
    // =========================
    console.log(`✔ Vehicle Card Found`);
    console.log(`✅ ${vehicle.name} | PASS`);
  }

  console.log('\n🎉 ALL BSI MODELS VALIDATED SUCCESSFULLY 🎉\n');
});

// const { test, expect } = require('@playwright/test');
// const { pageSetup } = require('../../../../helpers/setup');

// test.setTimeout(540_000);

// const vehicles = [
//   { name: 'PALISADE', modelName: 'J001', price: '$39,435' },
//   { name: 'PALISADE Hybrid', modelName: 'J006', price: '$44,160' },
//   { name: 'SANTA FE', modelName: '6001', price: '$35,050' },
//   { name: 'SANTA FE Hybrid', modelName: '6006', price: '$36,400' },
//   { name: 'TUCSON', modelName: '8001', price: '$29,450' },
//   { name: 'TUCSON Hybrid', modelName: '8006', price: '$32,450' },
//   { name: 'TUCSON Plug-in Hybrid', modelName: '8005', price: '$40,325' },
//   { name: 'SONATA', modelName: '2001', price: '$27,450' },
//   { name: 'SONATA Hybrid', modelName: '2006', price: '$29,200' },
//   { name: 'IONIQ 5', modelName: '5004', price: '$35,000' },
//   { name: 'IONIQ 5 N', modelName: '5008', price: '$66,200' },
//   { name: 'ELANTRA', modelName: '4001', price: '$22,625' },
//   // Update price if Hyundai changes it
//   { name: 'ELANTRA Hybrid', modelName: '4006', price: '$25,450' },
//   { name: 'ELANTRA N', modelName: '4008', price: '$35,100' },
//   { name: 'IONIQ 9', modelName: '7004', price: '$58,955' },
//   { name: 'KONA', modelName: 'Q001', price: '$25,500' },
//   { name: 'KONA Electric', modelName: 'Q004', price: '$32,975' },
//   { name: 'IONIQ 6', modelName: 'A004', price: '$37,850' },
//   { name: 'SANTA CRUZ', modelName: '9001', price: '$29,750' },
//   { name: 'VENUE', modelName: '1001', price: '$20,550' } // verify model code
// ];

// test('BSI Model Validation - Name, Price & Image (Data Driven)', async ({
//   page
// }) => {
//   // =========================
//   // SETUP
//   // =========================
//   await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

//   await page.waitForTimeout(5000);

//   await page.getByRole('link', {
//     name: 'Build & Price',
//     exact: true
//   }).click();

//   await expect(
//     page.getByRole('heading', {
//       name: 'Build and Search Inventory'
//     })
//   ).toBeVisible({ timeout: 30000 });
//     await page.waitForTimeout(3000);

//   console.log('Redirected to Build and Search Inventory page 🎉');

//   // =========================
//   // DATA DRIVEN VALIDATION
//   // =========================
//   for (const vehicle of vehicles) {
//     console.log(`\n====================================`);
//     console.log(`🔍 Validating ${vehicle.name}`);
//     console.log(`====================================`);

//     // Open model page directly
//     await page.goto(
//       `https://www.hyundaiusa.com/us/en/build?modelName=${vehicle.modelName}`,
//       {
//          waitUntil: 'domcontentloaded',
//         timeout: 30000
//       }
//     );

//     // Wait for cards
//     await page.waitForSelector(
//       '#bsi-vehicle-cards .bsi-model-card-container',
//       {
//         timeout: 30000
//       }
//     );

//     const cards = page.locator(
//       '#bsi-vehicle-cards .bsi-model-card-container'
//     );

//     const count = await cards.count();

//     expect(count).toBeGreaterThan(0);

//     const card = cards
//       .filter({
//         hasText: vehicle.name
//       })
//       .first();

//     await card.scrollIntoViewIfNeeded();

//     await expect(card).toBeVisible();

//     const cardText = (await card.textContent()) || '';

//     // =========================
//     // NAME VALIDATION
//     // =========================
//     expect(cardText).toContain(vehicle.name);

//     console.log(`✔ Name Validation Passed`);
//     console.log(`   Expected : ${vehicle.name}`);

//     // =========================
//     // PRICE VALIDATION
//     // =========================
//     await expect(card).toContainText(vehicle.price);

//     console.log(`✔ Price Validation Passed`);
//     console.log(`   Expected : ${vehicle.price}`);

//     // =========================
//     // IMAGE VALIDATION
//     // =========================
//     const image = card.locator('img').first();

//     await expect(image).toBeVisible();

//     console.log(`✔ Image Validation Passed`);

//     // =========================
//     // CARD VALIDATION
//     // =========================
//     console.log(`✔ Vehicle Card Found`);

//     console.log(`✅ ${vehicle.name} | PASS`);
//   }

//   console.log(
//     '\n🎉 ALL BSI MODELS VALIDATED SUCCESSFULLY 🎉\n'
//   );
// });