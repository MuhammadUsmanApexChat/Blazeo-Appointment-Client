/**
 * Maps between portal `appointmentLocations` (`type` + `value`) and
 * `@blazeo.com/calendar-client` `CalendarLocationModel` (`locationType`, `value`, …).
 *
 * `LocationType` in calendar-client: Physical=0, Video=1, Phone=2, Custom=3 — same as frontend `type`.
 */

export type FrontendAppointmentLocation = {
  type: number;
  value: string;
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
      return {
        type: Number(type),
        value: value != null ? String(value) : "",
      };
    })
    .filter((row): row is FrontendAppointmentLocation => row != null);
}

export function calendarPayloadHasLocations(calendar: any): boolean {
  return collectAppointmentLocations(calendar).length > 0;
}

/** API / MST row → frontend `{ type, value }`. */
export function mapApiLocationToFrontend(row: any): FrontendAppointmentLocation {
  const type =
    pick<number>(row, "locationType", "LocationType", "type", "Type") ?? 0;
  const value = pick<string>(row, "value", "Value") ?? "";
  return {
    type: Number(type),
    value: String(value),
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

/** Sort locations: Physical, Video, Phone, Custom (types 0–3). */
export function sortFrontendLocations(
  locations: FrontendAppointmentLocation[]
): FrontendAppointmentLocation[] {
  return [...locations].sort((a, b) => a.type - b.type);
}
