/** `GET /Calendar/Participant/Add` — attach `participantId` to this calendar. */
export declare function addParticipantToCalendar(calendar: any, participantId: string): any;
/** `GET /Calendar/Participant/Remove` */
export declare function removeParticipantFromCalendar(calendar: any, participantId: string): any;
/** `POST /Calendar/Participant/Availability/OpeningHour/Save` — one day/slot. */
export declare function saveCalendarOpeningHour(calendar: any, payload: any): any;
/** `POST /Calendar/Participant/Availability/OpeningHours/Save` — batch body (API-specific shape). */
export declare function saveCalendarOpeningHoursBatch(calendar: any, payload: any): any;
