import {
  saveCalendarEmailRemindersPreference,
  saveCalendarInAppRemindersPreference,
  saveCalendarSmsRemindersPreference,
} from "./saveCalendarSmsReminders.js";
import { saveCalendarThemePreference } from "./saveCalendarThemePreference.js";
import type { BlazeoPreferenceConnection } from "./setPreference.js";

function appendSaveResult(base: any, key: string, result: { ok: true; skipped: boolean; payload?: unknown }) {
  return {
    ...base,
    [`${key}Saved`]: !result.skipped,
    ...(result.skipped ? {} : { [key]: result.payload }),
  };
}

/**
 * After calendar create/update: save SMS, Email, InApp reminders + calendar theme when present on the payload.
 */
export async function saveCalendarPreferencesAfterSave(
  calendar: any,
  calendarId: string,
  connection: BlazeoPreferenceConnection = {},
  baseSuccess: any
) {
  const sms = await saveCalendarSmsRemindersPreference(calendarId, calendar, connection);
  if (!sms.ok) {
    return {
      ok: false,
      error: sms.error,
      ...(sms.apiResponse != null ? { apiResponse: sms.apiResponse } : {}),
    };
  }

  const email = await saveCalendarEmailRemindersPreference(calendarId, calendar, connection);
  if (!email.ok) {
    return {
      ok: false,
      error: email.error,
      ...(email.apiResponse != null ? { apiResponse: email.apiResponse } : {}),
    };
  }

  const inApp = await saveCalendarInAppRemindersPreference(calendarId, calendar, connection);
  if (!inApp.ok) {
    return {
      ok: false,
      error: inApp.error,
      ...(inApp.apiResponse != null ? { apiResponse: inApp.apiResponse } : {}),
    };
  }

  const theme = await saveCalendarThemePreference(calendarId, calendar, connection);
  if (!theme.ok) {
    return {
      ok: false,
      error: theme.error,
      ...(theme.apiResponse != null ? { apiResponse: theme.apiResponse } : {}),
    };
  }

  let result = appendSaveResult(baseSuccess, "smsRemindersPreference", sms);
  result = appendSaveResult(result, "emailRemindersPreference", email);
  result = appendSaveResult(result, "inAppRemindersPreference", inApp);
  result = appendSaveResult(result, "calendarThemePreference", theme);
  return result;
}
