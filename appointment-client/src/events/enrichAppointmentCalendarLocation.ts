import type { BlazeoPreferenceConnection } from "../preference/setPreference.js";
import {
  fetchCalendarLocationById,
  loadCalendarLocationDetailsMap,
  type CalendarLocationDetails,
} from "../calendar/fetchCalendarLocationById.js";
import { pickEventLocationFromEvent } from "./mapAppointmentEventLocation.js";

export type { CalendarLocationDetails };

/** Appointment/event row with optional resolved calendar location. */
export type EnrichedAppointmentEvent = Record<string, unknown> & {
  calendarLocationId: string | null;
  customLocationId: string | null;
  customLocation: string | null;
  calendarLocation: CalendarLocationDetails | null;
};

function lookupLocation(
  calendarLocationId: string | null,
  cache?: Map<string, CalendarLocationDetails>
): CalendarLocationDetails | null {
  if (!calendarLocationId) return null;
  if (!cache) return null;
  return cache.get(calendarLocationId.toLowerCase()) ?? null;
}

/**
 * Attach `calendarLocation` when `calendarLocationId` is set on an event/appointment row.
 * Missing id, missing record, or API failure → `calendarLocation: null` (no throw).
 */
export async function enrichAppointmentEventWithCalendarLocation(
  event: Record<string, unknown>,
  connection: BlazeoPreferenceConnection = {},
  cache?: Map<string, CalendarLocationDetails>
): Promise<EnrichedAppointmentEvent> {
  const { calendarLocationId, customLocation } = pickEventLocationFromEvent(event);

  let calendarLocation: CalendarLocationDetails | null = null;
  if (calendarLocationId) {
    calendarLocation =
      lookupLocation(calendarLocationId, cache) ??
      (await fetchCalendarLocationById(calendarLocationId, connection));
  }

  return {
    ...event,
    calendarLocationId,
    customLocationId: calendarLocationId,
    customLocation,
    calendarLocation,
    meetingLocationType: customLocation ? 3 : calendarLocationId ? 0 : 1,
    customMeetingLocation: customLocation,
  };
}

/** Preload locations for a list of events, then enrich each row. */
export async function enrichAppointmentEventsWithCalendarLocations(
  events: Record<string, unknown>[],
  connection: BlazeoPreferenceConnection = {},
  initialCache?: Map<string, CalendarLocationDetails>
): Promise<EnrichedAppointmentEvent[]> {
  if (!events.length) return [];

  const cache = new Map(initialCache ?? []);
  const missingIds = events
    .map((event) => pickEventLocationFromEvent(event).calendarLocationId)
    .filter((id): id is string => Boolean(id && !cache.has(id.toLowerCase())));

  if (missingIds.length) {
    const fetched = await loadCalendarLocationDetailsMap(missingIds, connection);
    fetched.forEach((details, key) => cache.set(key, details));
  }

  return Promise.all(
    events.map((event) => enrichAppointmentEventWithCalendarLocation(event, connection, cache))
  );
}
