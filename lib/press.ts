const pressDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

/** The dateline, resolved on the server so client and server agree. */
export function printedOn(date = new Date()): string {
  return pressDate.format(date);
}
