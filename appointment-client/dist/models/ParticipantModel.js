import { types } from "mobx-state-tree";
export const ParticipantModel = types.model("Participant", {
    id: types.identifier,
    name: types.string,
    email: types.optional(types.string, ""),
    role: types.optional(types.string, "Participant"),
});
//# sourceMappingURL=ParticipantModel.js.map