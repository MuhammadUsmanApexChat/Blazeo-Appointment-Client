import { PreferenceModel } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import { CALENDAR_THEME_OPTION } from "./mapCalendarThemePreference.js";
import {
  EMAIL_EVENT_REMINDER_OPTION,
  IN_APP_EVENT_REMINDER_OPTION,
  SMS_EVENT_REMINDER_OPTION,
} from "./mapEventReminderPreference.js";
import {
  buildCalendarPreferencesBundle,
  type CalendarPreferencesBundle,
} from "./mapPreferenceFromApi.js";

export type FetchCalendarPreferencesOptions = {
  baseUrl?: string;
  consumer?: string;
};

/**
 * Load calendar-scoped preferences: SMS, Email, InApp reminders + CalendarTheme.
 */
export async function fetchCalendarPreferences(
  calendarId: string,
  options: FetchCalendarPreferencesOptions = {}
): Promise<CalendarPreferencesBundle | null> {
  const id = String(calendarId ?? "").trim();
  if (!id) return null;

  const ready = ensureBlazeoHttpReady(options);
  if (!ready.ok) return null;

  const [smsRaw, emailRaw, inAppRaw, themeRaw] = await Promise.all([
    PreferenceModel.get(SMS_EVENT_REMINDER_OPTION, id),
    PreferenceModel.get(EMAIL_EVENT_REMINDER_OPTION, id),
    PreferenceModel.get(IN_APP_EVENT_REMINDER_OPTION, id),
    PreferenceModel.get(CALENDAR_THEME_OPTION, id),
  ]);

  return buildCalendarPreferencesBundle(smsRaw, emailRaw, inAppRaw, themeRaw);
}

/** Empty bundle when API returns nothing (keeps `preferences` shape stable on calendar view). */
export function emptyCalendarPreferencesBundle() {
  return buildCalendarPreferencesBundle(null, null, null, null);
}
