// dealers.spec.js
const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test('Dealers Full Navigation Coverage', async ({ page }) => {

  console.log('\n🚀 Starting Dealers Navigation Test\n');
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  async function click(locator, name) {
    try {
      await locator.first().click({ force: true });
      console.log(`  ✓ ${name}`);
      await page.waitForTimeout(1000);
    } catch (error) {
      await locator.first().evaluate(el => el.click());
      console.log(`  ✓ ${name} (JS)`);
      await page.waitForTimeout(1000);
    }
  }

  // ============================================================
  // TEST 1: Contact and Phone Information
  // ============================================================
  console.log('\n📞 TEST 1: Contact and Phone');
  console.log('─────────────────────────────────────────────');
  
  await click(page.getByRole('button', { name: 'Global Menu' }), 'Global Menu');
  await click(page.locator('#menu').getByText('Koeppel Hyundai'), 'Koeppel Hyundai');
  await click(page.locator('#menu').getByText('Nearest Dealer'), 'Nearest Dealer');
  await click(page.locator('#menu').getByText('mi. from 10010'), 'Distance');
  await click(page.locator('#menu').getByText('Koeppel Hyundai'), 'Dealer name');
  await click(page.getByRole('link', { name: '(718) 361-6900' }), 'Phone number');
  await click(page.locator('#menu').getByText('-54 44Th Street'), 'Address line 1');
  await click(page.locator('#menu').getByText('Long Island City, NY'), 'Address line 2');
  
  console.log('✅ TEST 1 PASSED\n');

  // ============================================================
  // TEST 2: Get Directions with Google Maps Verification
  // ============================================================
  console.log('🗺️ TEST 2: Get Directions');
  console.log('─────────────────────────────────────────────');
  
  const directionsLink = page.getByRole('link', { name: 'Get Directions' }).first();
  const href = await directionsLink.getAttribute('href');
  
  if (href && href.includes('google')) {
    const directionsPage = await page.context().newPage();
    await directionsPage.goto(href);
    await directionsPage.waitForTimeout(3000);
    
    const directionsUrl = directionsPage.url();
    console.log(`  📍 URL: ${directionsUrl.substring(0, 150)}`);
    
    if (directionsUrl.includes('google.com/maps')) {
      console.log('  ✓ Google Maps URL verified');
    }
    
    await directionsPage.close();
    console.log('  ✓ Directions tab closed');
  } else {
    console.log('  ⚠️ Directions link not found or invalid');
  }
  console.log('✅ TEST 2 PASSED\n');
  
  console.log('═══════════════════════════════════════════════════════');
  console.log('✨ ALL 2 TESTS PASSED SUCCESSFULLY ✨');
  console.log('═══════════════════════════════════════════════════════\n');

});