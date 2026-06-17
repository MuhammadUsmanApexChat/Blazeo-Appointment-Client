/**
 * Offline check for update-mode calendar location replacement.
 * Run: npm run verify:locations
 */
import assert from "node:assert/strict";
import {
  CalendarCreation,
  configure,
  replaceCalendarAppointmentLocations,
} from "../dist/index.js";

const calendarId = "cal-location-replace";
let nextLocationId = 100;
const requests = [];
const locationsByCalendar = new Map([
  [
    calendarId,
    [
      {
        calendarLocationId: "old-physical",
        calendarId,
        locationType: 0,
        value: "Old office",
        isDefault: true,
        sortOrder: 0,
      },
      {
        calendarLocationId: "old-video",
        calendarId,
        locationType: 1,
        value: "https://old.example/video",
        isDefault: false,
        sortOrder: 1,
      },
    ],
  ],
]);

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: String(status),
    async text() {
      return JSON.stringify(body);
    },
  };
}

function getCalendarIdFromUrl(url) {
  return new URL(url).searchParams.get("calendar_id") ?? calendarId;
}

function getLocationIdFromUrl(url) {
  return new URL(url).searchParams.get("calendar_location_id") ?? "";
}

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

configure({
  baseUrl: "https://mock.blazeo.local",
  fetch: async (url, init = {}) => {
    const parsed = new URL(url);
    const path = parsed.pathname;
    requests.push({ path, method: init.method ?? "GET", url });

    if (path === "/Calendar/Event/Update") {
      const body = JSON.parse(String(init.body ?? "{}"));
      return jsonResponse({
        status: "success",
        data: {
          ...body,
          calendarId: body.calendarId ?? calendarId,
        },
      });
    }

    if (path === "/Calendar/Location/Get") {
      const id = getCalendarIdFromUrl(url);
      return jsonResponse({
        status: "success",
        data: cloneRows(locationsByCalendar.get(id) ?? []),
      });
    }

    if (path === "/Calendar/Location/Remove") {
      const locationId = getLocationIdFromUrl(url);
      for (const [id, rows] of locationsByCalendar.entries()) {
        const next = rows.filter((row) => row.calendarLocationId !== locationId);
        if (next.length !== rows.length) {
          locationsByCalendar.set(id, next);
          return jsonResponse({ status: "success", data: { calendarLocationId: locationId } });
        }
      }
      return jsonResponse({ status: "failure", message: `Missing location ${locationId}` }, 404);
    }

    if (path === "/Calendar/Location/Save") {
      const body = JSON.parse(String(init.body ?? "{}"));
      const id = body.calendarId ?? calendarId;
      const row = {
        calendarLocationId: body.calendarLocationId ?? `new-location-${nextLocationId++}`,
        calendarId: id,
        locationType: body.locationType,
        name: body.name ?? "",
        value: body.value ?? "",
        isDefault: Boolean(body.isDefault),
        sortOrder: Number(body.sortOrder ?? 0),
      };
      const rows = locationsByCalendar.get(id) ?? [];
      locationsByCalendar.set(id, [...rows, row]);
      return jsonResponse({ status: "success", data: row });
    }

    return jsonResponse({ status: "failure", message: `Unhandled ${path}` }, 404);
  },
});

const direct = await replaceCalendarAppointmentLocations(calendarId, {
  appointmentLocations: [
    { type: 0, value: "New office" },
    { type: 1, value: "https://new.example/video" },
  ],
});

assert.equal(direct.ok, true, "direct replacement should succeed");
assert.equal(direct.skipped, false, "direct replacement should not be skipped");
assert.equal(direct.deletedCount, 2, "old locations should be deleted first");
assert.equal(direct.verified, true, "replacement should verify final location set");
assert.deepEqual(
  direct.saved.map((row) => [row.type, row.value]),
  [
    [0, "New office"],
    [1, "https://new.example/video"],
  ],
  "direct replacement should return fetched new locations"
);

const afterDirect = locationsByCalendar.get(calendarId) ?? [];
assert.equal(afterDirect.length, 2, "no stale rows should remain after direct replacement");
assert.equal(
  afterDirect.some((row) => String(row.value).startsWith("Old")),
  false,
  "old location values should be gone"
);

const updatePayload = {
  calendarId,
  companyKey: "company_key",
  name: "Updated calendar",
  timeZoneId: "UTC",
  duration: 30,
  appointmentLocations: [
    { type: 2, value: "+15551234567" },
    { type: 2, value: "+15551234567" },
    { type: 3, value: "Reception desk" },
  ],
};

const updated = await CalendarCreation.updateWithRelationsAsync(updatePayload);
assert.equal(updated.ok, true, "calendar update flow should succeed");
assert.equal(updated.appointmentLocationsSaved, true, "update should save locations");
assert.deepEqual(
  updated.appointmentLocations.map((row) => [row.type, row.value]),
  [
    [2, "+15551234567"],
    [3, "Reception desk"],
  ],
  "update should return verified, deduped replacement locations"
);

const finalRows = locationsByCalendar.get(calendarId) ?? [];
assert.equal(finalRows.length, 2, "update should leave only requested unique locations");
assert.equal(
  finalRows.some((row) => row.calendarLocationId === "old-physical" || row.calendarLocationId === "old-video"),
  false,
  "old location ids should not remain"
);
assert.ok(
  requests.find((req) => req.path === "/Calendar/Event/Update"),
  "calendar update endpoint should be called"
);
assert.equal(
  requests.filter((req) => req.path === "/Calendar/Location/Remove").length,
  4,
  "direct replacement and update replacement should delete existing rows"
);
assert.ok(
  requests.filter((req) => req.path === "/Calendar/Location/Save").length >= 4,
  "new rows should be inserted"
);

console.log("verifyCalendarLocationReplace: all checks passed");
