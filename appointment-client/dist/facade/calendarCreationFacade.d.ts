import type { IStateTreeNode } from "mobx-state-tree";
import type { CalendarBOInput } from "../types/calendarBo.js";
export type CreateCalendarOptions = {
    /** Overrides `blazeo.config` / global `configure` when set. */
    baseUrl?: string;
    consumer?: string;
    /**
     * When true, only builds the MST `Calendar` node (no HTTP).
     * Default false: calls `calendar.create()` → POST `/Calendar/Create`.
     */
    localOnly?: boolean;
};
/** Typical Blazeo `reqPost` / `calendar.create()` result shape. */
export type BlazeoCalendarCreateResponse = {
    status: string;
    message?: string;
    data?: unknown;
};
export type CreateCalendarSuccess = {
    ok: true;
    calendar: IStateTreeNode;
    apiResponse?: BlazeoCalendarCreateResponse;
};
export type CreateCalendarFailure = {
    ok: false;
    error: string;
    apiResponse?: BlazeoCalendarCreateResponse;
};
export type CreateCalendarResult = CreateCalendarSuccess | CreateCalendarFailure;
/** Merge per-call options with global Blazeo config (file + `configure`). */
export declare function resolveBlazeoConnection(options?: CreateCalendarOptions): {
    baseUrl?: string;
    consumer?: string;
};
/**
 * Uses {@link resolveBlazeoConnection} (config file + `configure` + optional overrides),
 * then `CalendarModel.create` and `calendar.create()` unless `localOnly`.
 */
export declare function createCalendarAsync(calendar: CalendarBOInput, options?: CreateCalendarOptions): Promise<CreateCalendarResult>;
//# sourceMappingURL=calendarCreationFacade.d.ts.map