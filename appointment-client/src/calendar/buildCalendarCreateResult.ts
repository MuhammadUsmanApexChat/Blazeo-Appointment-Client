import { getSnapshot } from "mobx-state-tree";
import { mapToDesiredCalendarResponse } from "./mapToDesiredResponse.js";
import {
  resolveCalendarIdAfterSave,
  syncCalendarIdOnNode,
} from "./resolveCalendarIdAfterSave.js";

/** Shape returned to callers after a successful `POST /Calendar/Create`. */
export function buildCalendarCreateSuccess(
  input: any,
  calendarNode: any,
  apiResponse: any,
  extra: Record<string, unknown> = {}
) {
  const calendarId = resolveCalendarIdAfterSave(calendarNode, input, apiResponse);
  syncCalendarIdOnNode(calendarNode, calendarId);

  const snap = getSnapshot(calendarNode) as Record<string, unknown>;
  const calendarView = mapToDesiredCalendarResponse(
    { ...input, ...snap, calendarId, uuid: calendarId },
    input?.openingHours ?? [],
    input?.members ?? []
  );

  return {
    ok: true as const,
    calendarId,
    calendar: calendarNode,
    calendarSnapshot: snap,
    calendarView,
    apiResponse,
    ...extra,
  };
}

export function buildRelationSaveFailure(
  baseSuccess: any,
  calendarId: string,
  error: string,
  apiResponse?: unknown
) {
  return {
    ...baseSuccess,
    ok: true as const,
    calendarId,
    relationSaveFailed: true,
    relationSaveError: error,
    ...(apiResponse != null ? { relationSaveApiResponse: apiResponse } : {}),
  };
}
