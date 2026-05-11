/**
 * Unwrap nested REST shapes: `res.data`, `res.Data`, or `res.data.data`.
 */
export declare function unwrapCalendarGetData(res: any): any;
/** `openingHours` / `OpeningHours` on the calendar object returned by GET /Calendar/
 * Robustly picks opening hours array from a raw calendar payload.
 */
export declare function pickOpeningHoursArrayFromCalendarPayload(data: any): any[] | null;
/**
 * Normalize `calendar.getParticipantOpeningHours()` response (`GET /Calendar/Participant/OpeningHours/Get`).
 * Supports various Blazeo API shapes including nested data and common property names.
 */
export declare function normalizeParticipantOpeningHoursResponse(res: any): {
    list: null;
    raw: any;
} | {
    list: any[];
    raw: any;
};
/**
 * Loads `CalendarModel` and attaches **`openingHours`** to the MST snapshot:
 * 1. Prefer rows embedded on **GET /Calendar/Get** (`CalendarModel.getRaw` payload — `@blazeo.com/calendar-client` MST omits them).
 * 2. If missing/empty, calls **`calendar.getParticipantOpeningHours()`** (`GET /Calendar/Participant/OpeningHours/Get`).
 */
export declare function fetchCalendarWithOpeningHours(calendarId: string, options?: any): Promise<any>;
