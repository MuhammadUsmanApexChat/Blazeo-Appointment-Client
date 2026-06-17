import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import { getCalendarLocationById, getCalendarLocationsByCalendar } from "./calendarLocationHttp.js";
import {
  mapApiCalendarLocationToDetails,
  type CalendarLocationDetails,
} from "./mapCalendarLocation.js";
import type { BlazeoPreferenceConnection } from "../preference/setPreference.js";

export type { CalendarLocationDetails } from "./mapCalendarLocation.js";

/**
 * Fetch one calendar location — `GET /Calendar/Location/GetById`.
 *
 * This is the same endpoint used by `CalendarLocationModel.getById` in
 * `@blazeo.com/calendar-client`, but implemented here without importing
 * `CalendarLocationModel` (some bundlers / versions may not expose it as a named export).
 *
 * Returns `null` when the id is empty, HTTP is not configured, the record is missing, or the call fails.
 */
export async function fetchCalendarLocationById(
  calendarLocationId: string,
  connection: BlazeoPreferenceConnection = {}
): Promise<CalendarLocationDetails | null> {
  const id = String(calendarLocationId ?? "").trim();
  if (!id) return null;

  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) return null;

  try {
    const row = await getCalendarLocationById(id, connection);
    return mapApiCalendarLocationToDetails(row);
  } catch (err) {
    console.warn(
      `[fetchCalendarLocationById] GET /Calendar/Location/GetById failed for ${id}:`,
      err
    );
    return null;
  }
}

/**
 * Batch-load location details for many ids (deduped). Map keys are lowercased `calendarLocationId`.
 */
export async function loadCalendarLocationDetailsMap(
  calendarLocationIds: Iterable<string>,
  connection: BlazeoPreferenceConnection = {}
): Promise<Map<string, CalendarLocationDetails>> {
  const map = new Map<string, CalendarLocationDetails>();
  const unique = [
    ...new Set(
      [...calendarLocationIds]
        .map((id) => String(id ?? "").trim())
        .filter(Boolean)
    ),
  ];
  if (!unique.length) return map;

  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) return map;

  await Promise.all(
    unique.map(async (id) => {
      const details = await fetchCalendarLocationById(id, connection);
      if (details) map.set(id.toLowerCase(), details);
    })
  );

  return map;
}

/**
 * Preload all locations for the given calendars (`GET /Calendar/Location/Get` per calendar).
 * Faster than many `GetById` calls when most events share a few calendars.
 */
export async function preloadCalendarLocationsMap(
  calendarIds: Iterable<string>,
  connection: BlazeoPreferenceConnection = {}
): Promise<Map<string, CalendarLocationDetails>> {
  const map = new Map<string, CalendarLocationDetails>();
  const unique = [
    ...new Set([...calendarIds].map((id) => String(id ?? "").trim()).filter(Boolean)),
  ];
  if (!unique.length) return map;

  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) return map;

  await Promise.all(
    unique.map(async (calendarId) => {
      try {
        const rows = (await getCalendarLocationsByCalendar(calendarId, connection)) ?? [];
        for (const row of rows) {
          const details = mapApiCalendarLocationToDetails(row);
          if (details) map.set(details.calendarLocationId.toLowerCase(), details);
        }
      } catch (err) {
        console.warn(
          `[preloadCalendarLocationsMap] GET /Calendar/Location/Get failed for ${calendarId}:`,
          err
        );
      }
    })
  );

  return map;
}
