/**
 * Maps Apex `CalendarBO`-shaped input to a snapshot for
 * {@link CalendarModel.create} from `@blazeo.com/calendar-client`.
 *
 * Only fields that exist on Blazeo's `Calendar` model are included so MST does not receive
 * unknown keys or invalid `null`s on optional numbers.
 */
export declare function mapCalendarBOToSnapshot(bo: any): {
    companyKey: any;
    calendarId: any;
    name: any;
    timeZoneId: any;
    purpose: any;
    description: any;
    assignmentMethod: any;
    duration: any;
    durationUnit: any;
    minimumBookingNotice: any;
    minimumBookingNoticeUnit: any;
    minimumCancelationNotice: any;
    minimumCancelationNoticeUnit: any;
    futureLimit: any;
    futureLimitUnit: any;
    bufferTime: any;
    bufferTimeUnit: any;
    bookingLimit: any;
    createdOn: any;
    modifiedOn: any;
};
