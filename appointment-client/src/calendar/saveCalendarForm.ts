import { saveCustomFieldForm } from "../customField/saveCustomFieldForm.js";
export type {
  SaveCustomFieldFormOptions,
  SaveCustomFieldFormResult,
} from "../customField/saveCustomFieldForm.js";
import type {
  SaveCustomFieldFormOptions,
  SaveCustomFieldFormResult,
} from "../customField/saveCustomFieldForm.js";
import type { ApiEnvelope, BlazeoCustomFieldConnection } from "../customField/customFieldHttp.js";
import type { FieldTypeDefinition } from "../customField/fetchFieldTypes.js";
import {
  collectAppointmentFormFields,
  mapCalendarFormFieldsToApi,
} from "./mapCalendarForm.js";
import { splitAppointmentFormFields, type LeadFieldRequirement } from "./mapFieldRequirements.js";
import { saveCalendarFieldRequirements } from "./saveCalendarFieldRequirements.js";

/** Calendar id string or any object with `calendarId` / `id` (calendar view, BO, MST snapshot). */
export type CalendarFormSaveTarget =
  | string
  | {
      calendarId?: string;
      CalendarId?: string;
      id?: string;
      Id?: string;
    };

export function resolveCalendarIdForForm(calendar: CalendarFormSaveTarget): string {
  if (typeof calendar === "string") {
    return calendar.trim();
  }
  const row = calendar as Record<string, unknown>;
  return String(
    row.calendarId ?? row.CalendarId ?? row.id ?? row.Id ?? ""
  ).trim();
}

/**
 * Save custom field form for a calendar — `POST /CustomField/Form/Save?calendar_id=…`.
 * Same as calendar-client `CustomFieldModel.saveForm(calendarId, fields)`.
 *
 * @param calendar - Calendar id (GUID) or object with `calendarId` / `id`
 * @param fields - Frontend rows or API-shaped rows (see `mapFormFieldsToApi`)
 */
export async function saveCalendarForm(
  calendar: CalendarFormSaveTarget,
  fields: unknown[],
  connection: BlazeoCustomFieldConnection = {},
  options: SaveCustomFieldFormOptions = {}
): Promise<SaveCustomFieldFormResult> {
  const calendarId = resolveCalendarIdForForm(calendar);
  return saveCustomFieldForm(calendarId, fields, connection, options);
}

export type SaveCalendarAppointmentFormResult =
  | { ok: true; skipped: true }
  | {
      ok: true;
      skipped: false;
      fieldRequirementsSaved?: boolean;
      fieldRequirements?: LeadFieldRequirement[];
      fieldRequirementsEnvelope?: ApiEnvelope;
      appointmentFormSaved?: boolean;
      apiFields?: FieldTypeDefinition[];
      envelope?: ApiEnvelope;
    }
  | { ok: false; error: string; reason?: string; apiResponse?: unknown };

/**
 * After calendar create/update: save `appointmentUserDefinedFields` from the calendar payload.
 *
 * Rows without `fieldId` that map to bookable lead columns are also saved via
 * `LeadModel.saveFieldRequirements`. All rows are saved via `POST /CustomField/Form/Save`
 * (`CustomFieldModel.saveForm`) with `kind` / `Kind` forwarded when present.
 */
export async function saveCalendarAppointmentForm(
  calendarId: string,
  calendar: any,
  connection: BlazeoCustomFieldConnection = {}
): Promise<SaveCalendarAppointmentFormResult> {
  const fields = collectAppointmentFormFields(calendar);
  if (fields.length === 0) {
    return { ok: true, skipped: true };
  }

  const { basicFields, customFields } = splitAppointmentFormFields(fields);

  let fieldRequirementsSaved = false;
  let fieldRequirements: LeadFieldRequirement[] | undefined;
  let fieldRequirementsEnvelope: ApiEnvelope | undefined;

  if (basicFields.length > 0) {
    const basicRes = await saveCalendarFieldRequirements(calendarId, basicFields, connection);
    if (!basicRes.ok) {
      return {
        ok: false,
        error: basicRes.detail,
        reason: basicRes.reason,
        apiResponse: "envelope" in basicRes ? basicRes.envelope : undefined,
      };
    }
    if (!basicRes.skipped) {
      fieldRequirementsSaved = true;
      fieldRequirements = basicRes.requirements;
      fieldRequirementsEnvelope = basicRes.envelope;
    }
  }

  let appointmentFormSaved = false;
  let apiFields: FieldTypeDefinition[] | undefined;
  let envelope: ApiEnvelope | undefined;

  if (customFields.length > 0 || basicFields.length > 0) {
    const res = await saveCalendarForm(calendarId, fields, connection);
    if (!res.ok) {
      return {
        ok: false,
        error: res.detail,
        reason: res.reason,
      };
    }

    if (res.envelope.status === "failure") {
      return {
        ok: false,
        error: String(res.envelope.message ?? "Custom field form save failed"),
        apiResponse: res.envelope,
      };
    }

    appointmentFormSaved = true;
    apiFields = res.apiFields;
    envelope = res.envelope;
  }

  if (!fieldRequirementsSaved && !appointmentFormSaved) {
    return { ok: true, skipped: true };
  }

  return {
    ok: true,
    skipped: false,
    ...(fieldRequirementsSaved
      ? { fieldRequirementsSaved, fieldRequirements, fieldRequirementsEnvelope }
      : {}),
    ...(appointmentFormSaved ? { appointmentFormSaved, apiFields, envelope } : {}),
  };
}

/** Map form rows from a calendar object (alias). */
export { mapCalendarFormFieldsToApi };

/** Alias matching calendar-client / MST naming. */
export const saveForm = saveCalendarForm;
