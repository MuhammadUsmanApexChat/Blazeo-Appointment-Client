import { PreferenceModel } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import { CALENDAR_THEME_OPTION } from "./mapCalendarThemePreference.js";
import { SMS_EVENT_REMINDER_OPTION } from "./mapSmsEventReminderPreference.js";
import {
  buildCalendarPreferencesBundle,
  type CalendarPreferencesBundle,
} from "./mapPreferenceFromApi.js";

export type FetchCalendarPreferencesOptions = {
  baseUrl?: string;
  consumer?: string;
};

/**
 * Load calendar-scoped preferences: `GET /preference/SMSEventReminder?keys=…` and `CalendarTheme`.
 */
export async function fetchCalendarPreferences(
  calendarId: string,
  options: FetchCalendarPreferencesOptions = {}
): Promise<CalendarPreferencesBundle | null> {
  const id = String(calendarId ?? "").trim();
  if (!id) return null;

  const ready = ensureBlazeoHttpReady(options);
  if (!ready.ok) return null;

  const [smsRaw, themeRaw] = await Promise.all([
    PreferenceModel.get(SMS_EVENT_REMINDER_OPTION, id),
    PreferenceModel.get(CALENDAR_THEME_OPTION, id),
  ]);

  return buildCalendarPreferencesBundle(smsRaw, themeRaw);
}
