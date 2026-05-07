import { configure } from "@blazeo.com/calendar-client";
import type { AppointmentClientConfig } from "./initializeAppointmentClient.js";

/**
 * Writes `baseUrl` / `consumer` into the global `@blazeo.com/calendar-client` `configure()` store.
 * Returns whether anything was applied (skipped when `baseUrl` is empty after trim).
 */
export function syncBlazeoConnection(config: AppointmentClientConfig): boolean {
  const baseUrl = config.baseUrl?.trim().replace(/\/+$/, "");
  if (!baseUrl) return false;
  configure({
    baseUrl,
    ...(config.consumer != null && String(config.consumer).trim() !== ""
      ? { consumer: String(config.consumer).trim() }
      : {}),
    ...(config.fetch ? { fetch: config.fetch } : {}),
  });
  return true;
}
