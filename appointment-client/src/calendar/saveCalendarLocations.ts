import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import { saveCalendarLocationApi } from "./calendarLocationHttp.js";
import {
  collectAppointmentLocations,
  mapFrontendLocationToSavePayload,
  sortFrontendLocations,
  type FrontendAppointmentLocation,
} from "./mapCalendarLocation.js";
import type { BlazeoPreferenceConnection } from "../preference/setPreference.js";

export type SaveCalendarLocationsResult =
  | { ok: true; skipped: true }
  | { ok: true; skipped: false; saved: FrontendAppointmentLocation[]; responses: unknown[] }
  | { ok: false; error: string; apiResponse?: unknown };

/**
 * Save each `appointmentLocations` row via `POST /Calendar/Location/Save`.
 */
export async function saveCalendarAppointmentLocations(
  calendarId: string,
  calendar: any,
  connection: BlazeoPreferenceConnection = {}
): Promise<SaveCalendarLocationsResult> {
  const id = String(calendarId ?? "").trim();
  if (!id) {
    return { ok: false, error: "calendarId is required to save appointment locations." };
  }

  const locations = sortFrontendLocations(collectAppointmentLocations(calendar));
  if (locations.length === 0) {
    return { ok: true, skipped: true };
  }

  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    return { ok: false, error: "Blazeo HTTP is not configured." };
  }

  const responses: unknown[] = [];
  const saved: FrontendAppointmentLocation[] = [];

  for (let i = 0; i < locations.length; i++) {
    const loc = locations[i];
    const payload = mapFrontendLocationToSavePayload(id, loc, i, {
      isDefault: i === 0,
    });
    const savedRow = await saveCalendarLocationApi(payload, connection);
    if (savedRow == null) {
      return {
        ok: false,
        error: `Calendar location save failed for type ${loc.type}`,
      };
    }

    responses.push(savedRow);
    saved.push(loc);
  }

  return { ok: true, skipped: false, saved, responses };
}
