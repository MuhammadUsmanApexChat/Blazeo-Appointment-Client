/**
 * Fetch all participant opening hours for a calendar.
 * Uses `GET /Calendar/Participant/OpeningHours/All/Get`.
 */
export declare function getAllParticipantOpeningHours(calendarId: string, options?: {
    baseUrl?: string;
    consumer?: string;
}): Promise<{
    openingHours: any[];
    raw: any[];
    meta: {
        ok: true;
        shape: "array";
    };
} | {
    openingHours: any[];
    raw: any;
    meta: {
        ok: boolean;
        shape?: undefined;
    };
}>;
