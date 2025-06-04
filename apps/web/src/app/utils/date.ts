/**
 * Gets the start and end of the current day in UTC
 * Returns UTC ISO strings for database queries
 */
export function getDayRange(date: Date): {
  startOfDayUTC: string;
  endOfDayUTC: string;
} {
  // Get the PST date components
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Set to the start of the day (12:00 AM) in PST
  const startOfDayPST = new Date(Date.UTC(year, month, day, 0, 0, 0));

  // Set to the end of the day (11:59 PM) in PST
  const endOfDayPST = new Date(Date.UTC(year, month, day, 23, 59, 59));

  return {
    startOfDayUTC: startOfDayPST.toISOString(),
    endOfDayUTC: endOfDayPST.toISOString(),
  };
}
