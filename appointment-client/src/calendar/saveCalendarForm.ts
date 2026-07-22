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
import { mapCrmLeadCustomFieldsToApi } from "../crm/mapCrmLeadCustomFieldsToApi.js";
import { saveCrmCalendarLeadFields } from "../crm/saveCrmCalendarLeadFields.js";
import { isCrmCalendar, resolveCompanyKeyFromCalendar } from "./isCrmCalendar.js";
import {
  collectAppointmentFormFields,
  collectCrmLeadCustomFields,
  collectDeletedCustomFieldIds,
  mapCalendarFormFieldsToApi,
} from "./mapCalendarForm.js";
import { removeCalendarFormField } from "./removeCalendarFormFields.js";
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
      crmLeadCustomFieldsSaved?: boolean;
      appointmentFormSaved?: boolean;
      customFieldsDeleted?: boolean;
      deletedCustomFieldIds?: string[];
      apiFields?: FieldTypeDefinition[];
      envelope?: ApiEnvelope;
    }
  | { ok: false; error: string; reason?: string; apiResponse?: unknown };

/**
 * After calendar create/update: save `appointmentUserDefinedFields` from the calendar payload.
 *
 * When `deletedCustomFieldIds` is present, those fields are removed first via
 * `GET /CustomField/RemoveField`, then the existing save flow continues.
 *
 * When `isCrm` is true and `crmLeadCustomFields` has one or more items, also saves via
 * `POST {crmApiUrl}/crm/calendar/lead-fields` with mapped `userDefinedFields`.
 *
 * `appointmentUserDefinedFields` always follow the existing Blazeo flow (with or without `isCrm`):
 * bookable lead rows (no `fieldId`) → `POST /lead/fields/save`; all rows →
 * `POST /CustomField/Form/Save`.
 */
export async function saveCalendarAppointmentForm(
  calendarId: string,
  calendar: any,
  connection: BlazeoCustomFieldConnection = {}
): Promise<SaveCalendarAppointmentFormResult> {
  const deletedCustomFieldIds = collectDeletedCustomFieldIds(calendar);
  const deletedIds: string[] = [];

  if (deletedCustomFieldIds.length > 0) {
    for (const fieldId of deletedCustomFieldIds) {
      try {
        const removeRes = await removeCalendarFormField(fieldId, connection);
        if (removeRes.ok) {
          deletedIds.push(fieldId);
        } else {
          console.error(`Failed to remove custom field ${fieldId}:`, removeRes.detail);
        }
      } catch (cfError) {
        console.error(`Failed to remove custom field ${fieldId}:`, cfError);
      }
    }
  }

  const customFieldsDeleted = deletedIds.length > 0;
  const fields = collectAppointmentFormFields(calendar);
  const crmLeadFields = collectCrmLeadCustomFields(calendar);

  let crmLeadCustomFieldsSaved = false;
  let crmEnvelope: ApiEnvelope | undefined;

  if (isCrmCalendar(calendar) && crmLeadFields.length > 0) {
    const userDefinedFields = mapCrmLeadCustomFieldsToApi(crmLeadFields);
    if (userDefinedFields.length > 0) {
      const companyKey = resolveCompanyKeyFromCalendar(calendar);
      const crmRes = await saveCrmCalendarLeadFields(
        calendarId,
        userDefinedFields,
        companyKey,
        connection
      );
      if (!crmRes.ok) {
        return {
          ok: false,
          error: crmRes.detail,
          reason: crmRes.reason,
          ...("envelope" in crmRes ? { apiResponse: crmRes.envelope } : {}),
        };
      }
      crmLeadCustomFieldsSaved = true;
      crmEnvelope = crmRes.envelope;
    }
  }

  if (fields.length === 0) {
    if (!crmLeadCustomFieldsSaved && !customFieldsDeleted) {
      return { ok: true, skipped: true };
    }
    return {
      ok: true,
      skipped: false,
      ...(customFieldsDeleted ? { customFieldsDeleted, deletedCustomFieldIds: deletedIds } : {}),
      ...(crmLeadCustomFieldsSaved ? { crmLeadCustomFieldsSaved: true, envelope: crmEnvelope } : {}),
    };
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

  if (
    !fieldRequirementsSaved &&
    !appointmentFormSaved &&
    !crmLeadCustomFieldsSaved &&
    !customFieldsDeleted
  ) {
    return { ok: true, skipped: true };
  }

  return {
    ok: true,
    skipped: false,
    ...(customFieldsDeleted ? { customFieldsDeleted, deletedCustomFieldIds: deletedIds } : {}),
    ...(crmLeadCustomFieldsSaved ? { crmLeadCustomFieldsSaved, envelope: crmEnvelope } : {}),
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
