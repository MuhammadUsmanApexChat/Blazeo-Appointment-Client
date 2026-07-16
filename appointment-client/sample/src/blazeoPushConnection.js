import {
  clearAccessToken,
  ensureBlazeoHttpReady,
  initializeAppointmentClient,
  setAccessToken,
  setCrmApiUrl,
} from "appointment-client";
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
  const accessToken = (effective?.accessToken ?? "").trim();

  if (accessToken) {
    setAccessToken(accessToken);
  } else {
    clearAccessToken();
  }

  if (crmApiUrl) {
    setCrmApiUrl(crmApiUrl);
  }

  const cfg = {
    ...(baseUrl ? { baseUrl } : {}),
    ...(consumer ? { consumer } : {}),
    ...(crmApiUrl ? { crmApiUrl } : {}),
    ...(accessToken ? { accessToken } : {}),
  };

  if (baseUrl) {
    initializeAppointmentClient({ baseUrl, ...cfg });
    configure(cfg);
  }

  ensureBlazeoHttpReady(cfg);
}
