import { configure } from "@blazeo.com/calendar-client";
import { resolveBlazeoConnection } from "../calendar/createCalendar.js";

export type EnsureBlazeoHttpOptions = {
  baseUrl?: string;
  consumer?: string;
};

/**
 * Ensures global Blazeo `configure({ baseUrl })` runs before any `CalendarModel` / `EventModel` HTTP.
 * Uses the same resolution as {@link resolveBlazeoConnection}: explicit args, existing `getConfig()`,
 * then `blazeoClientDefaults` — so file defaults apply even if the host never called `configure`.
 */
export function ensureBlazeoHttpReady(options: EnsureBlazeoHttpOptions = {}):
  | { ok: true; baseUrl: string; consumer?: string }
  | { ok: false; error: string } {
  // Hard-prefer explicit args (call-site can bypass any module-resolution mismatch).
  const explicitBase = options.baseUrl?.trim().replace(/\/+$/, "");
  const explicitConsumer = options.consumer?.trim() || undefined;
  if (explicitBase) {
    configure({
      baseUrl: explicitBase,
      ...(explicitConsumer ? { consumer: explicitConsumer } : {}),
    });
    return { ok: true, baseUrl: explicitBase, ...(explicitConsumer ? { consumer: explicitConsumer } : {}) };
  }

  const { baseUrl, consumer } = resolveBlazeoConnection(options);
  if (!baseUrl) {
    return {
      ok: false,
      error:
        "Blazeo base URL is not set. Call initializeAppointmentClient({ baseUrl }) or configure({ baseUrl }) at app startup, set blazeoClientConfig.baseUrl, or pass baseUrl when calling fetch APIs.",
    };
  }
  configure({
    baseUrl,
    ...(consumer ? { consumer } : {}),
  });
  return { ok: true, baseUrl, ...(consumer ? { consumer } : {}) };
}
