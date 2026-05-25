export type { AppointmentEventLocationInput, ResolvedEventLocation } from "./mapAppointmentEventLocation.js";
export { resolveEventLocationFields, pickEventLocationFromEvent, appointmentInputHasLocation } from "./mapAppointmentEventLocation.js";
/**
 * Maps Apex appointment input to a Blazeo `Event` MST snapshot for
 * {@link EventModel.create} from `@blazeo.com/calendar-client`.
 */
export declare function mapAppointmentToEventSnapshot(input: any, mode: "create" | "reschedule"): any;
/** Plain event row including location fields (from MST snapshot or API body). */
export declare function mapAppointmentEventToPlain(event: any): Record<string, unknown>;
