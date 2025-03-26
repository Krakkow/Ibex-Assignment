import { test, expect } from "@playwright/test";
import { MainSearchPage } from "../pages/mainSearchPage";
import { ResultsPage } from "../pages/resultsPage";
import { HouseInformationPage } from "../pages/houseInformationPage";

test("Search AirBNB For Vacancy In A Destination", async ({ page }) => {
  const mainSearchPage = new MainSearchPage(page);
  const resultsPage = new ResultsPage(page);
  await mainSearchPage.navigate();
  await mainSearchPage.searchDestination("Amsterdam");
  await mainSearchPage.selectDates(1, 2);
  await mainSearchPage.setGuests(2, 1);
  await mainSearchPage.search();

  const availableHouses = page.getByTestId("card-container");
  console.log(await availableHouses.count());
  await expect(availableHouses.first()).toBeVisible({ timeout: 5000 });

  const count = await availableHouses.count();
  expect(count).toBeGreaterThan(0);
  console.log(`Found ${count} available houses in Amsterdam for the selected dates and guests`);

  const bestHouse = await resultsPage.getHighestRatedHouses();
  const [bestHousePage] = await Promise.all([page.waitForEvent("popup"), await bestHouse.click()]);
  const houseInformationPage = new HouseInformationPage(bestHousePage);
  await bestHousePage.waitForLoadState();
  await houseInformationPage.closePopup();
  await houseInformationPage.validateHouseLocation("Amsterdam");
  const checkInDateToValidate = mainSearchPage.getCheckInDate();
  await houseInformationPage.validateCheckInDate(checkInDateToValidate);
  const checkoutDateToValidate = mainSearchPage.getCheckOutDate();
  await houseInformationPage.validateCheckoutDate(checkoutDateToValidate);
  const guestsAmountToValidate = mainSearchPage.getGuestsAmount();
  await houseInformationPage.validateGuestAmount(guestsAmountToValidate);
  await bestHousePage.pause(); // I need to remove this before handing over the code to the team
});
