/**
 * Maps Apex appointment input to a Blazeo `Event` MST snapshot for
 * {@link EventModel.create} from `@blazeo.com/calendar-client`.
 */
export declare function mapAppointmentToEventSnapshot(input: any, mode: "create" | "reschedule"): any;
