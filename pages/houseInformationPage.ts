import { expect, Page } from "@playwright/test";
import { waitForPageLoad } from "../utils/waitHelper";
import { formatDateToExpectedFormat } from "../utils/dateHelper";
import { selectDates } from "../utils/dateUtils";

export class HouseInformationPage {
  constructor(private bestHouseTab: Page) {}
  private popupWindow = this.bestHouseTab.getByTestId("modal-container");
  private popupCloseButton = this.bestHouseTab.locator('button[aria-label="Close"]');
  private locationTitle = this.bestHouseTab.locator('//*[@id="site-content"]/div/div[1]/div[3]/div/div[1]/div/div[1]/div/div/div/section/div[1]/h2');
  private checkInDate = this.bestHouseTab.getByTestId("change-dates-checkIn");
  private checkoutDate = this.bestHouseTab.getByTestId("change-dates-checkOut");
  private guestsAmount = this.bestHouseTab.locator('div[id="GuestPicker-book_it-trigger"]');
  private adultsGuestsCurrentValue = this.bestHouseTab.getByTestId("GuestPicker-book_it-form-adults-stepper-value");
  private adultsDecreaseButton = this.bestHouseTab.getByTestId("GuestPicker-book_it-form-adults-stepper-decrease-button");
  private adultsIncreaseButton = this.bestHouseTab.getByTestId("GuestPicker-book_it-form-adults-stepper-increase-button");
  private kidsGuestsCurrentValue = this.bestHouseTab.getByTestId("GuestPicker-book_it-form-children-stepper-value");
  private kidsDecreaseButton = this.bestHouseTab.getByTestId("GuestPicker-book_it-form-children-stepper-decrease-button");
  private kidsIncreaseButton = this.bestHouseTab.getByTestId("GuestPicker-book_it-form-children-stepper-increase-button");
  private reserveButton = this.bestHouseTab.getByRole("button", { name: "Reserve" });
  private guestPicker = this.bestHouseTab.locator('[data-plugin-in-point-id="GUEST_PICKER"]');

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

  async validateCheckInDate(expectedCheckInDate: string, isHousePage: boolean) {
    console.log("Validating check-in date");
    await this.checkInDate.waitFor({ state: "visible" });
    const actualCheckInDate = await this.checkInDate.textContent();
    if (!actualCheckInDate) {
      throw new Error("Check-in date not found");
    }
    const formattedActualCheckInDate = formatDateToExpectedFormat(actualCheckInDate, isHousePage);
    console.log(`Check-in date validated: ${actualCheckInDate}`);
    expect(formattedActualCheckInDate).toBe(expectedCheckInDate);
  }

  async validateCheckoutDate(expectedCheckoutDate: string, isHousePage: boolean) {
    console.log("Validating checkout date");
    const actualCheckoutDate = await this.checkoutDate.textContent();
    if (!actualCheckoutDate) {
      throw new Error("Checkout date not found");
    }
    const formattedActualCheckoutDate = formatDateToExpectedFormat(actualCheckoutDate, isHousePage);
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

  async updateGuests(newAdultsCount: number, newKidscount: number) {
    console.log("Updating guests count...");
    await this.guestsAmount.click();
    let actualAdultCount = parseInt((await this.adultsGuestsCurrentValue.textContent()) || "0");
    let actualKidsCount = parseInt((await this.kidsGuestsCurrentValue.textContent()) || "0");
    while (actualAdultCount < newAdultsCount) {
      await this.adultsIncreaseButton.click();
      actualAdultCount++;
    }
    while (actualAdultCount > newAdultsCount) {
      await this.adultsDecreaseButton.click();
      actualAdultCount--;
    }
    while (actualKidsCount < newKidscount) {
      await this.kidsIncreaseButton.click();
      actualKidsCount++;
    }
    while (actualKidsCount > newKidscount) {
      await this.kidsDecreaseButton.click();
      actualKidsCount--;
    }
    console.log(`Guest count updated to ${newAdultsCount} adults and ${newKidscount} kids.`);
    await this.guestsAmount.click();
  }

  async updateBookingDates(newCheckInDay: number, newCheckOutDay: number) {
    console.log("Updating booking dates...");
    await selectDates(this.bestHouseTab, newCheckInDay, newCheckOutDay, this.checkInDate, true);
    console.log("Booking dates updated.");
  }

  async reserveHouse() {
    console.log("Reserving house...");
    await this.reserveButton.click();
    console.log("House reserved.");
  }

  async validateReservationPageLoaded() {
    console.log("Validating that we are on the reservation page...");
    await waitForPageLoad(this.bestHouseTab);
    const pageTitle = await this.bestHouseTab.title();
    console.log(`Current page title: ${pageTitle}`);
    expect(pageTitle).toContain("Confirm and pay");
  }

  async validateGuestCount(expectedGuestCount: number) {
    console.log("Validating the guest count on the reservation page...");
    await this.guestPicker.waitFor({ state: "visible" });
    const actualGuestCount = await this.guestPicker.textContent();
    console.log(`Guest count found: ${actualGuestCount}`);
    expect(actualGuestCount?.trim()).toContain(`${expectedGuestCount}`);
  }
}
