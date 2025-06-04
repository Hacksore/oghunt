import { toZonedTime } from "date-fns-tz";

// Function to get the current date in PST (UTC-8)
// ProductHunt is in PST
export function getCurrentDateInPST(startDate?: Date) {
  const currentUTCDate = startDate || new Date();

  // Get the UTC offset for PST (UTC-8)
  const pstOffset = 8 * 60 * 60 * 1000;

  // Convert the current date to PST by subtracting the PST offset
  const pstDate = new Date(currentUTCDate.getTime() - pstOffset);

  // Return the PST date object
  return pstDate;
}

/**
 * Gets the start and end of the current day in PST/PDT
 * Returns UTC ISO strings for database queries
 */
export function getPSTDayRange(date: Date = new Date()): {
  startOfDayUTC: string;
  endOfDayUTC: string;
} {
  const pstDate = toPST(date);

  // Get the PST date components
  const year = pstDate.getFullYear();
  const month = pstDate.getMonth();
  const day = pstDate.getDate();

  // Set to the start of the day (12:00 AM) in PST
  const startOfDayPST = new Date(Date.UTC(year, month, day, 0, 0, 0));

  // Set to the end of the day (11:59 PM) in PST
  const endOfDayPST = new Date(Date.UTC(year, month, day, 23, 59, 59));

  return {
    startOfDayUTC: startOfDayPST.toISOString(),
    endOfDayUTC: endOfDayPST.toISOString(),
  };
}

/**
 * Converts a UTC date to PST/PDT (America/Los_Angeles)
 * Use this when you need to display or work with dates in PST
 */
export function toPST(date: Date | string): Date {
  return toZonedTime(new Date(date), "America/Los_Angeles");
}

/**
 * Gets the current date in PST/PDT (America/Los_Angeles)
 */
export function getCurrentPST(): Date {
  return toZonedTime(new Date(), "America/Los_Angeles");
}
