import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import type { ApiEnvelope, BlazeoCustomFieldConnection } from "../customField/customFieldHttp.js";
import { saveLeadFieldRequirementsApi } from "../lead/leadFieldRequirementsHttp.js";
import {
  mapFrontendFieldsToRequirements,
  type LeadFieldRequirement,
} from "./mapFieldRequirements.js";

export type SaveCalendarFieldRequirementsResult =
  | { ok: true; skipped: true }
  | {
      ok: true;
      skipped: false;
      requirements: LeadFieldRequirement[];
      envelope: ApiEnvelope;
    }
  | { ok: false; reason: "missing_base_url"; detail: string }
  | { ok: false; reason: "missing_calendar_id"; detail: string }
  | { ok: false; reason: "api_failure"; detail: string; envelope: ApiEnvelope };

/**
 * Save basic lead field requirements — same as `LeadModel.saveFieldRequirements` /
 * `POST /lead/fields/save?calendar_id=…`.
 *
 * Accepts frontend rows (`fieldKey`, `isRequired`, …) or API rows (`column`, `enabled`, `required`).
 */
export async function saveCalendarFieldRequirements(
  calendarId: string,
  fields: unknown[],
  connection: BlazeoCustomFieldConnection = {}
): Promise<SaveCalendarFieldRequirementsResult> {
  const id = String(calendarId ?? "").trim();
  if (!id) {
    return { ok: false, reason: "missing_calendar_id", detail: "calendarId is required" };
  }

  const requirements = normalizeRequirementsInput(fields);
  if (!requirements.length) {
    return { ok: true, skipped: true };
  }

  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    return { ok: false, reason: "missing_base_url", detail: ready.error };
  }

  const envelope = (await saveLeadFieldRequirementsApi(id, requirements, connection)) as ApiEnvelope;
  if (envelope.status === "failure") {
    return {
      ok: false,
      reason: "api_failure",
      detail: String(envelope.message ?? "Lead field requirements save failed"),
      envelope,
    };
  }

  return { ok: true, skipped: false, requirements, envelope };
}

function normalizeRequirementsInput(fields: unknown[]): LeadFieldRequirement[] {
  if (!Array.isArray(fields) || !fields.length) return [];

  const first = fields[0];
  if (
    first != null &&
    typeof first === "object" &&
    ("column" in (first as object) || "Column" in (first as object))
  ) {
    return fields
      .map((row) => {
        if (row == null || typeof row !== "object") return null;
        const r = row as Record<string, unknown>;
        const column = String(r.column ?? r.Column ?? "")
          .trim()
          .toLowerCase();
        if (!column) return null;
        return {
          column,
          enabled: Boolean(r.enabled ?? r.Enabled ?? true),
          required: Boolean(r.required ?? r.Required ?? false),
        };
      })
      .filter((r): r is LeadFieldRequirement => r != null);
  }

  return mapFrontendFieldsToRequirements(fields);
}

/** Alias aligned with calendar-client naming. */
export const saveFieldRequirements = saveCalendarFieldRequirements;
