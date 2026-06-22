class BSIFilterPage {
  constructor(page) {
    this.page = page;

    // Main selectors (stable + scoped)
    this.buildPriceLink = page.getByRole('link', { name: /build & price/i });
    this.closeButton = page.getByRole('button', { name: /close/i });

    // IMPORTANT: scoped filter container
    this.yearFilterButton = page.locator('button[aria-label="year tab"]').first();

    this.checkbox2026 = page.getByRole('checkbox', { name: '2026' });
    this.checkbox2025 = page.getByRole('checkbox', { name: '2025' });
    this.checkbox2024 = page.getByRole('checkbox', { name: '2024' });

    this.modelResultsText = page.getByText('Model Results');
  }

  async openBuildAndPrice() {
    await this.buildPriceLink.click();
    await this.closeButton.click();
    await this.modelResultsText.waitFor({ state: 'visible' });
  }

  async openYearFilter() {
    await this.yearFilterButton.click();
  }

  async selectYear(year) {
    const checkbox = this.page.getByRole('checkbox', { name: String(year) });
    await checkbox.check();
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async validateModelResults() {
    await this.modelResultsText.waitFor({ state: 'visible' });
  }
}

module.exports = { BSIFilterPage };