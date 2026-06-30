import type { BlazeoConnectionOptions } from "./blazeoConnection.js";
export type EnsureBlazeoHttpOptions = BlazeoConnectionOptions;
/**
 * Ensures global Blazeo `configure({ baseUrl, … })` runs before any `CalendarModel` / `EventModel` HTTP.
 * Uses the same resolution as {@link resolveBlazeoConnection}: explicit args, existing `getConfig()`,
 * then `blazeoClientDefaults` — so file defaults apply even if the host never called `configure`.
 * When `accessToken` / `getAccessToken` are passed, they are merged into the local auth store.
 */
export declare function ensureBlazeoHttpReady(options?: EnsureBlazeoHttpOptions): {
    ok: true;
    baseUrl: string;
    consumer?: string;
} | {
    ok: false;
    error: string;
};
