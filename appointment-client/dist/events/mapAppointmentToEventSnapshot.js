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
function normalizeParticipantId(id) {
    return id.trim().replace(/^\{|\}$/g, "");
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
    const eventIdRaw = input.thirdPartyAppointmentId?.trim();
    const eventId = eventIdRaw && eventIdRaw !== "new" ? eventIdRaw : "new";
    const email = input.email ?? input.visitorEmail ?? null;
    const phone = input.phone ?? input.visitorPhone ?? null;
    const visitorName = input.visitorName?.trim() || null;
    const snap = {
        eventId,
        calendarId: input.thirdPartyCalendarId?.trim() ?? "",
        participantId: normalizeParticipantId(input.participantId),
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
        rescheduleLink: input.rescheduleUrl ?? null,
        cancelLink: input.cancelUrl ?? null,
        timeZone: input.timeZone ?? null,
    };
    if (mode === "create") {
        const now = new Date().toISOString();
        snap.createdOn = now;
        snap.modifiedOn = now;
    }
    return snap;
}
