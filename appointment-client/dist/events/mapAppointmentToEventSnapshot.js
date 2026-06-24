import { getSnapshot, isStateTreeNode } from "mobx-state-tree";
import { resolveEventLocationFields, pickEventLocationFromEvent, } from "./mapAppointmentEventLocation.js";
export { resolveEventLocationFields, pickEventLocationFromEvent, appointmentInputHasLocation } from "./mapAppointmentEventLocation.js";
function parseDate(value) {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) {
        throw new Error("Invalid startDate or endDate");
    }
    return d;
}
function formatYmd(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
function normalizeGuid(id) {
    return id.trim().replace(/^\{|\}$/g, "");
}
function optionalLocationString(value) {
    return value != null && value !== "" ? value : undefined;
}
/**
 * Maps Apex appointment input to a Blazeo `Event` MST snapshot for
 * {@link EventModel.create} from `@blazeo.com/calendar-client`.
 */
export function mapAppointmentToEventSnapshot(input, mode) {
    const start = parseDate(input.startDate);
    const end = parseDate(input.endDate);
    const description = mode === "create"
        ? (input.description ?? null)
        : (input.description ?? input.notes ?? null);
    const email = input.email ?? input.visitorEmail ?? null;
    const phone = input.phone ?? input.visitorPhone ?? null;
    const visitorName = input.visitorName?.trim() || null;
    const { calendarLocationId, customLocation } = resolveEventLocationFields(input);
    const snap = {
        calendarId: normalizeGuid(input.calendarId ?? ""),
        participantId: normalizeGuid(input.participantId),
        title: input.title ?? null,
        description,
        startDate: formatYmd(start),
        endDate: formatYmd(end),
        startHour: start.getHours(),
        startMinute: start.getMinutes(),
        endHour: end.getHours(),
        endMinute: end.getMinutes(),
        visitorName,
        visitorEmail: email,
        visitorPhone: phone,
        calendarLocationId: optionalLocationString(calendarLocationId),
        customLocation: optionalLocationString(customLocation),
        rescheduleLink: input.rescheduleUrl ?? null,
        cancelLink: input.cancelUrl ?? null,
        timeZone: input.timeZone ?? null,
    };
    if (mode === "create") {
        const now = new Date().toISOString();
        snap.createdOn = now;
        snap.modifiedOn = now;
    }
    if (mode === "reschedule" || mode === "update") {
        const eventIdRaw = input.eventId?.trim();
        snap.eventId = eventIdRaw || undefined;
    }
    return snap;
}
/** Plain event row including location fields (from MST snapshot or API body). */
export function mapAppointmentEventToPlain(event) {
    const raw = isStateTreeNode(event) ? getSnapshot(event) : event;
    const loc = pickEventLocationFromEvent(raw);
    const base = raw != null && typeof raw === "object" ? { ...raw } : {};
    return {
        ...base,
        calendarLocationId: loc.calendarLocationId,
        customLocation: loc.customLocation,
        /** Portal alias — same value as `calendarLocationId` when a saved location was used. */
        customLocationId: loc.calendarLocationId,
    };
}
