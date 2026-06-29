import { type UnifiedCalendarView } from "./buildUnifiedCalendarView.js";
import { type FrontendCalendarView } from "./mapToFrontendCalendarView.js";
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
 * 4. **Preferences** (when `includePreferences`, default with unified view) — parallel
 *    `GET /preference/{SMSEventReminder|EmailEventReminder|InAppEventReminder|CalendarTheme}?keys={calendarId}`;
 *    merged as **`preferences`**, plus **`appointmentReminders`** / **`logoUrl`** / **`color`** when not already on the calendar payload.
 *
 * Server still performs multiple HTTP calls; on the client, **`calendarView`** is returned as **one object**.
 */
export declare function fetchCalendarDetails(calendarId: string, options?: {
    includeParticipantsInfo?: boolean;
    includeUnifiedCalendarView?: boolean;
    /** Prefer all-participant opening hours for **`calendarView`** when the API returns rows (default `true`). */
    preferAllParticipantOpeningHours?: boolean;
    /** Load preferences + `GET /Calendar/Location/Get` into the view (default: same as `includeUnifiedCalendarView`). */
    includePreferences?: boolean;
    /** Load `appointmentLocations` via `GET /Calendar/Location/Get` (default: same as `includePreferences`). */
    includeLocations?: boolean;
    /** Load `appointmentUserDefinedFields` via `GET /CustomField/Form/Get` (default: same as `includeUnifiedCalendarView`). */
    includeFormFields?: boolean;
    /** Load basic lead fields via `GET /lead/fields/get` (default: same as `includeFormFields`). */
    includeFieldRequirements?: boolean;
    /**
     * `frontend` — portal edit shape (openingHours with `days[]`, flat `appointmentReminders`, theme fields).
     * `unified` — legacy enriched object with `__typename`, `reminderChannelStatuses`, etc.
     */
    viewFormat?: "frontend" | "unified";
    /** Optional; applied with `resolveBlazeoConnection` so `CalendarModel.get` sees `baseUrl` without prior global `configure`. */
    baseUrl?: string;
    consumer?: string;
}): Promise<any>;
/**
 * Single return value only: unified calendar **`calendarView`** —
 * snapshot fields plus **`members`** (with **`participantInfo`**) plus **`openingHours`**
 * (prefers all-participant opening hours when available). Same shape as `fetchCalendarDetails().calendarView`.
 * Returns **`null`** if the calendar cannot be loaded (`CalendarModel.get`).
 */
export declare function fetchCalendarBundle(calendarId: string, connection?: {
    baseUrl?: string;
    consumer?: string;
    viewFormat?: "frontend" | "unified";
}): Promise<FrontendCalendarView | UnifiedCalendarView | null>;
