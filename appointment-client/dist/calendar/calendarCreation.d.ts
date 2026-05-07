import { deleteCalendarAsync } from "./createCalendar.js";
/**
 * Resolves Blazeo `participantId` for an opening-hour row: explicit `participantId`,
 * matching `CalendarCreation.SaveOpeningHours`.
 */
export declare function resolveParticipantIdForOpeningHour(openingHour: any): string | undefined;
/**
 * Orchestrates the same steps as Apex `CalendarCreation.CreateCalendarAsync`:
 * save calendar (`POST /Calendar/Create`), then add participants, then save opening hours
 * per day (`POST /Calendar/Participant/Availability/OpeningHour/Save`).
 */
export declare function createCalendarWithRelationsAsync(calendar: any, options?: any): Promise<any>;
/**
 * Calendar body update, then same member + opening-hour saves as create (Apex-style follow-up).
 * For member add/remove *diffs* against existing DB membership, use server-side Apex; this client
 * only performs additive Blazeo calls matching the payload.
 */
export declare function updateCalendarWithRelationsAsync(calendar: any, options?: any): Promise<any>;
/**
 * Aligned with `CalendarCreation`: create/update with members & opening hours,
 * or delete calendar only.
 */
export declare class CalendarCreation {
    static createWithRelationsAsync: typeof createCalendarWithRelationsAsync;
    static updateWithRelationsAsync: typeof updateCalendarWithRelationsAsync;
    static deleteCalendarAsync: typeof deleteCalendarAsync;
}
