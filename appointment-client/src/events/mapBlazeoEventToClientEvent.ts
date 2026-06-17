import { pickEventLocationFromEvent } from "./mapAppointmentEventLocation.js";

function pick<T>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k] as T;
  }
  return undefined;
}

function num(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function bool(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

/**
 * Maps Blazeo `GET /event/get` (PascalCase or camelCase) to a single camelCase client event row.
 */
export function mapBlazeoEventToClientEvent(source: unknown): Record<string, unknown> {
  if (source == null || typeof source !== "object") return {};
  const d = source as Record<string, unknown>;
  const { calendarLocationId, customLocation } = pickEventLocationFromEvent(d);

  return {
    id: num(pick(d, "id", "Id")),
    eventId: String(pick(d, "eventId", "EventId", "event_id") ?? ""),
    calendarId: String(pick(d, "calendarId", "CalendarId", "calendar_id") ?? ""),
    participantId: pick(d, "participantId", "ParticipantId", "participant_id") ?? null,
    title: pick(d, "title", "Title") ?? null,
    description: pick(d, "description", "Description") ?? null,
    isRecurring: bool(pick(d, "isRecurring", "IsRecurring", "is_recurring")),
    recurringFrequency: num(pick(d, "recurringFrequency", "RecurringFrequency", "recurring_frequency")) ?? 0,
    startDate: pick(d, "startDate", "StartDate", "start_date") ?? "",
    endDate: pick(d, "endDate", "EndDate", "end_date") ?? "",
    startHour: num(pick(d, "startHour", "StartHour", "start_hour")) ?? 0,
    startMinute: num(pick(d, "startMinute", "StartMinute", "start_minute")) ?? 0,
    endHour: num(pick(d, "endHour", "EndHour", "end_hour")) ?? 0,
    endMinute: num(pick(d, "endMinute", "EndMinute", "end_minute")) ?? 0,
    visitorName: pick(d, "visitorName", "VisitorName", "visitor_name") ?? null,
    visitorEmail: pick(d, "visitorEmail", "VisitorEmail", "visitor_email") ?? null,
    visitorPhone: pick(d, "visitorPhone", "VisitorPhone", "visitor_phone") ?? null,
    createdOn: pick(d, "createdOn", "CreatedOn", "created_on") ?? null,
    modifiedOn: pick(d, "modifiedOn", "ModifiedOn", "modified_on") ?? null,
    externalEventId: pick(d, "externalEventId", "ExternalEventId", "external_event_id") ?? null,
    attendeeStatus: num(pick(d, "attendeeStatus", "AttendeeStatus", "attendee_status")) ?? 0,
    rescheduleLink: pick(d, "rescheduleLink", "RescheduleLink", "reschedule_link") ?? null,
    cancelLink: pick(d, "cancelLink", "CancelLink", "cancel_link") ?? null,
    timeZone: pick(d, "timeZone", "TimeZone", "time_zone") ?? null,
    offset: num(pick(d, "offset", "Offset")) ?? 0,
    flowId: pick(d, "flowId", "FlowId", "flow_id") ?? null,
    flowPath: pick(d, "flowPath", "FlowPath", "flow_path") ?? null,
    calendarLocationId,
    customLocation,
  };
}
