import { test as base } from '@playwright/test';
import { URLS } from '../constants/urls';

// Base fixture only opens the base URL
export const test = base.extend({
  basePage: async ({ page }, use) => {
    // Go to base URL
    await page.goto(URLS.BASE_URL);

    // Wait until network idle to ensure images fully load
    await page.waitForLoadState('networkidle');

    // Disable animations and transitions for stable screenshots
    await page.addStyleTag({
      content: `
        * {
          animation: none !important;
          transition: none !important;
        }
      `
    });

    // Provide the page object to the tests
    await use(page);
  }
});

export const expect = test.expect;