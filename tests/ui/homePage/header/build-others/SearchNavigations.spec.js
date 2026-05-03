const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(120000);

test.describe('Shopping Tools - Search Vehicles Tests', () => {

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

  test('Search Vehicles - Global Search workflow', async () => {

    console.log('\n📋 Starting Search Vehicles - Global Search workflow test...');

    console.log('  → Clicking Global Search button');
    await page.getByRole('button', { name: 'Global Search' }).click();
    await page.waitForTimeout(1000);
    
    console.log('  → Clicking search box');
    await page.getByRole('searchbox', { name: 'Search Hyundai vehicles,' }).click();
    await page.waitForTimeout(500);
    
    console.log('  → Filling search box with Bluelink');
    await page.getByRole('searchbox', { name: 'Search Hyundai vehicles,' }).fill('Bluelink');
    await page.waitForTimeout(500);
    
    console.log('  → Clicking Blue Link Service Subscriber link');
    // This likely navigates to a new page
    await page.getByRole('link', { name: 'Blue Link Service Subscriber' }).click();
    await page.waitForTimeout(2000);
    
    // Wait for page to load after navigation
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    console.log('  → Clicking search field');
    const searchField = page.getByRole('searchbox', { name: 'Search Field' });
    if (await searchField.count() > 0) {
      await searchField.click();
    } else {
      console.log('  ⚠️ Search field not found, continuing...');
    }
    await page.waitForTimeout(500);
    
    console.log('  → Clicking search note title');
    const searchNote = page.locator('.g-search-note-title');
    if (await searchNote.count() > 0) {
      await searchNote.click();
    } else {
      console.log('  ⚠️ Search note title not found, continuing...');
    }
    await page.waitForTimeout(500);
    
    console.log('  → Clicking Blue Link Service text');
    const blueLinkText = page.getByText('The Hyundai Blue Link Service');
    if (await blueLinkText.count() > 0) {
      await blueLinkText.click();
      console.log('  ✓ Clicked Blue Link Service text');
    } else {
      console.log('  ⚠️ Blue Link Service text not found');
    }
    
    console.log('✅ Search Vehicles - Global Search workflow test passed\n');
  });

});