/** Lead columns accepted by `POST /lead/fields/save` (matches calendar-client `LeadModel.bookableColumns`). */
export const BOOKABLE_LEAD_COLUMNS = [
  "salutation",
  "first_name",
  "last_name",
  "email",
  "phone",
  "description",
] as const;

export type BookableLeadColumn = (typeof BOOKABLE_LEAD_COLUMNS)[number];

/** `Models.Appointment.CustomFieldKind.LeadField` — basic bookable lead rows. */
export const LEAD_FIELD_KIND = 2;

export type LeadFieldRequirement = {
  column: string;
  enabled: boolean;
  required: boolean;
};

/** Frontend `fieldKey` → API `column` for basic lead fields. */
export const FIELD_KEY_TO_LEAD_COLUMN: Record<string, BookableLeadColumn> = {
  salutation: "salutation",
  firstname: "first_name",
  first_name: "first_name",
  lastname: "last_name",
  last_name: "last_name",
  email: "email",
  phone: "phone",
  leadphone: "phone",
  description: "description",
};

/** API `column` → portal booking field row (`fieldKey`, `fieldLabel`, default `sortOrder`). */
export const LEAD_COLUMN_FRONTEND_META: Record<
  BookableLeadColumn,
  { fieldKey: string; fieldLabel: string; sortOrder: number }
> = {
  salutation: { fieldKey: "Salutation", fieldLabel: "Salutation", sortOrder: 0 },
  first_name: { fieldKey: "FirstName", fieldLabel: "First Name", sortOrder: 1 },
  last_name: { fieldKey: "LastName", fieldLabel: "Last Name", sortOrder: 2 },
  email: { fieldKey: "Email", fieldLabel: "Email", sortOrder: 3 },
  phone: { fieldKey: "Phone", fieldLabel: "Lead Phone", sortOrder: 4 },
  description: { fieldKey: "Description", fieldLabel: "Description", sortOrder: 5 },
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

/**
 * True when the row carries a persisted custom-field id (`fieldId` / `customFieldId`).
 * Frontend `id` alone does not count — only custom-field identifiers.
 */
export function hasFormFieldId(field: unknown): boolean {
  if (field == null || typeof field !== "object") return false;
  const row = field as Record<string, unknown>;
  const id = pick<string>(row, "fieldId", "FieldId", "customFieldId", "CustomFieldId");
  return id != null && String(id).trim() !== "";
}

/**
 * Resolves a bookable lead `column` from a frontend field row (`fieldKey` / `FieldKey`).
 */
export function resolveLeadColumnFromField(field: unknown): BookableLeadColumn | null {
  if (field == null || typeof field !== "object") return null;
  const row = field as Record<string, unknown>;
  const fieldKey = pick<string>(row, "fieldKey", "FieldKey");
  if (!fieldKey) return null;

  const token = normalizeFieldKeyToken(fieldKey);
  const mapped = FIELD_KEY_TO_LEAD_COLUMN[token];
  if (mapped) return mapped;

  const snake = token.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
  if ((BOOKABLE_LEAD_COLUMNS as readonly string[]).includes(snake)) {
    return snake as BookableLeadColumn;
  }

  return null;
}

export function isBookableLeadField(field: unknown): boolean {
  return resolveLeadColumnFromField(field) != null;
}

/** `kind` applies to custom fields only — not bookable lead rows. */
export function shouldForwardFieldKind(field: unknown): boolean {
  if (field == null || typeof field !== "object") return false;
  const row = field as Record<string, unknown>;
  if (isBookableLeadField(row)) return false;
  if (row.kind === 2 || row.Kind === 2) return false;
  if (hasFormFieldId(row)) return true;
  const kind = row.kind ?? row.Kind;
  if (kind === 1) return true;
  return false;
}

export function pickForwardedFieldKind(
  field: unknown
): number | string | undefined {
  if (!shouldForwardFieldKind(field)) return undefined;
  const row = field as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(row, "kind")) {
    return row.kind as number | string;
  }
  if (Object.prototype.hasOwnProperty.call(row, "Kind")) {
    return row.Kind as number | string;
  }
  return undefined;
}

function resolveRequired(row: Record<string, unknown>): boolean {
  return Boolean(
    pick(row, "isRequired", "IsRequired", "isMandatory", "IsMandatory") ?? false
  );
}

/**
 * One frontend basic field row → `{ column, enabled, required }` for `LeadModel.saveFieldRequirements`.
 */
export function mapFrontendFieldToRequirement(field: unknown): LeadFieldRequirement | null {
  if (field == null || typeof field !== "object") return null;
  const row = field as Record<string, unknown>;
  const column = resolveLeadColumnFromField(row);
  if (!column) return null;
  return {
    column,
    enabled: true,
    required: resolveRequired(row),
  };
}

/** Map basic frontend rows → `LeadModel.saveFieldRequirements` payload. */
export function mapFrontendFieldsToRequirements(fields: unknown[]): LeadFieldRequirement[] {
  if (!Array.isArray(fields)) return [];
  const seen = new Set<string>();
  const out: LeadFieldRequirement[] = [];
  for (const field of fields) {
    const req = mapFrontendFieldToRequirement(field);
    if (!req || seen.has(req.column)) continue;
    seen.add(req.column);
    out.push(req);
  }
  return out;
}

function normalizeRequirementRow(row: unknown): LeadFieldRequirement | null {
  if (row == null || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const column = String(r.column ?? r.Column ?? "")
    .trim()
    .toLowerCase();
  if (!column) return null;
  return {
    column,
    enabled: Boolean(r.enabled ?? r.Enabled ?? true),
    required: Boolean(r.required ?? r.Required ?? false),
  };
}

/** Blazeo `GET /lead/fields/get` `data` → `{ column, enabled, required }[]`. */
export function unwrapFieldRequirementsData(data: unknown): LeadFieldRequirement[] {
  if (data == null) return [];
  if (Array.isArray(data)) {
    return data.map(normalizeRequirementRow).filter((r): r is LeadFieldRequirement => r != null);
  }
  if (typeof data !== "object") return [];
  const row = data as Record<string, unknown>;
  const fields = row.fields ?? row.Fields;
  if (Array.isArray(fields)) {
    return fields.map(normalizeRequirementRow).filter((r): r is LeadFieldRequirement => r != null);
  }
  return [];
}

/**
 * One API requirement row → portal field row (no `fieldId`; saved via `saveFieldRequirements`).
 * Returns `null` when the column is unknown or `enabled` is false.
 */
export function mapFieldRequirementToFrontend(
  requirement: LeadFieldRequirement,
  calendarId: string | number = 0
): Record<string, unknown> | null {
  const column = String(requirement.column ?? "")
    .trim()
    .toLowerCase() as BookableLeadColumn;
  const meta = LEAD_COLUMN_FRONTEND_META[column];
  if (!meta || !requirement.enabled) return null;

  const isRequired = Boolean(requirement.required);
  return {
    fieldLabel: meta.fieldLabel,
    fieldKey: meta.fieldKey,
    kind: LEAD_FIELD_KIND,
    fieldToolTipText: "",
    isRequired,
    isMandatory: isRequired,
    sortOrder: meta.sortOrder,
    calendarId,
  };
}

/** Map `GET /lead/fields/get` requirements → portal `appointmentUserDefinedFields` basic rows. */
export function mapFieldRequirementsToFrontend(
  requirements: unknown[],
  calendarId: string | number = 0
): Record<string, unknown>[] {
  if (!Array.isArray(requirements)) return [];
  const rows = requirements
    .map((row) => {
      const req = normalizeRequirementRow(row);
      return req ? mapFieldRequirementToFrontend(req, calendarId) : null;
    })
    .filter((row): row is Record<string, unknown> => row != null);
  return rows.sort(
    (a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0)
  );
}

/** Custom rows from `GET /CustomField/Form/Get` — keep `fieldId` rows and non-bookable shapes. */
export function filterCustomFormFieldsFromFetch(fields: unknown[]): unknown[] {
  if (!Array.isArray(fields)) return [];
  return fields.filter((field) => hasFormFieldId(field) || !isBookableLeadField(field));
}

/** Merge basic lead rows + custom field rows for `appointmentUserDefinedFields`. */
export function mergeAppointmentUserDefinedFields(
  basicFields: unknown[],
  customFields: unknown[]
): unknown[] {
  return [...(basicFields ?? []), ...filterCustomFormFieldsFromFetch(customFields ?? [])];
}

export type SplitAppointmentFormFieldsResult = {
  /** Rows without `fieldId` that map to bookable lead columns → `saveFieldRequirements`. */
  basicFields: unknown[];
  /** Rows with `fieldId`, or without `fieldId` that are not bookable lead columns → custom form save. */
  customFields: unknown[];
};

/**
 * Split `appointmentUserDefinedFields` for the post-create save flow:
 * - no `fieldId` + bookable `fieldKey` → basic lead field requirements
 * - has `fieldId`, or non-bookable shape → `POST /CustomField/Form/Save`
 */
export function splitAppointmentFormFields(fields: unknown[]): SplitAppointmentFormFieldsResult {
  const basicFields: unknown[] = [];
  const customFields: unknown[] = [];
  if (!Array.isArray(fields)) return { basicFields, customFields };

  for (const field of fields) {
    if (hasFormFieldId(field)) {
      customFields.push(field);
    } else if (isBookableLeadField(field)) {
      basicFields.push(field);
    } else {
      customFields.push(field);
    }
  }

  return { basicFields, customFields };
}
