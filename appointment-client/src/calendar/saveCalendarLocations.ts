import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import {
  getCalendarLocationsByCalendar,
  removeCalendarLocationApi,
  saveCalendarLocationApi,
} from "./calendarLocationHttp.js";
import {
  collectAppointmentLocations,
  dedupeFrontendLocations,
  mapFrontendLocationToSavePayload,
  mapApiLocationToFrontend,
  sortFrontendLocations,
  calendarPayloadIncludesLocations,
  type FrontendAppointmentLocation,
  type CalendarLocationSavePayload,
} from "./mapCalendarLocation.js";
import type { BlazeoPreferenceConnection } from "../preference/setPreference.js";

export type SaveCalendarLocationsResult =
  | { ok: true; skipped: true }
  | {
      ok: true;
      skipped: false;
      saved: FrontendAppointmentLocation[];
      responses: unknown[];
      deletedCount?: number;
      verified?: boolean;
    }
  | { ok: false; error: string; apiResponse?: unknown };

export type SaveCalendarLocationsOptions = {
  /**
   * Update mode: remove every existing location for this calendar, insert the request payload,
   * then fetch again to verify no stale rows remain.
   */
  replaceExisting?: boolean;
};

type ExistingLocationRow = Record<string, unknown>;

function isFailureStatus(res: any): boolean {
  return res?.status !== "success" && res?.status !== "Success";
}

function pick<T>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key] as T;
  }
  return undefined;
}

function resolveLocationId(row: ExistingLocationRow): string {
  return String(
    pick(row, "calendarLocationId", "CalendarLocationId", "calendar_location_id") ?? ""
  ).trim();
}

function prepareLocations(calendar: any): FrontendAppointmentLocation[] {
  return sortFrontendLocations(dedupeFrontendLocations(collectAppointmentLocations(calendar)));
}

function mapExistingRowToSavePayload(
  calendarId: string,
  row: ExistingLocationRow,
  index: number
): CalendarLocationSavePayload {
  const frontend = mapApiLocationToFrontend(row);
  const calendarLocationId = resolveLocationId(row);
  const name = pick<string>(row, "name", "Name");
  const isDefault = pick<boolean>(row, "isDefault", "IsDefault", "is_default");
  const sortOrder = pick<number>(row, "sortOrder", "SortOrder", "sort_order");

  return {
    calendarId,
    ...(calendarLocationId ? { calendarLocationId } : {}),
    locationType: frontend.type,
    value: frontend.value,
    name: name != null ? String(name) : frontend.name ?? "",
    isDefault: isDefault != null ? Boolean(isDefault) : frontend.isDefault ?? index === 0,
    sortOrder: sortOrder != null ? Number(sortOrder) : frontend.sortOrder ?? index,
  };
}

function locationSignature(loc: FrontendAppointmentLocation): string {
  return `${Number(loc.type)}:${String(loc.value ?? "").trim().toLowerCase()}`;
}

function sameLocationSet(
  expected: FrontendAppointmentLocation[],
  actual: FrontendAppointmentLocation[]
): boolean {
  const expectedKeys = expected.map(locationSignature).sort();
  const actualKeys = actual.map(locationSignature).sort();
  if (expectedKeys.length !== actualKeys.length) return false;
  return expectedKeys.every((key, index) => key === actualKeys[index]);
}

async function restoreLocations(
  calendarId: string,
  rows: ExistingLocationRow[],
  connection: BlazeoPreferenceConnection
): Promise<void> {
  for (let i = 0; i < rows.length; i++) {
    await saveCalendarLocationApi(mapExistingRowToSavePayload(calendarId, rows[i], i), connection);
  }
}

async function removeRows(
  rows: ExistingLocationRow[],
  connection: BlazeoPreferenceConnection
): Promise<{ ok: true; removed: ExistingLocationRow[] } | { ok: false; removed: ExistingLocationRow[]; error: string; apiResponse?: unknown }> {
  const removed: ExistingLocationRow[] = [];
  for (const row of rows) {
    const id = resolveLocationId(row);
    if (!id) continue;
    const res = await removeCalendarLocationApi(id, connection);
    if (isFailureStatus(res)) {
      return {
        ok: false,
        removed,
        error: `Calendar location delete failed for ${id}`,
        apiResponse: res,
      };
    }
    removed.push(row);
  }
  return { ok: true, removed };
}

async function rollbackReplace(
  calendarId: string,
  deletedRows: ExistingLocationRow[],
  insertedRows: ExistingLocationRow[],
  connection: BlazeoPreferenceConnection
): Promise<void> {
  await removeRows(insertedRows, connection);
  await restoreLocations(calendarId, deletedRows, connection);
}

/**
 * Save each `appointmentLocations` row via `POST /Calendar/Location/Save`.
 */
export async function saveCalendarAppointmentLocations(
  calendarId: string,
  calendar: any,
  connection: BlazeoPreferenceConnection = {},
  options: SaveCalendarLocationsOptions = {}
): Promise<SaveCalendarLocationsResult> {
  const id = String(calendarId ?? "").trim();
  if (!id) {
    return { ok: false, error: "calendarId is required to save appointment locations." };
  }

  const shouldReplace = Boolean(options.replaceExisting);
  const hasLocationPayload = calendarPayloadIncludesLocations(calendar);
  const locations = shouldReplace
    ? prepareLocations(calendar)
    : sortFrontendLocations(collectAppointmentLocations(calendar));
  if (!shouldReplace && locations.length === 0) {
    return { ok: true, skipped: true };
  }
  if (shouldReplace && !hasLocationPayload) {
    return { ok: true, skipped: true };
  }

  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    return { ok: false, error: "Blazeo HTTP is not configured." };
  }

  if (shouldReplace) {
    return replaceCalendarAppointmentLocations(id, calendar, connection);
  }

  const responses: unknown[] = [];
  const saved: FrontendAppointmentLocation[] = [];

  for (let i = 0; i < locations.length; i++) {
    const loc = locations[i];
    const payload = mapFrontendLocationToSavePayload(id, loc, i, {
      isDefault: i === 0,
    });
    const savedRow = await saveCalendarLocationApi(payload, connection);
    if (savedRow == null) {
      return {
        ok: false,
        error: `Calendar location save failed for type ${loc.type}`,
      };
    }

    responses.push(savedRow);
    saved.push(loc);
  }

  return { ok: true, skipped: false, saved, responses };
}

/**
 * Update-mode location save.
 *
 * The backend exposes single-row remove/save endpoints instead of a server-side
 * transaction. This function treats replacement as an application-level unit:
 * delete current rows, insert requested rows, verify the final fetched set, and
 * best-effort restore the previous rows if any step fails.
 */
export async function replaceCalendarAppointmentLocations(
  calendarId: string,
  calendar: any,
  connection: BlazeoPreferenceConnection = {}
): Promise<SaveCalendarLocationsResult> {
  const id = String(calendarId ?? "").trim();
  if (!id) {
    return { ok: false, error: "calendarId is required to replace appointment locations." };
  }

  if (!calendarPayloadIncludesLocations(calendar)) {
    return { ok: true, skipped: true };
  }

  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    return { ok: false, error: "Blazeo HTTP is not configured." };
  }

  const existingRows = await getCalendarLocationsByCalendar(id, connection);
  if (existingRows == null) {
    return {
      ok: false,
      error: "Could not load existing calendar locations before replacement.",
    };
  }

  const expected = prepareLocations(calendar);
  const deleted = await removeRows(existingRows, connection);
  if (!deleted.ok) {
    await restoreLocations(id, deleted.removed, connection);
    return {
      ok: false,
      error: deleted.error,
      ...(deleted.apiResponse != null ? { apiResponse: deleted.apiResponse } : {}),
    };
  }

  const responses: ExistingLocationRow[] = [];
  const saved: FrontendAppointmentLocation[] = [];
  for (let i = 0; i < expected.length; i++) {
    const loc = expected[i];
    const payload = mapFrontendLocationToSavePayload(id, loc, i, {
      isDefault: i === 0,
    });
    const savedRow = await saveCalendarLocationApi(payload, connection);
    if (savedRow == null) {
      await rollbackReplace(id, deleted.removed, responses, connection);
      return {
        ok: false,
        error: `Calendar location replacement failed while inserting type ${loc.type}`,
      };
    }
    responses.push(savedRow);
    saved.push(loc);
  }

  const finalRows = await getCalendarLocationsByCalendar(id, connection);
  if (finalRows == null) {
    await rollbackReplace(id, deleted.removed, responses, connection);
    return {
      ok: false,
      error: "Could not verify calendar locations after replacement.",
    };
  }

  const finalLocations = sortFrontendLocations(
    finalRows.map((row) => mapApiLocationToFrontend(row))
  );
  if (!sameLocationSet(expected, finalLocations)) {
    await rollbackReplace(id, deleted.removed, responses, connection);
    return {
      ok: false,
      error: "Calendar location replacement verification failed.",
      apiResponse: { expected, actual: finalLocations },
    };
  }

  return {
    ok: true,
    skipped: false,
    saved: finalLocations,
    responses,
    deletedCount: deleted.removed.length,
    verified: true,
  };
}
