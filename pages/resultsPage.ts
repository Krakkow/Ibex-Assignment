import { Page } from "@playwright/test";

export class ResultsPage {
  constructor(private page: Page) {}
  private availableHouses = this.page.getByTestId("card-container");
  private availableHousesCount = this.availableHouses.count();

  private async extractRatingFromHouse(listingIndex: number): Promise<number> {
    const house = this.availableHouses.nth(listingIndex);
    const possibleRatingElements = house.locator('.//span[@aria-hidden="true" and matches(text(), "★")]');
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

  // async getHigestRatedHouses() {
  //   // const availableHousesCount = await this.availableHouses.count();
  //   if ((await this.availableHousesCount) === 0) {
  //     throw new Error("No houses available for the selected dates and guests");
  //   }

  //   let highestRatedHouse = null;
  //   let highestRating = 0;
  //   for (let i = 0; i < await this.availableHousesCount; i++) {
  //     const house = this.availableHouses.nth(i);
  //     const rating = await this.extractRatingFromHouse(house);
  //     if (rating > highestRating) {
  //       highestRating = rating;
  //       highestRatedHouse = house;
  //     }
  //   }
  //   if (!highestRatedHouse) {
  //     throw new Error("No houses available for the selected dates and guests");
  //   }
  //   return highestRatedHouse;
  // }

  // async selectHighestRatedHouse() {
  //   const bestHouse = await this.getHigestRatedHouses();
  //   await bestHouse.click();
  // }
}
