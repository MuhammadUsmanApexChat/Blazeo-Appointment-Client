/**
 * Public facade surface for `appointment-client`.
 *
 * Call {@link initializeAppointmentClient} from `../config/initializeAppointmentClient.js`
 * before using these APIs in a host application.
 */
export { createCalendarAsync, updateCalendarAsync, deleteCalendarAsync, resolveBlazeoConnection, } from "../calendar/createCalendar.js";
export { CalendarCreationFacade, createCalendarWithRelationsAsync, updateCalendarWithRelationsAsync, resolveParticipantIdForOpeningHour, } from "../calendar/calendarCreationFacade.js";
export { addParticipantToCalendar, removeParticipantFromCalendar, saveCalendarOpeningHour, saveCalendarOpeningHoursBatch, } from "../calendar/blazeoCalendarRelationMethods.js";
export { createAppointmentEventAsync, rescheduleAppointmentEventAsync, cancelAppointmentEventAsync, } from "../events/appointmentEventFacade.js";
export { mapAppointmentToEventSnapshot, } from "../events/mapAppointmentToEventSnapshot.js";
//# sourceMappingURL=index.js.map