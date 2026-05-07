import { types } from "mobx-state-tree";
export const CalendarSlotModel = types.model("CalendarSlot", {
    id: types.identifier,
    title: types.string,
    start: types.string,
    end: types.string,
});
//# sourceMappingURL=CalendarSlotModel.js.map