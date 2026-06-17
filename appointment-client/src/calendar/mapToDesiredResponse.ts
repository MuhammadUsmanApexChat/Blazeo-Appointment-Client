/**
 * Maps a raw Blazeo API calendar payload (often PascalCase) to the specific camelCase 
 * shape requested by the user, including typenames and normalized fields.
 */
export function mapToDesiredCalendarResponse(payload: any, openingHours: any[] = [], members: any[] = []) {
  if (!payload) return null;

  const pick = (obj: any, ...keys: string[]) => {
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return undefined;
  };

  const n = (v: any) => (v != null && v !== "" ? Number(v) : null);

  // Map members with typename
  const mappedMembers = members.map(m => ({
    id: m.id ?? pick(m, "id", "Id"),
    name: m.name ?? pick(m, "name", "Name", "alias", "Alias") ?? "",
    alias: m.alias ?? pick(m, "alias", "Alias") ?? "",
    email: m.email ?? pick(m, "email", "Email") ?? null,
    status: m.status ?? pick(m, "status", "Status") ?? 0,
    __typename: "Member"
  }));

  // Map opening hours with typename and raw fields
  const mappedOpeningHours = openingHours.map(oh => {
    // If it's already a unified object (has day/start/end), preserve it but ensure __typename
    if (oh.day !== undefined && oh.start !== undefined && oh.end !== undefined) {
      return {
        ...oh,
        __typename: "OpeningHour"
      };
    }

    // Otherwise, map from raw PascalCase or camelCase
    return {
      id: pick(oh, "id", "Id") ?? 0,
      createdOn: pick(oh, "createdOn", "CreatedOn", "created_on") ?? "0001-01-01T00:00:00.000Z",
      modifiedOn: pick(oh, "modifiedOn", "ModifiedOn", "modified_on") ?? "0001-01-01T00:00:00.000Z",
      member: pick(oh, "member", "Member"),
      openingHourId: pick(oh, "openingHourId", "OpeningHourId", "opening_hour_id") ?? "",
      calendarId: pick(oh, "calendarId", "CalendarId", "calendar_id") ?? "",
      participantId: pick(oh, "participantId", "ParticipantId", "participant_id") ?? "",
      days: oh.days ?? [],
      startHour: oh.startHour ?? pick(oh, "startHour", "StartHour") ?? 0,
      startMinute: oh.startMinute ?? pick(oh, "startMinute", "StartMinute") ?? 0,
      endHour: oh.endHour ?? pick(oh, "endHour", "EndHour") ?? 0,
      endMinute: oh.endMinute ?? pick(oh, "endMinute", "EndMinute") ?? 0,
      off: !!(oh.off ?? pick(oh, "off", "Off")),
      __typename: "OpeningHour"
    };
  });

  // Map theme
  const rawTheme = pick(payload, "theme", "Theme");
  const theme = rawTheme ? {
    id: pick(rawTheme, "id", "Id"),
    color: pick(rawTheme, "color", "Color"),
    logoUrl: pick(rawTheme, "logoUrl", "LogoUrl") ?? null,
    __typename: "Theme"
  } : null;

  // Map reminders
  const rawReminders = pick(payload, "reminderChannelStatuses", "ReminderChannelStatuses") ?? [];
  const reminderChannelStatuses = Array.isArray(rawReminders) ? rawReminders.map((r: any) => ({
    id: pick(r, "id", "Id"),
    calendarId: pick(r, "calendarId", "CalendarId"),
    channelId: pick(r, "channelId", "ChannelId"),
    status: !!pick(r, "status", "Status"),
    appointmentReminders: (pick(r, "appointmentReminders", "AppointmentReminders") ?? []).map((ar: any) => ({
      id: pick(ar, "id", "Id"),
      reminderChannelStatusId: pick(ar, "reminderChannelStatusId", "ReminderChannelStatusId"),
      recipientType: pick(ar, "recipientType", "RecipientType"),
      beforeEventTime: pick(ar, "beforeEventTime", "BeforeEventTime"),
      unit: pick(ar, "unit", "Unit"),
      __typename: "AppointmentReminder"
    })),
    __typename: "ReminderChannelStatus"
  })) : [];

  const uuid = pick(payload, "uuid", "Uuid", "calendarId", "CalendarId");

  return {
    id: n(pick(payload, "id", "Id")),
    durationUnit: n(pick(payload, "durationUnit", "DurationUnit")),
    minimumBookingNotice: n(pick(payload, "minimumBookingNotice", "MinimumBookingNotice")),
    minimumBookingNoticeUnit: n(pick(payload, "minimumBookingNoticeUnit", "MinimumBookingNoticeUnit")),
    minimumCancelationNotice: n(pick(payload, "minimumCancelationNotice", "MinimumCancelationNotice")),
    minimumCancelationNoticeUnit: n(pick(payload, "minimumCancelationNoticeUnit", "MinimumCancelationNoticeUnit")),
    futureLimit: n(pick(payload, "futureLimit", "FutureLimit")),
    futureLimitUnit: n(pick(payload, "futureLimitUnit", "FutureLimitUnit")),
    bufferTime: n(pick(payload, "bufferTime", "BufferTime")),
    bufferTimeUnit: n(pick(payload, "bufferTimeUnit", "BufferTimeUnit")),
    calendarLink: pick(payload, "calendarLink", "CalendarLink"),
    uuid: uuid,
    calendarId: uuid, // Explicit alias requested by user
    location: pick(payload, "location", "Location") ?? "",
    bookingPageTitle: pick(payload, "bookingPageTitle", "BookingPageTitle") ?? null,
    reminderChannelStatuses,
    members: mappedMembers,
    createdOn: pick(payload, "createdOn", "CreatedOn") ?? "0001-01-01T00:00:00.000Z",
    modifiedOn: pick(payload, "modifiedOn", "ModifiedOn") ?? "0001-01-01T00:00:00.000Z",
    name: pick(payload, "name", "Name"),
    timeZoneId: pick(payload, "timeZoneId", "TimeZoneId"),
    description: pick(payload, "description", "Description") ?? "",
    assignmentType: n(pick(payload, "assignmentType", "AssignmentType", "assignmentMethod", "AssignmentMethod")),
    duration: n(pick(payload, "duration", "Duration")),
    bookingLimit: n(pick(payload, "bookingLimit", "BookingLimit")),
    calendarJson: pick(payload, "calendarJson", "CalendarJson") ?? null,
    isThirdPartySaved: !!pick(payload, "isThirdPartySaved", "IsThirdPartySaved"),
    themeId: n(pick(payload, "themeId", "ThemeId")),
    theme,
    openingHours: mappedOpeningHours,
    appointmentUserDefinedFields: pick(payload, "appointmentUserDefinedFields", "AppointmentUserDefinedFields") ?? [],
    __typename: "Calendar"
  };
}
