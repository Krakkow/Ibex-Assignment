export function getDateButtonLabel(daysToSelect: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysToSelect);
  const year = date.getFullYear();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.getDate();

  return `${day}, ${weekday}, ${month} ${year}.`;
}

export function formatDateToExpectedFormat(rawDate: string): string {
  if (!rawDate) {
    throw new Error("Provided date is not valid.");
  }
  const [month, day, year] = rawDate.split("/");
  const parsedDate = new Date(`${year}-${month}-${day}`);
  return `${parseInt(day)}, ${parsedDate.toLocaleString("en-US", { weekday: "long" })}, ${parsedDate.toLocaleString("en-US", {
    month: "long",
  })} ${year}.`;
}
