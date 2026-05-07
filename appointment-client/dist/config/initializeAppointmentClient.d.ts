export interface AppointmentClientConfig {
    baseUrl: string;
    consumer?: string;
    fetch?: typeof fetch;
}
/**
 * Applies Blazeo connection (same as {@link syncBlazeoConnection}) and marks the client as configured
 * when a non-empty `baseUrl` was written to `@blazeo.com/calendar-client`.
 */
export declare function initializeAppointmentClient(config: AppointmentClientConfig): void;
export declare function isAppointmentClientConfigured(): boolean;
