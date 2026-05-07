/** `GET /Calendar/Participant/Add` — attach `participantId` to this calendar. */
export function addParticipantToCalendar(calendar: any, participantId: string) {
  return calendar.addParticipant(participantId);
}

/** `GET /Calendar/Participant/Remove` */
export function removeParticipantFromCalendar(calendar: any, participantId: string) {
  return calendar.removeParticipant(participantId);
}

/** `POST /Calendar/Participant/Availability/OpeningHour/Save` — one day/slot. */
export function saveCalendarOpeningHour(calendar: any, payload: any) {
  return calendar.saveOpeningHour(payload);
}

/** `POST /Calendar/Participant/Availability/OpeningHours/Save` — batch body (API-specific shape). */
export function saveCalendarOpeningHoursBatch(calendar: any, payload: any) {
  return calendar.saveOpeningHours(payload);
}
