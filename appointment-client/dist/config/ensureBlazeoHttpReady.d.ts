export type EnsureBlazeoHttpOptions = {
    baseUrl?: string;
    consumer?: string;
};
/**
 * Ensures global Blazeo `configure({ baseUrl })` runs before any `CalendarModel` / `EventModel` HTTP.
 * Uses the same resolution as {@link resolveBlazeoConnection}: explicit args, existing `getConfig()`,
 * then `blazeoClientDefaults` — so file defaults apply even if the host never called `configure`.
 */
export declare function ensureBlazeoHttpReady(options?: EnsureBlazeoHttpOptions): {
    ok: true;
    baseUrl: string;
    consumer?: string;
} | {
    ok: false;
    error: string;
};
