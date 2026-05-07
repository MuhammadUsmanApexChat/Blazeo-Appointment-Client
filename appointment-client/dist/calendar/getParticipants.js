import { CalendarModel } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
/**
 * Fetches participants for a calendar.
 */
export async function getParticipants(calendarId, options = {}) {
    const ready = ensureBlazeoHttpReady(options);
    if (!ready.ok) {
        throw new Error(ready.error);
    }
    const participants = await CalendarModel.getParticipants(calendarId);
    return Array.isArray(participants) ? participants : [];
}
