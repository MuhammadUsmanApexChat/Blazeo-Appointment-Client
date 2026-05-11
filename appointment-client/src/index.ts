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
export { createCalendarRoot, CalendarRootModel, CalendarSlotModel, EventModel, ParticipantModel } from "./models/CalendarRootModel.js";
export { fetchCalendarDetails, fetchCalendarBundle, normalizeOpeningHours } from "./calendar/fetchCalendarDetails.js";
export { getCalendarsByCompany } from "./calendar/getCalendarsByCompany.js";
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

import { fetchCalendarDetails, fetchCalendarBundle } from "./calendar/fetchCalendarDetails.js";
import { fetchCalendarWithOpeningHours } from "./calendar/fetchCalendarWithOpeningHours.js";
import { getCalendarsByCompany } from "./calendar/getCalendarsByCompany.js";

import { 
  CalendarModel as CoreCalendarModel, 
  EventModel as CoreEventModel, 
  ParticipantModel as CoreParticipantModel, 
  CalendarParticipantModel as CoreCalendarParticipantModel,
  configure, 
  getConfig 
} from "@blazeo.com/calendar-client";

// Attach new methods to CalendarModel for easier access
(CoreCalendarModel as any).fetchCalendarDetails = fetchCalendarDetails;
(CoreCalendarModel as any).fetchCalendarBundle = fetchCalendarBundle;
(CoreCalendarModel as any).fetchCalendarWithOpeningHours = fetchCalendarWithOpeningHours;
(CoreCalendarModel as any).getCalendarsByCompany = getCalendarsByCompany;

export { 
  CoreCalendarModel as CalendarModel, 
  CoreEventModel as CoreEventModel, 
  CoreParticipantModel as CoreParticipantModel, 
  CoreCalendarParticipantModel as CalendarParticipantModel,
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
