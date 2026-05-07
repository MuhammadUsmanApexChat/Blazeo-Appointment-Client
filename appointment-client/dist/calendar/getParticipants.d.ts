/**
 * Fetches participants for a calendar.
 */
export declare function getParticipants(calendarId: string, options?: {
    baseUrl?: string;
    consumer?: string;
}): Promise<any[]>;
