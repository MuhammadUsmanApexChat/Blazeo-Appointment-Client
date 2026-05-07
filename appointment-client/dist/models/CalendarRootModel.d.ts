import { Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
export declare const CalendarSlotModel: import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    title: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    start: import("mobx-state-tree").ISimpleType<string>;
    end: import("mobx-state-tree").ISimpleType<string>;
    isAvailable: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<boolean>, [undefined]>;
}, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare const EventModel: import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    title: import("mobx-state-tree").ISimpleType<string>;
    calendarId: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    startsAt: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    endsAt: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    participantIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
}, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare const ParticipantModel: import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    name: import("mobx-state-tree").ISimpleType<string>;
    email: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    role: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
}, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare const CalendarRootModel: import("mobx-state-tree").IModelType<{
    slots: import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
        id: import("mobx-state-tree").ISimpleType<string>;
        title: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        start: import("mobx-state-tree").ISimpleType<string>;
        end: import("mobx-state-tree").ISimpleType<string>;
        isAvailable: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<boolean>, [undefined]>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    events: import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
        id: import("mobx-state-tree").ISimpleType<string>;
        title: import("mobx-state-tree").ISimpleType<string>;
        calendarId: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        startsAt: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        endsAt: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        participantIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    participants: import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
        id: import("mobx-state-tree").ISimpleType<string>;
        name: import("mobx-state-tree").ISimpleType<string>;
        email: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
        role: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
}, {
    removeSlot(id: string): void;
    removeEvent(id: string): void;
    removeParticipant(id: string): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export interface ICalendarRoot extends Instance<typeof CalendarRootModel> {
}
export interface ICalendarRootSnapshotIn extends SnapshotIn<typeof CalendarRootModel> {
}
export interface ICalendarRootSnapshotOut extends SnapshotOut<typeof CalendarRootModel> {
}
export declare function createCalendarRoot(snapshot?: ICalendarRootSnapshotIn): ICalendarRoot;
