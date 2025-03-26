import { Locator, Page } from "@playwright/test";
import { format } from "date-fns";

let checkinDateFormattedForSearchPage = "";
let checkinDateFormattedForBookingPage = "";
let checkoutDateFormattedForSearchPage = "";
let checkoutDateFormattedForBookingPage = "";

function generateFormattedDates(checkinDay: number, checkoutDay: number) {
  const checkinDateObj = new Date();
  checkinDateObj.setDate(checkinDateObj.getDate() + checkinDay);

  const checkoutDateObj = new Date();
  checkoutDateObj.setDate(checkoutDateObj.getDate() + checkoutDay);

  checkinDateFormattedForSearchPage = format(checkinDateObj, "d, EEEE, MMMM yyyy.");
  checkinDateFormattedForBookingPage = format(checkinDateObj, "MM/dd/yyyy");
  checkoutDateFormattedForSearchPage = format(checkoutDateObj, "d, EEEE, MMMM yyyy.");
  checkoutDateFormattedForBookingPage = format(checkoutDateObj, "MM/dd/yyyy");
}

function getDateLocators(page: Page, isHousePage: boolean): { checkInDateButton: Locator; checkOutDateButton: Locator } {
  if (isHousePage) {
    return {
      checkInDateButton: page.getByTestId(`calendar-day-${checkinDateFormattedForBookingPage}`),
      checkOutDateButton: page.getByTestId(`calendar-day-${checkoutDateFormattedForBookingPage}`),
    };
  } else {
    return {
      checkInDateButton: page.getByRole("button", { name: checkinDateFormattedForSearchPage }),
      checkOutDateButton: page.getByRole("button", { name: checkoutDateFormattedForSearchPage }),
    };
  }
}

async function isCalendarOpen(dateButton: Locator): Promise<boolean> {
  return await dateButton.isVisible().catch(() => false);
}

export async function selectDates(page: Page, checkinDay: number, checkoutDay: number, datePickerButton: Locator, isHousePage: boolean = false) {
  generateFormattedDates(checkinDay, checkoutDay);

  console.log(`Attempting to select dates:`);
  console.log(`Check-in (Search Page Format): ${checkinDateFormattedForSearchPage}`);
  console.log(`Check-in (Booking Page Format): ${checkinDateFormattedForBookingPage}`);
  console.log(`Check-out (Search Page Format): ${checkoutDateFormattedForSearchPage}`);
  console.log(`Check-out (Booking Page Format): ${checkoutDateFormattedForBookingPage}`);

  const { checkInDateButton, checkOutDateButton } = getDateLocators(page, isHousePage);
  if (!(await isCalendarOpen(checkInDateButton))) {
    console.log("Opening calendar...");
    await datePickerButton.click();
  }

  if (await isCalendarOpen(checkInDateButton)) {
    await checkInDateButton.click();
    console.log(`Check-in date selected: ${checkinDateFormattedForSearchPage}`);
  } else {
    console.log("Check-in date not available, keeping original.");
  }

  if (await isCalendarOpen(checkOutDateButton)) {
    await checkOutDateButton.click();
    console.log(`Check-out date selected: ${checkoutDateFormattedForSearchPage}`);
  } else {
    console.log("Check-out date not available, keeping original.");
  }
}

export function getStoredCheckInDate(isHousePage: boolean): string {
  return isHousePage ? checkinDateFormattedForBookingPage : checkinDateFormattedForSearchPage;
}

export function getStoredCheckOutDate(isHousePage: boolean): string {
  return isHousePage ? checkoutDateFormattedForBookingPage : checkoutDateFormattedForSearchPage;
}
