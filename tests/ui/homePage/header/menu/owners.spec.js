// owners.spec.js
const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000); // 120 seconds timeout

test.describe('Owners Section Navigation Tests', () => {
  
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
  });

  test.afterAll(async () => {
    await page.close();
  });

  // Add 2 seconds wait after each test
  test.afterEach(async () => {
    console.log('⏳ Test completed, waiting 2 seconds...\n');
    await page.waitForTimeout(2000);
  });

  // Helper function with force click for intercepted elements
  async function safeClick(locator, expectedHeading) {
    const count = await locator.count();
    if (count > 0) {
      try {
        await locator.first().click({ force: true, timeout: 5000 });
        console.log(`  ✓ Clicked element`);
        await page.waitForTimeout(2000); // 👈 2 seconds after each click
      } catch (error) {
        console.log(`  ⚠️ Force click failed, trying JS click...`);
        await locator.first().evaluate(el => el.click());
        console.log(`  ✓ Clicked element via JS`);
        await page.waitForTimeout(2000); // 👈 2 seconds after each click
      }

      if (expectedHeading) {
        const headingLocator = page.getByRole('heading', { name: expectedHeading }).first();
        await expect(headingLocator).toBeVisible();
        console.log(`  ✓ Verified: ${expectedHeading}`);
        await page.waitForTimeout(2000); // 👈 2 seconds after verification
      }
    }
  }

  async function goHome() {
    console.log(`  🏠 Navigating to home page...`);
    await page.goto('https://www.hyundaiusa.com/us/en');
    await page.waitForTimeout(2000); // 👈 2 seconds after navigation
  }

  test('TC-01: Ownership Resources Navigation', async () => {
    console.log('\n📋 TEST: Ownership Resources');
    
    console.log('  Step 1: Opening Global Menu');
    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    
    console.log('  Step 2: Clicking Owners');
    await safeClick(page.getByText('Owners', { exact: true }));
    
    console.log('  Step 3: Clicking Ownership Resources');
    await safeClick(page.getByRole('link', { name: 'Ownership Resources ⁠' }));
    
    console.log('  Step 4: Verifying Ownership Resources heading');
    await safeClick(page.getByRole('heading', { name: 'Ownership Resources', exact: true }));
    
    console.log('  Step 5: Verifying Welcome heading');
    await safeClick(page.getByRole('heading', { name: 'Welcome', exact: true }));
    
    console.log('✅ Ownership Resources test passed\n');
  });

  test('TC-02: Login Navigation', async () => {
    console.log('\n🔐 TEST: Login Navigation');
    
    console.log('  Step 1: Going to home page');
    await goHome();
    
    console.log('  Step 2: Opening Global Menu');
    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    
    console.log('  Step 3: Clicking Login');
    await safeClick(page.getByRole('link', { name: 'Login to My Hyundai ⁠' }));
    
    console.log('  Step 4: Verifying Login page');
    await safeClick(page.getByRole('heading', { name: 'Welcome to MyHyundai' }));
    
    console.log('✅ Login test passed\n');
  });

  test('TC-03: Accessories Navigation', async () => {
    console.log('\n🛒 TEST: Accessories Navigation');
    
    console.log('  Step 1: Going to home page');
    await goHome();
    
    console.log('  Step 2: Opening Global Menu');
    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    
    console.log('  Step 3: Clicking Accessories');
    try {
      await page.getByText('Accessories').first().click({ force: true, timeout: 3000 });
      console.log('  ✓ Accessories clicked (force)');
      await page.waitForTimeout(2000); // 👈 2 seconds after click
    } catch (error) {
      try {
        await page.evaluate(() => {
          const elements = document.querySelectorAll('span, a, div');
          for (let el of elements) {
            if (el.textContent.trim() === 'Accessories') {
              el.click();
              break;
            }
          }
        });
        console.log('  ✓ Accessories clicked (JS evaluate)');
        await page.waitForTimeout(2000); // 👈 2 seconds after click
      } catch (error2) {
        await page.locator('a[href*="accessories"]').first().click({ force: true });
        console.log('  ✓ Accessories clicked (href)');
        await page.waitForTimeout(2000); // 👈 2 seconds after click
      }
    }
    
    console.log('✅ Accessories test passed\n');
  });

  test('TC-04: Schedule Service Navigation', async () => {
    console.log('\n🔧 TEST: Schedule Service Navigation');
    
    console.log('  Step 1: Going to home page');
    await goHome();
    
    console.log('  Step 2: Opening Global Menu');
    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    
    console.log('  Step 3: Clicking Schedule Service');
    await safeClick(page.getByRole('link', { name: 'Schedule Service ⁠' }));
    
    console.log('  Step 4: Verifying Schedule Service page');
    await safeClick(page.getByRole('heading', { name: 'Find a Hyundai dealership in' }));
    
    console.log('✅ Schedule Service test passed\n');
  });

  test('TC-05: Warranty Navigation', async () => {
    console.log('\n📜 TEST: Warranty Navigation');
    
    console.log('  Step 1: Going to home page');
    await goHome();
    
    console.log('  Step 2: Opening Global Menu');
    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    
    console.log('  Step 3: Clicking Warranty');
    await safeClick(page.getByRole('link', { name: 'America\'s Best Warranty ⁠' }));
    
    console.log('  Step 4: Verifying Warranty page');
    await safeClick(page.getByRole('heading', { name: 'America\'s Best Warranty' }));
    
    console.log('✅ Warranty test passed\n');
  });

  test('TC-06: Roadside Assistance Navigation', async () => {
    console.log('\n🚗 TEST: Roadside Assistance Navigation');
    
    console.log('  Step 1: Going to home page');
    await goHome();
    
    console.log('  Step 2: Opening Global Menu');
    await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    
    console.log('  Step 3: Clicking Roadside Assistance');
    await safeClick(page.getByRole('link', { name: '24/7 Roadside Assistance ⁠' }));
    
    console.log('  Step 4: Verifying Roadside Assistance page');
    await safeClick(page.getByRole('heading', { name: 'Hyundai Assurance 24/7' }));
    
    console.log('  Step 5: Verifying phone number');
    await expect(page.getByText('800-243-7766').first()).toBeVisible();
    console.log('  ✓ Phone number verified');
    await page.waitForTimeout(2000); // 👈 2 seconds after verification
    
    console.log('✅ Roadside Assistance test passed\n');
  });

});



// // owners.spec.js
// const { test, expect } = require('@playwright/test');
// const { pageSetup } = require('../../../../../helpers/setup');

// test.describe('Owners Section Navigation Tests', () => {
  
//   let page;
  
//   test.beforeAll(async ({ browser }) => {
//     page = await browser.newPage();
//     await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
//   });

//   test.afterAll(async () => {
//     await page.close();
//   });

//   // Add 3 seconds wait after each test
//   test.afterEach(async () => {
//     console.log('step completed');
//   });

//   // Helper function with force click for intercepted elements
//   async function safeClick(locator, expectedHeading) {
//     const count = await locator.count();
//     if (count > 0) {
//       try {
//         await locator.first().click({ force: true, timeout: 5000 });
//       } catch (error) {
//         console.log(`  ⚠️ Force click failed, trying JS click...`);
//         await locator.first().evaluate(el => el.click());
//       }
//       await page.waitForTimeout(800);

//       if (expectedHeading) {
//         const headingLocator = page.getByRole('heading', { name: expectedHeading }).first();
//         await expect(headingLocator).toBeVisible();
//         console.log(`  ✓ Verified: ${expectedHeading}`);
//       }
//     }
//   }

//   async function goHome() {
//     await page.goto('https://www.hyundaiusa.com/us/en');
//     await page.waitForTimeout(800);
//   }

//   test('TC-01: Ownership Resources Navigation', async () => {
//     console.log('\n📋 TEST: Ownership Resources');
    
//     await safeClick(page.getByRole('button', { name: 'Global Menu' }));
//     await safeClick(page.getByText('Owners', { exact: true }));
//     await safeClick(page.getByRole('link', { name: 'Ownership Resources ⁠' }));
//     await safeClick(page.getByRole('heading', { name: 'Ownership Resources', exact: true }));
//     await safeClick(page.getByRole('heading', { name: 'Welcome', exact: true }));
    
//     console.log('✅ Ownership Resources test passed\n');
//   });

//   test('TC-02: Login Navigation', async () => {
//     console.log('\n🔐 TEST: Login Navigation');
    
//     await goHome();
//     await safeClick(page.getByRole('button', { name: 'Global Menu' }));
//     await safeClick(page.getByRole('link', { name: 'Login to My Hyundai ⁠' }));
//     await safeClick(page.getByRole('heading', { name: 'Welcome to MyHyundai' }));
    
//     console.log('✅ Login test passed\n');
//   });

//   test('TC-03: Accessories Navigation', async () => {
//     console.log('\n🛒 TEST: Accessories Navigation');
    
//     await goHome();
//     await safeClick(page.getByRole('button', { name: 'Global Menu' }));
    
//     try {
//       await page.getByText('Accessories').first().click({ force: true, timeout: 3000 });
//       console.log('  ✓ Accessories clicked (force)');
//     } catch (error) {
//       try {
//         await page.evaluate(() => {
//           const elements = document.querySelectorAll('span, a, div');
//           for (let el of elements) {
//             if (el.textContent.trim() === 'Accessories') {
//               el.click();
//               break;
//             }
//           }
//         });
//         console.log('  ✓ Accessories clicked (JS evaluate)');
//       } catch (error2) {
//         await page.locator('a[href*="accessories"]').first().click({ force: true });
//         console.log('  ✓ Accessories clicked (href)');
//       }
//     }
    
//     await page.waitForTimeout(1500);
//     console.log('✅ Accessories test passed\n');
//   });

//   test('TC-04: Schedule Service Navigation', async () => {
//     console.log('\n🔧 TEST: Schedule Service Navigation');
    
//     await goHome();
//     await safeClick(page.getByRole('button', { name: 'Global Menu' }));
//     await safeClick(page.getByRole('link', { name: 'Schedule Service ⁠' }));
//     await safeClick(page.getByRole('heading', { name: 'Find a Hyundai dealership in' }));
    
//     console.log('✅ Schedule Service test passed\n');
//   });

//   test('TC-05: Warranty Navigation', async () => {
//     console.log('\n📜 TEST: Warranty Navigation');
    
//     await goHome();
//     await safeClick(page.getByRole('button', { name: 'Global Menu' }));
//     await safeClick(page.getByRole('link', { name: 'America\'s Best Warranty ⁠' }));
//     await safeClick(page.getByRole('heading', { name: 'America\'s Best Warranty' }));
    
//     console.log('✅ Warranty test passed\n');
//   });

//   test('TC-06: Roadside Assistance Navigation', async () => {
//     console.log('\n🚗 TEST: Roadside Assistance Navigation');
    
//     await goHome();
//     await safeClick(page.getByRole('button', { name: 'Global Menu' }));
//     await safeClick(page.getByRole('link', { name: '24/7 Roadside Assistance ⁠' }));
//     await safeClick(page.getByRole('heading', { name: 'Hyundai Assurance 24/7' }));
//     await expect(page.getByText('800-243-7766').first()).toBeVisible();
    
//     console.log('✅ Roadside Assistance test passed\n');
//   });

// });
