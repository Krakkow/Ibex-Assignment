export function getDateButtonLabel(daysToSelect: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysToSelect);
  const year = date.getFullYear();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.getDate();

  return `${day}, ${weekday}, ${month} ${year}.`;
}
