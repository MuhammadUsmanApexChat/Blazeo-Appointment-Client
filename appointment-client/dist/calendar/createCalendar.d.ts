/** Merge per-call options with global Blazeo config (defaults file + `configure`). */
export declare function resolveBlazeoConnection(options?: any): {
    baseUrl: any;
    consumer: any;
};
/** Shared MST `env` for Blazeo models (`Calendar`, `Event`, …). */
export declare function buildModelEnv(baseUrl: string | undefined, consumer: string | undefined, forLocalOnly: boolean): any;
/**
 * Uses {@link resolveBlazeoConnection} (defaults + `configure` + optional overrides),
 * then `CalendarModel.create` and `calendar.create()` unless `localOnly`.
 */
export declare function createCalendarAsync(calendar: any, options?: any): Promise<{
    ok: boolean;
    error: string;
    calendar?: undefined;
    apiResponse?: undefined;
} | {
    ok: boolean;
    calendar: any;
    error?: undefined;
    apiResponse?: undefined;
} | {
    ok: boolean;
    error: any;
    apiResponse: any;
    calendar?: undefined;
} | {
    ok: boolean;
    calendar: any;
    apiResponse: any;
    error?: undefined;
}>;
/**
 * Uses {@link resolveBlazeoConnection}, builds a `Calendar` node from {@link mapCalendarBOToSnapshot},
 * then `calendar.update()` → POST `/Calendar/Event/Update` unless `localOnly`.
 */
export declare function updateCalendarAsync(calendar: any, options?: any): Promise<{
    ok: boolean;
    error: string;
    calendar?: undefined;
    apiResponse?: undefined;
} | {
    ok: boolean;
    calendar: any;
    error?: undefined;
    apiResponse?: undefined;
} | {
    ok: boolean;
    error: any;
    apiResponse: any;
    calendar?: undefined;
} | {
    ok: boolean;
    calendar: any;
    apiResponse: any;
    error?: undefined;
}>;
/**
 * Removes a calendar via `calendar.remove()` → GET `/Calendar/Remove?calendar_id=…`.
 */
export declare function deleteCalendarAsync(calendarId: string, options?: any): Promise<{
    ok: boolean;
    error: string;
    calendar?: undefined;
    apiResponse?: undefined;
} | {
    ok: boolean;
    calendar: any;
    error?: undefined;
    apiResponse?: undefined;
} | {
    ok: boolean;
    error: any;
    apiResponse: any;
    calendar?: undefined;
} | {
    ok: boolean;
    calendar: any;
    apiResponse: any;
    error?: undefined;
}>;
