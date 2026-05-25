import {
  isApiFormFieldRow,
  mapFrontendFormFieldsToApi,
  type FrontendCalendarFormField,
} from "../customField/mapFormFieldsToApi.js";

export type { FrontendCalendarFormField };
function pick<T>(obj: any, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj[k] !== null) return obj[k] as T;
  }
  return undefined;
}

/**
 * Custom field form rows on the portal calendar object (CreateCalendar / update payload).
 * Primary key: `appointmentUserDefinedFields` (matches calendar view / `mapToDesiredCalendarResponse`).
 */
export function collectAppointmentFormFields(calendar: any): unknown[] {
  const arr =
    pick<unknown[]>(calendar, "appointmentUserDefinedFields", "AppointmentUserDefinedFields") ??
    pick<unknown[]>(calendar, "formFields", "FormFields") ??
    pick<unknown[]>(calendar, "customFormFields", "CustomFormFields") ??
    [];
  return Array.isArray(arr) ? arr : [];
}

export function calendarPayloadHasFormFields(calendar: any): boolean {
  return collectAppointmentFormFields(calendar).length > 0;
}

/** Map calendar-embedded form rows → `POST /CustomField/Form/Save` body. */
export function mapCalendarFormFieldsToApi(calendar: any) {
  return mapFrontendFormFieldsToApi(collectAppointmentFormFields(calendar));
}

/** Blazeo `Type` name → lead `fieldSubType` (inverse of {@link FIELD_SUBTYPE_TO_API_TYPE}). */
export const API_TYPE_TO_FIELD_SUBTYPE: Record<string, number> = {
  Text: 301,
  Email: 302,
  Dropdown: 303,
  MultilineText: 304,
  Number: 305,
  Phone: 306,
  Date: 307,
  Checkbox: 308,
  RadioButton: 309,
  MultiselectList: 310,
};

const LEAD_CUSTOM_FIELD_TYPE = 3;

function labelToFieldKey(label: string): string {
  const parts = String(label ?? "")
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
  if (!parts.length) return "Field";
  return parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

function mapApiOptionsToLeadCustom(options: unknown[] | undefined): { value: string }[] {
  if (!Array.isArray(options)) return [];
  return options.map((raw) => {
    const row =
      raw != null && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const value = String(
      row.Value ?? row.value ?? row.Label ?? row.label ?? row.Key ?? row.key ?? ""
    );
    return { value };
  });
}

function hasCustomFieldOptions(row: Record<string, unknown>): boolean {
  return (
    Array.isArray(row.DropdownOptions) ||
    Array.isArray(row.dropdownOptions) ||
    Array.isArray(row.RadioButtonOptions) ||
    Array.isArray(row.checkBoxOptions) ||
    Array.isArray(row.multiselectListOptions)
  );
}

/**
 * One API form row (`GET /CustomField/Form/Get`) → portal calendar field row.
 */
export function mapApiFormFieldToFrontend(row: unknown): FrontendCalendarFormField | null {
  if (row == null || typeof row !== "object") return null;
  const src = row as Record<string, unknown>;

  if (!isApiFormFieldRow(src)) {
    if (
      src.fieldLabel != null ||
      src.fieldKey != null ||
      src.fieldName != null ||
      src.FieldLabel != null
    ) {
      return { ...src } as FrontendCalendarFormField;
    }
    return null;
  }

  const label = String(pick(src, "Label", "label") ?? "").trim();
  const typeName = String(pick(src, "Type", "type") ?? "Text");
  const fieldId = String(
    pick(src, "CustomFieldId", "customFieldId", "DataId", "dataId") ?? ""
  ).trim();
  const isRequired = Boolean(pick(src, "IsRequired", "isRequired", "isMandatory") ?? false);
  const options =
    pick<unknown[]>(src, "DropdownOptions", "dropdownOptions") ??
    pick<unknown[]>(src, "RadioButtonOptions", "radioButtonOptions") ??
    pick<unknown[]>(src, "checkBoxOptions", "CheckBoxOptions") ??
    pick<unknown[]>(src, "multiselectListOptions", "MultiselectListOptions") ??
    [];

  const fieldSubType = API_TYPE_TO_FIELD_SUBTYPE[typeName];
  const isLeadStyle =
    fieldSubType != null &&
    (hasCustomFieldOptions(src) || typeName === "Dropdown" || typeName === "RadioButton");

  if (isLeadStyle) {
    return {
      fieldName: label || typeName,
      fieldType: LEAD_CUSTOM_FIELD_TYPE,
      fieldSubType,
      description: label || undefined,
      isImportant: false,
      isRequired,
      isMandatory: isRequired,
      ...(fieldId ? { fieldId } : {}),
      leadCustomOptions: mapApiOptionsToLeadCustom(options),
    };
  }

  const fieldKey =
    Object.entries({
      email: "Email",
      phone: "Phone",
      firstname: "FirstName",
      lastname: "LastName",
    }).find(([k]) => typeName.toLowerCase().includes(k) || labelToFieldKey(label).toLowerCase() === k)?.[1] ??
    labelToFieldKey(label);

  return {
    fieldLabel: label,
    fieldKey,
    ...(fieldId ? { fieldId } : {}),
    fieldToolTipText: "",
    isRequired,
    isMandatory: isRequired,
    sortOrder: 0,
    calendarId: 0,
  };
}

/** API form array → `appointmentUserDefinedFields` for calendar view. */
export function mapApiFormFieldsToFrontend(fields: unknown[]): FrontendCalendarFormField[] {
  if (!Array.isArray(fields)) return [];
  return fields
    .map((row) => mapApiFormFieldToFrontend(row))
    .filter((row): row is FrontendCalendarFormField => row != null);
}

export function unwrapFormGetData(data: unknown): unknown[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") {
    const row = data as Record<string, unknown>;
    const inner =
      row.fields ?? row.Fields ?? row.items ?? row.Items ?? row.data ?? row.Data;
    if (Array.isArray(inner)) return inner;
    if (inner != null && typeof inner === "object") return [inner];
    return [row];
  }
  return [];
}
