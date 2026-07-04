import {
  isApiFormFieldRow,
  mapFrontendFormFieldToApi,
  mapFrontendFormFieldsToApi,
  normalizeApiTypeName,
  resolveApiTypeName,
  type FrontendCalendarFormField,
} from "../customField/mapFormFieldsToApi.js";
import { isBookableLeadField, LEAD_FIELD_KIND, resolveLeadColumnFromField } from "./mapFieldRequirements.js";

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

function labelToFieldKey(label: string): string {
  const parts = String(label ?? "")
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
  if (!parts.length) return "Field";
  return parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

/** Portal custom-field `fieldKey` — lowercase slug, e.g. `"lead custom date"` → `leadcustomdate`. */
function labelToCustomFieldKey(label: string): string {
  return String(label ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}


/** Forward API `kind` / `Kind` onto frontend rows from `GET /CustomField/Form/Get`. */
function kindFromRow(src: Record<string, unknown>): Record<string, unknown> {
  const kind = src.kind ?? src.Kind;
  return kind !== undefined ? { kind } : {};
}

function isStandardBookingFieldRow(label: string, typeName: string): boolean {
  const fieldKey = labelToFieldKey(label);
  if (resolveLeadColumnFromField({ fieldKey, fieldLabel: label })) return true;
  const token = fieldKey.toLowerCase();
  if (typeName === "Email" && token === "email") return true;
  if (typeName === "Phone" && (token === "phone" || token === "leadphone")) return true;
  return false;
}

function shouldMapAsCustomUdfField(
  src: Record<string, unknown>,
  label: string,
  typeName: string,
  fieldId: string
): boolean {
  if (isStandardBookingFieldRow(label, typeName)) return false;
  if (fieldId) return true;
  if (hasCustomFieldOptions(src)) return true;
  const fieldSubType = API_TYPE_TO_FIELD_SUBTYPE[typeName];
  return (
    fieldSubType != null &&
    typeName !== "Text" &&
    typeName !== "Email" &&
    typeName !== "Phone"
  );
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
    Array.isArray(row.radioButtonOptions) ||
    Array.isArray(row.checkBoxOptions) ||
    Array.isArray(row.checkboxOptions) ||
    Array.isArray(row.CheckBoxOptions) ||
    Array.isArray(row.multiselectListOptions)
  );
}

function optionKeyFromValue(value: string, index: number): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return slug || `option_${index}`;
}

function normalizeApiOptions(options: unknown[]): { Key: string; Value: string }[] {
  return options.map((raw, index) => {
    const row =
      raw != null && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const value = String(
      row.Value ?? row.value ?? row.Label ?? row.label ?? row.Text ?? row.text ?? ""
    );
    const key = String(row.Key ?? row.key ?? optionKeyFromValue(value, index));
    return { Key: key, Value: value };
  });
}

function pickApiOptions(src: Record<string, unknown>): {
  DropdownOptions?: { Key: string; Value: string }[];
  RadioButtonOptions?: { Key: string; Value: string }[];
  checkBoxOptions?: { Key: string; Value: string }[];
  multiselectListOptions?: { Key: string; Value: string }[];
} {
  const out: ReturnType<typeof pickApiOptions> = {};
  const dropdown = pick<unknown[]>(src, "DropdownOptions", "dropdownOptions");
  const radio = pick<unknown[]>(src, "RadioButtonOptions", "radioButtonOptions");
  const checkbox = pick<unknown[]>(
    src,
    "checkBoxOptions",
    "CheckBoxOptions",
    "checkboxOptions",
    "CheckboxOptions"
  );
  const multi = pick<unknown[]>(src, "multiselectListOptions", "MultiselectListOptions");

  if (Array.isArray(dropdown) && dropdown.length) {
    out.DropdownOptions = normalizeApiOptions(dropdown);
  }
  if (Array.isArray(radio) && radio.length) {
    out.RadioButtonOptions = normalizeApiOptions(radio);
  }
  if (Array.isArray(checkbox) && checkbox.length) {
    out.checkBoxOptions = normalizeApiOptions(checkbox);
  }
  if (Array.isArray(multi) && multi.length) {
    out.multiselectListOptions = normalizeApiOptions(multi);
  }
  return out;
}

function inferApiTypeFromOptions(
  typeName: string,
  options: ReturnType<typeof pickApiOptions>
): string {
  const normalized = normalizeApiTypeName(typeName);
  if (options.checkBoxOptions?.length) return "Checkbox";
  if (options.DropdownOptions?.length) return "Dropdown";
  if (options.RadioButtonOptions?.length) return "RadioButton";
  if (options.multiselectListOptions?.length) return "MultiselectList";
  return normalized;
}

function resolveClientFieldType(
  src: Record<string, unknown>,
  optionLists: ReturnType<typeof pickApiOptions>
): string {
  return inferApiTypeFromOptions(resolveApiTypeName(src), optionLists);
}

/** Blazeo `GET /CustomField/Form/Get` row → calendar-client API shape for `appointmentUserDefinedFields`. */
export function mapApiFormFieldToClient(row: unknown): Record<string, unknown> | null {
  if (row == null || typeof row !== "object") return null;
  const src = row as Record<string, unknown>;

  if (!isApiFormFieldRow(src)) {
    const hasFrontendShape =
      src.fieldLabel != null ||
      src.fieldKey != null ||
      src.fieldName != null ||
      src.FieldLabel != null ||
      src.fieldType != null ||
      src.FieldType != null ||
      src.fieldSubType != null ||
      src.FieldSubType != null;
    if (hasFrontendShape) {
      const apiRow = mapFrontendFormFieldToApi(src);
      if (apiRow) return mapApiFormFieldToClient(apiRow);
    }
    return null;
  }

  const label = String(pick(src, "Label", "label") ?? "").trim();
  const customFieldId = String(
    pick(src, "CustomFieldId", "customFieldId", "DataId", "dataId", "fieldId") ?? ""
  ).trim();
  const optionLists = pickApiOptions(src);
  const typeName = resolveClientFieldType(src, optionLists);

  const client: Record<string, unknown> = {
    Value: pick(src, "Value", "value") ?? null,
    Id: pick(src, "Id", "id") ?? 0,
    DataId: (pick(src, "DataId", "dataId") as string | undefined) ?? customFieldId ?? null,
    CustomFieldId: customFieldId || null,
    IsRequired: Boolean(pick(src, "IsRequired", "isRequired", "isMandatory") ?? false),
    Label: label || null,
    Type: typeName,
    ...optionLists,
  };

  const helpText = pick<string>(src, "helpText", "HelpText", "description", "Description");
  if (helpText != null && String(helpText).trim() !== "") {
    client.helpText = String(helpText).trim();
    client.HelpText = String(helpText).trim();
  }

  const kind = kindFromRow(src);
  if (kind.kind !== undefined) {
    client.kind = kind.kind;
    client.Kind = kind.kind;
  }

  return client;
}

/** API form array → `appointmentUserDefinedFields` in Blazeo GET shape. */
export function mapApiFormFieldsToClient(fields: unknown[]): Record<string, unknown>[] {
  if (!Array.isArray(fields)) return [];
  return fields
    .map((row) => mapApiFormFieldToClient(row))
    .filter((row): row is Record<string, unknown> => row != null);
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
      const out = { ...src } as FrontendCalendarFormField;
      if (isBookableLeadField(src) && out.kind == null && out.Kind == null) {
        out.kind = LEAD_FIELD_KIND;
      }
      return out;
    }
    return null;
  }

  const label = String(pick(src, "Label", "label") ?? "").trim();
  const optionLists = pickApiOptions(src);
  const typeName = resolveClientFieldType(src, optionLists);
  const fieldId = String(
    pick(src, "CustomFieldId", "customFieldId", "DataId", "dataId") ?? ""
  ).trim();
  const isRequired = Boolean(pick(src, "IsRequired", "isRequired", "isMandatory") ?? false);
  const fieldSubType = API_TYPE_TO_FIELD_SUBTYPE[typeName];
  const optionsForLead =
    optionLists.DropdownOptions ??
    optionLists.RadioButtonOptions ??
    optionLists.checkBoxOptions ??
    optionLists.multiselectListOptions ??
    [];

  if (shouldMapAsCustomUdfField(src, label, typeName, fieldId)) {
    const helpText = pick<string>(src, "helpText", "HelpText", "description", "Description");
    const customKey = labelToCustomFieldKey(label) || labelToFieldKey(label);
    return {
      fieldName: label || typeName,
      fieldLabel: label || typeName,
      fieldKey: customKey,
      fieldType: typeName,
      fieldSubType: fieldSubType ?? 0,
      isImportant: false,
      isRequired,
      isMandatory: isRequired,
      ...(fieldId ? { fieldId } : {}),
      ...kindFromRow(src),
      ...(helpText != null && String(helpText).trim() !== ""
        ? { description: String(helpText).trim() }
        : {}),
      ...(optionsForLead.length
        ? { leadCustomOptions: mapApiOptionsToLeadCustom(optionsForLead) }
        : {}),
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
    ...kindFromRow(src),
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
