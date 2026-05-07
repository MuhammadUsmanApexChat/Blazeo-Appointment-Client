/**
 * ApexFlows `AppointmentBO`-aligned input for Blazeo event APIs
 * (same intent as `AppointmentAPIAdapter` Create / Reschedule / Cancel).
 */
export type ApexAppointmentInput = {
    /** Blazeo `calendarId` — `ThirdPartyCalendarId` in Apex. */
    thirdPartyCalendarId: string;
    /** Participant GUID string (with or without braces). */
    participantId: string;
    title?: string;
    /** Create: `AppointmentBO.Description`. */
    description?: string;
    /** Reschedule / update: Apex often uses `Notes` for body (see adapter). */
    notes?: string;
    startDate: string | Date;
    endDate: string | Date;
    visitorEmail?: string;
    visitorPhone?: string;
    visitorName?: string;
    email?: string;
    phone?: string;
    rescheduleUrl?: string;
    cancelUrl?: string;
    timeZone?: string;
    /** Existing Blazeo event id — required for reschedule; omit or `"new"` for create. */
    thirdPartyAppointmentId?: string;
};
//# sourceMappingURL=appointment.d.ts.map