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
import { mapFrontendFormFieldsToApi } from "../customField/mapFormFieldsToApi.js";

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
      apiFields: FieldTypeDefinition[];
      envelope: ApiEnvelope;
    }
  | { ok: false; error: string; reason?: string; apiResponse?: unknown };

/**
 * After calendar create/update: save `appointmentUserDefinedFields` from the calendar payload.
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

  return {
    ok: true,
    skipped: false,
    apiFields: res.apiFields,
    envelope: res.envelope,
  };
}

/** Map form rows from a calendar object (alias). */
export { mapCalendarFormFieldsToApi };

/** Alias matching calendar-client / MST naming. */
export const saveForm = saveCalendarForm;
