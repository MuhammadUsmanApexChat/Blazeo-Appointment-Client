import { saveCustomFieldFormApi } from "./customFieldFormHttp.js";
import type { ApiEnvelope, BlazeoCustomFieldConnection } from "./customFieldHttp.js";import type { FieldTypeDefinition } from "./fetchFieldTypes.js";
import {
  mapFrontendFormFieldsToApi,
  type MapFormFieldsOptions,
} from "./mapFormFieldsToApi.js";

export type SaveCustomFieldFormOptions = MapFormFieldsOptions & {
  /** Send `fields` as-is (already API-shaped). Default: transform from calendar/lead frontend rows. */
  fieldsAlreadyApiFormat?: boolean;
};

export type SaveCustomFieldFormResult =
  | {
      ok: true;
      envelope: ApiEnvelope;
      /** Payload sent to `POST /CustomField/Form/Save`. */
      apiFields: FieldTypeDefinition[];
    }
  | { ok: false; reason: "missing_base_url"; detail: string }
  | { ok: false; reason: "missing_calendar_id"; detail: string };

/**
 * Save custom field form layout — same as `CustomFieldModel.saveForm` /
 * `POST /CustomField/Form/Save?calendar_id=…`.
 *
 * Accepts calendar-style frontend rows (`fieldLabel`, `fieldKey`, `fieldId`, …) or
 * lead-style rows (`fieldName`, `fieldType`, `fieldSubType`, `leadCustomOptions`, …).
 * Transforms to API rows (`Label`, `Type`, `DataId`, `CustomFieldId`, `DropdownOptions`, …) before POST.
 *
 * Pass `fieldsAlreadyApiFormat: true` (or pre-shaped rows with `Type` + `Label`) to skip transformation.
 */
export async function saveCustomFieldForm(
  calendarId: string,
  fields: unknown[],
  connection: BlazeoCustomFieldConnection = {},
  options: SaveCustomFieldFormOptions = {}
): Promise<SaveCustomFieldFormResult> {
  const id = String(calendarId ?? "").trim();
  if (!id) {
    return { ok: false, reason: "missing_calendar_id", detail: "calendarId is required" };
  }

  const skipTransform = Boolean(options.skipTransform ?? options.fieldsAlreadyApiFormat);
  const apiFields = mapFrontendFormFieldsToApi(fields ?? [], { skipTransform });

  const envelope = await saveCustomFieldFormApi(id, apiFields, connection);
  if (envelope.status === "failure" && /base url|not configured/i.test(String(envelope.message))) {
    return {
      ok: false,
      reason: "missing_base_url",
      detail: String(envelope.message ?? "Blazeo base URL is not configured."),
    };
  }

  return { ok: true, envelope, apiFields };
}

/** Alias aligned with calendar-client naming. */
export const saveForm = saveCustomFieldForm;
