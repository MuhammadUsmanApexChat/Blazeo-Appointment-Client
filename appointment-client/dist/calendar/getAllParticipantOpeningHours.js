import { CalendarModel } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import { normalizeParticipantOpeningHoursResponse } from "./fetchCalendarWithOpeningHours.js";
/**
 * Fetch all participant opening hours for a calendar.
 * Uses `GET /Calendar/Participant/OpeningHours/All/Get`.
 */
export async function getAllParticipantOpeningHours(calendarId, options = {}) {
    const ready = ensureBlazeoHttpReady(options);
    if (!ready.ok) {
        throw new Error(ready.error);
    }
    const raw = await CalendarModel.getAllParticipantOpeningHours(calendarId);
    // calendar-client static helper returns either `unknown[] | null` or an envelope depending on version/entrypoint.
    if (Array.isArray(raw)) {
        return { openingHours: raw, raw, meta: { ok: true, shape: "array" } };
    }
    const { list } = normalizeParticipantOpeningHoursResponse(raw);
    const openingHours = Array.isArray(list) ? list : [];
    const ok = Array.isArray(list) ? true : raw?.status === "success";
    return { openingHours, raw, meta: { ok: !!ok } };
}
