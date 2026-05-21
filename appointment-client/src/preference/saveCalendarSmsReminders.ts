import { REMINDER_CHANNEL_CONFIGS } from "./mapEventReminderPreference.js";
import {
  saveCalendarEventReminderPreference,
  type SaveCalendarEventReminderResult,
} from "./saveCalendarEventReminderPreference.js";
import type { BlazeoPreferenceConnection } from "./setPreference.js";

/**
 * `POST /preference/Calendar/{calendarId}/SMSEventReminder` with SMS reminder rows from the calendar payload.
 */
export async function saveCalendarSmsRemindersPreference(
  calendarId: string,
  calendar: any,
  connection: BlazeoPreferenceConnection = {}
): Promise<SaveCalendarEventReminderResult> {
  return saveCalendarEventReminderPreference(
    calendarId,
    calendar,
    REMINDER_CHANNEL_CONFIGS[0],
    connection
  );
}

export async function saveCalendarEmailRemindersPreference(
  calendarId: string,
  calendar: any,
  connection: BlazeoPreferenceConnection = {}
): Promise<SaveCalendarEventReminderResult> {
  return saveCalendarEventReminderPreference(
    calendarId,
    calendar,
    REMINDER_CHANNEL_CONFIGS[1],
    connection
  );
}

export async function saveCalendarInAppRemindersPreference(
  calendarId: string,
  calendar: any,
  connection: BlazeoPreferenceConnection = {}
): Promise<SaveCalendarEventReminderResult> {
  return saveCalendarEventReminderPreference(
    calendarId,
    calendar,
    REMINDER_CHANNEL_CONFIGS[2],
    connection
  );
}
