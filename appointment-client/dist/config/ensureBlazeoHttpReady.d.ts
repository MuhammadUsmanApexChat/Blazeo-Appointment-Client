import type { BlazeoConnectionOptions } from "./blazeoConnection.js";
export type EnsureBlazeoHttpOptions = BlazeoConnectionOptions;
/**
 * Ensures global Blazeo `configure()` runs before any `CalendarModel` / `EventModel` HTTP.
 * Merges `baseUrl` / `consumer` / JWT (`accessToken`, `getAccessToken`) into both
 * `@blazeo.com/calendar-client` and the appointment-client auth store.
 */
export declare function ensureBlazeoHttpReady(options?: EnsureBlazeoHttpOptions): {
    ok: true;
    baseUrl: string;
    consumer?: string;
} | {
    ok: false;
    error: string;
};
