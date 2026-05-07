import type { CalendarBOInput } from "../types/calendar.js";
/**
 * Maps Apex `CalendarBO`-shaped input to a snapshot for
 * {@link CalendarModel.create} from `@blazeo.com/calendar-client`.
 *
 * Only fields that exist on Blazeo's `Calendar` model are included so MST does not receive
 * unknown keys or invalid `null`s on optional numbers.
 */
export declare function mapCalendarBOToSnapshot(bo: CalendarBOInput): Record<string, unknown>;
//# sourceMappingURL=mapCalendarBoToBlazeoSnapshot.d.ts.map