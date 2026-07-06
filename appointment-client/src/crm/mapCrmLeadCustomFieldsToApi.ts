import { API_TYPE_TO_FIELD_SUBTYPE } from "../calendar/mapCalendarForm.js";

export type CrmCalendarLeadFieldApiRow = {
  fieldLabel: string;
  fieldKey: string;
  fieldToolTipText: string;
  isRequired: boolean;
  sortOrder: number;
  fieldSubTypeId: number;
  subType: string;
};

const FIELD_SUBTYPE_TO_API_TYPE: Record<number, string> = Object.fromEntries(
  Object.entries(API_TYPE_TO_FIELD_SUBTYPE).map(([type, subType]) => [subType, type])
);

const FIELD_KEY_TO_SUBTYPE: Record<string, { subType: string; fieldSubTypeId: number }> = {
  email: { subType: "Email", fieldSubTypeId: 302 },
  phone: { subType: "Phone", fieldSubTypeId: 306 },
  leadphone: { subType: "Phone", fieldSubTypeId: 306 },
  firstname: { subType: "Text", fieldSubTypeId: 301 },
  lastname: { subType: "Text", fieldSubTypeId: 301 },
  salutation: { subType: "Text", fieldSubTypeId: 301 },
  description: { subType: "MultilineText", fieldSubTypeId: 304 },
};

function pick<T>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k] as T;
  }
  return undefined;
}

function normalizeFieldKeyToken(fieldKey: string): string {
  return String(fieldKey ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function resolveSubTypeFromRow(src: Record<string, unknown>): { subType: string; fieldSubTypeId: number } {
  const subType = String(pick(src, "subType", "SubType") ?? "").trim();
  const fieldSubTypeId = Number(
    pick(src, "fieldSubTypeId", "FieldSubTypeId", "fieldSubType", "FieldSubType") ?? 0
  );

  if (subType && fieldSubTypeId > 0) {
    return { subType, fieldSubTypeId };
  }
  if (subType && API_TYPE_TO_FIELD_SUBTYPE[subType] != null) {
    return { subType, fieldSubTypeId: API_TYPE_TO_FIELD_SUBTYPE[subType] };
  }
  if (fieldSubTypeId > 0) {
    return {
      subType: FIELD_SUBTYPE_TO_API_TYPE[fieldSubTypeId] ?? "Text",
      fieldSubTypeId,
    };
  }

  const fieldTypeName = pick<string>(src, "fieldType", "FieldType");
  if (fieldTypeName != null && typeof fieldTypeName === "string" && !/^\d+$/.test(fieldTypeName.trim())) {
    const normalized = fieldTypeName.trim();
    return {
      subType: normalized,
      fieldSubTypeId: API_TYPE_TO_FIELD_SUBTYPE[normalized] ?? 301,
    };
  }

  const fieldKey = String(pick(src, "fieldKey", "FieldKey") ?? "").trim();
  const hinted = FIELD_KEY_TO_SUBTYPE[normalizeFieldKeyToken(fieldKey)];
  if (hinted) return hinted;

  return { subType: "Text", fieldSubTypeId: 301 };
}

/** CRM `crmLeadCustomFields` row → `POST /crm/calendar/lead-fields` `userDefinedFields` item. */
export function mapCrmLeadCustomFieldToApi(row: unknown): CrmCalendarLeadFieldApiRow | null {
  if (row == null || typeof row !== "object") return null;
  const src = row as Record<string, unknown>;

  const fieldLabel = String(
    pick(src, "fieldLabel", "FieldLabel", "fieldName", "FieldName", "label", "Label") ?? ""
  ).trim();
  const fieldKey = String(pick(src, "fieldKey", "FieldKey") ?? "").trim();
  if (!fieldLabel && !fieldKey) return null;

  const { subType, fieldSubTypeId } = resolveSubTypeFromRow(src);

  return {
    fieldLabel: fieldLabel || fieldKey,
    fieldKey: fieldKey || fieldLabel,
    fieldToolTipText: String(pick(src, "fieldToolTipText", "FieldToolTipText") ?? ""),
    isRequired: Boolean(pick(src, "isRequired", "IsRequired", "isMandatory", "IsMandatory") ?? false),
    sortOrder: Number(pick(src, "sortOrder", "SortOrder") ?? 0),
    fieldSubTypeId,
    subType,
  };
}

export function mapCrmLeadCustomFieldsToApi(fields: unknown[]): CrmCalendarLeadFieldApiRow[] {
  if (!Array.isArray(fields)) return [];
  return fields
    .map((row) => mapCrmLeadCustomFieldToApi(row))
    .filter((row): row is CrmCalendarLeadFieldApiRow => row != null)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
