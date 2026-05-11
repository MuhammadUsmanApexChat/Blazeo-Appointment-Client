/**
 * Maps a raw Blazeo API calendar payload (often PascalCase) to the specific camelCase
 * shape requested by the user, including typenames and normalized fields.
 */
export declare function mapToDesiredCalendarResponse(payload: any, openingHours?: any[], members?: any[]): {
    id: number | null;
    durationUnit: number | null;
    minimumBookingNotice: number | null;
    minimumBookingNoticeUnit: number | null;
    minimumCancelationNotice: number | null;
    minimumCancelationNoticeUnit: number | null;
    futureLimit: number | null;
    futureLimitUnit: number | null;
    bufferTime: number | null;
    bufferTimeUnit: number | null;
    calendarLink: any;
    uuid: any;
    location: any;
    bookingPageTitle: any;
    reminderChannelStatuses: {
        id: any;
        calendarId: any;
        channelId: any;
        status: boolean;
        appointmentReminders: any;
        __typename: string;
    }[];
    members: {
        id: any;
        name: any;
        email: any;
        status: any;
        __typename: string;
    }[];
    createdOn: any;
    modifiedOn: any;
    name: any;
    timeZoneId: any;
    description: any;
    assignmentType: number | null;
    duration: number | null;
    bookingLimit: number | null;
    calendarJson: any;
    isThirdPartySaved: boolean;
    themeId: number | null;
    theme: {
        id: any;
        color: any;
        logoUrl: any;
        __typename: string;
    } | null;
    openingHours: {
        id: any;
        createdOn: any;
        modifiedOn: any;
        member: any;
        openingHourId: any;
        calendarId: any;
        participantId: any;
        days: any;
        startHour: any;
        startMinute: any;
        endHour: any;
        endMinute: any;
        off: boolean;
        __typename: string;
    }[];
    appointmentUserDefinedFields: any;
    __typename: string;
} | null;
