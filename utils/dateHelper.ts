import { format } from "date-fns";

export function getDateButtonLabel(dayOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  const formattedDate = format(date, "d, EEEE, MMMM yyyy.");
  console.log(`✅ getDateButtonLabel(${dayOffset}) = "${formattedDate}"`);
  return formattedDate;
}

export function formatDateToExpectedFormat(rawDate: string, isHousePage: boolean): string {
  if (!rawDate) {
    throw new Error("Provided date is not valid.");
  }
  const [month, day, year] = rawDate.split("/");
  const parsedDate = new Date(`${year}-${month}-${day}`);
  if (isHousePage) {
    return `0${parseInt(month)}/0${parseInt(day)}/${year}`;
  } else {
    return `${parseInt(day)}, ${parsedDate.toLocaleString("en-US", { weekday: "long" })}, ${parsedDate.toLocaleString("en-US", {
      month: "long",
    })} ${year}.`;
  }
}
