/**
 * Maps between portal `appointmentLocations` (`type` + `value`) and
 * `@blazeo.com/calendar-client` `CalendarLocationModel` (`locationType`, `value`, …).
 *
 * `LocationType` in calendar-client: Physical=0, Video=1, Phone=2, Custom=3 — same as frontend `type`.
 */

export type FrontendAppointmentLocation = {
  type: number;
  value: string;
  calendarLocationId?: string;
  name?: string;
  isDefault?: boolean;
  sortOrder?: number;
};

export type CalendarLocationSavePayload = {
  calendarId: string;
  calendarLocationId?: string;
  locationType: number;
  name?: string;
  value: string;
  isDefault?: boolean;
  sortOrder?: number;
};

/** Full calendar location row from `GET /Calendar/Location/GetById` (CalendarLocationModel.getById). */
export type CalendarLocationDetails = {
  id: number | null;
  calendarLocationId: string;
  calendarId: string | null;
  locationType: number;
  /** Portal alias — same as `locationType`. */
  type: number;
  name: string;
  value: string;
  isDefault: boolean;
  sortOrder: number;
  createdOn: string | null;
  modifiedOn: string | null;
};

function pick<T>(obj: any, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k] as T;
  }
  return undefined;
}

export function collectAppointmentLocations(calendar: any): FrontendAppointmentLocation[] {
  const arr = calendar?.appointmentLocations ?? calendar?.AppointmentLocations;
  if (!Array.isArray(arr)) return [];

  return arr
    .map((row) => {
      const type = pick<number>(row, "type", "Type", "locationType", "LocationType");
      const value = pick<string>(row, "value", "Value");
      if (type == null) return null;
      const calendarLocationId = pick<string>(
        row,
        "calendarLocationId",
        "CalendarLocationId",
        "calendar_location_id"
      );
      const name = pick<string>(row, "name", "Name");
      const isDefault = pick<boolean>(row, "isDefault", "IsDefault", "is_default");
      const sortOrder = pick<number>(row, "sortOrder", "SortOrder", "sort_order");
      return {
        type: Number(type),
        value: value != null ? String(value) : "",
        ...(calendarLocationId ? { calendarLocationId: String(calendarLocationId) } : {}),
        ...(name != null ? { name: String(name) } : {}),
        ...(isDefault != null ? { isDefault: Boolean(isDefault) } : {}),
        ...(sortOrder != null ? { sortOrder: Number(sortOrder) } : {}),
      };
    })
    .filter((row): row is FrontendAppointmentLocation => row != null);
}

export function calendarPayloadHasLocations(calendar: any): boolean {
  return collectAppointmentLocations(calendar).length > 0;
}

export function calendarPayloadIncludesLocations(calendar: any): boolean {
  return Array.isArray(calendar?.appointmentLocations) || Array.isArray(calendar?.AppointmentLocations);
}

function n(v: unknown): number | null {
  return v != null && v !== "" ? Number(v) : null;
}

function b(v: unknown): boolean {
  return v === true || v === "true" || v === 1 || v === "1";
}

/** API / MST row → full location details for appointment responses. */
export function mapApiCalendarLocationToDetails(row: unknown): CalendarLocationDetails | null {
  if (row == null || typeof row !== "object") return null;
  const src = row as Record<string, unknown>;
  const calendarLocationId = String(
    pick(src, "calendarLocationId", "CalendarLocationId", "calendar_location_id") ?? ""
  ).trim();
  if (!calendarLocationId) return null;

  const locationType = n(pick(src, "locationType", "LocationType", "type", "Type")) ?? 0;
  return {
    id: n(pick(src, "id", "Id")),
    calendarLocationId,
    calendarId:
      pick<string>(src, "calendarId", "CalendarId", "calendar_id") != null
        ? String(pick(src, "calendarId", "CalendarId", "calendar_id"))
        : null,
    locationType,
    type: locationType,
    name: String(pick(src, "name", "Name") ?? ""),
    value: String(pick(src, "value", "Value") ?? ""),
    isDefault: b(pick(src, "isDefault", "IsDefault", "is_default")),
    sortOrder: n(pick(src, "sortOrder", "SortOrder", "sort_order")) ?? 0,
    createdOn: (pick(src, "createdOn", "CreatedOn", "created_on") as string | null) ?? null,
    modifiedOn: (pick(src, "modifiedOn", "ModifiedOn", "modified_on") as string | null) ?? null,
  };
}

/** API / MST row → frontend `{ type, value }`. */
export function mapApiLocationToFrontend(row: any): FrontendAppointmentLocation {
  const type =
    pick<number>(row, "locationType", "LocationType", "type", "Type") ?? 0;
  const value = pick<string>(row, "value", "Value") ?? "";
  const calendarLocationId = pick<string>(
    row,
    "calendarLocationId",
    "CalendarLocationId",
    "calendar_location_id"
  );
  const name = pick<string>(row, "name", "Name");
  const isDefault = pick<boolean>(row, "isDefault", "IsDefault", "is_default");
  const sortOrder = pick<number>(row, "sortOrder", "SortOrder", "sort_order");
  return {
    type: Number(type),
    value: String(value),
    ...(calendarLocationId ? { calendarLocationId: String(calendarLocationId) } : {}),
    ...(name != null ? { name: String(name) } : {}),
    ...(isDefault != null ? { isDefault: Boolean(isDefault) } : {}),
    ...(sortOrder != null ? { sortOrder: Number(sortOrder) } : {}),
  };
}

/** Frontend row → `POST /Calendar/Location/Save` body. */
export function mapFrontendLocationToSavePayload(
  calendarId: string,
  location: FrontendAppointmentLocation,
  index: number,
  options?: { calendarLocationId?: string; isDefault?: boolean }
): CalendarLocationSavePayload {
  return {
    calendarId,
    ...(options?.calendarLocationId
      ? { calendarLocationId: options.calendarLocationId }
      : {}),
    locationType: location.type,
    value: location.value ?? "",
    name: pick<string>(location as any, "name", "Name") ?? "",
    isDefault: options?.isDefault ?? index === 0,
    sortOrder: index,
  };
}

export function dedupeFrontendLocations(
  locations: FrontendAppointmentLocation[]
): FrontendAppointmentLocation[] {
  const seen = new Set<string>();
  const deduped: FrontendAppointmentLocation[] = [];
  for (const loc of locations) {
    const key = `${Number(loc.type)}:${String(loc.value ?? "").trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(loc);
  }
  return deduped;
}

/** Sort locations: Physical, Video, Phone, Custom (types 0–3). */
export function sortFrontendLocations(
  locations: FrontendAppointmentLocation[]
): FrontendAppointmentLocation[] {
  return [...locations].sort((a, b) => a.type - b.type);
}
