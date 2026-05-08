import { CalendarModel } from "@blazeo.com/calendar-client";
import { resolveBlazeoConnection } from "./createCalendar.js";
import { unwrapCalendarGetData, normalizeParticipantOpeningHoursResponse } from "./fetchCalendarWithOpeningHours.js";

/**
 * Direct wrapper around `calendar.getParticipantOpeningHours()` for a calendar id.
 *
 * This hits `GET /Calendar/Participant/OpeningHours/Get` (server-side shape may vary),
 * so we also return a normalized list alongside the raw response.
 */
export async function getParticipantOpeningHours(calendarId: string, options: any = {}) {
  try {
    const { baseUrl, consumer, ...passThrough } = options;
    const { baseUrl: resolvedBase, consumer: resolvedConsumer } = resolveBlazeoConnection({ baseUrl, consumer });
    const rawRes = await (CalendarModel as any).getRaw(calendarId);
    const payload = unwrapCalendarGetData(rawRes);

    if (!payload) {
      return {
        openingHours: [] as any[],
        raw: null as any,
        meta: { ok: false as const, reason: "calendar_not_found" },
      };
    }

    const cal = (CalendarModel as any).create(
      { ...payload, calendarId },
      { baseUrl: resolvedBase, consumer: resolvedConsumer }
    );

    const raw = await cal.getParticipantOpeningHours({ calendarId, ...(passThrough ?? {}) });
    const { list } = normalizeParticipantOpeningHoursResponse(raw);
    const openingHours = Array.isArray(list) ? list : [];

    return {
      openingHours,
      raw,
      meta: {
        ok: true as const,
        count: openingHours.length,
        status: raw?.status ?? (raw?.Status || "unknown"),
      },
    };
  } catch (err) {
    return {
      openingHours: [] as any[],
      raw: null as any,
      meta: {
        ok: false as const,
        reason: "exception",
        error: err instanceof Error ? err.message : String(err),
      },
    };
  }
}
