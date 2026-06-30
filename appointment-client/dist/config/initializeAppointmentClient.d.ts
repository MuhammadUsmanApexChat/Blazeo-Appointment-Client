import type { AppointmentClientConfig } from "./syncBlazeoConnection.js";
export type { AppointmentClientConfig } from "./syncBlazeoConnection.js";
/**
 * Applies Blazeo connection (same as {@link syncBlazeoConnection}) and marks the client as configured
 * when a non-empty `baseUrl` was written to `@blazeo.com/calendar-client`.
 */
export declare function initializeAppointmentClient(config: AppointmentClientConfig): void;
export declare function isAppointmentClientConfigured(): boolean;
