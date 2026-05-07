import { configure } from "@blazeo.com/calendar-client";
import { resolveBlazeoConnection } from "../calendar/createCalendar.js";
/**
 * Ensures global Blazeo `configure({ baseUrl })` runs before any `CalendarModel` / `EventModel` HTTP.
 * Uses the same resolution as {@link resolveBlazeoConnection}: explicit args, existing `getConfig()`,
 * then `blazeoClientDefaults` — so file defaults apply even if the host never called `configure`.
 */
export function ensureBlazeoHttpReady(options = {}) {
    const { baseUrl, consumer } = resolveBlazeoConnection(options);
    if (!baseUrl) {
        return {
            ok: false,
            error: "Blazeo base URL is not set. Call initializeAppointmentClient({ baseUrl }) or configure({ baseUrl }) at app startup, set blazeoClientConfig.baseUrl, or pass baseUrl when calling fetch APIs.",
        };
    }
    configure({
        baseUrl,
        ...(consumer ? { consumer } : {}),
    });
    return { ok: true, baseUrl, ...(consumer ? { consumer } : {}) };
}
