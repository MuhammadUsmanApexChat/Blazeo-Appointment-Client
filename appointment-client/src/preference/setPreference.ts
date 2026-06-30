import { PreferenceModel } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import type { BlazeoConnectionOptions } from "../config/blazeoConnection.js";

export type BlazeoPreferenceConnection = BlazeoConnectionOptions;

/**
 * Save a preference: `PreferenceModel.set` → `POST /preference/{scope}/{key}/{option}`.
 * Ensures Blazeo HTTP config (`initializeAppointmentClient` / `configure` / defaults) before the request.
 */
export async function setPreferenceAsync(
  scope: string,
  key: string,
  option: string,
  body: string | object,
  connection: BlazeoPreferenceConnection = {}
): Promise<
  | { ok: true; response: unknown }
  | { ok: false; reason: "missing_base_url"; detail: string }
> {
  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    return { ok: false, reason: "missing_base_url", detail: ready.error };
  }

  const response = await PreferenceModel.set(
    String(scope).trim(),
    String(key).trim(),
    String(option).trim(),
    body
  );
  return { ok: true, response };
}
