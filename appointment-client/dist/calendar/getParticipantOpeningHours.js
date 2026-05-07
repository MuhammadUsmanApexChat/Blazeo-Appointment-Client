import { CalendarModel } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import { normalizeParticipantOpeningHoursResponse } from "./fetchCalendarWithOpeningHours.js";
/**
 * Direct wrapper around `calendar.getParticipantOpeningHours()` for a calendar id.
 *
 * This hits `GET /Calendar/Participant/OpeningHours/Get` (server-side shape may vary),
 * so we also return a normalized list alongside the raw response.
 */
export async function getParticipantOpeningHours(calendarId, options = {}) {
    try {
        const { baseUrl, consumer, ...passThrough } = options;
        const ready = ensureBlazeoHttpReady({ baseUrl, consumer });
        if (!ready.ok) {
            return {
                openingHours: [],
                raw: null,
                meta: { ok: false, reason: "missing_base_url", error: ready.error },
            };
        }
        const cal = await CalendarModel.get(calendarId);
        if (cal == null) {
            return {
                openingHours: [],
                raw: null,
                meta: { ok: false, reason: "calendar_not_found" },
            };
        }
        const raw = await cal.getParticipantOpeningHours({ calendarId, ...(passThrough ?? {}) });
        const { list } = normalizeParticipantOpeningHoursResponse(raw);
        const openingHours = Array.isArray(list) ? list : [];
        return {
            openingHours,
            raw,
            meta: {
                ok: true,
                count: openingHours.length,
                status: raw?.status ?? (raw?.Status || "unknown"),
            },
        };
    }
    catch (err) {
        return {
            openingHours: [],
            raw: null,
            meta: {
                ok: false,
                reason: "exception",
                error: err instanceof Error ? err.message : String(err),
            },
        };
    }
}
