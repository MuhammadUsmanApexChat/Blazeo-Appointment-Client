import { CalendarModel } from "@blazeo.com/calendar-client";
import { getSnapshot } from "mobx-state-tree";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";

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

  const ready = ensureBlazeoHttpReady({ baseUrl, consumer });
  if (!ready.ok) {
    throw new Error(ready.error);
  }

  const rawRes: any = await (CalendarModel as any).getRaw(calendarId);
  const cal: any = await CalendarModel.get(calendarId);
  const payload = unwrapCalendarGetData(rawRes);
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
  const snap = cal != null ? getSnapshot(cal) : null;
  const calendar = snap != null ? { ...(snap as any), openingHours } : null;

  return {
    calendar,
    cal,
    openingHours,
    embeddedFromGet: embedded,
    fromCalendarGet: embedded.length > 0,
    fromParticipantApi: embedded.length === 0 && openingHours.length > 0 && participantRes != null,
    participantOpeningHoursResponse: participantRes,
    ...(includeRawGet ? { rawGet: rawRes } : {}),
  };
}
