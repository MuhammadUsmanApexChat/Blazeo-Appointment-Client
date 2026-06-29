import { getSnapshot } from "mobx-state-tree";

function pickId(row: Record<string, unknown>): string | undefined {
  const id =
    row.calendarId ??
    row.CalendarId ??
    row.calendar_id ??
    row.uuid ??
    row.Uuid ??
    row.id ??
    row.Id;
  if (id == null) return undefined;
  const s = String(id).trim();
  return s && s !== "new" ? s : undefined;
}

/** Extract a calendar id from Blazeo create/get response `data` (object, nested object, or plain id string). */
export function pickCalendarIdFromApiData(data: unknown): string | undefined {
  if (data == null) return undefined;

  if (typeof data === "string" || typeof data === "number") {
    const s = String(data).trim();
    return s && s !== "new" ? s : undefined;
  }

  if (typeof data !== "object") return undefined;

  const row = data as Record<string, unknown>;
  const direct = pickId(row);
  if (direct) return direct;

  const nested = row.data ?? row.Data;
  if (nested != null && nested !== data) {
    return pickCalendarIdFromApiData(nested);
  }

  return undefined;
}

/** Resolve the persisted calendar id after `POST /Calendar/Create` (API body, MST node, or input). */
export function resolveCalendarIdAfterSave(
  calendarNode: unknown,
  input: { calendarId?: string } | null | undefined,
  apiResponse?: { data?: unknown } | null
): string | undefined {
  const fromApi = pickCalendarIdFromApiData(apiResponse?.data);
  if (fromApi) return fromApi;

  if (calendarNode != null && typeof calendarNode === "object") {
    const snap = getSnapshot(calendarNode as any) as { calendarId?: string };
    const fromNode = snap.calendarId?.trim();
    if (fromNode && fromNode !== "new") return fromNode;
  }

  const fromInput = input?.calendarId?.trim();
  return fromInput && fromInput !== "new" ? fromInput : undefined;
}

/** Apply API-returned calendar id onto an MST calendar node when the snapshot still has a client-generated id. */
export function syncCalendarIdOnNode(calendarNode: any, calendarId: string | undefined) {
  const id = calendarId?.trim();
  if (!id || !calendarNode || typeof calendarNode !== "object") return;
  if (typeof calendarNode.setCalendarId === "function") {
    calendarNode.setCalendarId(id);
    return;
  }
  if ("calendarId" in calendarNode && calendarNode.calendarId !== id) {
    try {
      calendarNode.calendarId = id;
    } catch {
      // MST nodes are usually updated by applyCalendarResponse; ignore if read-only.
    }
  }
}
