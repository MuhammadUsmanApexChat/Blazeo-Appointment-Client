import { getExampleSlots } from "./exampleData.js";

export {
  initializeAppointmentClient,
  isAppointmentClientConfigured,
} from "./config/initializeAppointmentClient.js";
export type { AppointmentClientConfig } from "./config/initializeAppointmentClient.js";
export { syncBlazeoConnection } from "./config/syncBlazeoConnection.js";
export { ensureBlazeoHttpReady } from "./config/ensureBlazeoHttpReady.js";
export type { EnsureBlazeoHttpOptions } from "./config/ensureBlazeoHttpReady.js";
export type { BlazeoConnectionOptions } from "./config/blazeoConnection.js";
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
  mapToFrontendCalendarView,
  mapOpeningHoursToFrontend,
  type FrontendCalendarOpeningHour,
  type FrontendCalendarMember,
} from "./calendar/mapToFrontendCalendarView.js";
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
export {
  pickCalendarIdFromApiData,
  resolveCalendarIdAfterSave,
  syncCalendarIdOnNode,
} from "./calendar/resolveCalendarIdAfterSave.js";
export {
  buildCalendarCreateSuccess,
  buildRelationSaveFailure,
} from "./calendar/buildCalendarCreateResult.js";
export {
  createCalendarAsync,
  updateCalendarAsync,
  deleteCalendarAsync,
  resolveBlazeoConnection,
} from "./calendar/createCalendar.js";
export { CalendarCreation, createCalendarWithRelationsAsync, updateCalendarWithRelationsAsync, resolveParticipantIdForOpeningHour } from "./calendar/calendarCreation.js";
export { addParticipantToCalendar, removeParticipantFromCalendar, saveCalendarOpeningHour, saveCalendarOpeningHoursBatch } from "./calendar/blazeoCalendarRelationMethods.js";
export { createAppointmentEventAsync, rescheduleAppointmentEventAsync, updateAppointmentEventAsync, cancelAppointmentEventAsync } from "./events/appointmentEventFacade.js";
export {
  getEventById,
  type GetEventByIdResult,
  type GetEventByIdOptions,
} from "./events/fetchEventById.js";
export {
  searchEventsByCompanyKey,
  type SearchEventsByCompanyKeyOptions,
} from "./events/searchEventsByCompanyKey.js";
export {
  backfillEventLocationIds,
  eventSearchResultToClientRow,
} from "./events/backfillEventLocationIds.js";
export { mapBlazeoEventToClientEvent } from "./events/mapBlazeoEventToClientEvent.js";
export {
  mapAppointmentToEventSnapshot,
  mapAppointmentEventToPlain,
  resolveEventLocationFields,
  pickEventLocationFromEvent,
  appointmentInputHasLocation,
  type AppointmentEventLocationInput,
  type ResolvedEventLocation,
} from "./events/mapAppointmentToEventSnapshot.js";
export {
  enrichAppointmentEventWithCalendarLocation,
  enrichAppointmentEventsWithCalendarLocations,
  type EnrichedAppointmentEvent,
  type CalendarLocationDetails as AppointmentCalendarLocationDetails,
} from "./events/enrichAppointmentCalendarLocation.js";
export { setPreferenceAsync, type BlazeoPreferenceConnection } from "./preference/setPreference.js";
export {
  collectAppointmentReminders,
  mapSmsRemindersToPreferencePayload,
  mapEmailRemindersToPreferencePayload,
  mapInAppRemindersToPreferencePayload,
  mapReminderRecipients,
  normalizeReminderRecipientType,
  isValidPreferenceRecipient,
  REMINDER_RECIPIENTS,
  calendarPayloadHasEventReminders,
  SMS_CHANNEL_TYPE,
  EMAIL_CHANNEL_TYPE,
  NOTIFICATION_CHANNEL_TYPE,
  SMS_EVENT_REMINDER_OPTION,
  EMAIL_EVENT_REMINDER_OPTION,
  IN_APP_EVENT_REMINDER_OPTION,
  REMINDER_CHANNEL_CONFIGS,
  type AppointmentReminderInput,
  type EventReminderPreferenceRow,
  type SmsEventReminderPreferenceRow,
} from "./preference/mapEventReminderPreference.js";
export {
  saveCalendarSmsRemindersPreference,
  saveCalendarEmailRemindersPreference,
  saveCalendarInAppRemindersPreference,
} from "./preference/saveCalendarSmsReminders.js";
export {
  mapCalendarThemeToPreferencePayload,
  calendarPayloadHasTheme,
  CALENDAR_THEME_OPTION,
  type CalendarThemePreferenceRow,
} from "./preference/mapCalendarThemePreference.js";
export { saveCalendarThemePreference } from "./preference/saveCalendarThemePreference.js";
export { saveCalendarPreferencesAfterSave } from "./preference/saveCalendarPreferences.js";
export {
  fetchCalendarPreferences,
  emptyCalendarPreferencesBundle,
  type FetchCalendarPreferencesOptions,
} from "./preference/fetchCalendarPreferences.js";
export {
  parsePreferenceOptionRows,
  mapSmsPreferenceToAppointmentReminders,
  mapEmailPreferenceToAppointmentReminders,
  mapInAppPreferenceToAppointmentReminders,
  mapAllPreferenceRemindersToAppointmentReminders,
  mapPreferenceRecipientsToRecipientType,
  buildCalendarPreferencesBundle,
  type CalendarPreferencesBundle,
} from "./preference/mapPreferenceFromApi.js";
export { mergePreferencesIntoCalendarView } from "./preference/mergePreferencesIntoCalendarView.js";
export {
  collectAppointmentLocations,
  mapApiLocationToFrontend,
  mapFrontendLocationToSavePayload,
  calendarPayloadHasLocations,
  calendarPayloadIncludesLocations,
  dedupeFrontendLocations,
  sortFrontendLocations,
  type FrontendAppointmentLocation,
  type CalendarLocationSavePayload,
  type CalendarLocationDetails,
  mapApiCalendarLocationToDetails,
} from "./calendar/mapCalendarLocation.js";
export {
  fetchCalendarAppointmentLocations,
  type FetchCalendarLocationsOptions,
} from "./calendar/fetchCalendarLocations.js";
export {
  fetchCalendarLocationById,
  loadCalendarLocationDetailsMap,
} from "./calendar/fetchCalendarLocationById.js";
export {
  saveCalendarAppointmentLocations,
  replaceCalendarAppointmentLocations,
  type SaveCalendarLocationsOptions,
  type SaveCalendarLocationsResult,
} from "./calendar/saveCalendarLocations.js";
export { saveCalendarRelationsAfterSave } from "./calendar/saveCalendarRelationsAfterSave.js";
export { calendarPayloadHasRelations } from "./calendar/calendarCreation.js";
export {
  getCalendarLocationsByCalendar,
  getCalendarLocationById,
  saveCalendarLocationApi,
  removeCalendarLocationApi,
} from "./calendar/calendarLocationHttp.js";
export {
  fetchLeadDetails,
  fetchLeadByEmail,
  fetchLeadsByCompany,
  type BlazeoLeadConnection,
  type LeadsByCompanyListOpts,
} from "./lead/fetchLeadDetails.js";
export {
  getFieldTypes,
  getFieldType,
  parseFieldTypesList,
  parseAllFieldTypeDefinitions,
  wantsAllFieldTypeDefinitions,
  normalizeFieldTypeQuery,
  pickFieldTypeFromApiData,
  type FieldTypeDefinition,
  type FieldTypeResult,
} from "./customField/fetchFieldTypes.js";
export {
  collectAppointmentFormFields,
  calendarPayloadHasFormFields,
  mapCalendarFormFieldsToApi,
  mapApiFormFieldToClient,
  mapApiFormFieldsToClient,
  mapApiFormFieldToFrontend,
  mapApiFormFieldsToFrontend,
} from "./calendar/mapCalendarForm.js";
export {
  fetchCalendarAppointmentForm,
  getForm,
  type FetchCalendarFormOptions,
} from "./calendar/fetchCalendarForm.js";
export {
  fetchCalendarFieldRequirements,
  getFieldRequirements,
  type FetchCalendarFieldRequirementsOptions,
  type CalendarFieldRequirementsBundle,
} from "./calendar/fetchCalendarFieldRequirements.js";
export {
  removeCalendarFormField,
  removeAllCalendarFormFields,
  removeField,
  removeAllFields,
  resolveCustomFieldId,
  type CustomFieldRemoveTarget,
  type RemoveCustomFieldResult,
  type RemoveAllCalendarFormFieldsResult,
} from "./calendar/removeCalendarFormFields.js";
export {
  saveCalendarForm,
  saveForm,
  saveCalendarAppointmentForm,
  resolveCalendarIdForForm,
  type CalendarFormSaveTarget,
  type SaveCalendarAppointmentFormResult,
  type SaveCustomFieldFormOptions,
  type SaveCustomFieldFormResult,
} from "./calendar/saveCalendarForm.js";
export {
  saveCalendarFieldRequirements,
  saveFieldRequirements,
  type SaveCalendarFieldRequirementsResult,
} from "./calendar/saveCalendarFieldRequirements.js";
export {
  BOOKABLE_LEAD_COLUMNS,
  FIELD_KEY_TO_LEAD_COLUMN,
  hasFormFieldId,
  resolveLeadColumnFromField,
  isBookableLeadField,
  mapFrontendFieldToRequirement,
  mapFrontendFieldsToRequirements,
  unwrapFieldRequirementsData,
  mapFieldRequirementToFrontend,
  mapFieldRequirementsToFrontend,
  filterCustomFormFieldsFromFetch,
  mergeAppointmentUserDefinedFields,
  LEAD_COLUMN_FRONTEND_META,
  LEAD_FIELD_KIND,
  splitAppointmentFormFields,
  type BookableLeadColumn,
  type LeadFieldRequirement,
  type SplitAppointmentFormFieldsResult,
} from "./calendar/mapFieldRequirements.js";
/** @deprecated Prefer {@link saveCalendarForm} or `CalendarModel.saveForm`. */
export { saveCustomFieldForm } from "./customField/saveCustomFieldForm.js";
export {
  mapFrontendFormFieldToApi,
  mapFrontendFormFieldsToApi,
  normalizeApiTypeName,
  resolveApiTypeName,
  mapLeadCustomOptionsToApiOptions,
  isApiFormFieldRow,
  resolveHelpTextForApi,
  FIELD_SUBTYPE_TO_API_TYPE,
  FIELD_TYPE_SUBTYPE_TO_API_TYPE,
  FIELD_KEY_TO_API_TYPE,
  type FrontendCalendarFormField,
  type MapFormFieldsOptions,
} from "./customField/mapFormFieldsToApi.js";
export type { BlazeoCustomFieldConnection, ApiEnvelope } from "./customField/customFieldHttp.js";

import { getCalendarsByCompany } from "./calendar/getCalendarsByCompany.js";
import { fetchCalendarDetails } from "./calendar/fetchCalendarDetails.js";
import { getAppointmentsByFilter } from "./events/getAppointmentsByFilter.js";
import {
  mapCalendarFormFieldsToApi,
  collectAppointmentFormFields,
} from "./calendar/mapCalendarForm.js";
import { saveCalendarForm } from "./calendar/saveCalendarForm.js";
import { fetchCalendarAppointmentForm } from "./calendar/fetchCalendarForm.js";
import { fetchCalendarFieldRequirements } from "./calendar/fetchCalendarFieldRequirements.js";
import {
  removeCalendarFormField,
  removeAllCalendarFormFields,
} from "./calendar/removeCalendarFormFields.js";
import { replaceCalendarAppointmentLocations } from "./calendar/saveCalendarLocations.js";
export { getCalendarsByCompany, fetchCalendarDetails, getAppointmentsByFilter };

import { 
  CalendarModel as CoreCalendarModel, 
  EventModel as CoreEventModel, 
  ParticipantModel as CoreParticipantModel, 
  CalendarParticipantModel as CoreCalendarParticipantModel,
  LeadModel as CoreLeadModel,
  PreferenceModel as CorePreferenceModel,
  PreferenceScope,
  getConfig,
} from "@blazeo.com/calendar-client";
import {
  configureAppointmentClient as configure,
  setAccessToken,
  setGetAccessToken,
  clearAccessToken,
  clearAuth,
  getAuth,
  ensureValidAccessToken,
  buildAuthHeaders,
  isAccessTokenExpired,
  DEFAULT_TOKEN_REFRESH_SKEW_MS,
} from "./http/blazeoAuth.js";
export type { AuthState } from "./http/blazeoAuth.js";

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
   * `appointmentUserDefinedFields` on the returned view (basic rows from `GET /lead/fields/get`
   * plus custom rows from `GET /CustomField/Form/Get`).
   */
  getForm: fetchCalendarAppointmentForm,
  /** Basic lead field config — `GET /lead/fields/get` (also merged into fetch `appointmentUserDefinedFields`). */
  getFieldRequirements: fetchCalendarFieldRequirements,
  /** Rows from `calendar.appointmentUserDefinedFields` → API form payload. */
  mapFormFieldsToApi: mapCalendarFormFieldsToApi,
  collectAppointmentFormFields,
  /** `GET /CustomField/RemoveField?customfield_id=…` */
  removeField: removeCalendarFormField,
  /** `GET /CustomField/RemoveAllFields?calendar_id=…` */
  removeAllFields: removeAllCalendarFormFields,
  /** Update-mode helper: delete all locations then insert payload locations. */
  replaceLocations: replaceCalendarAppointmentLocations,
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
  getConfig,
  setAccessToken,
  setGetAccessToken,
  clearAccessToken,
  clearAuth,
  getAuth,
  ensureValidAccessToken,
  buildAuthHeaders,
  isAccessTokenExpired,
  DEFAULT_TOKEN_REFRESH_SKEW_MS,
};

export const packageName = "@blazeo.com/appointment-client";

export class CalendarClient {
  name = "CalendarClient";
  getExampleSlots() {
    return getExampleSlots();
  }
}
