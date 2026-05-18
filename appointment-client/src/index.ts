import { getExampleSlots } from "./exampleData.js";

export {
  initializeAppointmentClient,
  isAppointmentClientConfigured,
} from "./config/initializeAppointmentClient.js";
export { syncBlazeoConnection } from "./config/syncBlazeoConnection.js";
export { ensureBlazeoHttpReady } from "./config/ensureBlazeoHttpReady.js";
export type { EnsureBlazeoHttpOptions } from "./config/ensureBlazeoHttpReady.js";
export { blazeoClientConfig } from "./config/blazeoClientDefaults.js";
export { applyBlazeoClientConfig } from "./config/applyBlazeoDefaults.js";
export { 
  createCalendarRoot, 
  CalendarRootModel, 
  CalendarSlotModel, 
  EventModel as MSTEventModel, 
  ParticipantModel as MSTParticipantModel 
} from "./models/CalendarRootModel.js";
export { fetchCalendarBundle, normalizeOpeningHours } from "./calendar/fetchCalendarDetails.js";
export {
  buildUnifiedCalendarView,
  type UnifiedCalendarMember,
  type UnifiedCalendarView,
  type UnifiedOpeningHourRow,
  type UnifiedParticipantWithHours,
} from "./calendar/buildUnifiedCalendarView.js";
export { fetchCalendarWithOpeningHours, unwrapCalendarGetData, pickOpeningHoursArrayFromCalendarPayload, normalizeParticipantOpeningHoursResponse } from "./calendar/fetchCalendarWithOpeningHours.js";
export { getOpeningHours } from "./calendar/getOpeningHours.js";
export { getParticipantOpeningHours } from "./calendar/getParticipantOpeningHours.js";
export { getAllParticipantOpeningHours } from "./calendar/getAllParticipantOpeningHours.js";
export { getParticipants } from "./calendar/getParticipants.js";
export { getExampleSlots, getExampleEvents, getExampleParticipants, getExampleCalendarRoot, getExampleCalendarRootSnapshot } from "./exampleData.js";

// Re-export core models from calendar-client for convenience
export { createCalendarAsync, updateCalendarAsync, deleteCalendarAsync, resolveBlazeoConnection } from "./calendar/createCalendar.js";
export { CalendarCreation, createCalendarWithRelationsAsync, updateCalendarWithRelationsAsync, resolveParticipantIdForOpeningHour } from "./calendar/calendarCreation.js";
export { addParticipantToCalendar, removeParticipantFromCalendar, saveCalendarOpeningHour, saveCalendarOpeningHoursBatch } from "./calendar/blazeoCalendarRelationMethods.js";
export { createAppointmentEventAsync, rescheduleAppointmentEventAsync, cancelAppointmentEventAsync } from "./events/appointmentEventFacade.js";
export { mapAppointmentToEventSnapshot } from "./events/mapAppointmentToEventSnapshot.js";
export { setPreferenceAsync, type BlazeoPreferenceConnection } from "./preference/setPreference.js";
export {
  collectAppointmentReminders,
  mapSmsRemindersToPreferencePayload,
  mapReminderRecipients,
  SMS_CHANNEL_TYPE,
  SMS_EVENT_REMINDER_OPTION,
  type AppointmentReminderInput,
  type SmsEventReminderPreferenceRow,
} from "./preference/mapSmsEventReminderPreference.js";
export { saveCalendarSmsRemindersPreference } from "./preference/saveCalendarSmsReminders.js";
export {
  mapCalendarThemeToPreferencePayload,
  calendarPayloadHasTheme,
  CALENDAR_THEME_OPTION,
  type CalendarThemePreferenceRow,
} from "./preference/mapCalendarThemePreference.js";
export { saveCalendarThemePreference } from "./preference/saveCalendarThemePreference.js";
export { saveCalendarPreferencesAfterSave } from "./preference/saveCalendarPreferences.js";
export { fetchCalendarPreferences, type FetchCalendarPreferencesOptions } from "./preference/fetchCalendarPreferences.js";
export {
  parsePreferenceOptionRows,
  mapSmsPreferenceToAppointmentReminders,
  mapPreferenceRecipientsToRecipientType,
  buildCalendarPreferencesBundle,
  type CalendarPreferencesBundle,
} from "./preference/mapPreferenceFromApi.js";
export { mergePreferencesIntoCalendarView } from "./preference/mergePreferencesIntoCalendarView.js";

import { getCalendarsByCompany } from "./calendar/getCalendarsByCompany.js";
import { fetchCalendarDetails } from "./calendar/fetchCalendarDetails.js";
import { getAppointmentsByFilter } from "./events/getAppointmentsByFilter.js";
export { getCalendarsByCompany, fetchCalendarDetails, getAppointmentsByFilter };

import { 
  CalendarModel as CoreCalendarModel, 
  EventModel as CoreEventModel, 
  ParticipantModel as CoreParticipantModel, 
  CalendarParticipantModel as CoreCalendarParticipantModel,
  LeadModel as CoreLeadModel,
  PreferenceModel as CorePreferenceModel,
  PreferenceScope,
  configure, 
  getConfig 
} from "@blazeo.com/calendar-client";

// Enriched CalendarModel
export const CalendarModel = {
  ...CoreCalendarModel,
  getCalendarsByCompany,
  fetchCalendarDetails
};

export { 
  CoreEventModel as EventModel, 
  CoreParticipantModel as ParticipantModel, 
  CoreCalendarParticipantModel as CalendarParticipantModel,
  CoreLeadModel as LeadModel,
  CorePreferenceModel as PreferenceModel,
  PreferenceScope,
  CoreEventModel,
  CoreParticipantModel,
  configure, 
  getConfig 
};

export const packageName = "@blazeo.com/appointment-client";

export class CalendarClient {
  name = "CalendarClient";
  getExampleSlots() {
    return getExampleSlots();
  }
}
