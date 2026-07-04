import { configureAppointmentClient } from "../http/blazeoAuth.js";
/**
 * Writes `baseUrl` / `consumer` / JWT into global `@blazeo.com/calendar-client` config.
 * Returns whether anything was applied (skipped when `baseUrl` is empty after trim).
 */
export function syncBlazeoConnection(config) {
    const baseUrl = config.baseUrl?.trim().replace(/\/+$/, "");
    if (!baseUrl)
        return false;
    const expiresAtUtc = config.expiresAtUtc ?? config.tokenExpiresAt ?? config.expires_at_utc;
    configureAppointmentClient({
        baseUrl,
        ...(config.consumer != null && String(config.consumer).trim() !== ""
            ? { consumer: String(config.consumer).trim() }
            : {}),
        ...(config.fetch ? { fetch: config.fetch } : {}),
        ...(config.accessToken != null && String(config.accessToken).trim() !== ""
            ? { accessToken: String(config.accessToken).trim() }
            : {}),
        ...(expiresAtUtc != null && String(expiresAtUtc).trim() !== ""
            ? { expiresAtUtc: String(expiresAtUtc).trim() }
            : {}),
        ...(config.getAccessToken ? { getAccessToken: config.getAccessToken } : {}),
    });
    return true;
}
