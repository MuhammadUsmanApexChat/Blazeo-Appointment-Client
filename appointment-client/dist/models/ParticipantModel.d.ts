import { type Instance } from "mobx-state-tree";
export declare const ParticipantModel: import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    name: import("mobx-state-tree").ISimpleType<string>;
    email: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
    role: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
}, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export type Participant = Instance<typeof ParticipantModel>;
//# sourceMappingURL=ParticipantModel.d.ts.map