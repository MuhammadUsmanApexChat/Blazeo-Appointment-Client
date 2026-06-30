import { configureAppointmentClient } from "../http/blazeoAuth.js";
import type { BlazeoConnectionOptions } from "./blazeoConnection.js";

export interface AppointmentClientConfig extends BlazeoConnectionOptions {
  fetch?: typeof fetch;
}

/**
 * Writes connection + auth into calendar-client `configure()` and the local auth store.
 * Returns whether anything was applied (skipped when `baseUrl` is empty after trim).
 */
export function syncBlazeoConnection(config: AppointmentClientConfig): boolean {
  const baseUrl = config.baseUrl?.trim().replace(/\/+$/, "");
  if (!baseUrl) return false;
  configureAppointmentClient({
    ...config,
    baseUrl,
  });
  return true;
}
