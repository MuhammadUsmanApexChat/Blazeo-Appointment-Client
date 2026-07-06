function pick<T>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k] as T;
  }
  return undefined;
}

/** Unwrap `userDefinedFields` from common CRM GET response envelopes. */
export function unwrapCrmUserDefinedFields(data: unknown): unknown[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data;

  if (typeof data === "object") {
    const row = data as Record<string, unknown>;
    const direct = pick<unknown[]>(row, "userDefinedFields", "UserDefinedFields");
    if (Array.isArray(direct)) return direct;

    const inner = row.data ?? row.Data;
    if (Array.isArray(inner)) return inner;
    if (inner != null && typeof inner === "object") {
      const nested = inner as Record<string, unknown>;
      const fields = pick<unknown[]>(nested, "userDefinedFields", "UserDefinedFields");
      if (Array.isArray(fields)) return fields;
    }
  }

  return [];
}

/** CRM `userDefinedFields` row → portal `crmLeadCustomFields` / frontend field row. */
export function mapCrmUserDefinedFieldToFrontend(row: unknown): Record<string, unknown> | null {
  if (row == null || typeof row !== "object") return null;
  const src = row as Record<string, unknown>;

  const fieldLabel = String(
    pick(src, "fieldLabel", "FieldLabel", "fieldName", "FieldName", "label", "Label") ?? ""
  ).trim();
  const fieldKey = String(pick(src, "fieldKey", "FieldKey") ?? "").trim();
  if (!fieldLabel && !fieldKey) return null;

  const isRequired = Boolean(
    pick(src, "isRequired", "IsRequired", "isMandatory", "IsMandatory") ?? false
  );
  const fieldSubType =
    pick<number>(src, "fieldSubType", "FieldSubType", "fieldSubTypeId", "FieldSubTypeId") ?? 0;

  const rawFieldType = pick<number | string>(src, "fieldType", "FieldType");
  const fieldTypeId =
    pick<number>(src, "fieldTypeId", "FieldTypeId") ??
    (typeof rawFieldType === "number" || (typeof rawFieldType === "string" && /^\d+$/.test(rawFieldType.trim()))
      ? Number(rawFieldType)
      : undefined);

  const fieldTypeName =
    pick<string>(src, "subType", "SubType") ??
    (typeof rawFieldType === "string" && !/^\d+$/.test(rawFieldType.trim())
      ? rawFieldType
      : undefined);

  const out: Record<string, unknown> = {
    ...src,
    ...(fieldLabel ? { fieldLabel } : {}),
    ...(fieldKey ? { fieldKey } : {}),
    fieldToolTipText: String(pick(src, "fieldToolTipText", "FieldToolTipText") ?? ""),
    isRequired,
    isMandatory: Boolean(pick(src, "isMandatory", "IsMandatory") ?? isRequired),
    sortOrder: Number(pick(src, "sortOrder", "SortOrder") ?? 0),
    fieldSubType,
    ...(fieldSubType ? { fieldSubTypeId: fieldSubType } : {}),
    ...(fieldTypeId != null && Number.isFinite(fieldTypeId) ? { fieldTypeId } : {}),
    ...(fieldTypeName ? { fieldType: String(fieldTypeName) } : {}),
    ...(fieldTypeId != null && Number.isFinite(fieldTypeId) && fieldTypeName == null
      ? { fieldType: fieldTypeId }
      : {}),
  };

  const fieldName = pick<string>(src, "fieldName", "FieldName");
  if (fieldName != null && String(fieldName).trim() !== "") {
    out.fieldName = String(fieldName).trim();
  } else if (fieldLabel) {
    out.fieldName = fieldLabel;
  }

  return out;
}

export function mapCrmUserDefinedFieldsToFrontend(fields: unknown[]): Record<string, unknown>[] {
  if (!Array.isArray(fields)) return [];
  return fields
    .map((row) => mapCrmUserDefinedFieldToFrontend(row))
    .filter((row): row is Record<string, unknown> => row != null)
    .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0));
}
