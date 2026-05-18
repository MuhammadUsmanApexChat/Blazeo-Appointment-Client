import { saveCalendarSmsRemindersPreference } from "./saveCalendarSmsReminders.js";
import { saveCalendarThemePreference } from "./saveCalendarThemePreference.js";
import type { BlazeoPreferenceConnection } from "./setPreference.js";

/**
 * After calendar create/update: save SMS reminders + calendar theme preferences when present on the payload.
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

  const theme = await saveCalendarThemePreference(calendarId, calendar, connection);
  if (!theme.ok) {
    return {
      ok: false,
      error: theme.error,
      ...(theme.apiResponse != null ? { apiResponse: theme.apiResponse } : {}),
    };
  }

  return {
    ...baseSuccess,
    smsRemindersPreferenceSaved: !sms.skipped,
    ...(sms.skipped ? {} : { smsRemindersPreference: sms.payload }),
    calendarThemePreferenceSaved: !theme.skipped,
    ...(theme.skipped ? {} : { calendarThemePreference: theme.payload }),
  };
}
