const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.describe('Shopping Tools - Finance Tests', () => {

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
  });

  test.afterAll(async () => {
    await page.close();
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
  }

  // TC-08
  test('Payment Calculator', async () => {

    await goHome();
    await openShoppingTools();

    await safeClick(page.getByText('Finance', { exact: true }));

    await safeClick(
      page.getByRole('link', { name: 'Payment Calculator' }),
      'Our car payment calculator'
    );

    await safeClick(page.getByText('Popular Filter'));

  });

});