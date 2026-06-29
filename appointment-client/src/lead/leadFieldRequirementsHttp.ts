import { LeadModel } from "@blazeo.com/calendar-client";
import {
  blazeoCustomFieldGet,
  blazeoCustomFieldPost,
  type ApiEnvelope,
  type BlazeoCustomFieldConnection,
} from "../customField/customFieldHttp.js";
import type { LeadFieldRequirement } from "../calendar/mapFieldRequirements.js";

function normalizeRequirement(field: unknown): LeadFieldRequirement | null {
  if (field == null) return null;
  if (typeof field === "string") {
    const column = field.trim().toLowerCase();
    return column ? { column, enabled: true, required: false } : null;
  }
  if (typeof field !== "object") return null;
  const row = field as Record<string, unknown>;
  const column = String(row.column ?? row.Column ?? "")
    .trim()
    .toLowerCase();
  if (!column) return null;
  return {
    column,
    enabled: Boolean(row.enabled ?? row.Enabled ?? true),
    required: Boolean(row.required ?? row.Required ?? false),
  };
}

function normalizeRequirementsForSave(fields: LeadFieldRequirement[]): LeadFieldRequirement[] {
  return fields.map(normalizeRequirement).filter((r): r is LeadFieldRequirement => r != null);
}

/**
 * `GET /lead/fields/get?calendar_id=…`
 * Uses direct HTTP so older `@blazeo.com/calendar-client` versions without
 * `LeadModel.getFieldRequirements` still work.
 */
export async function getLeadFieldRequirementsApi(
  calendarId: string,
  connection: BlazeoCustomFieldConnection = {}
): Promise<ApiEnvelope> {
  const id = String(calendarId ?? "").trim();
  if (!id) {
    return { status: "failure", message: "calendarId required" };
  }

  const leadModel = LeadModel as { getFieldRequirements?: (cid: string) => Promise<ApiEnvelope> };
  if (typeof leadModel.getFieldRequirements === "function") {
    return leadModel.getFieldRequirements(id);
  }

  return blazeoCustomFieldGet("/lead/fields/get", { calendar_id: id }, connection);
}

/**
 * `POST /lead/fields/save` with `{ calendar_id, fields }`.
 * Uses direct HTTP when `LeadModel.saveFieldRequirements` is unavailable.
 */
export async function saveLeadFieldRequirementsApi(
  calendarId: string,
  fields: LeadFieldRequirement[],
  connection: BlazeoCustomFieldConnection = {}
): Promise<ApiEnvelope> {
  const id = String(calendarId ?? "").trim();
  if (!id) {
    return { status: "failure", message: "calendarId required" };
  }

  const normalized = normalizeRequirementsForSave(fields);
  if (!normalized.length) {
    return { status: "failure", message: "fields required" };
  }

  const leadModel = LeadModel as {
    saveFieldRequirements?: (cid: string, reqs: LeadFieldRequirement[]) => Promise<ApiEnvelope>;
  };
  if (typeof leadModel.saveFieldRequirements === "function") {
    return leadModel.saveFieldRequirements(id, normalized);
  }

  return blazeoCustomFieldPost(
    "/lead/fields/save",
    { calendar_id: id, fields: normalized },
    undefined,
    connection
  );
}
