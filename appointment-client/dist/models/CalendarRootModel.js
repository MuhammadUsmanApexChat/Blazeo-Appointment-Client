import { types } from "mobx-state-tree";
export const CalendarSlotModel = types.model("CalendarSlot", {
    id: types.identifier,
    title: types.maybeNull(types.string),
    start: types.string,
    end: types.string,
    isAvailable: types.optional(types.boolean, true),
});
export const EventModel = types.model("Event", {
    id: types.identifier,
    title: types.string,
    calendarId: types.maybeNull(types.string),
    startsAt: types.maybeNull(types.string),
    endsAt: types.maybeNull(types.string),
    participantIds: types.optional(types.array(types.string), []),
});
export const ParticipantModel = types.model("Participant", {
    id: types.identifier,
    name: types.string,
    email: types.maybeNull(types.string),
    role: types.maybeNull(types.string),
});
export const CalendarRootModel = types
    .model("CalendarRoot", {
    slots: types.array(CalendarSlotModel),
    events: types.array(EventModel),
    participants: types.array(ParticipantModel),
})
    .actions((self) => ({
    removeSlot(id) {
        const i = self.slots.findIndex((s) => s.id === id);
        if (i >= 0)
            self.slots.splice(i, 1);
    },
    removeEvent(id) {
        const i = self.events.findIndex((e) => e.id === id);
        if (i >= 0)
            self.events.splice(i, 1);
    },
    removeParticipant(id) {
        const i = self.participants.findIndex((p) => p.id === id);
        if (i >= 0)
            self.participants.splice(i, 1);
    },
}));
export function createCalendarRoot(snapshot) {
    return snapshot
        ? CalendarRootModel.create(snapshot)
        : CalendarRootModel.create({
            slots: [],
            events: [],
            participants: [],
        });
}
