import { configureAppointmentClient } from "../http/blazeoAuth.js";
/**
 * Writes connection + auth into calendar-client `configure()` and the local auth store.
 * Returns whether anything was applied (skipped when `baseUrl` is empty after trim).
 */
export function syncBlazeoConnection(config) {
    const baseUrl = config.baseUrl?.trim().replace(/\/+$/, "");
    if (!baseUrl)
        return false;
    configureAppointmentClient({
        ...config,
        baseUrl,
    });
    return true;
}
