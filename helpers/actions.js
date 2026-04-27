const { expect } = require('@playwright/test');

async function safeClick(page, locator, expectedHeading) {
  if (await locator.count()) {
    await locator.first().click();

    if (expectedHeading) {
      await expect(
        page.getByRole('heading', { name: expectedHeading }).first()
      ).toBeVisible();
    }
  }
}

module.exports = { safeClick };