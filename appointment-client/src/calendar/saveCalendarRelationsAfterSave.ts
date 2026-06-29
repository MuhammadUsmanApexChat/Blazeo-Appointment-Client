import { saveCalendarAppointmentForm } from "./saveCalendarForm.js";
import { saveCalendarAppointmentLocations } from "./saveCalendarLocations.js";
import { saveCalendarPreferencesAfterSave } from "../preference/saveCalendarPreferences.js";
import type { BlazeoPreferenceConnection } from "../preference/setPreference.js";
import { buildRelationSaveFailure } from "./buildCalendarCreateResult.js";

export type SaveCalendarRelationsOptions = BlazeoPreferenceConnection & {
  /** Internal update-mode flag: replace all calendar locations before inserting payload locations. */
  replaceLocationsOnSave?: boolean;
  /** When true, relation save failures still return the base create/update success payload. */
  preserveBaseOnRelationFailure?: boolean;
};

function relationSaveFailure(
  baseSuccess: any,
  calendarId: string,
  error: string,
  connection: SaveCalendarRelationsOptions,
  apiResponse?: unknown
) {
  if (connection.preserveBaseOnRelationFailure && baseSuccess?.ok) {
    return buildRelationSaveFailure(baseSuccess, calendarId, error, apiResponse);
  }
  return {
    ok: false,
    error,
    ...(apiResponse != null ? { apiResponse } : {}),
  };
}

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
  connection: SaveCalendarRelationsOptions = {},
  baseSuccess: any
) {
  const withPrefs = await saveCalendarPreferencesAfterSave(
    calendar,
    calendarId,
    connection,
    baseSuccess
  );
  if (!withPrefs.ok) {
    return relationSaveFailure(
      baseSuccess,
      calendarId,
      withPrefs.error,
      connection,
      withPrefs.apiResponse
    );
  }

  const loc = await saveCalendarAppointmentLocations(calendarId, calendar, connection, {
    replaceExisting: Boolean(connection.replaceLocationsOnSave),
  });
  if (!loc.ok) {
    return relationSaveFailure(
      baseSuccess,
      calendarId,
      loc.error,
      connection,
      loc.apiResponse
    );
  }

  const withLoc = appendLocationsResult(withPrefs, loc);

  const form = await saveCalendarAppointmentForm(calendarId, calendar, connection);
  if (!form.ok) {
    return relationSaveFailure(
      baseSuccess,
      calendarId,
      form.error,
      connection,
      form.apiResponse
    );
  }

  if (form.skipped) {
    return {
      ...withLoc,
      calendarId,
      ok: true,
      appointmentFormSaved: false,
      fieldRequirementsSaved: false,
    };
  }

  return {
    ...withLoc,
    calendarId,
    ok: true,
    appointmentFormSaved: Boolean(form.appointmentFormSaved),
    fieldRequirementsSaved: Boolean(form.fieldRequirementsSaved),
    ...(form.fieldRequirements != null ? { fieldRequirements: form.fieldRequirements } : {}),
    ...(form.apiFields != null ? { appointmentFormFields: form.apiFields } : {}),
  };
}
