/**
 * Plain shapes aligned with CalendarBO / MemberBO / OpeningHourBO for mapping
 * into `@blazeo.com/calendar-client` `CalendarModel.create` (see `mapCalendarBoToBlazeoSnapshot.ts`).
 */
export type CalendarBOInput = {
    /** Blazeo / API calendar identifier; falls back to `thirdPartyCalendarId` or `"new"`. */
    calendarId?: string;
    thirdPartyCalendarId?: string;
    /** Apex / DB numeric id when known */
    serverId?: number;
    companyKey?: string | null;
    purpose?: string;
    name?: string | null;
    timeZoneId?: string | null;
    description?: string | null;
    /** Apex `AssignmentType` — mapped to Blazeo `assignmentMethod`. */
    assignmentType?: number;
    assignmentMethod?: number;
    duration?: number;
    bookingLimit?: number | null;
    calendarJson?: string | null;
    isThirdPartySaved?: boolean;
    durationUnit?: number;
    minimumBookingNotice?: number;
    minimumBookingNoticeUnit?: number;
    minimumCancelationNotice?: number;
    minimumCancelationNoticeUnit?: number;
    futureLimit?: number;
    futureLimitUnit?: number;
    bufferTime?: number | null;
    bufferTimeUnit?: number;
    calendarLink?: string | null;
    status?: number;
    location?: string | null;
    bookingPageTitle?: string | null;
    themeId?: number | null;
    createdOn?: string | null;
    modifiedOn?: string | null;
    /** Not part of Blazeo Calendar MST — reserved for future participant/hours steps. */
    members?: MemberBOInput[];
    openingHours?: OpeningHourBOInput[];
};
export type MemberBOInput = {
    id: number;
    name?: string | null;
    email?: string;
    thirdPartyMemberId?: string | null;
};
export type OpeningHourBOInput = {
    id: number;
    openingHourId?: string;
    calendarId?: string;
    participantId?: string;
    days: number[];
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    off: boolean;
    member: number;
};
//# sourceMappingURL=calendarBo.d.ts.map