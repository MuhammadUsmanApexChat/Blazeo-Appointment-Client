import { initializeAppointmentClient, CalendarParticipantModel } from "appointment-client";

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

const info = await CalendarParticipantModel.getInfoByCalendar(calendarId);

console.log(
  JSON.stringify(
    {
      calendarId,
      count: Array.isArray(info) ? info.length : 0,
      info,
    },
    null,
    2
  )
);

