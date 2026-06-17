/**
 * Offline checks for appointment calendar location enrichment.
 * Run: npm run verify:appointment-location
 */
import assert from "node:assert/strict";
import { configure } from "@blazeo.com/calendar-client";
import {
  enrichAppointmentEventWithCalendarLocation,
  enrichAppointmentEventsWithCalendarLocations,
  fetchCalendarLocationById,
  getEventById,
} from "../dist/index.js";

const locationId = "loc-1111-2222-3333-4444-555555555555";
const missingId = "missing-loc-id";

const locationsById = new Map([
  [
    locationId,
    {
      calendarLocationId: locationId,
      calendarId: "cal-1",
      locationType: 1,
      name: "Video room",
      value: "https://meet.example.com/abc",
      isDefault: true,
      sortOrder: 0,
    },
  ],
]);

configure({
  baseUrl: "https://mock.blazeo.local",
  fetch: async (url) => {
    const parsed = new URL(url);
    const path = parsed.pathname;

    if (path === "/Calendar/Location/GetById") {
      const id = parsed.searchParams.get("calendar_location_id");
      const row = locationsById.get(id);
      if (!row) {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          async text() {
            return JSON.stringify({ status: "failure", message: "not found" });
          },
        };
      }
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        async text() {
          return JSON.stringify({ status: "success", data: row });
        },
      };
    }

    if (path === "/event/customdata/get") {
      const eventId = parsed.searchParams.get("event_id");
      if (eventId === "evt-customdata-location") {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          async text() {
            return JSON.stringify({
              status: "success",
              data: JSON.stringify({ calendarLocationId: locationId }),
            });
          },
        };
      }
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        async text() {
          return JSON.stringify({ status: "success", data: "{}" });
        },
      };
    }

    if (path === "/event/get") {
      const id = parsed.searchParams.get("event_id");
      if (id === "evt-with-location") {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          async text() {
            return JSON.stringify({
              status: "success",
              data: {
                eventId: "evt-with-location",
                calendarId: "cal-1",
                participantId: "p-1",
                calendarLocationId: locationId,
                customLocation: null,
              },
            });
          },
        };
      }
      if (id === "evt-no-location") {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          async text() {
            return JSON.stringify({
              status: "success",
              data: {
                eventId: "evt-no-location",
                calendarId: "cal-1",
                participantId: "p-1",
                calendarLocationId: null,
                customLocation: "Room 5",
              },
            });
          },
        };
      }
      if (id === "evt-customdata-location") {
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          async text() {
            return JSON.stringify({
              status: "success",
              data: {
                eventId: "evt-customdata-location",
                calendarId: "cal-1",
                participantId: "p-1",
                calendar_location_id: null,
              },
            });
          },
        };
      }
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        async text() {
          return JSON.stringify({ status: "failure", message: "not found" });
        },
      };
    }

    return {
      ok: false,
      status: 404,
      statusText: "Not Found",
      async text() {
        return JSON.stringify({ status: "failure", message: `Unhandled ${path}` });
      },
    };
  },
});

const details = await fetchCalendarLocationById(locationId);
assert.ok(details, "fetchCalendarLocationById should return details");
assert.equal(details.calendarLocationId, locationId);
assert.equal(details.type, 1);
assert.equal(details.value, "https://meet.example.com/abc");

const missing = await fetchCalendarLocationById(missingId);
assert.equal(missing, null, "missing location should return null");

const noId = await fetchCalendarLocationById("");
assert.equal(noId, null, "empty id should return null");

const withLocation = await enrichAppointmentEventWithCalendarLocation({
  eventId: "evt-1",
  calendarLocationId: locationId,
});
assert.equal(withLocation.calendarLocationId, locationId);
assert.ok(withLocation.calendarLocation, "event with id should include calendarLocation");
assert.equal(withLocation.calendarLocation.name, "Video room");

const withoutLocation = await enrichAppointmentEventWithCalendarLocation({
  eventId: "evt-2",
  customLocation: "Room 5",
});
assert.equal(withoutLocation.calendarLocationId, null);
assert.equal(withoutLocation.calendarLocation, null, "no id → calendarLocation null");
assert.equal(withoutLocation.customLocation, "Room 5");

const batch = await enrichAppointmentEventsWithCalendarLocations([
  { eventId: "a", calendarLocationId: locationId },
  { eventId: "b" },
  { eventId: "c", calendarLocationId: missingId },
]);
assert.equal(batch.length, 3);
assert.ok(batch[0].calendarLocation?.value.includes("meet.example.com"));
assert.equal(batch[1].calendarLocation, null);
assert.equal(batch[2].calendarLocation, null, "unknown id → null without error");

const fetched = await getEventById("evt-with-location", { baseUrl: "https://mock.blazeo.local" });
assert.equal(fetched.ok, true, "getEventById should succeed");
assert.equal(fetched.ok && fetched.event.calendarLocationId, locationId, "event should expose calendarLocationId");
assert.equal(
  fetched.ok && fetched.event.calendarLocation,
  undefined,
  "getEventById should not fetch calendarLocation details"
);
assert.equal(fetched.ok && "apiResponse" in fetched, false, "getEventById should not return apiResponse");

const fetchedNoLoc = await getEventById("evt-no-location", { baseUrl: "https://mock.blazeo.local" });
assert.equal(fetchedNoLoc.ok, true, "getEventById without location should succeed");
assert.equal(
  fetchedNoLoc.ok && fetchedNoLoc.event.calendarLocation,
  undefined,
  "getEventById should not include calendarLocation field"
);

console.log("verifyAppointmentCalendarLocation: all checks passed");
