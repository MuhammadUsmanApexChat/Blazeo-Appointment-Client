export interface UnifiedCalendarMember {
    id: number | string;
    name: string;
    email: string | null;
    /** When API exposes status; otherwise derived from participant info flags. */
    status: number | null;
    /** Full row from Participants/GetInfo (plain object). */
    participantInfo?: Record<string, unknown> | null;
    __typename?: string;
}
export interface UnifiedParticipantWithHours extends UnifiedCalendarMember {
    openingHours: UnifiedOpeningHourRow[];
}
export interface UnifiedOpeningHourRow {
    id?: number | string;
    createdOn?: string;
    modifiedOn?: string;
    member: number | string;
    openingHourId?: string;
    calendarId?: string;
    participantId?: string;
    days: string[];
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    off: boolean;
    __typename?: string;
}
export type UnifiedCalendarView = Record<string, unknown> & {
    members: UnifiedCalendarMember[];
    openingHours: UnifiedOpeningHourRow[];
    participants?: UnifiedParticipantWithHours[];
};
/**
 * Build a consumer-friendly `{ id, name, members, openingHours }` shape where
 * `openingHours[].member` references `members[].id`.
 */
export declare function buildUnifiedCalendarView(calendarSnapshot: Record<string, any> | null, openingHoursRows: any[], participants: any[] | null | undefined, participantsInfo: any[] | null | undefined): UnifiedCalendarView | null;
