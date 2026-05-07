/**
 * Public facade surface for `appointment-client`.
 *
 * Call {@link initializeAppointmentClient} from `../config/initializeAppointmentClient.js`
 * before using these APIs in a host application.
 */
export { createCalendarAsync, updateCalendarAsync, deleteCalendarAsync, resolveBlazeoConnection, type BlazeoCalendarCreateResponse, type CreateCalendarOptions, type CreateCalendarResult, } from "../calendar/createCalendar.js";
export { CalendarCreationFacade, createCalendarWithRelationsAsync, updateCalendarWithRelationsAsync, resolveParticipantIdForOpeningHour, type CalendarWithRelationsResult, type CalendarWithRelationsSuccess, } from "../calendar/calendarCreationFacade.js";
export { addParticipantToCalendar, removeParticipantFromCalendar, saveCalendarOpeningHour, saveCalendarOpeningHoursBatch, type BlazeoCalendarForRelations, type BlazeoCalendarRelationResponse, } from "../calendar/blazeoCalendarRelationMethods.js";
export { createAppointmentEventAsync, rescheduleAppointmentEventAsync, cancelAppointmentEventAsync, type AppointmentEventOptions, type AppointmentEventResult, type AppointmentEventSuccess, type AppointmentEventFailure, type BlazeoEventApiResponse, } from "../events/appointmentEventFacade.js";
export { mapAppointmentToEventSnapshot, type AppointmentEventMappingMode, } from "../events/mapAppointmentToEventSnapshot.js";
//# sourceMappingURL=index.d.ts.map