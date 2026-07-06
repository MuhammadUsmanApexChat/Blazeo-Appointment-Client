import { getConfig } from "@blazeo.com/calendar-client";
import { resolveCrmApiUrl } from "../config/crmClientConfig.js";
import type { ApiEnvelope } from "../customField/customFieldHttp.js";
import { buildCrmCalendarLeadFieldsUrl } from "./crmCalendarLeadFieldsPath.js";

export type CrmCalendarLeadFieldsConnection = {
  crmApiUrl?: string;
  fetch?: typeof fetch;
};

export type SaveCrmCalendarLeadFieldsResult =
  | { ok: true; envelope: ApiEnvelope; userDefinedFields: unknown[] }
  | { ok: false; reason: "missing_crm_api_url"; detail: string }
  | { ok: false; reason: "missing_calendar_id"; detail: string }
  | { ok: false; reason: "missing_company_key"; detail: string }
  | { ok: false; reason: "missing_fields"; detail: string }
  | { ok: false; reason: "api_failure"; detail: string; envelope: ApiEnvelope };

/**
 * `POST {crmApiUrl}/crm/calendar/lead-fields` with `companyKey` header.
 * Sends mapped `crmLeadCustomFields` rows as `userDefinedFields`.
 */
export async function saveCrmCalendarLeadFields(
  calendarId: string,
  userDefinedFields: unknown[],
  companyKey: string,
  connection: CrmCalendarLeadFieldsConnection = {}
): Promise<SaveCrmCalendarLeadFieldsResult> {
  const id = String(calendarId ?? "").trim();
  if (!id) {
    return { ok: false, reason: "missing_calendar_id", detail: "calendarId is required" };
  }

  const key = String(companyKey ?? "").trim();
  if (!key) {
    return { ok: false, reason: "missing_company_key", detail: "companyKey is required" };
  }

  if (!Array.isArray(userDefinedFields) || userDefinedFields.length === 0) {
    return { ok: false, reason: "missing_fields", detail: "userDefinedFields required" };
  }

  const crmApiUrl = resolveCrmApiUrl(connection);
  if (!crmApiUrl) {
    return {
      ok: false,
      reason: "missing_crm_api_url",
      detail:
        "CRM API URL is not set. Call initializeAppointmentClient({ crmApiUrl }) or pass crmApiUrl when saving.",
    };
  }

  const env = getConfig();
  const fetchFn =
    connection.fetch ??
    env?.fetch ??
    (typeof fetch !== "undefined"
      ? fetch
      : () => {
          throw new Error("fetch is not available");
        });

  const body = { calendarId: id, userDefinedFields };
  const url = buildCrmCalendarLeadFieldsUrl(crmApiUrl);

  const res = await fetchFn(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      companyKey: key,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let envelope: ApiEnvelope;
  try {
    envelope = JSON.parse(text) as ApiEnvelope;
  } catch {
    envelope = { status: "failure", message: text || res.statusText };
  }

  if (!res.ok && envelope.status !== "failure") {
    envelope.status = "failure";
    envelope.message = envelope.message ?? `HTTP ${res.status}`;
  }

  if (envelope.status === "failure" || (!res.ok && envelope.status !== "success")) {
    return {
      ok: false,
      reason: "api_failure",
      detail: String(envelope.message ?? "CRM calendar lead-fields save failed"),
      envelope,
    };
  }

  return { ok: true, envelope, userDefinedFields };
}
