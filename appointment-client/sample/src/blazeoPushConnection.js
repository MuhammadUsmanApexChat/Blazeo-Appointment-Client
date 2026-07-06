import { ensureBlazeoHttpReady, initializeAppointmentClient, setCrmApiUrl } from "appointment-client";
import { configure } from "@blazeo.com/calendar-client";

function normalizeBase(u) {
  const t = (u ?? "").trim();
  if (!t) return "";
  return t.replace(/\/+$/, "");
}

/**
 * Applies Base URL from the connection card. With Vite `resolve.alias` pointing
 * `@blazeo.com/calendar-client` at one file, `configure` here matches `CalendarModel`'s store.
 * `initializeAppointmentClient` + `ensureBlazeoHttpReady` keep `appointment-client` helpers aligned.
 */
export function pushBlazeoConnection(effective) {
  const baseUrl = normalizeBase(effective?.baseUrl ?? "");
  const crmApiUrl = normalizeBase(effective?.crmApiUrl ?? "");
  const consumer = (effective?.consumer ?? "").trim() || undefined;

  if (crmApiUrl) {
    setCrmApiUrl(crmApiUrl);
  }

  if (!baseUrl) return;

  const cfg = {
    baseUrl,
    ...(consumer ? { consumer } : {}),
    ...(crmApiUrl ? { crmApiUrl } : {}),
  };
  initializeAppointmentClient(cfg);
  configure(cfg);
  ensureBlazeoHttpReady(cfg);
}
