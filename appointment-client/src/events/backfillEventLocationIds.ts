import { getSnapshot, isStateTreeNode } from "mobx-state-tree";
import type { BlazeoPreferenceConnection } from "../preference/setPreference.js";
import { getEventByIdRaw } from "./eventHttp.js";
import { mapBlazeoEventToClientEvent } from "./mapBlazeoEventToClientEvent.js";
import { pickEventLocationFromEvent } from "./mapAppointmentEventLocation.js";

async function mapWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const res: R[] = new Array(items.length);
  let next = 0;
  const workers = new Array(Math.max(1, Math.min(limit, items.length))).fill(0).map(async () => {
    while (true) {
      const idx = next++;
      if (idx >= items.length) return;
      res[idx] = await mapper(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return res;
}

/** Normalize a search/list event row (MST or API) to camelCase client fields. */
export function eventSearchResultToClientRow(event: unknown): Record<string, unknown> {
  if (event == null) return {};
  const raw = (event as { _raw?: unknown })._raw;
  const base =
    isStateTreeNode(event) ? getSnapshot(event) : typeof event === "object" ? { ...(event as object) } : {};
  const merged =
    raw != null && typeof raw === "object"
      ? { ...(base as Record<string, unknown>), ...(raw as Record<string, unknown>) }
      : (base as Record<string, unknown>);
  return mapBlazeoEventToClientEvent(merged);
}

/**
 * Search/list endpoints often omit `CalendarLocationId`. Backfill via `GET /event/get` per eventId.
 */
export async function backfillEventLocationIds(
  rows: Record<string, unknown>[],
  connection: BlazeoPreferenceConnection = {}
): Promise<Record<string, unknown>[]> {
  const result = rows.map((row) => ({ ...row }));
  const needs = result
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => {
      const loc = pickEventLocationFromEvent(row);
      const eventId = String(row.eventId ?? "").trim();
      return !loc.calendarLocationId && !loc.customLocation && eventId;
    });

  if (!needs.length) return result;

  const filled = await mapWithConcurrencyLimit(needs, 12, async ({ row, index }) => {
    const eventId = String(row.eventId ?? "").trim();
    try {
      const raw = await getEventByIdRaw(eventId, connection);
      const data = raw?.data;
      if (!data || typeof data !== "object") return { index, row };
      const normalized = mapBlazeoEventToClientEvent(data);
      const loc = pickEventLocationFromEvent(normalized);
      if (!loc.calendarLocationId && !loc.customLocation) return { index, row };
      return {
        index,
        row: {
          ...row,
          calendarLocationId: loc.calendarLocationId,
          customLocation: loc.customLocation,
        },
      };
    } catch {
      return { index, row };
    }
  });

  for (const { index, row } of filled) result[index] = row;
  return result;
}
