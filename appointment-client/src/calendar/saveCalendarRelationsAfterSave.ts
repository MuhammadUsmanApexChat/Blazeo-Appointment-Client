import { saveCalendarAppointmentLocations } from "./saveCalendarLocations.js";
import { saveCalendarPreferencesAfterSave } from "../preference/saveCalendarPreferences.js";
import type { BlazeoPreferenceConnection } from "../preference/setPreference.js";

function appendLocationsResult(base: any, loc: Awaited<ReturnType<typeof saveCalendarAppointmentLocations>>) {
  if (!loc.ok) return loc;
  return {
    ...base,
    appointmentLocationsSaved: !loc.skipped,
    ...(loc.skipped ? {} : { appointmentLocations: loc.saved }),
  };
}

/**
 * After calendar create/update: preferences (SMS, Email, InApp, theme) + appointment locations.
 */
export async function saveCalendarRelationsAfterSave(
  calendar: any,
  calendarId: string,
  connection: BlazeoPreferenceConnection = {},
  baseSuccess: any
) {
  const withPrefs = await saveCalendarPreferencesAfterSave(
    calendar,
    calendarId,
    connection,
    baseSuccess
  );
  if (!withPrefs.ok) return withPrefs;

  const loc = await saveCalendarAppointmentLocations(calendarId, calendar, connection);
  if (!loc.ok) {
    return {
      ok: false,
      error: loc.error,
      ...(loc.apiResponse != null ? { apiResponse: loc.apiResponse } : {}),
    };
  }

  return appendLocationsResult(withPrefs, loc);
}
