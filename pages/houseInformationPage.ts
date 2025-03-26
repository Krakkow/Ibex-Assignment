import { expect, Page } from "@playwright/test";
import { waitForPageLoad } from "../utils/waitHelper";
import { formatDateToExpectedFormat } from "../utils/dateHelper";

export class HouseInformationPage {
  constructor(private bestHouseTab: Page) {}
  private popupWindow = this.bestHouseTab.getByTestId("modal-container");
  private popupCloseButton = this.bestHouseTab.locator('button[aria-label="Close"]');
  private locationTitle = this.bestHouseTab.locator('//*[@id="site-content"]/div/div[1]/div[3]/div/div[1]/div/div[1]/div/div/div/section/div[1]/h2');
  private checkInDate = this.bestHouseTab.getByTestId("change-dates-checkIn");
  private checkoutDate = this.bestHouseTab.getByTestId("change-dates-checkOut");
  private guestsAmount = this.bestHouseTab.locator('div[id="GuestPicker-book_it-trigger"] span');

  async checkIfPopupExists(): Promise<boolean> {
    await waitForPageLoad(this.bestHouseTab);
    const isVisible = await this.popupWindow.isVisible();
    console.log(`Popup is visible: ${isVisible}`);
    return isVisible;
  }

  async closePopup() {
    if (await this.checkIfPopupExists()) {
      if (await this.popupCloseButton.isVisible()) {
        await this.popupCloseButton.click();
        console.log("Popup closed");
      } else {
        console.log("Close button isn't visible, trying to close the popup by clicking outside");
        await this.bestHouseTab.mouse.click(10, 10);
      }

      console.log("Popup closed");
    }
  }

  async validateHouseLocation(expectedLocation: string) {
    console.log("Validating house location");
    const locationText = await this.locationTitle.textContent();
    expect(locationText?.toLowerCase()).toContain(expectedLocation.toLowerCase());
    console.log(`House location validated: ${locationText}`);
  }

  async validateCheckInDate(expectedCheckInDate: string) {
    console.log("Validating check-in date");
    await this.checkInDate.waitFor({ state: "visible" });
    const actualCheckInDate = await this.checkInDate.textContent();
    if (!actualCheckInDate) {
      throw new Error("Check-in date not found");
    }
    const formattedActualCheckInDate = formatDateToExpectedFormat(actualCheckInDate);
    expect(formattedActualCheckInDate).toBe(expectedCheckInDate);
    console.log(`Check-in date validated: ${actualCheckInDate}`);
  }

  async validateCheckoutDate(expectedCheckoutDate: string) {
    console.log("Validating checkout date");
    const actualCheckoutDate = await this.checkoutDate.textContent();
    if (!actualCheckoutDate) {
      throw new Error("Checkout date not found");
    }
    const formattedActualCheckoutDate = formatDateToExpectedFormat(actualCheckoutDate);
    expect(formattedActualCheckoutDate).toBe(expectedCheckoutDate);
    console.log(`Checkout date validated: ${actualCheckoutDate}`);
  }

  async validateGuestAmount(expectedGuests: number) {
    console.log("Validating guest count...");
    let actualGuestText = await this.guestsAmount.textContent();
    if (!actualGuestText) {
      throw new Error("Failed to retrieve guest count.");
    }
    actualGuestText = actualGuestText.trim();
    const actualGuests = parseInt(actualGuestText.match(/\d+/)?.[0] || "0");
    expect(actualGuests).toBe(expectedGuests);
    console.log(`Guest count validated successfully.`);
  }
}
