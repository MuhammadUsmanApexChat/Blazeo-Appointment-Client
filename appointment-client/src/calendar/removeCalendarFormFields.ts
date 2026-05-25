import { blazeoCustomFieldGet } from "../customField/customFieldHttp.js";
import type { ApiEnvelope, BlazeoCustomFieldConnection } from "../customField/customFieldHttp.js";
import {
  resolveCalendarIdForForm,
  type CalendarFormSaveTarget,
} from "./saveCalendarForm.js";

/** Field id string or row with `fieldId` / `customFieldId` / `CustomFieldId`. */
export type CustomFieldRemoveTarget =
  | string
  | {
      fieldId?: string;
      FieldId?: string;
      customFieldId?: string;
      CustomFieldId?: string;
      DataId?: string;
      dataId?: string;
    };

export function resolveCustomFieldId(target: CustomFieldRemoveTarget): string {
  if (typeof target === "string") {
    return target.trim();
  }
  const row = target as Record<string, unknown>;
  return String(
    row.customFieldId ??
      row.CustomFieldId ??
      row.fieldId ??
      row.FieldId ??
      row.dataId ??
      row.DataId ??
      ""
  ).trim();
}

export type RemoveCustomFieldResult =
  | { ok: true; envelope: ApiEnvelope }
  | { ok: false; reason: "missing_base_url"; detail: string }
  | { ok: false; reason: "missing_custom_field_id"; detail: string };

export type RemoveAllCalendarFormFieldsResult =
  | { ok: true; envelope: ApiEnvelope }
  | { ok: false; reason: "missing_base_url"; detail: string }
  | { ok: false; reason: "missing_calendar_id"; detail: string };

function envelopeBaseUrlFailure(envelope: ApiEnvelope): RemoveCustomFieldResult | null {
  if (envelope.status === "failure" && /base url|not configured/i.test(String(envelope.message))) {
    return {
      ok: false,
      reason: "missing_base_url",
      detail: String(envelope.message ?? "Blazeo base URL is not configured."),
    };
  }
  return null;
}

/**
 * Remove one custom field — `GET /CustomField/RemoveField?customfield_id=…`.
 * Same as `CustomFieldModel.removeField(customFieldId)`.
 */
export async function removeCalendarFormField(
  customField: CustomFieldRemoveTarget,
  connection: BlazeoCustomFieldConnection = {}
): Promise<RemoveCustomFieldResult> {
  const customFieldId = resolveCustomFieldId(customField);
  if (!customFieldId) {
    return {
      ok: false,
      reason: "missing_custom_field_id",
      detail: "customFieldId (or fieldId) is required",
    };
  }

  const envelope = await blazeoCustomFieldGet(
    "/CustomField/RemoveField",
    { customfield_id: customFieldId },
    connection
  );

  const baseFail = envelopeBaseUrlFailure(envelope);
  if (baseFail) return baseFail;

  return { ok: true, envelope };
}

/**
 * Remove all custom fields for a calendar — `GET /CustomField/RemoveAllFields?calendar_id=…`.
 * Same as `CustomFieldModel.removeAllFields(calendarId)`.
 */
export async function removeAllCalendarFormFields(
  calendar: CalendarFormSaveTarget,
  connection: BlazeoCustomFieldConnection = {}
): Promise<RemoveAllCalendarFormFieldsResult> {
  const calendarId = resolveCalendarIdForForm(calendar);
  if (!calendarId) {
    return {
      ok: false,
      reason: "missing_calendar_id",
      detail: "calendarId is required",
    };
  }

  const envelope = await blazeoCustomFieldGet(
    "/CustomField/RemoveAllFields",
    { calendar_id: calendarId },
    connection
  );

  if (envelope.status === "failure" && /base url|not configured/i.test(String(envelope.message))) {
    return {
      ok: false,
      reason: "missing_base_url",
      detail: String(envelope.message ?? "Blazeo base URL is not configured."),
    };
  }

  return { ok: true, envelope };
}

/** Aliases aligned with calendar-client naming. */
export const removeField = removeCalendarFormField;
export const removeAllFields = removeAllCalendarFormFields;
