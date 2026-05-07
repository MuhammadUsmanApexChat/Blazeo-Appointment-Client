import { CalendarSlotModel } from "./models/CalendarRootModel.js";
import { CalendarRootModel } from "./models/CalendarRootModel.js";
import { EventModel } from "./models/CalendarRootModel.js";
import { ParticipantModel } from "./models/CalendarRootModel.js";

const EXAMPLE_SLOT_SNAPSHOTS = [
  {
    id: "slot-1",
    title: "Team standup",
    start: "09:00",
    end: "09:15",
  },
  {
    id: "slot-2",
    title: "Focus block",
    start: "10:00",
    end: "12:00",
  },
  {
    id: "slot-3",
    title: "1:1 with design",
    start: "14:00",
    end: "14:30",
  },
];

const EXAMPLE_EVENT_SNAPSHOTS = [
  {
    id: "ev-1",
    title: "Product roadmap review",
    calendarId: "cal-eng",
    startsAt: "2026-04-02T15:00:00.000Z",
    endsAt: "2026-04-02T16:00:00.000Z",
    participantIds: ["p-1", "p-2"],
  },
  {
    id: "ev-2",
    title: "Customer onboarding call",
    calendarId: "cal-sales",
    startsAt: "2026-04-03T10:30:00.000Z",
    endsAt: "2026-04-03T11:00:00.000Z",
    participantIds: ["p-3"],
  },
];

const EXAMPLE_PARTICIPANT_SNAPSHOTS = [
  { id: "p-1", name: "Alex Morgan", email: "alex@example.com", role: "Organizer" },
  { id: "p-2", name: "Jordan Lee", email: "jordan@example.com", role: "Required" },
  { id: "p-3", name: "Sam Rivera", email: "sam@example.com", role: "Optional" },
];

/** Example slot nodes (MST instances). */
export function getExampleSlots() {
  return EXAMPLE_SLOT_SNAPSHOTS.map((s) => CalendarSlotModel.create(s as any));
}

/** Example event nodes. */
export function getExampleEvents() {
  return EXAMPLE_EVENT_SNAPSHOTS.map((s) => EventModel.create(s as any));
}

/** Example participant nodes. */
export function getExampleParticipants() {
  return EXAMPLE_PARTICIPANT_SNAPSHOTS.map((s) => ParticipantModel.create(s as any));
}

/** Full root store snapshot suitable for `createCalendarRoot(snapshot)`. */
export function getExampleCalendarRootSnapshot() {
  return {
    slots: EXAMPLE_SLOT_SNAPSHOTS,
    events: EXAMPLE_EVENT_SNAPSHOTS,
    participants: EXAMPLE_PARTICIPANT_SNAPSHOTS,
  };
}

/** Root store with example slots, events, and participants. */
export function getExampleCalendarRoot() {
  return CalendarRootModel.create(getExampleCalendarRootSnapshot() as any);
}
