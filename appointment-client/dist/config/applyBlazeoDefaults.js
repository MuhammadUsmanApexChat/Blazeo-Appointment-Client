import { blazeoClientConfig } from "./blazeoClientDefaults.js";
import { syncBlazeoConnection } from "./syncBlazeoConnection.js";
/** Push {@link blazeoClientConfig} into `@blazeo.com/calendar-client` (global store). Call explicitly if you use file defaults; otherwise use {@link initializeAppointmentClient}. */
export function applyBlazeoClientConfig() {
    debugger;
    const baseUrl = blazeoClientConfig.baseUrl?.trim().replace(/\/+$/, "");
    if (!baseUrl)
        return;
    const consumer = blazeoClientConfig.consumer?.trim();
    syncBlazeoConnection({
        baseUrl,
        ...(consumer ? { consumer } : {}),
    });
}
