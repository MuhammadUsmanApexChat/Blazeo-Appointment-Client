import { type UnifiedCalendarView } from "./buildUnifiedCalendarView.js";
/**
 * Normalizes the REST envelope from `calendar.getParticipantOpeningHours()`
 * (`GET /Calendar/Participant/OpeningHours/Get`) into a plain row array.
 */
export declare function normalizeOpeningHours(res: any): any[];
/**
 * Calendar + legacy opening hours + full detail bundle (`fetchCalendarDetails`), **or**
 * only the **single unified object** via {@link fetchCalendarBundle}.
 *
 * **Flow**
 * 1. **Calendar** — parallel `CalendarModel.get` + `getRaw` (both `GET /Calendar/Get`: model + raw envelope).
 * 2. **Legacy `openingHours`** — embed from raw, else `getParticipantOpeningHours` (narrow endpoint).
 * 3. **`calendarView` (one object)** — in parallel after calendar is known:
 *    - `GET /Calendar/Participant/All` and optional `/Participant/Get` merge when both return rows.
 *    - `GET /Calendar/Participants/GetInfo`
 *    - `GET /Calendar/Participant/OpeningHours/All/Get` when options enable it (`preferAllParticipantOpeningHours`)
 *    Then `calendarView` = calendar snapshot fields + **`members`** (with **`participantInfo`**) + **`openingHours`**
 *    (`openingHours[].member` → `members[].id`).
 *
 * Server still performs multiple HTTP calls; on the client, **`calendarView`** is returned as **one object**.
 */
export declare function fetchCalendarDetails(calendarId: string, options?: {
    includeParticipantsInfo?: boolean;
    includeUnifiedCalendarView?: boolean;
    /** Prefer all-participant opening hours for **`calendarView`** when the API returns rows (default `true`). */
    preferAllParticipantOpeningHours?: boolean;
    /** Optional; applied with `resolveBlazeoConnection` so `CalendarModel.get` sees `baseUrl` without prior global `configure`. */
    baseUrl?: string;
    consumer?: string;
}): Promise<{
    calendar: null;
    cal: null;
    calendarView: UnifiedCalendarView | null;
    openingHours: any[];
    participants: any[];
    participantsInfo: any;
    allParticipantOpeningHours: any[] | null;
    embeddedFromGet: any[];
    fromCalendarGet: boolean;
    fromParticipantApi: boolean;
    participantOpeningHoursResponse: any;
    rawGet: any;
    meta: {
        ok: false;
        reason: "missing_base_url";
        detail: string;
    };
} | {
    calendar: null;
    cal: null;
    calendarView: UnifiedCalendarView | null;
    openingHours: any[];
    participants: any[];
    participantsInfo: any;
    allParticipantOpeningHours: any[] | null;
    embeddedFromGet: any[];
    fromCalendarGet: boolean;
    fromParticipantApi: boolean;
    participantOpeningHoursResponse: any;
    rawGet: any;
    meta: {
        ok: false;
        reason: string;
        detail?: undefined;
    };
} | {
    calendar: any;
    cal: any;
    calendarView: UnifiedCalendarView | null;
    openingHours: any[];
    participants: any[];
    participantsInfo: unknown;
    allParticipantOpeningHours: any[] | null;
    embeddedFromGet: any[];
    fromCalendarGet: boolean;
    fromParticipantApi: boolean;
    participantOpeningHoursResponse: any;
    meta: {
        calendarViewMemberCount?: number | undefined;
        calendarViewOpeningHourCount?: number | undefined;
        ok: true;
        /** `calendarView.openingHours` came from OpeningHours/All/Get */
        calendarViewUsedAllParticipantOpeningHours: boolean;
        reason?: undefined;
        detail?: undefined;
    };
    rawGet?: undefined;
}>;
/**
 * Single return value only: unified calendar **`calendarView`** —
 * snapshot fields plus **`members`** (with **`participantInfo`**) plus **`openingHours`**
 * (prefers all-participant opening hours when available). Same shape as `fetchCalendarDetails().calendarView`.
 * Returns **`null`** if the calendar cannot be loaded (`CalendarModel.get`).
 */
export declare function fetchCalendarBundle(calendarId: string, connection?: {
    baseUrl?: string;
    consumer?: string;
}): Promise<UnifiedCalendarView | null>;
