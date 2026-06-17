import { EventModel, LeadModel } from "@blazeo.com/calendar-client";
import { getCalendarsByCompany } from "../calendar/getCalendarsByCompany.js";
import { preloadCalendarLocationsMap } from "../calendar/fetchCalendarLocationById.js";
import { pickEventLocationFromEvent } from "./mapAppointmentEventLocation.js";
import { enrichAppointmentEventsWithCalendarLocations } from "./enrichAppointmentCalendarLocation.js";
import {
  backfillEventLocationIds,
  eventSearchResultToClientRow,
} from "./backfillEventLocationIds.js";
import moment from "moment";

export type GetAppointmentsByFilterOptions = {
  baseUrl?: string;
  consumer?: string;
  leadId?: string;
  /** When false, skips lead lookup by visitor email (faster). Default true. */
  resolveLeadIds?: boolean;
  /** When false, skips per-event GET /event/get for missing location ids. Default true. */
  backfillEventLocation?: boolean;
  /** When false, skips calendarLocation detail attachment. Default true. */
  includeCalendarLocation?: boolean;
  [key: string]: unknown;
};

/**
 * Fetch appointments with enriched mapping (organizer/calendar names, leadId, calendarLocation).
 * Parallelizes independent API work and scopes calendar/member fetches to calendars in the result set.
 */
export async function getAppointmentsByFilter(
  companyKey: string,
  startDateFrom: string,
  startDateTo: string,
  opts: GetAppointmentsByFilterOptions = {}
) {
  const resolveLeadIds = opts.resolveLeadIds !== false;
  const backfillEventLocation = opts.backfillEventLocation !== false;
  const includeCalendarLocation = opts.includeCalendarLocation !== false;

  const response: any = await (EventModel as any).getByDateRangeWithFilters(
    companyKey,
    startDateFrom,
    startDateTo,
    opts
  );

  const events = response?.events || [];
  const totalCount = response?.totalCount || 0;

  if (events.length === 0) {
    return { events: [], totalCount: 0 };
  }

  const calendarIdsInScope = [
    ...new Set(
      events
        .map((e: any) => String(e?.calendarId ?? "").trim())
        .filter((id: string) => id.length > 0)
    ),
  ] as string[];

  let clientRows = events.map((event: unknown) => eventSearchResultToClientRow(event));

  const calendarOpts = {
    baseUrl: opts.baseUrl,
    consumer: opts.consumer,
    includePreferences: false,
    includeLocations: false,
    calendarIds: calendarIdsInScope,
  };

  const [backfilledRows, enrichedCalendars, locationCache] = await Promise.all([
    backfillEventLocation
      ? backfillEventLocationIds(clientRows, opts)
      : Promise.resolve(clientRows),
    getCalendarsByCompany(companyKey, calendarOpts),
    includeCalendarLocation
      ? preloadCalendarLocationsMap(calendarIdsInScope, opts)
      : Promise.resolve(new Map()),
  ]);

  clientRows = backfilledRows;

  const calendarMap = new Map<string, string>();
  const participantMap = new Map<string, string>();

  enrichedCalendars.forEach((cal: any) => {
    calendarMap.set(cal.calendarId, cal.name);
    if (Array.isArray(cal.members)) {
      cal.members.forEach((m: any) => {
        participantMap.set(m.id, m.name);
      });
    }
  });

  const leadCache = new Map<string, string | null>();

  const mappedEvents = await Promise.all(
    events.map(async (event: any, index: number) => {
      const clientRow = clientRows[index] ?? {};
      let resolvedLeadId = event.leadId ?? opts.leadId ?? null;

      if (resolveLeadIds && !resolvedLeadId && event.visitorEmail) {
        const emailKey = String(event.visitorEmail).trim().toLowerCase();
        if (leadCache.has(emailKey)) {
          resolvedLeadId = leadCache.get(emailKey) ?? null;
        } else {
          try {
            const lead: any = await LeadModel.getByEmail(event.visitorEmail, companyKey);
            resolvedLeadId = lead?.leadId ?? null;
          } catch (err) {
            console.warn(
              `[getAppointmentsByFilter] Failed to resolve lead for ${event.visitorEmail}:`,
              err
            );
            resolvedLeadId = null;
          }
          leadCache.set(emailKey, resolvedLeadId);
        }
      }

      const calendarId = event.calendarId;
      const participantId = event.participantId;
      const { calendarLocationId, customLocation } = pickEventLocationFromEvent(clientRow);

      return {
        id: event.eventId,
        appointmentId: event.eventId,
        title: event.title || "Appointment",
        organizer: participantMap.get(participantId) || "Member",
        guest: event.visitorName || "Guest",
        serviceType: calendarMap.get(calendarId) || "Calendar",
        status: event.attendeeStatus ?? 1,
        calendarId,
        memberId: participantId,
        participantId,
        leadId: resolvedLeadId,
        notes: event.description || "",
        startDate: event.startDate ? moment(event.startDate).toISOString() : null,
        endDate: event.endDate ? moment(event.endDate).toISOString() : null,
        timeZone: event.timeZone || "Pakistan Standard Time",
        calendarLocationId,
        customLocationId: calendarLocationId,
        customLocation,
        meetingLocationType: customLocation ? 3 : calendarLocationId ? 0 : 1,
        customMeetingLocation: customLocation,
        __typename: "Appointment",
      };
    })
  );

  const eventsOut = includeCalendarLocation
    ? await enrichAppointmentEventsWithCalendarLocations(
        mappedEvents,
        opts,
        locationCache
      )
    : mappedEvents;

  return {
    events: eventsOut,
    totalCount,
  };
}
