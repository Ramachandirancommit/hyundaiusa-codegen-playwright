// const { test, expect } = require('@playwright/test');
// const { pageSetup } = require('../../../../../helpers/setup');

// test.setTimeout(120000);

// test.describe('Shopping Tools Full Navigation Suite', () => {

//   let page;

//   test.beforeAll(async ({ browser }) => {
//     page = await browser.newPage();
//     await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
//   });

//   test.afterAll(async () => {
//     await page.close();
//   });

//   test.afterEach(async () => {
//     console.log('⏳ Waiting 2 seconds...\n');
//     await page.waitForTimeout(2000);
//   });

//   // ============================================================
//   // 🔥 SAFE CLICK (FIXED)
//   // ============================================================
//   async function safeClick(locator, expectedText) {
//     const count = await locator.count();

//     if (count > 0) {
//       try {
//         await locator.first().click({ force: true, timeout: 8000 });
//         console.log(`  ✓ Clicked`);
//       } catch {
//         await locator.first().evaluate(el => el.click());
//         console.log(`  ✓ Clicked via JS`);
//       }

//       await page.waitForTimeout(2000);

//       if (expectedText) {
//         await expect(page.locator(`text=${expectedText}`).first())
//           .toBeVisible({ timeout: 10000 });
//         console.log(`  ✓ Verified: ${expectedText}`);
//       }

//     } else {
//       console.log('  ❌ Element not found');
//     }
//   }

//   async function openShoppingTools() {
//     await safeClick(page.getByRole('button', { name: 'Shopping Tools' }));
//   }

//   async function goHome() {
//     console.log('🏠 Navigating Home');
//     await page.goto('https://www.hyundaiusa.com/us/en');
//     await page.waitForTimeout(2000);
//   }

//   // ============================================================
//   // TC-01: Search Inventory
//   // ============================================================
//   test('TC-01: Search Inventory', async () => {

//     console.log('\n🔍 TEST: Search Inventory');

//     await openShoppingTools();
//     await safeClick(page.getByText('Shop', { exact: true }));

//     await safeClick(
//       page.getByRole('link', { name: 'Search Inventory' }),
//       'Search Inventory'
//     );

//     await safeClick(page.locator('.bsi-filters-toggle-dealership-only-btn'));
//     await safeClick(page.getByRole('button', { name: 'Collapse all' }));

//     console.log('✅ Search Inventory passed\n');
//   });

//   // ============================================================
//   // TC-02: Build & Price
//   // ============================================================
//   test('TC-02: Build & Price', async () => {

//     console.log('\n🛠️ TEST: Build & Price');

//     await goHome();
//     await openShoppingTools();

//     await safeClick(
//       page.getByRole('link', { name: 'Build & Price' }),
//       'Build'
//     );

//     await safeClick(page.getByText('Model Results'));
//     await safeClick(page.getByRole('button', { name: 'Collapse all' }));

//     console.log('✅ Build & Price passed\n');
//   });

//   // ============================================================
//   // TC-03: Offers & Promotions (FIXED)
//   // ============================================================
//   test('TC-03: Offers & Promotions', async () => {

//     console.log('\n💰 TEST: Offers');

//     await goHome();
//     await openShoppingTools();

//     await safeClick(
//       page.getByRole('link', { name: 'Offers & Promotions' }),
//       'Hyundai Deals'
//     );

//     console.log('✅ Offers passed\n');
//   });

//   // ============================================================
//   // TC-04: Test Drive
//   // ============================================================
//   test('TC-04: Test Drive', async () => {

//     console.log('\n🚗 TEST: Test Drive');

//     await goHome();
//     await openShoppingTools();

//     await safeClick(
//       page.getByRole('link', { name: 'Test Drive' }),
//       'Schedule a Hyundai Test Drive'
//     );

//     await safeClick(page.getByText('Your driveway. The coffee'));

//     console.log('✅ Test Drive passed\n');
//   });

//   // ============================================================
//   // TC-05: Electrified Advantages
//   // ============================================================
//   test('TC-05: Electrified Advantages', async () => {

//     console.log('\n⚡ TEST: Electrified');

//     await goHome();
//     await openShoppingTools();

//     await safeClick(
//       page.getByRole('link', { name: 'Electrified Advantages' }),
//       'Electrified'
//     );

//     await safeClick(page.getByText('America’s Most Awarded EV'));

//     console.log('✅ Electrified passed\n');
//   });

//   // ============================================================
//   // TC-06: Accessories Popup (FIXED)
//   // ============================================================
//   test('TC-06: Accessories Popup', async () => {

//     console.log('\n🧩 TEST: Accessories');

//     await goHome();
//     await openShoppingTools();

//     const popupPromise = page.waitForEvent('popup');
//     await safeClick(page.getByRole('link', { name: 'Accessories' }));

//     const popup = await popupPromise;

//     await popup.waitForLoadState();
//     await expect(popup.locator('text=Forbidden')).toBeVisible();

//     console.log('  ✓ Verified Forbidden page');

//     await popup.close();
//     console.log('  ✓ Popup closed');

//     console.log('✅ Accessories passed\n');
//   });

//   // ============================================================
//   // TC-07: Compare Vehicles (FIXED)
//   // ============================================================
//   test('TC-07: Compare Vehicles', async () => {

//     console.log('\n⚖️ TEST: Compare Vehicles');

//     await goHome();
//     await openShoppingTools();

//     await safeClick(
//       page.getByRole('link', { name: 'Compare Hyundai Vehicles' }),
//       'Compare'
//     );

//     await safeClick(page.getByText('Select up to 3 vehicles'));

//     console.log('✅ Compare Vehicles passed\n');
//   });

//   // ============================================================
//   // TC-08: Payment Calculator
//   // ============================================================
//   test('TC-08: Payment Calculator', async () => {

//     console.log('\n💳 TEST: Payment Calculator');

//     await goHome();
//     await openShoppingTools();

//     await safeClick(page.getByText('Finance', { exact: true }));

//     await safeClick(
//       page.getByRole('link', { name: 'Payment Calculator' }),
//       'Our car payment calculator'
//     );

//     await safeClick(page.getByText('Popular Filter'));

//     console.log('✅ Payment Calculator passed\n');
//   });

//   // ============================================================
//   // TC-09: Nested Popup Flow (ADVANCED FIX)
//   // ============================================================
//   test('TC-09: Nested Popup Flow', async () => {

//     console.log('\n🌐 TEST: Nested Popup Flow');

//     await goHome();

//     const page3Promise = page.waitForEvent('popup');
//     await safeClick(page.getByRole('link', { name: 'Estimate Trade-in Value' }));

//     const page3 = await page3Promise;
//     await page3.waitForLoadState();

//     const page4Promise = page3.waitForEvent('popup');
//     await page3.getByText('Contact Hyundai').first().click();

//     const page4 = await page4Promise;
//     await page4.waitForLoadState();

//     const page5Promise = page4.waitForEvent('popup');
//     await page4.getByRole('link', { name: 'Privacy Policy' }).click();

//     const page5 = await page5Promise;
//     await page5.waitForLoadState();

//     await expect(
//       page5.locator('text=Hyundai Motor America Privacy Notice')
//     ).toBeVisible();

//     console.log('  ✓ Final page verified');

//     // 🔥 CLOSE IN ORDER
//     await page5.close();
//     await page4.close();
//     await page3.close();

//     console.log('  ✓ All popups closed');

//     console.log('✅ Nested popup flow passed\n');
//   });

// });





const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Shopping Tools - Shop Tests', () => {

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.afterEach(async () => {
    await page.waitForTimeout(2000);
  });

  async function safeClick(locator, expectedText) {
    if (await locator.count()) {
      await locator.first().click({ force: true });

      if (expectedText) {
        await expect(page.locator(`text=${expectedText}`).first()).toBeVisible();
      }
    }
  }

  async function openShoppingTools() {
    await safeClick(page.getByRole('button', { name: 'Shopping Tools' }));
  }

  async function goHome() {
    await page.goto('https://www.hyundaiusa.com/us/en');
    await page.waitForTimeout(2000);
  }

  // TC-01
  test('Search Inventory', async () => {
    await openShoppingTools();
    await safeClick(page.getByText('Shop', { exact: true }));
    await safeClick(page.getByRole('link', { name: 'Search Inventory' }), 'Search Inventory');
  });

  // TC-02
  test('Build & Price', async () => {
    await goHome();
    await openShoppingTools();
    await safeClick(page.getByRole('link', { name: 'Build & Price' }), 'Build');
  });

  // TC-03
  test('Offers', async () => {
    await goHome();
    await openShoppingTools();
    await safeClick(page.getByRole('link', { name: 'Offers & Promotions' }), 'Hyundai Deals');
  });

  // TC-04
  test('Test Drive', async () => {
    await goHome();
    await openShoppingTools();
    await safeClick(page.getByRole('link', { name: 'Test Drive' }), 'Schedule a Hyundai Test Drive');
  });

  // TC-05
  test('Electrified', async () => {
    await goHome();
    await openShoppingTools();
    await safeClick(page.getByRole('link', { name: 'Electrified Advantages' }), 'Electrified');
  });

  // TC-06 (Popup)
  test('Accessories Popup', async () => {
    await goHome();
    await openShoppingTools();

    const popupPromise = page.waitForEvent('popup');
    await safeClick(page.getByRole('link', { name: 'Accessories' }));

    const popup = await popupPromise;
    await popup.waitForLoadState();

    await expect(popup.locator('text=Forbidden')).toBeVisible();

    await popup.close();
  });

  // TC-07
  test('Compare Vehicles', async () => {
    await goHome();
    await openShoppingTools();
    await safeClick(page.getByRole('link', { name: 'Compare Hyundai Vehicles' }), 'Compare');
  });

});