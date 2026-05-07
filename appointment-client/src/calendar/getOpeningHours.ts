import { fetchCalendarWithOpeningHours } from "./fetchCalendarWithOpeningHours.js";

/**
 * Fetches opening hours for a calendar.
 * Automatically handles embedded calendar-level hours and participant-level fallbacks.
 */
export async function getOpeningHours(calendarId: string, options: { baseUrl?: string; consumer?: string } = {}) {
  const result = await fetchCalendarWithOpeningHours(calendarId, options);
  return result.openingHours;
}
