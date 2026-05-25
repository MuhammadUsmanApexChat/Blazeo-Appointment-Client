/**
 * Offline checks for event location mapping (create + reschedule snapshots).
 * Run: node scripts/verifyEventLocation.mjs
 */
import {
  mapAppointmentToEventSnapshot,
  resolveEventLocationFields,
  pickEventLocationFromEvent,
} from "../dist/events/mapAppointmentToEventSnapshot.js";

const baseInput = {
  calendarId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  participantId: "11111111-2222-3333-4444-555555555555",
  title: "Test",
  startDate: "2026-05-21T10:00:00.000Z",
  endDate: "2026-05-21T10:30:00.000Z",
  email: "a@b.com",
  timeZone: "UTC",
};

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Saved calendar location only (API name)
const savedLoc = resolveEventLocationFields({
  calendarLocationId: "loc-uuid-1",
});
assert(savedLoc.calendarLocationId === "loc-uuid-1", "calendarLocationId");

// Portal alias: customLocationId → calendarLocationId
const portalAlias = resolveEventLocationFields({
  customLocationId: "portal-loc-uuid",
});
assert(portalAlias.calendarLocationId === "portal-loc-uuid", "customLocationId alias");
assert(portalAlias.customLocation === null, "no custom when customLocationId set");
assert(savedLoc.customLocation === null, "no custom when id set");

const snapCreateSaved = mapAppointmentToEventSnapshot(
  { ...baseInput, calendarLocationId: "loc-uuid-1" },
  "create"
);
assert(snapCreateSaved.calendarLocationId === "loc-uuid-1", "snap calendarLocationId");

const snapCreatePortalId = mapAppointmentToEventSnapshot(
  { ...baseInput, CustomLocationId: "portal-loc-uuid" },
  "create"
);
assert(snapCreatePortalId.calendarLocationId === "portal-loc-uuid", "snap from CustomLocationId");
assert(snapCreateSaved.customLocation === undefined, "snap no custom");

// Custom location only
const customLoc = resolveEventLocationFields({
  customLocation: "  Room 42  ",
});
assert(customLoc.customLocation === "Room 42", "trimmed custom");
assert(customLoc.calendarLocationId === null, "no id when custom");

const snapCreateCustom = mapAppointmentToEventSnapshot(
  { ...baseInput, customLocation: "Room 42" },
  "create"
);
assert(snapCreateCustom.customLocation === "Room 42", "snap custom");
assert(snapCreateCustom.calendarLocationId === undefined, "snap no calendar id");

// Custom wins when both provided
const both = resolveEventLocationFields({
  calendarLocationId: "loc-uuid-1",
  customLocation: "Override address",
});
assert(both.customLocation === "Override address", "custom wins");
assert(both.calendarLocationId === null, "id cleared when custom");

// Reschedule carries location + eventId
const snapReschedule = mapAppointmentToEventSnapshot(
  {
    ...baseInput,
    eventId: "evt-123",
    customLocation: "New place",
  },
  "reschedule"
);
assert(snapReschedule.eventId === "evt-123", "eventId");
assert(snapReschedule.customLocation === "New place", "reschedule custom");

// API response pick (PascalCase)
const fromApi = pickEventLocationFromEvent({
  CalendarLocationId: "api-loc",
  CustomLocation: null,
});
assert(fromApi.calendarLocationId === "api-loc", "pick CalendarLocationId");

// Backward compatible: no location fields
const legacy = mapAppointmentToEventSnapshot(baseInput, "create");
assert(legacy.calendarLocationId === undefined, "legacy no calendarLocationId");
assert(legacy.customLocation === undefined, "legacy no customLocation");

console.log("verifyEventLocation: all checks passed");
