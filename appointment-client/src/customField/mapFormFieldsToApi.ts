import type { FieldTypeDefinition } from "./fetchFieldTypes.js";

/** Frontend / lead `fieldSubType` → Blazeo `Type` name (POST /CustomField/Form/Save). */
export const FIELD_SUBTYPE_TO_API_TYPE: Record<number, string> = {
  301: "Text",
  302: "Email",
  303: "Dropdown",
  304: "MultilineText",
  305: "Number",
  306: "Phone",
  307: "Date",
  308: "Checkbox",
  309: "RadioButton",
  310: "MultiselectList",
};

/** Composite `fieldType` + `fieldSubType` (e.g. custom field type 3, subtype 303). */
export const FIELD_TYPE_SUBTYPE_TO_API_TYPE: Record<string, string> = {
  "3_301": "Text",
  "3_302": "Email",
  "3_303": "Dropdown",
  "3_304": "MultilineText",
  "3_305": "Number",
  "3_306": "Phone",
  "3_307": "Date",
  "3_308": "Checkbox",
  "3_309": "RadioButton",
  "3_310": "MultiselectList",
};

/** Calendar booking `fieldKey` hints when no numeric subtype is present. */
export const FIELD_KEY_TO_API_TYPE: Record<string, string> = {
  email: "Email",
  phone: "Phone",
  firstname: "Text",
  lastname: "Text",
  name: "Text",
  company: "Text",
  address: "MultilineText",
  city: "Text",
  state: "Text",
  zip: "Text",
  postalcode: "Text",
  country: "Text",
};

export type FrontendCalendarFormField = Record<string, unknown>;

export type MapFormFieldsOptions = {
  /** When true, input is already API-shaped (`Type`, `Label`, …) and returned unchanged. */
  skipTransform?: boolean;
};

function pick<T>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k] as T;
  }
  return undefined;
}

function newGuid(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function slugKey(value: string, index: number): string {
  const base = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return base || `option_${index}`;
}

/** `leadCustomOptions` / frontend options → `{ Key, Value }[]`. */
export function mapLeadCustomOptionsToApiOptions(
  options: unknown[] | undefined
): { Key: string; Value: string }[] {
  if (!Array.isArray(options)) return [];
  return options.map((raw, index) => {
    const row =
      raw != null && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const value = String(
      pick(row, "value", "Value", "label", "Label", "text", "Text") ?? `Option ${index + 1}`
    );
    const key = String(pick(row, "key", "Key") ?? slugKey(value, index));
    return { Key: key, Value: value };
  });
}

function resolveRequired(row: Record<string, unknown>): boolean {
  return Boolean(
    pick(row, "isRequired", "IsRequired", "isMandatory", "IsMandatory") ?? false
  );
}

function resolveLabel(row: Record<string, unknown>): string {
  return String(
    pick(row, "fieldLabel", "FieldLabel", "fieldName", "FieldName", "label", "Label") ?? ""
  ).trim();
}

function resolveIds(row: Record<string, unknown>): { dataId: string; customFieldId: string } {
  const existing = pick<string>(row, "fieldId", "FieldId", "dataId", "DataId", "customFieldId", "CustomFieldId");
  const id = existing != null && String(existing).trim() !== "" ? String(existing).trim() : newGuid();
  return { dataId: id, customFieldId: id };
}

function resolveApiTypeName(row: Record<string, unknown>): string {
  const explicit = pick<string | number>(row, "Type", "type", "fieldTypeName", "FieldTypeName");
  if (typeof explicit === "string" && explicit.trim() && !/^\d+$/.test(explicit.trim())) {
    return explicit.trim();
  }

  const subType = pick<number | string>(row, "fieldSubType", "FieldSubType");
  const fieldTypeNum = pick<number | string>(row, "fieldType", "FieldType");
  if (subType != null && String(subType).trim() !== "") {
    const subNum = Number(subType);
    if (Number.isFinite(subNum) && FIELD_SUBTYPE_TO_API_TYPE[subNum]) {
      return FIELD_SUBTYPE_TO_API_TYPE[subNum];
    }
    if (fieldTypeNum != null) {
      const combo = `${fieldTypeNum}_${subType}`;
      if (FIELD_TYPE_SUBTYPE_TO_API_TYPE[combo]) return FIELD_TYPE_SUBTYPE_TO_API_TYPE[combo];
    }
  }

  if (fieldTypeNum != null) {
    const ft = Number(fieldTypeNum);
    if (Number.isFinite(ft) && FIELD_SUBTYPE_TO_API_TYPE[ft]) {
      return FIELD_SUBTYPE_TO_API_TYPE[ft];
    }
  }

  const fieldKey = pick<string>(row, "fieldKey", "FieldKey");
  if (fieldKey) {
    const hint = FIELD_KEY_TO_API_TYPE[String(fieldKey).trim().toLowerCase()];
    if (hint) return hint;
  }

  return "Text";
}

function attachTypeSpecificLists(
  payload: FieldTypeDefinition,
  row: Record<string, unknown>,
  apiType: string
): void {
  const options =
    pick<unknown[]>(row, "leadCustomOptions", "LeadCustomOptions", "dropdownOptions", "DropdownOptions") ??
    [];

  const mapped = mapLeadCustomOptionsToApiOptions(
    Array.isArray(options) ? options : []
  );
  if (!mapped.length) return;

  switch (apiType) {
    case "Dropdown":
      payload.DropdownOptions = mapped;
      break;
    case "RadioButton":
      payload.RadioButtonOptions = mapped;
      break;
    case "MultiselectList":
      payload.multiselectListOptions = mapped;
      break;
    case "Checkbox":
      payload.checkBoxOptions = mapped;
      break;
    default:
      break;
  }
}

/** Row already in POST body shape (`Type` + ids / label). */
export function isApiFormFieldRow(row: Record<string, unknown>): boolean {
  const type = pick(row, "Type", "type");
  const hasTypeName =
    typeof type === "string" && type.trim() !== "" && !/^\d+$/.test(type.trim());
  const hasIds =
    pick(row, "CustomFieldId", "customFieldId", "DataId", "dataId") != null;
  const hasLabel = pick(row, "Label", "label") != null;
  return Boolean(hasTypeName && (hasIds || hasLabel));
}

/**
 * Maps one frontend calendar/lead field row to Blazeo `POST /CustomField/Form/Save` item.
 */
export function mapFrontendFormFieldToApi(row: unknown): FieldTypeDefinition | null {
  if (row == null || typeof row !== "object") return null;
  const src = row as Record<string, unknown>;

  if (isApiFormFieldRow(src)) {
    return { ...src } as FieldTypeDefinition;
  }

  const label = resolveLabel(src);
  const { dataId, customFieldId } = resolveIds(src);
  const apiType = resolveApiTypeName(src);

  const payload: FieldTypeDefinition = {
    Value: pick(src, "Value", "value") ?? null,
    DataId: dataId,
    CustomFieldId: customFieldId,
    IsRequired: resolveRequired(src),
    Label: label || null,
    Type: apiType,
  };

  attachTypeSpecificLists(payload, src, apiType);
  return payload;
}

/**
 * Maps frontend field array → API payload for `CustomFieldModel.saveForm` / `POST /CustomField/Form/Save`.
 */
export function mapFrontendFormFieldsToApi(
  fields: unknown[],
  options: MapFormFieldsOptions = {}
): FieldTypeDefinition[] {
  if (!Array.isArray(fields)) return [];
  if (options.skipTransform) {
    return fields.filter((f) => f != null && typeof f === "object") as FieldTypeDefinition[];
  }
  return fields
    .map((row) => mapFrontendFormFieldToApi(row))
    .filter((row): row is FieldTypeDefinition => row != null);
}
