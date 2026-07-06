import { getConfig } from "@blazeo.com/calendar-client";
import { resolveCrmApiUrl } from "../config/crmClientConfig.js";
import type { ApiEnvelope } from "../customField/customFieldHttp.js";
import type { FrontendCalendarFormField } from "../customField/mapFormFieldsToApi.js";
import { buildCrmCalendarLeadFieldsUrl } from "./crmCalendarLeadFieldsPath.js";
import {
  mapCrmUserDefinedFieldsToFrontend,
  unwrapCrmUserDefinedFields,
} from "./mapCrmUserDefinedFieldsToFrontend.js";

export type FetchCrmCalendarLeadFieldsConnection = {
  crmApiUrl?: string;
  fetch?: typeof fetch;
};

export type FetchCrmCalendarLeadFieldsOptions = FetchCrmCalendarLeadFieldsConnection & {
  /** `frontend` (default) — portal rows; `api` — CRM rows unchanged. */
  format?: "frontend" | "api";
};

export type FetchCrmCalendarLeadFieldsResult =
  | { ok: true; userDefinedFields: unknown[]; envelope?: ApiEnvelope }
  | { ok: false; reason: "missing_crm_api_url"; detail: string }
  | { ok: false; reason: "missing_calendar_id"; detail: string }
  | { ok: false; reason: "missing_company_key"; detail: string }
  | { ok: false; reason: "api_failure"; detail: string; envelope?: ApiEnvelope };

/**
 * `GET {crmApiUrl}/crm/calendar/lead-fields/{calendarId}` with `companyKey` header.
 */
export async function fetchCrmCalendarLeadFields(
  calendarId: string,
  companyKey: string,
  connection: FetchCrmCalendarLeadFieldsOptions = {}
): Promise<FetchCrmCalendarLeadFieldsResult> {
  const id = String(calendarId ?? "").trim();
  if (!id) {
    return { ok: false, reason: "missing_calendar_id", detail: "calendarId is required" };
  }

  const key = String(companyKey ?? "").trim();
  if (!key) {
    return { ok: false, reason: "missing_company_key", detail: "companyKey is required" };
  }

  const crmApiUrl = resolveCrmApiUrl(connection);
  if (!crmApiUrl) {
    return {
      ok: false,
      reason: "missing_crm_api_url",
      detail:
        "CRM API URL is not set. Call initializeAppointmentClient({ crmApiUrl }) or pass crmApiUrl when fetching.",
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

  const url = buildCrmCalendarLeadFieldsUrl(crmApiUrl, id);
  const res = await fetchFn(url, {
    method: "GET",
    headers: { companyKey: key },
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

  const failed =
    envelope.status === "failure" || (!res.ok && envelope.status !== "success" && envelope.status !== "Success");

  if (failed) {
    return {
      ok: false,
      reason: "api_failure",
      detail: String(envelope.message ?? "CRM calendar lead-fields fetch failed"),
      envelope,
    };
  }

  const rawFields = unwrapCrmUserDefinedFields(envelope.data ?? envelope);
  return { ok: true, userDefinedFields: rawFields, envelope };
}

/**
 * Fetch CRM lead fields and map to `crmLeadCustomFields` frontend rows.
 * Returns `null` when the call fails or no rows are returned (same as Blazeo form fetch).
 */
export async function fetchCrmCalendarAppointmentForm(
  calendarId: string,
  companyKey: string,
  options: FetchCrmCalendarLeadFieldsOptions = {}
): Promise<Record<string, unknown>[] | FrontendCalendarFormField[] | null> {
  const { format = "frontend", ...connection } = options;
  const res = await fetchCrmCalendarLeadFields(calendarId, companyKey, connection);
  if (!res.ok) return null;

  const rows = res.userDefinedFields;
  if (!rows.length) return [];

  return format === "frontend"
    ? mapCrmUserDefinedFieldsToFrontend(rows)
    : (rows as Record<string, unknown>[]);
}
