/**
 * Plain shapes aligned with CalendarBO / MemberBO / OpeningHourBO for mapping
 * into `@blazeo.com/calendar-client` `CalendarModel.create` (see `mapCalendarBoToBlazeoSnapshot.ts`).
 */
export type CalendarInput = {
    /** Blazeo / API calendar identifier; falls back to `thirdPartyCalendarId` or `"new"`. */
    calendarId?: string;
    companyKey?: string | null;
    name?: string | null;
    timeZoneId?: string | null;
    description?: string | null;
    /** Apex `AssignmentType` — mapped to Blazeo `assignmentMethod`. */
    assignmentType?: number;
    assignmentMethod?: number;
    duration?: number;
    bookingLimit?: number | null;
    durationUnit?: number;
    minimumBookingNotice?: number;
    minimumBookingNoticeUnit?: number;
    minimumCancelationNotice?: number;
    minimumCancelationNoticeUnit?: number;
    futureLimit?: number;
    futureLimitUnit?: number;
    bufferTime?: number | null;
    bufferTimeUnit?: number;
    /**
     * Apex: used to populate Blazeo `purpose` (fallback).
     * If omitted, we fallback to `bookingPageTitle` or "".
     */
    purpose?: string;
    bookingPageTitle?: string | null;
    createdOn?: string | null;
    modifiedOn?: string | null;
    /** Not part of Blazeo Calendar MST — reserved for future participant/hours steps. */
    members?: MemberBOInput[];
    openingHours?: OpeningHourBOInput[];
};
export type MemberBOInput = {
    id: string | null;
};
export type OpeningHourBOInput = {
    id: number;
    openingHourId?: string;
    participantId?: string;
    days: number[];
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    off: boolean;
};
//# sourceMappingURL=calendar.d.ts.map