import { collectAppointmentReminders } from "./mapSmsEventReminderPreference.js";
import {
  buildCalendarPreferencesBundle,
  mapSmsPreferenceToAppointmentReminders,
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

  const existingReminders = collectAppointmentReminders(merged);
  const smsRows = preferences.smsEventReminder.options;
  if (smsRows.length > 0 && existingReminders.length === 0) {
    merged.appointmentReminders = mapSmsPreferenceToAppointmentReminders(smsRows);
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
