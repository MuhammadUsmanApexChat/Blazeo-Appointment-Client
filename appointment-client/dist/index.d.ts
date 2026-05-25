export { initializeAppointmentClient, isAppointmentClientConfigured, } from "./config/initializeAppointmentClient.js";
export { syncBlazeoConnection } from "./config/syncBlazeoConnection.js";
export { ensureBlazeoHttpReady } from "./config/ensureBlazeoHttpReady.js";
export type { EnsureBlazeoHttpOptions } from "./config/ensureBlazeoHttpReady.js";
export { blazeoClientConfig } from "./config/blazeoClientDefaults.js";
export { applyBlazeoClientConfig } from "./config/applyBlazeoDefaults.js";
export { createCalendarRoot, CalendarRootModel, CalendarSlotModel, EventModel as MSTEventModel, ParticipantModel as MSTParticipantModel } from "./models/CalendarRootModel.js";
export { fetchCalendarBundle, normalizeOpeningHours } from "./calendar/fetchCalendarDetails.js";
export { mapToFrontendCalendarView, mapOpeningHoursToFrontend, type FrontendCalendarOpeningHour, type FrontendCalendarMember, } from "./calendar/mapToFrontendCalendarView.js";
export { buildUnifiedCalendarView, type UnifiedCalendarMember, type UnifiedCalendarView, type UnifiedOpeningHourRow, type UnifiedParticipantWithHours, } from "./calendar/buildUnifiedCalendarView.js";
export { fetchCalendarWithOpeningHours, unwrapCalendarGetData, pickOpeningHoursArrayFromCalendarPayload, normalizeParticipantOpeningHoursResponse } from "./calendar/fetchCalendarWithOpeningHours.js";
export { getOpeningHours } from "./calendar/getOpeningHours.js";
export { getParticipantOpeningHours } from "./calendar/getParticipantOpeningHours.js";
export { getAllParticipantOpeningHours } from "./calendar/getAllParticipantOpeningHours.js";
export { getParticipants } from "./calendar/getParticipants.js";
export { getExampleSlots, getExampleEvents, getExampleParticipants, getExampleCalendarRoot, getExampleCalendarRootSnapshot } from "./exampleData.js";
export { createCalendarAsync, updateCalendarAsync, deleteCalendarAsync, resolveBlazeoConnection } from "./calendar/createCalendar.js";
export { CalendarCreation, createCalendarWithRelationsAsync, updateCalendarWithRelationsAsync, resolveParticipantIdForOpeningHour } from "./calendar/calendarCreation.js";
export { addParticipantToCalendar, removeParticipantFromCalendar, saveCalendarOpeningHour, saveCalendarOpeningHoursBatch } from "./calendar/blazeoCalendarRelationMethods.js";
export { createAppointmentEventAsync, rescheduleAppointmentEventAsync, cancelAppointmentEventAsync } from "./events/appointmentEventFacade.js";
export { mapAppointmentToEventSnapshot, mapAppointmentEventToPlain, resolveEventLocationFields, pickEventLocationFromEvent, appointmentInputHasLocation, type AppointmentEventLocationInput, type ResolvedEventLocation, } from "./events/mapAppointmentToEventSnapshot.js";
export { setPreferenceAsync, type BlazeoPreferenceConnection } from "./preference/setPreference.js";
export { collectAppointmentReminders, mapSmsRemindersToPreferencePayload, mapEmailRemindersToPreferencePayload, mapInAppRemindersToPreferencePayload, mapReminderRecipients, calendarPayloadHasEventReminders, SMS_CHANNEL_TYPE, EMAIL_CHANNEL_TYPE, NOTIFICATION_CHANNEL_TYPE, SMS_EVENT_REMINDER_OPTION, EMAIL_EVENT_REMINDER_OPTION, IN_APP_EVENT_REMINDER_OPTION, REMINDER_CHANNEL_CONFIGS, type AppointmentReminderInput, type EventReminderPreferenceRow, type SmsEventReminderPreferenceRow, } from "./preference/mapEventReminderPreference.js";
export { saveCalendarSmsRemindersPreference, saveCalendarEmailRemindersPreference, saveCalendarInAppRemindersPreference, } from "./preference/saveCalendarSmsReminders.js";
export { mapCalendarThemeToPreferencePayload, calendarPayloadHasTheme, CALENDAR_THEME_OPTION, type CalendarThemePreferenceRow, } from "./preference/mapCalendarThemePreference.js";
export { saveCalendarThemePreference } from "./preference/saveCalendarThemePreference.js";
export { saveCalendarPreferencesAfterSave } from "./preference/saveCalendarPreferences.js";
export { fetchCalendarPreferences, emptyCalendarPreferencesBundle, type FetchCalendarPreferencesOptions, } from "./preference/fetchCalendarPreferences.js";
export { parsePreferenceOptionRows, mapSmsPreferenceToAppointmentReminders, mapEmailPreferenceToAppointmentReminders, mapInAppPreferenceToAppointmentReminders, mapAllPreferenceRemindersToAppointmentReminders, mapPreferenceRecipientsToRecipientType, buildCalendarPreferencesBundle, type CalendarPreferencesBundle, } from "./preference/mapPreferenceFromApi.js";
export { mergePreferencesIntoCalendarView } from "./preference/mergePreferencesIntoCalendarView.js";
export { collectAppointmentLocations, mapApiLocationToFrontend, mapFrontendLocationToSavePayload, calendarPayloadHasLocations, sortFrontendLocations, type FrontendAppointmentLocation, type CalendarLocationSavePayload, } from "./calendar/mapCalendarLocation.js";
export { fetchCalendarAppointmentLocations, type FetchCalendarLocationsOptions, } from "./calendar/fetchCalendarLocations.js";
export { saveCalendarAppointmentLocations, type SaveCalendarLocationsResult, } from "./calendar/saveCalendarLocations.js";
export { saveCalendarRelationsAfterSave } from "./calendar/saveCalendarRelationsAfterSave.js";
export { calendarPayloadHasRelations } from "./calendar/calendarCreation.js";
export { getCalendarLocationsByCalendar, saveCalendarLocationApi, } from "./calendar/calendarLocationHttp.js";
export { fetchLeadDetails, fetchLeadByEmail, fetchLeadsByCompany, type BlazeoLeadConnection, type LeadsByCompanyListOpts, } from "./lead/fetchLeadDetails.js";
export { getFieldTypes, getFieldType, parseFieldTypesList, parseAllFieldTypeDefinitions, wantsAllFieldTypeDefinitions, normalizeFieldTypeQuery, pickFieldTypeFromApiData, type FieldTypeDefinition, type FieldTypeResult, } from "./customField/fetchFieldTypes.js";
export { collectAppointmentFormFields, calendarPayloadHasFormFields, mapCalendarFormFieldsToApi, mapApiFormFieldToFrontend, mapApiFormFieldsToFrontend, } from "./calendar/mapCalendarForm.js";
export { fetchCalendarAppointmentForm, getForm, type FetchCalendarFormOptions, } from "./calendar/fetchCalendarForm.js";
export { removeCalendarFormField, removeAllCalendarFormFields, removeField, removeAllFields, resolveCustomFieldId, type CustomFieldRemoveTarget, type RemoveCustomFieldResult, type RemoveAllCalendarFormFieldsResult, } from "./calendar/removeCalendarFormFields.js";
export { saveCalendarForm, saveForm, saveCalendarAppointmentForm, resolveCalendarIdForForm, type CalendarFormSaveTarget, type SaveCalendarAppointmentFormResult, type SaveCustomFieldFormOptions, type SaveCustomFieldFormResult, } from "./calendar/saveCalendarForm.js";
/** @deprecated Prefer {@link saveCalendarForm} or `CalendarModel.saveForm`. */
export { saveCustomFieldForm } from "./customField/saveCustomFieldForm.js";
export { mapFrontendFormFieldToApi, mapFrontendFormFieldsToApi, mapLeadCustomOptionsToApiOptions, isApiFormFieldRow, FIELD_SUBTYPE_TO_API_TYPE, FIELD_TYPE_SUBTYPE_TO_API_TYPE, FIELD_KEY_TO_API_TYPE, type FrontendCalendarFormField, type MapFormFieldsOptions, } from "./customField/mapFormFieldsToApi.js";
export type { BlazeoCustomFieldConnection, ApiEnvelope } from "./customField/customFieldHttp.js";
import { getCalendarsByCompany } from "./calendar/getCalendarsByCompany.js";
import { fetchCalendarDetails } from "./calendar/fetchCalendarDetails.js";
import { getAppointmentsByFilter } from "./events/getAppointmentsByFilter.js";
import { mapCalendarFormFieldsToApi, collectAppointmentFormFields } from "./calendar/mapCalendarForm.js";
import { saveCalendarForm } from "./calendar/saveCalendarForm.js";
import { fetchCalendarAppointmentForm } from "./calendar/fetchCalendarForm.js";
import { removeCalendarFormField, removeAllCalendarFormFields } from "./calendar/removeCalendarFormFields.js";
export { getCalendarsByCompany, fetchCalendarDetails, getAppointmentsByFilter };
import { EventModel as CoreEventModel, ParticipantModel as CoreParticipantModel, CalendarParticipantModel as CoreCalendarParticipantModel, LeadModel as CoreLeadModel, PreferenceModel as CorePreferenceModel, PreferenceScope, configure, getConfig } from "@blazeo.com/calendar-client";
export declare const CalendarModel: {
    getCalendarsByCompany: typeof getCalendarsByCompany;
    fetchCalendarDetails: typeof fetchCalendarDetails;
    /** Full calendar view: members, opening hours, and all preferences (alias of `fetchCalendarDetails`). */
    getCalendarView: typeof fetchCalendarDetails;
    /**
     * Save booking form — automatic in `createCalendarWithRelationsAsync` when
     * `appointmentUserDefinedFields` is on the create payload.
     */
    saveForm: typeof saveCalendarForm;
    /**
     * Load booking form — automatic in `fetchCalendarDetails` / `getCalendarView` as
     * `appointmentUserDefinedFields` on the returned view.
     */
    getForm: typeof fetchCalendarAppointmentForm;
    /** Rows from `calendar.appointmentUserDefinedFields` → API form payload. */
    mapFormFieldsToApi: typeof mapCalendarFormFieldsToApi;
    collectAppointmentFormFields: typeof collectAppointmentFormFields;
    /** `GET /CustomField/RemoveField?customfield_id=…` */
    removeField: typeof removeCalendarFormField;
    /** `GET /CustomField/RemoveAllFields?calendar_id=…` */
    removeAllFields: typeof removeAllCalendarFormFields;
    get(calendarId: string): Promise<unknown>;
    getRaw(calendarId: string): Promise<{
        status: string;
        data?: unknown;
        message?: string;
    }>;
    getByCompany(companyKey: string, opts?: {
        skip?: number;
        take?: number;
        sortBy?: string;
        sortOrder?: "ASC" | "DESC" | "asc" | "desc" | string;
        sort?: string;
        sort_column?: string;
        sort_dir?: "asc" | "desc" | string;
        page?: number;
        page_size?: number;
    }): Promise<{
        calendars: unknown[];
        totalCount: number;
    } | null>;
    getTimeZones(): Promise<unknown>;
    getTimeZone(timezoneId: string): Promise<unknown>;
    getParticipants(calendarId: string): Promise<unknown>;
    getAllParticipantOpeningHours(calendarId: string): Promise<unknown[] | null>;
    getCalendarParticipant(calendarId: string): Promise<unknown>;
    getParticipantsInfo(calendarId: string): Promise<unknown>;
    getMonth(calendarId: string, year: number, month: number): Promise<unknown>;
    getEvents(calendarId: string): Promise<unknown>;
    createWithParticipants(name: string, companyKey: string, participantIds: string[], description: string, calendarId?: string): Promise<unknown>;
    editWithParticipants(calendarId: string, name: string, participantIds: string[], description: string): Promise<unknown>;
    create(snapshot: object, options?: {
        env?: object;
    }): unknown;
};
export { CoreEventModel as EventModel, CoreParticipantModel as ParticipantModel, CoreCalendarParticipantModel as CalendarParticipantModel, CoreLeadModel as LeadModel, CorePreferenceModel as PreferenceModel, PreferenceScope, CoreEventModel, CoreParticipantModel, configure, getConfig };
export declare const packageName = "@blazeo.com/appointment-client";
export declare class CalendarClient {
    name: string;
    getExampleSlots(): (import("mobx-state-tree").ModelInstanceTypeProps<{
        id: import("mobx-state-tree").ISimpleType<string>;
        title: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        start: import("mobx-state-tree").ISimpleType<string>;
        end: import("mobx-state-tree").ISimpleType<string>;
        isAvailable: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<boolean>, [undefined]>;
    }> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        id: import("mobx-state-tree").ISimpleType<string>;
        title: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        start: import("mobx-state-tree").ISimpleType<string>;
        end: import("mobx-state-tree").ISimpleType<string>;
        isAvailable: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<boolean>, [undefined]>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>)[];
}
