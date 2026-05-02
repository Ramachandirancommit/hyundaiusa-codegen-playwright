// tests/ui/homePage/footer/social-links.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(90_000);

const SOCIAL_LINKS = [
  { name: 'Facebook', selector: 'a[href*="facebook.com"]', expected: /facebook/ },
  { name: 'X', selector: 'a[href*="x.com"], a[href*="twitter.com"]', expected: /(x|twitter)/ },
  { name: 'Instagram', selector: 'a[href*="instagram.com"]', expected: /instagram/ },
  { name: 'YouTube', selector: 'a[href*="youtube.com"]', expected: /youtube/ },
];

async function scrollFooter(page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
}

test('Social Links Validation', async ({ page, context }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  await scrollFooter(page);

  for (const item of SOCIAL_LINKS) {

    const link = page.locator(item.selector).first();

    if (!(await link.count())) continue;

    console.log(`➡ Testing ${item.name}`);

    let popup;

    try {
      [popup] = await Promise.all([
        context.waitForEvent('page', { timeout: 10000 }),
        link.click(),
      ]);

      await popup.waitForLoadState();

      expect(popup.url()).toMatch(item.expected);

      console.log(`✔ ${item.name} popup validated`);

      await popup.close();

    } catch {
      // fallback same tab
      await page.waitForTimeout(2000);

      expect(page.url()).toMatch(item.expected);

      console.log(`✔ ${item.name} same-tab validated`);

      await page.goBack();
    }
  }

  console.log('\n✅ Social links verified');
});