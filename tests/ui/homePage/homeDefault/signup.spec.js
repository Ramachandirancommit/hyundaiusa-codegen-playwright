 // tests/ui/homePage/homeDefault/email-signup.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(60000);

test('Email Signup - Hyundai Updates', async ({ page }) => {
  // Setup page with ZIP and cookies
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en', '10010');
  
  // Handle Close button if exists
  try {
    await page.getByRole('button', { name: 'Close' }).click({ timeout: 3000 });
  } catch {
    // Close button not present, continue
  }
  
  await page.waitForTimeout(1000);
  
  // Click Hyundai Logo (ensure on home page)
  await page.getByRole('link', { name: 'Hyundai Logo' }).click();
  await page.waitForTimeout(1000);
  
  // Click "Send me Hyundai updates"
  await page.getByText('Send me Hyundai updates.').click();
  await page.waitForTimeout(1000);
  
  // Enter email address
  await page.getByRole('textbox', { name: 'Enter your email address' }).click();
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill('rmani@autoeveramerica.com');
  await page.waitForTimeout(500);
  
  // Click Continue signing up button
  await page.getByRole('button', { name: 'Continue signing up' }).click();
  await page.waitForTimeout(2000);
  
  // Fill registration form
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill('mani');
  await page.getByRole('textbox', { name: 'First Name*' }).press('Tab');
  
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('ramachandiran');
  await page.getByRole('textbox', { name: 'Last Name*' }).press('Tab');
  
  await page.getByRole('textbox', { name: 'Email Address*' }).click();
  await page.locator('#hrb-phone-number').click();
  await page.locator('#hrb-phone-number').fill('(891) 234-7283');
  
  // Check consent checkbox
  await page.locator('#hrb-form-consent').click();
  
  // Select dealership
  await page.locator('span').filter({ hasText: 'Koeppel Hyundai' }).click();
  
  // Check optional checkbox
  await page.locator('#hrb-form-optional-checkbox').click();
  
  // Select vehicle interests
  await page.locator('.multiselect__tags').click();
  await page.locator('#hrb-multiselect').getByText('VENUE').click();
  await page.locator('span').filter({ hasText: 'KONA' }).nth(4).click();
  await page.getByText('KONA Electric', { exact: true }).click();
  
  await page.waitForTimeout(1000);
  
  // Submit the form
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(3000);
  
  // Verify success message
  await expect(page.getByText('Keep in touch. ⁠')).toBeVisible();
  await expect(page.getByText('Success!')).toBeVisible();
  
  console.log('✅ Email signup test passed!');
});