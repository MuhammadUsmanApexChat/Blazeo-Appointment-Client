import type { AppointmentClientConfig } from "./initializeAppointmentClient.js";
/**
 * Writes `baseUrl` / `consumer` into the global `@blazeo.com/calendar-client` `configure()` store.
 * Returns whether anything was applied (skipped when `baseUrl` is empty after trim).
 */
export declare function syncBlazeoConnection(config: AppointmentClientConfig): boolean;
