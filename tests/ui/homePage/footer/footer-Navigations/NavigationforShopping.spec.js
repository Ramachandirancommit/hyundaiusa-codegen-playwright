// NavigationforShopping.spec.js
const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test('Verify the footer navigations - Shopping Tools section', async ({ page }) => {
  
  // ==========================================
  // MODULE 1: INITIAL SETUP
  // ==========================================
  console.log('\n🔧 MODULE 1: Initial Setup');
  console.log('========================================');
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');

  // ==========================================
  // MODULE 2: SHOP HYUNDAI
  // ==========================================
  console.log('\n🚗 MODULE 2: Shop Hyundai');
  console.log('========================================');
  await page.getByRole('heading', { name: 'Shopping Tools' }).click();
  await page.getByRole('link', { name: 'Shop Hyundai' }).click();
  await page.waitForTimeout(3000);
  await page.getByRole('heading', { name: 'Shop Hyundai' }).click();
  await page.getByText('We’ve put everything you need').click();
  await page.getByText('Just getting started? Check').click();
  console.log('  ✓ Shop Hyundai module completed');

  // ==========================================
  // MODULE 3: FIND A DEALER
  // ==========================================
  console.log('\n📍 MODULE 3: Find a Dealer');
  console.log('========================================');
  await page.getByRole('link', { name: 'Find a Dealer' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('heading', { name: 'Find a Hyundai dealership in' }).click();
  console.log('  ✓ Find a Dealer module completed');

  // ==========================================
  // MODULE 4: BUILD & SEARCH INVENTORY
  // ==========================================
  console.log('\n🔧 MODULE 4: Build & Search Inventory');
  console.log('========================================');
  await page.getByRole('link', { name: 'Build & Search Inventory' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('heading', { name: 'Build and Search Inventory' }).click();
  console.log('  ✓ Build & Search Inventory module completed');

  // ==========================================
  // MODULE 5: OFFERS & PROMOTIONS
  // ==========================================
  console.log('\n🎁 MODULE 5: Offers & Promotions');
  console.log('========================================');
  await page.getByRole('link', { name: 'Offers & Promotions', exact: true }).click();
  await page.waitForTimeout(2000);
  await page.getByText('Hyundai Deals and Special').click();
  console.log('  ✓ Offers & Promotions module completed');

  // ==========================================
  // MODULE 6: REQUEST A QUOTE
  // ==========================================
  console.log('\n📝 MODULE 6: Request a Quote');
  console.log('========================================');
  await page.locator('footer').getByRole('link', { name: 'Request a Quote' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('heading', { name: 'Request a Quote' }).click();
  await page.getByText('Select a vehicle', { exact: true }).click();
  await page.getByText('Choose a dealer Select up to').click();
  await page.getByText('Enter your info').click();
  console.log('  ✓ Request a Quote module completed');

  // ==========================================
  // MODULE 7: SCHEDULE A TEST DRIVE
  // ==========================================
  console.log('\n🚙 MODULE 7: Schedule a Test Drive');
  console.log('========================================');
  await page.getByRole('link', { name: 'Schedule a Test Drive' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('heading', { name: 'Schedule a Hyundai Test Drive' }).click();
  await page.getByText('Your driveway. The coffee').click();
  console.log('  ✓ Schedule a Test Drive module completed');

  // ==========================================
  // MODULE 8: SEARCH CERTIFIED USED VEHICLES
  // ==========================================
  console.log('\n✅ MODULE 8: Search Certified Used Vehicles');
  console.log('========================================');
  await page.getByRole('link', { name: 'Search Certified Used Vehicles' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('heading', { name: 'Find Your Hyundai' }).click();
  await page.getByRole('heading', { name: 'Showing 1-12 of 793 matches' }).click();
  console.log('  ✓ Search Certified Used Vehicles module completed');

  // ==========================================
  // MODULE 9: COMPARE VEHICLES
  // ==========================================
  console.log('\n📊 MODULE 9: Compare Vehicles');
  console.log('========================================');
  await page.getByRole('link', { name: 'Compare our Vehicles' }).click();
  await page.waitForTimeout(2000);
  await page.getByText('Popular filters').click();
  await page.getByRole('heading', { name: 'Shopping 31 vehicles' }).click();
  console.log('  ✓ Compare Vehicles module completed');

  // ==========================================
  // MODULE 10: CALCULATE PAYMENT
  // ==========================================
  console.log('\n💰 MODULE 10: Calculate Payment');
  console.log('========================================');
  await page.getByRole('link', { name: 'Calculate a Payment' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('heading', { name: 'Our car payment calculator' }).click();
  await page.getByText('Popular Filter').click();
  await page.getByText('Estimated Payment Calculator').click();
  console.log('  ✓ Calculate Payment module completed');

  // ==========================================
  // MODULE 11: ESTIMATE TRADE-IN VALUE (NEW TAB)
  // ==========================================
  console.log('\n💲 MODULE 11: Estimate Trade-in Value');
  console.log('========================================');
  
  // Open trade-in value in new tab
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Estimate Trade-in Value', exact: true }).click();
  const tradeInPage = await page1Promise;
  
  // Wait for new tab to load completely
  await tradeInPage.waitForTimeout(3000);
  console.log('  ✓ Trade-in Value page opened in new tab');
  
  // Verify trade-in value page content
  await tradeInPage.getByRole('heading', { name: 'Trade-in Value' }).click();
  await tradeInPage.getByText('In just a few seconds you can').click();
  await tradeInPage.getByRole('link', { name: 'Hyundai Logo' }).click();
  console.log('  ✓ Trade-in Value verification completed');
  
  // Close the trade-in value tab
  await tradeInPage.close();
  console.log('  ✓ Trade-in Value tab closed successfully');
  
  // CRITICAL: Wait and ensure focus returns to main page and any overlays are gone
  await page.waitForTimeout(2000);
  
  // Scroll to top to avoid footer interception issues
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // ==========================================
  // MODULE 12: APPLY FOR CREDIT (Fixed interception issue)
  // ==========================================
  console.log('\n💳 MODULE 12: Apply for Credit');
  console.log('========================================');
  
  // Option 1: Use JavaScript click to bypass interception
  await page.getByRole('link', { name: 'Apply for Credit' }).first().evaluate(element => element.click());
  await page.waitForTimeout(3000);
  console.log('  ✓ Credit application page loaded');
  
  await page.getByText('Apply for Auto Financing').click();
  await page.getByText('Save time at the dealership').click();
  await page.getByText('Hyundai Motor Finance’s').click();
  console.log('  ✓ Apply for Credit module completed');

  // ==========================================
  // MODULE 13: HYUNDAI SHOWROOM LIVE
  // ==========================================
  console.log('\n🎬 MODULE 13: Hyundai Showroom Live');
  console.log('========================================');
  await page.getByRole('link', { name: 'Hyundai Showroom Live', exact: true }).click();
  await page.waitForTimeout(3000);
  console.log('  ✓ Showroom Live page loaded');
  
  await page.getByText('Live hosted walkarounds').click();
  await page.getByRole('heading', { name: 'Virtual showroom. Real-time' }).click();
  console.log('  ✓ Hyundai Showroom Live module completed');

  // ==========================================
  // TEST COMPLETION
  // ==========================================
  console.log('\n✅ TEST COMPLETED SUCCESSFULLY');
  console.log('========================================\n');
});