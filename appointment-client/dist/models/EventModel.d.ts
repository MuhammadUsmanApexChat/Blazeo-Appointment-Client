import { type Instance } from "mobx-state-tree";
export declare const EventModel: import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    title: import("mobx-state-tree").ISimpleType<string>;
    calendarId: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
    startsAt: import("mobx-state-tree").ISimpleType<string>;
    endsAt: import("mobx-state-tree").ISimpleType<string>;
    participantIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
}, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export type Event = Instance<typeof EventModel>;
//# sourceMappingURL=EventModel.d.ts.map