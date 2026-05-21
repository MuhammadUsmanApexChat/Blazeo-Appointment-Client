import { collectAppointmentReminders } from "./mapEventReminderPreference.js";
import {
  buildCalendarPreferencesBundle,
  mapAllPreferenceRemindersToAppointmentReminders,
  type CalendarPreferencesBundle,
} from "./mapPreferenceFromApi.js";

/**
 * Attach preference data to unified calendar view (non-breaking: adds fields, fills gaps only).
 */
export function mergePreferencesIntoCalendarView(
  calendarView: Record<string, any>,
  preferences: CalendarPreferencesBundle
): Record<string, any> {
  const merged = { ...calendarView };

  merged.preferences = preferences;

  const fromPreferences = mapAllPreferenceRemindersToAppointmentReminders(preferences);
  if (fromPreferences.length > 0) {
    merged.appointmentReminders = fromPreferences;
  }

  const themeRow = preferences.calendarTheme.options[0];
  if (themeRow) {
    if (themeRow.logoUrl) merged.logoUrl = themeRow.logoUrl;
    if (themeRow.color) merged.color = themeRow.color;
    merged.theme = {
      ...(merged.theme && typeof merged.theme === "object" ? merged.theme : {}),
      ...(themeRow.logoUrl ? { logoUrl: themeRow.logoUrl } : {}),
      ...(themeRow.color ? { color: themeRow.color } : {}),
      __typename: "Theme",
    };
  }

  return merged;
}

export { buildCalendarPreferencesBundle };
