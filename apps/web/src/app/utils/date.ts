// Function to parse a YYYY-MM-DD string as a PST date
export function parsePSTDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);

  // Create a date object that represents the PST date
  // We'll create it as if it's UTC, then adjust for PST offset
  const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

  // Convert to PST by adding 8 hours (PST is UTC-8, so we add 8 to get UTC)
  const pstDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);

  return pstDate;
}

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

// Function to get the start and end of the current day in PST
// Then convert to UTC ISO-8601 strings
export function getStartAndEndOfDayInUTC(startDate?: Date) {
  const currentPSTDate = getCurrentDateInPST(startDate);

  // Get the PST date components
  const year = currentPSTDate.getUTCFullYear();
  const month = currentPSTDate.getUTCMonth();
  const day = currentPSTDate.getUTCDate();

  // Set to the start of the day (12:00 AM) in PST
  const startOfDayPST = new Date(Date.UTC(year, month, day, 0, 0, 0));

  // Set to the end of the day (11:59 PM) in PST
  const endOfDayPST = new Date(Date.UTC(year, month, day, 23, 59, 59));

  // Convert PST times to UTC ISO-8601 format
  const startOfDayUTC = startOfDayPST.toISOString();
  const endOfDayUTC = endOfDayPST.toISOString();

  // Return the start and end of the day in UTC ISO-8601 format
  return {
    startOfDayUTC,
    endOfDayUTC,
  };
}
