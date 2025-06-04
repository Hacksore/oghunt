import { getPSTDayRange } from "./timezone";

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

// Re-export the PST day range function for backward compatibility
export const getStartAndEndOfDayInUTC = getPSTDayRange;
