const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(320000);

test.describe('Shopping Tools - Global Saved Tests', () => {

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
    console.log('✓ Setup complete - ready for tests\n');
  });

  test.afterAll(async () => {
    await page.close();
    console.log('✓ Browser closed');
  });

  test('Global Saved Features Navigation', async () => {

    console.log('\n💾 Starting Global Saved Features Navigation test...');

    console.log('  → Opening Global Saved menu');
    await page.getByRole('button', { name: 'Global Saved' }).click();
    
    console.log('  → Clicking Builds tab');
    await page.getByRole('button', { name: 'Builds' }).click();
    
    console.log('  → Clicking New inventory tab');
    await page.getByRole('button', { name: 'New inventory' }).click();
    
    console.log('  → Clicking Certified used tab');
    await page.getByRole('tab', { name: 'Certified used' }).click();
    
    console.log('  → Clicking Builds tab again');
    await page.getByRole('tab', { name: 'Builds' }).click();
    
    console.log('  → Clicking Start a build link');
    await page.getByRole('link', { name: 'Start a build' }).click();
    
    console.log('  → Clicking Build label');
    await page.getByLabel('Build').first().click();
    
    console.log('  → Clicking heart icon');
    await page.locator('#bv-360-top-nav-heart-anchor-disabled').first().click();
    
    console.log('  → Selecting PALISADE SE');
    await page.locator('#bv-landing').getByText('PALISADE SE').click();
    
    console.log('  → Opening Global Saved menu');
    await page.getByRole('button', { name: 'Global Saved' }).click();
    
    console.log('  → Verifying PALISADE saved vehicle');
    await expect(page.getByLabel('/ 1').getByText('PALISADE', { exact: true })).toBeVisible();
    
    console.log('  → Verifying Clear all option');
    await expect(page.getByText('Clear all Don\'t see a vehicle')).toBeVisible();
    
    console.log('  → Verifying saved date');
    await expect(page.getByText('Saved on 04/27/').first()).toBeVisible();
    
    console.log('  → Clicking New inventory tab');
    await page.getByRole('tab', { name: 'New inventory' }).click();
    
    console.log('  → Clicking Search new inventory link');
    await page.getByRole('link', { name: 'Search new inventory' }).click();
    
    console.log('  → Saving first vehicle');
    await page.locator('#bsi-save-button-heart-disabled-KMHLS4DG3TU108031').click();
    
    console.log('  → Saving second vehicle');
    await page.locator('#bsi-save-button-heart-disabled-KMHLM4DG6TU118479').click();
    
    console.log('  → Opening Global Saved menu');
    await page.getByRole('button', { name: 'Global Saved' }).click();
    
    console.log('  → Clicking New inventory tab');
    await page.getByRole('button', { name: 'New inventory' }).click();
    
    console.log('  → Verifying ELANTRA saved vehicle 1');
    await expect(page.getByLabel('1 / 2').getByText('ELANTRA', { exact: true })).toBeVisible();
    
    console.log('  → Verifying ELANTRA saved vehicle 2');
    await expect(page.getByLabel('2 /').getByText('ELANTRA', { exact: true })).toBeVisible();
    
    console.log('  → Verifying saved date for ELANTRA');
    await expect(page.getByLabel('1 / 2').getByText('Saved on 04/27/')).toBeVisible();
    
    console.log('  → Clicking saved vehicle compare option');
    await page.locator('.gn-v3-saved-vehicle-card.swiper-slide.swiper-slide-next > .gn-v3-saved-vehicle-card-inner > .gn-v3-saved-vehicle-card-model-section-height > .gn-v3-saved-vehicle-card-model-section > .gn-v3-saved-vehicle-card-saved-compare > .gn-v3-saved-vehicle-card-saved').click();
    
    console.log('  → Clicking Certified used tab');
    await page.getByRole('tab', { name: 'Certified used' }).click();
    
    console.log('  → Clicking Search certified used link');
    await page.getByRole('link', { name: 'Search certified used', exact: true }).click();
    
    console.log('  → Clicking Search Certified inventory link');
    await page.getByRole('link', { name: 'Search Certified inventory' }).nth(1).click();
    
    console.log('  → Saving 2025 Elantra SEL');
    await page.getByRole('checkbox', { name: 'save vehicle 2025 Elantra SEL' }).click();
    
    console.log('  → Saving 2025 Elantra Limited');
    await page.getByRole('checkbox', { name: 'save vehicle 2025 Elantra Limited' }).click();
    
    console.log('  → Saving 2020 Elantra Gt');
    await page.getByRole('checkbox', { name: 'save vehicle 2020 Elantra Gt' }).click();
    
    console.log('  → Opening Global Saved menu');
    await page.getByRole('button', { name: 'Global Saved' }).click();
    
    console.log('  → Clicking Certified used tab');
    await page.getByRole('button', { name: 'Certified used' }).click();
    
    console.log('  → Verifying saved date for vehicle 1');
    await expect(page.getByLabel('1 / 3').getByText('Saved on 04/27/')).toBeVisible();
    
    console.log('  → Verifying saved date for vehicle 2');
    await expect(page.getByLabel('2 /').getByText('Saved on 04/27/')).toBeVisible();
    
    console.log('  → Verifying saved date for vehicle 3');
    await expect(page.getByLabel('3 /').getByText('Saved on 04/27/')).toBeVisible();
    
    console.log('  → Verifying Elantra vehicle 1');
    await expect(page.getByLabel('1 / 3').getByText('Elantra', { exact: true })).toBeVisible();
    
    console.log('  → Verifying Elantra vehicle 2');
    await expect(page.getByLabel('2 /').getByText('Elantra', { exact: true })).toBeVisible();
    
    console.log('  → Verifying Elantra Gt vehicle 3');
    await expect(page.getByLabel('3 /').getByText('Elantra Gt')).toBeVisible();
    
    console.log('  → Clicking Builds tab');
    await page.getByRole('tab', { name: 'Builds' }).click();
    
    console.log('  → Clearing all builds');
    await page.getByRole('button', { name: 'Clear all' }).click();
    
    console.log('  → Confirming clear');
    await page.getByRole('button', { name: 'Confirm' }).click();
    
    console.log('  → Clicking New inventory tab');
    await page.getByRole('tab', { name: 'New inventory' }).click();
    
    console.log('  → Clicking Builds tab');
    await page.getByRole('tab', { name: 'Builds' }).click();
    
    console.log('  → Verifying no builds saved message');
    await expect(page.getByText('You have no builds saved.')).toBeVisible();
    
    console.log('  → Clicking New inventory tab');
    await page.getByRole('tab', { name: 'New inventory' }).click();
    
    console.log('  → Clearing all new inventory');
    await page.getByRole('button', { name: 'Clear all' }).click();
    
    console.log('  → Confirming clear');
    await page.getByRole('button', { name: 'Confirm' }).click();
    
    console.log('  → Verifying no new inventory message');
    await expect(page.getByText('You have no new inventory')).toBeVisible();
    
    console.log('  → Clicking Certified used tab');
    await page.getByRole('tab', { name: 'Certified used' }).click();
    
    console.log('  → Clearing all certified used');
    await page.getByRole('button', { name: 'Clear all' }).click();
    
    console.log('  → Confirming clear');
    await page.getByRole('button', { name: 'Confirm' }).click();
    
    console.log('  → Verifying no certified used message');
    await expect(page.getByText('You have no certified used')).toBeVisible();
    
    console.log('✅ Global Saved Features Navigation test passed\n');
  });

});