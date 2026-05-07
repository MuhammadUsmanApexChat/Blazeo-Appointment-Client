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

export { 
  CalendarModel, 
  EventModel as CoreEventModel, 
  ParticipantModel as CoreParticipantModel, 
  CalendarParticipantModel,
  configure, 
  getConfig 
} from "@blazeo.com/calendar-client";

export const packageName = "@blazeo.com/appointment-client";

export class CalendarClient {
  name = "CalendarClient";
  getExampleSlots() {
    return getExampleSlots();
  }
}
