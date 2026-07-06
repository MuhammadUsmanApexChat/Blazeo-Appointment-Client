import { getConfig } from "@blazeo.com/calendar-client";
import { setCrmApiUrl } from "./crmClientConfig.js";
import { syncBlazeoConnection } from "./syncBlazeoConnection.js";
import type { BlazeoConnectionOptions } from "./blazeoConnection.js";

export interface AppointmentClientConfig extends BlazeoConnectionOptions {
  baseUrl: string;
  /** CRM API base URL for `POST {crmApiUrl}/crm/calendar/lead-fields` when `isCrm` is true. */
  crmApiUrl?: string;
  fetch?: typeof fetch;
}

let isConfigured = false;

/**
 * Applies Blazeo connection (same as {@link syncBlazeoConnection}) and marks the client as configured
 * when a non-empty `baseUrl` was written to `@blazeo.com/calendar-client`.
 */
export function initializeAppointmentClient(config: AppointmentClientConfig) {
  if (config.crmApiUrl != null) {
    setCrmApiUrl(config.crmApiUrl);
  }
  if (syncBlazeoConnection(config)) {
    isConfigured = true;
  }
}

export function isAppointmentClientConfigured() {
  return isConfigured || getConfig() !== null;
}
