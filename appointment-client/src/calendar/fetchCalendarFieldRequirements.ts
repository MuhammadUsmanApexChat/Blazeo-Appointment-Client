import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import type { ApiEnvelope, BlazeoCustomFieldConnection } from "../customField/customFieldHttp.js";
import { getLeadFieldRequirementsApi } from "../lead/leadFieldRequirementsHttp.js";
import {
  mapFieldRequirementsToFrontend,
  unwrapFieldRequirementsData,
  type LeadFieldRequirement,
} from "./mapFieldRequirements.js";

export type FetchCalendarFieldRequirementsOptions = BlazeoCustomFieldConnection & {
  /**
   * `api` (default) — `{ column, enabled, required }[]`
   * `frontend` — portal rows: `fieldLabel`, `fieldKey`, `isRequired`, …
   */
  format?: "api" | "frontend";
};

export type CalendarFieldRequirementsBundle = {
  requirements: LeadFieldRequirement[];
  isDefault?: boolean;
  available?: string[];
};

/**
 * `GET /lead/fields/get?calendar_id=…` — same as `LeadModel.getFieldRequirements`.
 */
export async function fetchCalendarFieldRequirements(
  calendarId: string,
  options: FetchCalendarFieldRequirementsOptions = {}
): Promise<LeadFieldRequirement[] | Record<string, unknown>[] | null> {
  const id = String(calendarId ?? "").trim();
  if (!id) return null;

  const { format = "api", ...connection } = options;
  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) return null;

  const envelope = (await getLeadFieldRequirementsApi(id, connection)) as {
    status?: string;
    data?: unknown;
  };
  if (envelope.status !== "success" && envelope.status !== "Success") {
    return null;
  }

  const requirements = unwrapFieldRequirementsData(envelope.data);
  if (format === "frontend") {
    return mapFieldRequirementsToFrontend(requirements, id);
  }

  return requirements;
}

/** Alias aligned with calendar-client `LeadModel.getFieldRequirements`. */
export const getFieldRequirements = fetchCalendarFieldRequirements;
