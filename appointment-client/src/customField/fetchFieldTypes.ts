import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import {
  blazeoCustomFieldGet,
  type ApiEnvelope,
  type BlazeoCustomFieldConnection,
} from "./customFieldHttp.js";

export type { BlazeoCustomFieldConnection } from "./customFieldHttp.js";

/** API returns `{ fieldtypes: "Text, Dropdown, ..." }` — normalize to a trimmed name list. */
export function parseFieldTypesList(data: unknown): string[] | null {
  if (data == null) return null;

  if (typeof data === "string") {
    const items = data.split(",").map((s) => s.trim()).filter(Boolean);
    return items.length ? items : null;
  }

  if (Array.isArray(data)) {
    const items = data.map((x) => String(x).trim()).filter(Boolean);
    return items.length ? items : null;
  }

  if (typeof data === "object") {
    const row = data as Record<string, unknown>;
    const raw =
      row.fieldtypes ?? row.FieldTypes ?? row.fieldTypes ?? row.types ?? row.Types;
    return parseFieldTypesList(raw);
  }

  return null;
}

export type FieldTypeDefinition = Record<string, unknown>;

function readFieldTypeName(row: FieldTypeDefinition): string {
  const t = row.Type ?? row.type;
  return t != null ? String(t).trim() : "";
}

/** True when the caller wants every field-type definition (not one name). */
export function wantsAllFieldTypeDefinitions(input: string): boolean {
  const trimmed = String(input ?? "").trim();
  if (!trimmed) return true;
  const lower = trimmed.toLowerCase();
  if (lower === "all" || lower === "*" || lower === "fieldtypes") return true;
  return trimmed.includes(",");
}

/** Single type name for `FieldType` query param (no comma splitting). */
export function normalizeFieldTypeQuery(input: string): string {
  let s = String(input ?? "").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

/** All definition rows from API `data` (usually an array). */
export function parseAllFieldTypeDefinitions(data: unknown): FieldTypeDefinition[] | null {
  if (data == null) return null;
  if (Array.isArray(data)) {
    const rows = data.filter((x) => x != null && typeof x === "object") as FieldTypeDefinition[];
    return rows.length ? rows : null;
  }
  if (typeof data === "object") return [data as FieldTypeDefinition];
  return null;
}

function pickOneFieldTypeRow(
  data: unknown,
  requestedType: string
): FieldTypeDefinition | null {
  const want = String(requestedType ?? "").trim();
  if (!want || data == null) return null;

  if (Array.isArray(data)) {
    const match = data.find((item) => {
      if (item == null || typeof item !== "object") return false;
      return readFieldTypeName(item as FieldTypeDefinition).toLowerCase() === want.toLowerCase();
    });
    return match && typeof match === "object" ? (match as FieldTypeDefinition) : null;
  }

  if (typeof data === "object") {
    const row = data as FieldTypeDefinition;
    const name = readFieldTypeName(row);
    if (!name || name.toLowerCase() === want.toLowerCase()) {
      return row;
    }
    return null;
  }

  return null;
}

/** Pick one row when `requestedType` is a single name. */
export function pickFieldTypeFromApiData(
  data: unknown,
  requestedType: string
): FieldTypeDefinition | null {
  return pickOneFieldTypeRow(data, normalizeFieldTypeQuery(requestedType));
}

export type FieldTypeResult = FieldTypeDefinition | FieldTypeDefinition[] | null;

/** Load one definition per type name (API returns a single row per `FieldType` query). */
async function fetchAllFieldTypeDefinitions(
  names: string[],
  connection: BlazeoCustomFieldConnection
): Promise<FieldTypeDefinition[] | null> {
  if (!names.length) return null;

  const rows = await Promise.all(
    names.map(async (name) => {
      const res = await blazeoCustomFieldGet(
        "/CustomField/FieldType/Get",
        { FieldType: name },
        connection
      );
      if (res.status !== "success") return null;
      return (
        pickOneFieldTypeRow(res.data, name) ??
        parseAllFieldTypeDefinitions(res.data)?.[0] ??
        null
      );
    })
  );

  const definitions = rows.filter((row): row is FieldTypeDefinition => row != null);
  return definitions.length ? definitions : null;
}

/**
 * All supported custom field type names.
 * `GET /CustomField/FieldTypes/Get` — unwraps API `data.fieldtypes` into `string[]`.
 *
 * @example
 * const res = await getFieldTypes({ baseUrl, consumer });
 * // res.fieldTypes → ["Checkbox", "Date", "Dropdown", "Text", ...]
 */
export async function getFieldTypes(
  connection: BlazeoCustomFieldConnection = {}
): Promise<
  | { ok: true; fieldTypes: string[] | null }
  | { ok: false; reason: "missing_base_url"; detail: string }
> {
  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    return { ok: false, reason: "missing_base_url", detail: ready.error };
  }
  const res = await blazeoCustomFieldGet("/CustomField/FieldTypes/Get", undefined, connection);
  const fieldTypes =
    res.status === "success" ? parseFieldTypesList(res.data) : null;
  return { ok: true, fieldTypes };
}

/**
 * Field type definition(s) from `GET /CustomField/FieldType/Get`.
 * - One name (e.g. `"Text"`) → single object.
 * - Comma-separated list, empty, or `"all"` → all definitions (API array, unfiltered).
 *
 * @example
 * await getFieldType("Text", connection); // one row
 * await getFieldType("Checkbox, Date, Text", connection); // all rows
 */
export async function getFieldType(
  fieldType: string,
  connection: BlazeoCustomFieldConnection = {}
): Promise<
  | { ok: true; fieldType: FieldTypeResult }
  | { ok: false; reason: "missing_base_url"; detail: string }
> {
  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    return { ok: false, reason: "missing_base_url", detail: ready.error };
  }
  const trimmed = String(fieldType ?? "").trim();
  const fetchAll = wantsAllFieldTypeDefinitions(trimmed);

  if (fetchAll) {
    const fromInput = trimmed.includes(",") ? parseFieldTypesList(trimmed) : null;
    let names = fromInput?.length ? fromInput : null;
    if (!names?.length) {
      const listed = await getFieldTypes(connection);
      names = listed.ok ? listed.fieldTypes : null;
    }
    const definitions = names?.length
      ? await fetchAllFieldTypeDefinitions(names, connection)
      : null;
    return { ok: true, fieldType: definitions };
  }

  const queryName = normalizeFieldTypeQuery(trimmed);
  if (!queryName) {
    return { ok: true, fieldType: null };
  }

  const res = await blazeoCustomFieldGet(
    "/CustomField/FieldType/Get",
    { FieldType: queryName },
    connection
  );
  if (res.status !== "success") {
    return { ok: true, fieldType: null };
  }

  const single = pickFieldTypeFromApiData(res.data, trimmed);
  return { ok: true, fieldType: single };
}
