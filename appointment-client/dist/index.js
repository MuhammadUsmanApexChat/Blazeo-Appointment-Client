import { getExampleSlots } from "./exampleData.js";
export { initializeAppointmentClient, isAppointmentClientConfigured, } from "./config/initializeAppointmentClient.js";
export { syncBlazeoConnection } from "./config/syncBlazeoConnection.js";
export { ensureBlazeoHttpReady } from "./config/ensureBlazeoHttpReady.js";
export { blazeoClientConfig } from "./config/blazeoClientDefaults.js";
export { applyBlazeoClientConfig } from "./config/applyBlazeoDefaults.js";
export { createCalendarRoot, CalendarRootModel, CalendarSlotModel, EventModel as MSTEventModel, ParticipantModel as MSTParticipantModel } from "./models/CalendarRootModel.js";
export { fetchCalendarBundle, normalizeOpeningHours } from "./calendar/fetchCalendarDetails.js";
export { mapToFrontendCalendarView, mapOpeningHoursToFrontend, } from "./calendar/mapToFrontendCalendarView.js";
export { buildUnifiedCalendarView, } from "./calendar/buildUnifiedCalendarView.js";
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
export { mapAppointmentToEventSnapshot, mapAppointmentEventToPlain, resolveEventLocationFields, pickEventLocationFromEvent, appointmentInputHasLocation, } from "./events/mapAppointmentToEventSnapshot.js";
export { setPreferenceAsync } from "./preference/setPreference.js";
export { collectAppointmentReminders, mapSmsRemindersToPreferencePayload, mapEmailRemindersToPreferencePayload, mapInAppRemindersToPreferencePayload, mapReminderRecipients, calendarPayloadHasEventReminders, SMS_CHANNEL_TYPE, EMAIL_CHANNEL_TYPE, NOTIFICATION_CHANNEL_TYPE, SMS_EVENT_REMINDER_OPTION, EMAIL_EVENT_REMINDER_OPTION, IN_APP_EVENT_REMINDER_OPTION, REMINDER_CHANNEL_CONFIGS, } from "./preference/mapEventReminderPreference.js";
export { saveCalendarSmsRemindersPreference, saveCalendarEmailRemindersPreference, saveCalendarInAppRemindersPreference, } from "./preference/saveCalendarSmsReminders.js";
export { mapCalendarThemeToPreferencePayload, calendarPayloadHasTheme, CALENDAR_THEME_OPTION, } from "./preference/mapCalendarThemePreference.js";
export { saveCalendarThemePreference } from "./preference/saveCalendarThemePreference.js";
export { saveCalendarPreferencesAfterSave } from "./preference/saveCalendarPreferences.js";
export { fetchCalendarPreferences, emptyCalendarPreferencesBundle, } from "./preference/fetchCalendarPreferences.js";
export { parsePreferenceOptionRows, mapSmsPreferenceToAppointmentReminders, mapEmailPreferenceToAppointmentReminders, mapInAppPreferenceToAppointmentReminders, mapAllPreferenceRemindersToAppointmentReminders, mapPreferenceRecipientsToRecipientType, buildCalendarPreferencesBundle, } from "./preference/mapPreferenceFromApi.js";
export { mergePreferencesIntoCalendarView } from "./preference/mergePreferencesIntoCalendarView.js";
export { collectAppointmentLocations, mapApiLocationToFrontend, mapFrontendLocationToSavePayload, calendarPayloadHasLocations, sortFrontendLocations, } from "./calendar/mapCalendarLocation.js";
export { fetchCalendarAppointmentLocations, } from "./calendar/fetchCalendarLocations.js";
export { saveCalendarAppointmentLocations, } from "./calendar/saveCalendarLocations.js";
export { saveCalendarRelationsAfterSave } from "./calendar/saveCalendarRelationsAfterSave.js";
export { calendarPayloadHasRelations } from "./calendar/calendarCreation.js";
export { getCalendarLocationsByCalendar, saveCalendarLocationApi, } from "./calendar/calendarLocationHttp.js";
export { fetchLeadDetails, fetchLeadByEmail, fetchLeadsByCompany, } from "./lead/fetchLeadDetails.js";
export { getFieldTypes, getFieldType, parseFieldTypesList, parseAllFieldTypeDefinitions, wantsAllFieldTypeDefinitions, normalizeFieldTypeQuery, pickFieldTypeFromApiData, } from "./customField/fetchFieldTypes.js";
export { collectAppointmentFormFields, calendarPayloadHasFormFields, mapCalendarFormFieldsToApi, mapApiFormFieldToFrontend, mapApiFormFieldsToFrontend, } from "./calendar/mapCalendarForm.js";
export { fetchCalendarAppointmentForm, getForm, } from "./calendar/fetchCalendarForm.js";
export { removeCalendarFormField, removeAllCalendarFormFields, removeField, removeAllFields, resolveCustomFieldId, } from "./calendar/removeCalendarFormFields.js";
export { saveCalendarForm, saveForm, saveCalendarAppointmentForm, resolveCalendarIdForForm, } from "./calendar/saveCalendarForm.js";
/** @deprecated Prefer {@link saveCalendarForm} or `CalendarModel.saveForm`. */
export { saveCustomFieldForm } from "./customField/saveCustomFieldForm.js";
export { mapFrontendFormFieldToApi, mapFrontendFormFieldsToApi, mapLeadCustomOptionsToApiOptions, isApiFormFieldRow, FIELD_SUBTYPE_TO_API_TYPE, FIELD_TYPE_SUBTYPE_TO_API_TYPE, FIELD_KEY_TO_API_TYPE, } from "./customField/mapFormFieldsToApi.js";
import { getCalendarsByCompany } from "./calendar/getCalendarsByCompany.js";
import { fetchCalendarDetails } from "./calendar/fetchCalendarDetails.js";
import { getAppointmentsByFilter } from "./events/getAppointmentsByFilter.js";
import { mapCalendarFormFieldsToApi, collectAppointmentFormFields, } from "./calendar/mapCalendarForm.js";
import { saveCalendarForm } from "./calendar/saveCalendarForm.js";
import { fetchCalendarAppointmentForm } from "./calendar/fetchCalendarForm.js";
import { removeCalendarFormField, removeAllCalendarFormFields, } from "./calendar/removeCalendarFormFields.js";
export { getCalendarsByCompany, fetchCalendarDetails, getAppointmentsByFilter };
import { CalendarModel as CoreCalendarModel, EventModel as CoreEventModel, ParticipantModel as CoreParticipantModel, CalendarParticipantModel as CoreCalendarParticipantModel, LeadModel as CoreLeadModel, PreferenceModel as CorePreferenceModel, PreferenceScope, configure, getConfig } from "@blazeo.com/calendar-client";
// Enriched CalendarModel
export const CalendarModel = {
    ...CoreCalendarModel,
    getCalendarsByCompany,
    fetchCalendarDetails,
    /** Full calendar view: members, opening hours, and all preferences (alias of `fetchCalendarDetails`). */
    getCalendarView: fetchCalendarDetails,
    /**
     * Save booking form — automatic in `createCalendarWithRelationsAsync` when
     * `appointmentUserDefinedFields` is on the create payload.
     */
    saveForm: saveCalendarForm,
    /**
     * Load booking form — automatic in `fetchCalendarDetails` / `getCalendarView` as
     * `appointmentUserDefinedFields` on the returned view.
     */
    getForm: fetchCalendarAppointmentForm,
    /** Rows from `calendar.appointmentUserDefinedFields` → API form payload. */
    mapFormFieldsToApi: mapCalendarFormFieldsToApi,
    collectAppointmentFormFields,
    /** `GET /CustomField/RemoveField?customfield_id=…` */
    removeField: removeCalendarFormField,
    /** `GET /CustomField/RemoveAllFields?calendar_id=…` */
    removeAllFields: removeAllCalendarFormFields,
};
export { CoreEventModel as EventModel, CoreParticipantModel as ParticipantModel, CoreCalendarParticipantModel as CalendarParticipantModel, CoreLeadModel as LeadModel, CorePreferenceModel as PreferenceModel, PreferenceScope, CoreEventModel, CoreParticipantModel, configure, getConfig };
export const packageName = "@blazeo.com/appointment-client";
export class CalendarClient {
    name = "CalendarClient";
    getExampleSlots() {
        return getExampleSlots();
    }
}
