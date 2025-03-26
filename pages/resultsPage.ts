import { Page } from "@playwright/test";
import { waitForPageLoad } from "../utils/waitHelper";

export class ResultsPage {
  constructor(private page: Page) {}

  private availableHouses = this.page.getByTestId("card-container");

  private async getAvailableHousesCount(): Promise<number> {
    await waitForPageLoad(this.page);
    return await this.availableHouses.count();
  }

  private async extractRatingFromHouse(listingIndex: number): Promise<number | null> {
    const house = this.availableHouses.nth(listingIndex);
    const possibleRatingElements = house.locator('xpath=.//span[contains(text(), "out of 5")]');
    const possibleRatingElementsCount = await possibleRatingElements.count();
    for (let i = 0; i < possibleRatingElementsCount; i++) {
      const ratingText = await possibleRatingElements.nth(i).textContent();
      console.log(`Extracted rating text: ${ratingText}`);
      if (ratingText && /^\d/.test(ratingText.trim())) {
        const ratingMatch = ratingText.match(/^\d+(\.\d+)?/);
        if (ratingMatch) {
          return parseFloat(ratingMatch[0]);
        }
      }
    }
    return null;
  }

  async getHighestRatedHouses() {
    const listingCount = await this.getAvailableHousesCount();
    console.log(`Found ${listingCount} listings on the search results page.`);
    if (listingCount === 0) {
      throw new Error("No listings found on the search results page.");
    }
    let highestRatedHouse = null;
    let highestRating = 0;
    for (let i = 0; i < listingCount; i++) {
      const house = this.availableHouses.nth(i);
      const rating = await this.extractRatingFromHouse(i);
      console.log(`Listing ${i} has rating: ${rating}`);
      if (rating !== null && rating > highestRating) {
        highestRating = rating;
        highestRatedHouse = house;
      }
    }

    if (!highestRatedHouse) {
      throw new Error("No valid ratings found.");
    }

    return highestRatedHouse;
  }
}
