import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import { getCalendarLocationsByCalendar } from "./calendarLocationHttp.js";
import {
  mapApiLocationToFrontend,
  sortFrontendLocations,
  type FrontendAppointmentLocation,
} from "./mapCalendarLocation.js";

export type FetchCalendarLocationsOptions = {
  baseUrl?: string;
  consumer?: string;
};

/**
 * `GET /Calendar/Location/Get?calendar_id=…` → `appointmentLocations` for calendar view.
 */
export async function fetchCalendarAppointmentLocations(
  calendarId: string,
  options: FetchCalendarLocationsOptions = {}
): Promise<FrontendAppointmentLocation[]> {
  const id = String(calendarId ?? "").trim();
  if (!id) return [];

  const ready = ensureBlazeoHttpReady(options);
  if (!ready.ok) return [];

  const rows = await getCalendarLocationsByCalendar(id, options);
  if (!rows?.length) return [];

  const mapped = rows
    .map((row) => mapApiLocationToFrontend(row))
    .filter((row): row is FrontendAppointmentLocation => row != null);

  return sortFrontendLocations(mapped);
}
