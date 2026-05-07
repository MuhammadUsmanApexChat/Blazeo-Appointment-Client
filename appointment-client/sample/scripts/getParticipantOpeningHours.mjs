import {
  initializeAppointmentClient,
  CalendarModel,
  normalizeParticipantOpeningHoursResponse,
} from "appointment-client";

function reqEnv(name, fallback = "") {
  const v = (process.env[name] ?? fallback).trim();
  return v;
}

const baseUrl = reqEnv("BLAZEO_BASE_URL");
const consumer = reqEnv("BLAZEO_CONSUMER");
const calendarId = reqEnv("CALENDAR_ID");

if (!baseUrl) {
  console.error("Missing env BLAZEO_BASE_URL");
  process.exit(1);
}
if (!calendarId) {
  console.error("Missing env CALENDAR_ID");
  process.exit(1);
}

initializeAppointmentClient({ baseUrl, ...(consumer ? { consumer } : {}) });

const cal = await CalendarModel.get(calendarId);
if (!cal) {
  console.error("Calendar not found:", calendarId);
  process.exit(2);
}

const raw = await cal.getParticipantOpeningHours({});
const { list } = normalizeParticipantOpeningHoursResponse(raw);

console.log(
  JSON.stringify(
    {
      calendarId,
      count: Array.isArray(list) ? list.length : 0,
      openingHours: Array.isArray(list) ? list : null,
      raw,
    },
    null,
    2
  )
);

