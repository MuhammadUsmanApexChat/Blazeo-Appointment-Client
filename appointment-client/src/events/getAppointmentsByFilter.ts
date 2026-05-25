import { EventModel, LeadModel } from "@blazeo.com/calendar-client";
import { getCalendarsByCompany } from "../calendar/getCalendarsByCompany.js";
import { pickEventLocationFromEvent } from "./mapAppointmentEventLocation.js";
import moment from "moment";

/**
 * High-level method to fetch appointments with enriched mapping.
 * Resolves names for organizers and calendars, and attempts to resolve missing leadIds.
 */
export async function getAppointmentsByFilter(
  companyKey: string,
  startDateFrom: string,
  startDateTo: string,
  opts: any = {}
) {
  // 1. Fetch raw events
  // Cast to any because getByDateRangeWithFilters is missing from some .d.ts versions but present in .js
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

  // 2. Fetch company data for name resolution (Calendars & Participants)
  const enrichedCalendars = await getCalendarsByCompany(companyKey);
  
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

  // 3. Map events to the desired response schema
  const mappedEvents = await Promise.all(
    events.map(async (event: any) => {
      // Resolve leadId if missing
      // Note: event properties might be uppercase depending on API version, mapEventFromApi usually handles this
      // but let's be defensive.
      const rawEvent = (event as any)._raw || event;
      let resolvedLeadId = event.leadId ?? rawEvent.lead_id ?? opts.leadId ?? null;
      
      if (!resolvedLeadId && event.visitorEmail) {
        try {
          const lead: any = await LeadModel.getByEmail(event.visitorEmail, companyKey);
          if (lead) {
            resolvedLeadId = lead.leadId;
          }
        } catch (err) {
          console.warn(`[getAppointmentsByFilter] Failed to resolve lead for ${event.visitorEmail}:`, err);
        }
      }

      const calendarId = event.calendarId;
      const participantId = event.participantId;
      const { calendarLocationId, customLocation } = pickEventLocationFromEvent(
        rawEvent !== event ? { ...event, ...rawEvent } : event
      );

      return {
        id: event.eventId, // UUID as per feedback
        appointmentId: event.eventId,
        title: event.title || "Appointment",
        organizer: participantMap.get(participantId) || "Member",
        guest: event.visitorName || "Guest",
        serviceType: calendarMap.get(calendarId) || "Calendar",
        status: event.attendeeStatus ?? 1,
        calendarId: calendarId, // UUID
        memberId: participantId, // UUID
        participantId: participantId, // UUID
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
        // Keep raw fields for potential fallback or reference
        _raw: event
      };
    })
  );

  return {
    events: mappedEvents,
    totalCount
  };
}
