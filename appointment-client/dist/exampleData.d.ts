/** Example slot nodes (MST instances). */
export declare function getExampleSlots(): (import("mobx-state-tree").ModelInstanceTypeProps<{
    id: import("mobx-state-tree").ISimpleType<string>;
    title: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    start: import("mobx-state-tree").ISimpleType<string>;
    end: import("mobx-state-tree").ISimpleType<string>;
    isAvailable: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<boolean>, [undefined]>;
}> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    title: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    start: import("mobx-state-tree").ISimpleType<string>;
    end: import("mobx-state-tree").ISimpleType<string>;
    isAvailable: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<boolean>, [undefined]>;
}, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>)[];
/** Example event nodes. */
export declare function getExampleEvents(): (import("mobx-state-tree").ModelInstanceTypeProps<{
    id: import("mobx-state-tree").ISimpleType<string>;
    title: import("mobx-state-tree").ISimpleType<string>;
    calendarId: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    startsAt: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    endsAt: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    participantIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
}> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    title: import("mobx-state-tree").ISimpleType<string>;
    calendarId: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    startsAt: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    endsAt: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    participantIds: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>, [undefined]>;
}, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>)[];
/** Example participant nodes. */
export declare function getExampleParticipants(): (import("mobx-state-tree").ModelInstanceTypeProps<{
    id: import("mobx-state-tree").ISimpleType<string>;
    name: import("mobx-state-tree").ISimpleType<string>;
    email: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    role: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
}> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
    id: import("mobx-state-tree").ISimpleType<string>;
    name: import("mobx-state-tree").ISimpleType<string>;
    email: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
    role: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").ISimpleType<string>>;
}, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>)[];
/** Full root store snapshot suitable for `createCalendarRoot(snapshot)`. */
export declare function getExampleCalendarRootSnapshot(): {
    slots: {
        id: string;
        title: string;
        start: string;
        end: string;
    }[];
    events: {
        id: string;
        title: string;
        calendarId: string;
        startsAt: string;
        endsAt: string;
        participantIds: string[];
    }[];
    participants: {
        id: string;
        name: string;
        email: string;
        role: string;
    }[];
};
/** Root store with example slots, events, and participants. */
export declare function getExampleCalendarRoot(): import("mobx-state-tree").ModelInstanceTypeProps<{
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
}> & {
    removeSlot(id: string): void;
    removeEvent(id: string): void;
    removeParticipant(id: string): void;
} & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
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
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
