import { CalendarModel } from "@blazeo.com/calendar-client";
import { getSnapshot } from "mobx-state-tree";
import { resolveBlazeoConnection } from "./createCalendar.js";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import { mapToDesiredCalendarResponse } from "./mapToDesiredResponse.js";

/**
 * Unwrap nested REST shapes: `res.data`, `res.Data`, or `res.data.data`.
 */
export function unwrapCalendarGetData(res: any) {
  if (res == null || typeof res !== "object") return null;
  let d = res.data ?? res.Data;
  if (d == null) return null;
  if (typeof d === "object" && (d.data != null || d.Data != null)) {
    d = d.data ?? d.Data;
  }
  return d;
}

/** `openingHours` / `OpeningHours` on the calendar object returned by GET /Calendar/
 * Robustly picks opening hours array from a raw calendar payload.
 */
export function pickOpeningHoursArrayFromCalendarPayload(data: any) {
  if (data == null) return null;
  const { list } = normalizeParticipantOpeningHoursResponse(data);
  return list;
}

/**
 * Normalize `calendar.getParticipantOpeningHours()` response (`GET /Calendar/Participant/OpeningHours/Get`).
 * Supports various Blazeo API shapes including nested data and common property names.
 */
export function normalizeParticipantOpeningHoursResponse(res: any) {
  if (res == null) return { list: null, raw: res };

  // 1. Check for standard envelope: res.data or res.Data
  let d = res.data ?? res.Data ?? res;

  // 2. Handle double-nested data (common in some Blazeo API versions)
  if (d && typeof d === "object" && !Array.isArray(d)) {
    if (d.data !== undefined) d = d.data;
    else if (d.Data !== undefined) d = d.Data;
  }

  // 3. If d is now an array, that's our list
  if (Array.isArray(d)) return { list: d, raw: res };

  // 4. Otherwise check for known list properties on the object
  if (d && typeof d === "object") {
    const list =
      d.openingHours ??
      d.OpeningHours ??
      d.participantOpeningHours ??
      d.ParticipantOpeningHours ??
      d.rows ??
      d.Rows ??
      d.items ??
      d.Items ??
      d.list ??
      d.List;
    if (Array.isArray(list)) return { list, raw: res };
  }

  return { list: null, raw: res };
}

/**
 * Loads `CalendarModel` and attaches **`openingHours`** to the MST snapshot:
 * 1. Prefer rows embedded on **GET /Calendar/Get** (`CalendarModel.getRaw` payload — `@blazeo.com/calendar-client` MST omits them).
 * 2. If missing/empty, calls **`calendar.getParticipantOpeningHours()`** (`GET /Calendar/Participant/OpeningHours/Get`).
 */
export async function fetchCalendarWithOpeningHours(calendarId: string, options: any = {}) {
  const { includeRawGet = false, baseUrl, consumer } = options;

  const { baseUrl: resolvedBase, consumer: resolvedConsumer } = resolveBlazeoConnection({ baseUrl, consumer });
  const rawRes = await (CalendarModel as any).getRaw(calendarId);
  const payload = unwrapCalendarGetData(rawRes);

  let cal: any = null;
  if (payload) {
    // Manually create the model instance to fix a bug in calendar-client static get.
    cal = (CalendarModel as any).create(
      { ...payload, calendarId },
      { baseUrl: resolvedBase, consumer: resolvedConsumer }
    );
  }

  if (cal == null) {
    return {
      calendar: null,
      openingHours: [],
      raw: rawRes,
      meta: { ok: false as const, reason: "calendar_not_found" },
    };
  }

  const embedded = pickOpeningHoursArrayFromCalendarPayload(payload) ?? [];
  let resolved = embedded.length > 0 ? embedded : null;
  let participantRes: any = null;

  if ((resolved == null || resolved.length === 0) && cal != null) {
    // Pass calendarId explicitly because some server shapes do not populate `self.calendarId` on the MST model.
    participantRes = await cal.getParticipantOpeningHours({ calendarId });
    const { list } = normalizeParticipantOpeningHoursResponse(participantRes);
    if (list != null && list.length > 0) resolved = list;
  }

  const openingHours = Array.isArray(resolved) ? resolved : [];
  const mappedOpeningHours = openingHours.map(oh => ({
    ...oh,
  }));

  const rawMembers = payload?.members ?? payload?.Members ?? payload?.participants ?? payload?.Participants;
  const mappedMembers = Array.isArray(rawMembers) 
    ? rawMembers.map((m: any) => ({ ...m }))
    : [];

  const calendar = mapToDesiredCalendarResponse(payload, openingHours, mappedMembers);

  if (!calendar) return null as any;

  Object.defineProperties(calendar, {
    _cal: { value: cal, enumerable: false },
    _openingHours: { value: openingHours, enumerable: false },
    _embeddedFromGet: { value: embedded, enumerable: false },
    _rawGet: { value: rawRes, enumerable: false },
  });

  return calendar as any;
}
