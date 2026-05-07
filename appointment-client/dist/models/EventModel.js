import { types } from "mobx-state-tree";
export const EventModel = types.model("Event", {
    id: types.identifier,
    title: types.string,
    calendarId: types.optional(types.string, ""),
    startsAt: types.string,
    endsAt: types.string,
    participantIds: types.optional(types.array(types.string), []),
});
//# sourceMappingURL=EventModel.js.map