/**
 * Creates an appointment event — `Event.create()` → `POST /event/create`
 * (aligned with `AppointmentAPIAdapter.Create`).
 */
export declare function createAppointmentEventAsync(input: any, options?: any): Promise<{
    ok: boolean;
    error: string;
    event?: undefined;
    apiResponse?: undefined;
} | {
    ok: boolean;
    event: any;
    error?: undefined;
    apiResponse?: undefined;
} | {
    ok: boolean;
    event: any;
    apiResponse: Record<string, unknown>;
    error?: undefined;
} | {
    ok: boolean;
    error: any;
    apiResponse: any;
    event?: undefined;
}>;
/**
 * Reschedules an appointment — `Event.reschedule()` → `POST /event/reschedule`
 * (aligned with `AppointmentAPIAdapter.Reschedule`).
 */
export declare function rescheduleAppointmentEventAsync(input: any, options?: any): Promise<{
    ok: boolean;
    error: string;
    event?: undefined;
    apiResponse?: undefined;
} | {
    ok: boolean;
    event: any;
    error?: undefined;
    apiResponse?: undefined;
} | {
    ok: boolean;
    event: any;
    apiResponse: Record<string, unknown>;
    error?: undefined;
} | {
    ok: boolean;
    error: any;
    apiResponse: any;
    event?: undefined;
}>;
/**
 * Cancels an appointment — `EventModel.cancel` → `GET /event/cancel`
 * (aligned with `AppointmentAPIAdapter.Cancel`).
 */
export declare function cancelAppointmentEventAsync(appointmentEventId: string, options?: any): Promise<{
    ok: boolean;
    error: string;
    apiResponse?: undefined;
} | {
    ok: boolean;
    error: any;
    apiResponse: any;
} | {
    ok: boolean;
    apiResponse: any;
    error?: undefined;
}>;
