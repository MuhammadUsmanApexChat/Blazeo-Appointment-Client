import { getConfig } from "@blazeo.com/calendar-client";
import { syncBlazeoConnection } from "./syncBlazeoConnection.js";
let isConfigured = false;
/**
 * Applies Blazeo connection (same as {@link syncBlazeoConnection}) and marks the client as configured
 * when a non-empty `baseUrl` was written to `@blazeo.com/calendar-client`.
 */
export function initializeAppointmentClient(config) {
    if (syncBlazeoConnection(config)) {
        isConfigured = true;
    }
}
export function isAppointmentClientConfigured() {
    return isConfigured || getConfig() !== null;
}
