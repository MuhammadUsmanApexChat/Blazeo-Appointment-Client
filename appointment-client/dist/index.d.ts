export { initializeAppointmentClient, isAppointmentClientConfigured, } from "./config/initializeAppointmentClient.js";
export { syncBlazeoConnection } from "./config/syncBlazeoConnection.js";
export { ensureBlazeoHttpReady } from "./config/ensureBlazeoHttpReady.js";
export type { EnsureBlazeoHttpOptions } from "./config/ensureBlazeoHttpReady.js";
export { blazeoClientConfig } from "./config/blazeoClientDefaults.js";
export { applyBlazeoClientConfig } from "./config/applyBlazeoDefaults.js";
export { createCalendarRoot, CalendarRootModel, CalendarSlotModel, EventModel as MSTEventModel, ParticipantModel as MSTParticipantModel } from "./models/CalendarRootModel.js";
export { fetchCalendarBundle, normalizeOpeningHours } from "./calendar/fetchCalendarDetails.js";
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
export { mapAppointmentToEventSnapshot } from "./events/mapAppointmentToEventSnapshot.js";
import { getCalendarsByCompany } from "./calendar/getCalendarsByCompany.js";
import { fetchCalendarDetails } from "./calendar/fetchCalendarDetails.js";
import { getAppointmentsByFilter } from "./events/getAppointmentsByFilter.js";
export { getCalendarsByCompany, fetchCalendarDetails, getAppointmentsByFilter };
import { EventModel as CoreEventModel, ParticipantModel as CoreParticipantModel, CalendarParticipantModel as CoreCalendarParticipantModel, LeadModel as CoreLeadModel, configure, getConfig } from "@blazeo.com/calendar-client";
export declare const CalendarModel: {
    getCalendarsByCompany: typeof getCalendarsByCompany;
    fetchCalendarDetails: typeof fetchCalendarDetails;
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
export { CoreEventModel as EventModel, CoreParticipantModel as ParticipantModel, CoreCalendarParticipantModel as CalendarParticipantModel, CoreLeadModel as LeadModel, CoreEventModel, CoreParticipantModel, configure, getConfig };
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
