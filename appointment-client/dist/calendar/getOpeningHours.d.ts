/**
 * Fetches opening hours for a calendar.
 * Automatically handles embedded calendar-level hours and participant-level fallbacks.
 */
export declare function getOpeningHours(calendarId: string, options?: {
    baseUrl?: string;
    consumer?: string;
}): Promise<any[]>;
