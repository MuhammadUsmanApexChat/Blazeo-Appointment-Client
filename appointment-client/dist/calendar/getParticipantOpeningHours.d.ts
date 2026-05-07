/**
 * Direct wrapper around `calendar.getParticipantOpeningHours()` for a calendar id.
 *
 * This hits `GET /Calendar/Participant/OpeningHours/Get` (server-side shape may vary),
 * so we also return a normalized list alongside the raw response.
 */
export declare function getParticipantOpeningHours(calendarId: string, options?: any): Promise<{
    openingHours: any[];
    raw: any;
    meta: {
        ok: false;
        reason: string;
        count?: undefined;
        status?: undefined;
        error?: undefined;
    };
} | {
    openingHours: any[];
    raw: any;
    meta: {
        ok: true;
        count: number;
        status: any;
        reason?: undefined;
        error?: undefined;
    };
} | {
    openingHours: any[];
    raw: any;
    meta: {
        ok: false;
        reason: string;
        error: string;
        count?: undefined;
        status?: undefined;
    };
}>;
