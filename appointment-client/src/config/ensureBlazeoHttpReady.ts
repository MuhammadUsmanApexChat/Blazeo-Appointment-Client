import { configure } from "@blazeo.com/calendar-client";
import { resolveBlazeoConnection } from "../calendar/createCalendar.js";
import type { BlazeoConnectionOptions } from "./blazeoConnection.js";
import { blazeoConnectionToConfigureEnv } from "./blazeoConnection.js";
import { applyAppointmentAuth } from "../http/blazeoAuth.js";

export type EnsureBlazeoHttpOptions = BlazeoConnectionOptions;

/**
 * Ensures global Blazeo `configure()` runs before any `CalendarModel` / `EventModel` HTTP.
 * Merges `baseUrl` / `consumer` / JWT (`accessToken`, `getAccessToken`) into both
 * `@blazeo.com/calendar-client` and the appointment-client auth store.
 */
export function ensureBlazeoHttpReady(options: EnsureBlazeoHttpOptions = {}):
  | { ok: true; baseUrl: string; consumer?: string }
  | { ok: false; error: string } {
  const resolved = resolveBlazeoConnection(options);
  const baseUrl =
    options.baseUrl?.trim().replace(/\/+$/, "") || resolved.baseUrl;
  const consumer = options.consumer?.trim() || resolved.consumer;

  const merged: BlazeoConnectionOptions = {
    ...options,
    ...(baseUrl ? { baseUrl } : {}),
    ...(consumer ? { consumer } : {}),
  };

  const configureEnv = blazeoConnectionToConfigureEnv(merged);
  if (Object.keys(configureEnv).length > 0) {
    configure(configureEnv as Parameters<typeof configure>[0]);
  }
  applyAppointmentAuth(merged);

  if (!baseUrl) {
    return {
      ok: false,
      error:
        "Blazeo base URL is not set. Call initializeAppointmentClient({ baseUrl }) or configure({ baseUrl }) at app startup, set blazeoClientConfig.baseUrl, or pass baseUrl when calling fetch APIs.",
    };
  }

  return { ok: true, baseUrl, ...(consumer ? { consumer } : {}) };
}
