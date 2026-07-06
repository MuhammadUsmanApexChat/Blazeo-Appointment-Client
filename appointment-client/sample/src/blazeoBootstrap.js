/**
 * Runs once before React mounts. Order:
 * 1. `blazeoClientDefaults.ts` (via applyBlazeoClientConfig) — optional file defaults
 * 2. `VITE_BLAZEO_BASE_URL` / `VITE_BLAZEO_CONSUMER` — overrides when set
 *
 * Uses {@link pushBlazeoConnection} so calendar-client is configured the same way as the UI card.
 */
import { applyBlazeoClientConfig } from "appointment-client";
import { pushBlazeoConnection } from "./blazeoPushConnection.js";

function normalizeBase(u) {
  const t = (u ?? "").trim();
  if (!t) return "";
  return t.replace(/\/+$/, "");
}

export function bootstrapBlazeoClient() {  
  applyBlazeoClientConfig();

  const envBase = normalizeBase(import.meta.env.VITE_BLAZEO_BASE_URL ?? "");
  const envConsumer = (import.meta.env.VITE_BLAZEO_CONSUMER ?? "").trim();
  const envCrmApiUrl = normalizeBase(import.meta.env.VITE_CRM_API_URL ?? "");

  if (!envBase && !envCrmApiUrl) return;

  pushBlazeoConnection({
    baseUrl: envBase,
    ...(envConsumer ? { consumer: envConsumer } : {}),
    ...(envCrmApiUrl ? { crmApiUrl: envCrmApiUrl } : {}),
  });
}
