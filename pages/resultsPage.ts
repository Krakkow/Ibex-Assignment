import { Page } from "@playwright/test";

export class ResultsPage {
  constructor(private page: Page) {}
  private availableHouses = this.page.getByTestId("card-container");
  private availableHousesCount = this.availableHouses.count();

  private async extractRatingFromHouse(listingIndex: number): Promise<number> {
    const house = this.availableHouses.nth(listingIndex);
    const possibleRatingElements = house.locator('xpath=.//span[contains(text(), "out of 5")]');
    const possibleRatingElementsCount = await possibleRatingElements.count();
    for (let i = 0; i < possibleRatingElementsCount; i++) {
      const ratingElement = possibleRatingElements.nth(i).textContent();
      console.log(ratingElement);
      //   if (ratingElement && /^\d/.test(ratingElement.trim())) {
      //     const ratingMatch = ratingElement.match(/^\d+(\.\d+)?/);
      //     if (ratingMatch) {
      //       return parseFloat(ratingMatch[0]);
      //     }
      //   }
    }
    return 0;
  }

  async getHighestRatedHouses() {
    const listingCount = await this.availableHouses.count();
    console.log(`Found ${listingCount} listings on the search results page.`);
    if (listingCount === 0) {
      throw new Error("No listings found on the search results page.");
    }
    let highestRatedHouse = null;
    let highestRating = 0;
    for (let i = 0; i < listingCount; i++) {
      const house = this.page.getByTestId("card-container").nth(i);
      const rating = await this.extractRatingFromHouse(i);
      console.log(`Listing ${i} has rating: ${rating}`);
      if (rating > highestRating) {
        highestRating = rating;
        highestRatedHouse = this.availableHouses.nth(i);
      }
    }

    if (!highestRatedHouse) {
      throw new Error("No valid ratings found.");
    }

    return highestRatedHouse;
  }
}
