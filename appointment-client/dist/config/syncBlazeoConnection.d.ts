import type { AppointmentClientConfig } from "./initializeAppointmentClient.js";
/**
 * Writes `baseUrl` / `consumer` / JWT into global `@blazeo.com/calendar-client` config.
 * Returns whether anything was applied (skipped when `baseUrl` is empty after trim).
 */
export declare function syncBlazeoConnection(config: AppointmentClientConfig): boolean;
