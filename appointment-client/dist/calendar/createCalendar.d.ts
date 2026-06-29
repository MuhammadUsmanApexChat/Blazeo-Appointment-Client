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
    ok: true;
    calendarId: string | undefined;
    calendar: any;
    calendarSnapshot: Record<string, unknown>;
    calendarView: {
        id: number | null;
        durationUnit: number | null;
        minimumBookingNotice: number | null;
        minimumBookingNoticeUnit: number | null;
        minimumCancelationNotice: number | null;
        minimumCancelationNoticeUnit: number | null;
        futureLimit: number | null;
        futureLimitUnit: number | null;
        bufferTime: number | null;
        bufferTimeUnit: number | null;
        calendarLink: any;
        uuid: any;
        calendarId: any;
        location: any;
        bookingPageTitle: any;
        reminderChannelStatuses: {
            id: any;
            calendarId: any;
            channelId: any;
            status: boolean;
            appointmentReminders: any;
            __typename: string;
        }[];
        members: {
            id: any;
            name: any;
            alias: any;
            email: any;
            status: any;
            __typename: string;
        }[];
        createdOn: any;
        modifiedOn: any;
        name: any;
        timeZoneId: any;
        description: any;
        assignmentType: number | null;
        duration: number | null;
        bookingLimit: number | null;
        calendarJson: any;
        isThirdPartySaved: boolean;
        themeId: number | null;
        theme: {
            id: any;
            color: any;
            logoUrl: any;
            __typename: string;
        } | null;
        openingHours: any[];
        appointmentUserDefinedFields: any;
        __typename: string;
    } | null;
    apiResponse: any;
} | {
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
