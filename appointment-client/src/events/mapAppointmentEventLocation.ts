/**
 * Event location fields for create/reschedule — aligned with Blazeo `Event` MST
 * (`calendarLocationId`, `customLocation`) and POST `/event/create` | `/event/reschedule`.
 */

export type AppointmentEventLocationInput = {
  /** Saved calendar location row id (`GET /Calendar/Location/Get`). */
  calendarLocationId?: string | null;
  CalendarLocationId?: string | null;
  calendar_location_id?: string | null;
  /** Portal alias for saved location id (maps to `calendarLocationId` on the API). */
  customLocationId?: string | null;
  CustomLocationId?: string | null;
  /** Free-text location when not using a saved calendar location. */
  customLocation?: string | null;
  CustomLocation?: string | null;
  custom_location?: string | null;
  /** Portal alias sometimes used on appointment payloads. */
  customMeetingLocation?: string | null;
  CustomMeetingLocation?: string | null;
};

export type ResolvedEventLocation = {
  calendarLocationId: string | null;
  customLocation: string | null;
};

function pick<T>(obj: any, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj[k] !== null) return obj[k] as T;
  }
  return undefined;
}

/**
 * Resolves location for API payload.
 * Custom text wins when non-empty; otherwise uses `calendarLocationId`.
 */
export function resolveEventLocationFields(input: any): ResolvedEventLocation {
  if (input == null || typeof input !== "object") {
    return { calendarLocationId: null, customLocation: null };
  }

  const customRaw = pick<string>(
    input,
    "customLocation",
    "CustomLocation",
    "custom_location",
    "customMeetingLocation",
    "CustomMeetingLocation"
  );
  const calendarLocRaw = pick<string>(
    input,
    "calendarLocationId",
    "CalendarLocationId",
    "calendar_location_id",
    "customLocationId",
    "CustomLocationId",
    "savedLocationId",
    "SavedLocationId",
    "appointmentLocationId",
    "AppointmentLocationId"
  );

  const customTrimmed = customRaw != null ? String(customRaw).trim() : "";
  const calendarLocTrimmed = calendarLocRaw != null ? String(calendarLocRaw).trim() : "";

  if (customTrimmed) {
    return { calendarLocationId: null, customLocation: customTrimmed };
  }
  if (calendarLocTrimmed) {
    return { calendarLocationId: calendarLocTrimmed, customLocation: null };
  }
  return { calendarLocationId: null, customLocation: null };
}

/** True when either location field is present on the input. */
export function appointmentInputHasLocation(input: any): boolean {
  const { calendarLocationId, customLocation } = resolveEventLocationFields(input);
  return Boolean(calendarLocationId || customLocation);
}

function normalizeLocationId(value: unknown): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed !== "" ? trimmed : null;
}

function normalizeCustomLocation(value: unknown): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed !== "" ? trimmed : null;
}

/** Normalize API / MST event to plain location fields for responses. */
export function pickEventLocationFromEvent(event: any): ResolvedEventLocation {
  if (event == null || typeof event !== "object") {
    return { calendarLocationId: null, customLocation: null };
  }

  const customRaw = pick<string>(
    event,
    "customLocation",
    "CustomLocation",
    "custom_location",
    "customMeetingLocation",
    "CustomMeetingLocation"
  );
  const calendarLocRaw = pick<string>(
    event,
    "calendarLocationId",
    "CalendarLocationId",
    "calendar_location_id",
    "locationId",
    "LocationId",
    "customLocationId",
    "CustomLocationId",
    "savedLocationId",
    "SavedLocationId",
    "appointmentLocationId",
    "AppointmentLocationId"
  );

  const customTrimmed = normalizeCustomLocation(customRaw);
  const calendarLocTrimmed = normalizeLocationId(calendarLocRaw);

  if (customTrimmed) {
    return { calendarLocationId: null, customLocation: customTrimmed };
  }
  if (calendarLocTrimmed) {
    return { calendarLocationId: calendarLocTrimmed, customLocation: null };
  }
  return { calendarLocationId: null, customLocation: null };
}

/** Merge location fields from event model, raw GET payload, and optional custom data. */
export function pickEventLocationFromSources(...sources: unknown[]): ResolvedEventLocation {
  for (const source of sources) {
    const loc = pickEventLocationFromEvent(source);
    if (loc.calendarLocationId || loc.customLocation) return loc;
  }
  return { calendarLocationId: null, customLocation: null };
}

/** Try to read `calendarLocationId` from `/event/customdata/get` payload shapes. */
export function pickEventLocationFromCustomData(customData: unknown): ResolvedEventLocation {
  if (customData == null) return { calendarLocationId: null, customLocation: null };

  let row: unknown = customData;
  if (typeof customData === "string") {
    try {
      row = JSON.parse(customData);
    } catch {
      return { calendarLocationId: null, customLocation: null };
    }
  }

  const direct = pickEventLocationFromEvent(row);
  if (direct.calendarLocationId || direct.customLocation) return direct;

  if (row != null && typeof row === "object") {
    const obj = row as Record<string, unknown>;
    for (const value of Object.values(obj)) {
      if (value != null && typeof value === "object") {
        const nested = pickEventLocationFromEvent(value);
        if (nested.calendarLocationId || nested.customLocation) return nested;
      }
    }
  }

  return { calendarLocationId: null, customLocation: null };
}
