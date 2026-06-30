import { resolveBlazeoConnection } from "../calendar/createCalendar.js";
import { configureAppointmentClient } from "../http/blazeoAuth.js";
/**
 * Ensures global Blazeo `configure({ baseUrl, … })` runs before any `CalendarModel` / `EventModel` HTTP.
 * Uses the same resolution as {@link resolveBlazeoConnection}: explicit args, existing `getConfig()`,
 * then `blazeoClientDefaults` — so file defaults apply even if the host never called `configure`.
 * When `accessToken` / `getAccessToken` are passed, they are merged into the local auth store.
 */
export function ensureBlazeoHttpReady(options = {}) {
    const explicitBase = options.baseUrl?.trim().replace(/\/+$/, "");
    const explicitConsumer = options.consumer?.trim() || undefined;
    if (explicitBase) {
        configureAppointmentClient({
            ...options,
            baseUrl: explicitBase,
            ...(explicitConsumer ? { consumer: explicitConsumer } : {}),
        });
        return {
            ok: true,
            baseUrl: explicitBase,
            ...(explicitConsumer ? { consumer: explicitConsumer } : {}),
        };
    }
    const { baseUrl, consumer } = resolveBlazeoConnection(options);
    if (!baseUrl) {
        return {
            ok: false,
            error: "Blazeo base URL is not set. Call initializeAppointmentClient({ baseUrl }) or configure({ baseUrl }) at app startup, set blazeoClientConfig.baseUrl, or pass baseUrl when calling fetch APIs.",
        };
    }
    configureAppointmentClient({
        ...options,
        baseUrl,
        ...(consumer ? { consumer } : {}),
    });
    return { ok: true, baseUrl, ...(consumer ? { consumer } : {}) };
}
