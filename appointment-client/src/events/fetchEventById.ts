import { EventModel } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import type { BlazeoConnectionOptions } from "../config/blazeoConnection.js";
import { getSnapshot, isStateTreeNode } from "mobx-state-tree";
import { buildModelEnv, resolveBlazeoConnection } from "../calendar/createCalendar.js";
import { mapAppointmentEventToPlain } from "./mapAppointmentToEventSnapshot.js";
import { getEventByIdRaw } from "./eventHttp.js";
import { mapBlazeoEventToClientEvent } from "./mapBlazeoEventToClientEvent.js";

function isFailureStatus(res: any) {
  if (res == null || typeof res !== "object") return false;
  if (!("status" in (res as any))) return false;
  return (res as any).status !== "success" && (res as any).status !== "Success";
}

function ensureConfigure(options: BlazeoConnectionOptions = {}) {
  ensureBlazeoHttpReady(options);
}

export type GetEventByIdOptions = BlazeoConnectionOptions & {
  localOnly?: boolean;
  /** When true, includes the raw `GET /event/get` envelope on the result (debug only). */
  includeRawGet?: boolean;
};

export type GetEventByIdResult =
  | {
      ok: true;
      event: Record<string, unknown>;
      rawGet?: unknown;
    }
  | { ok: false; error: string; rawGet?: unknown };

/**
 * Fetch an event by `eventId` — single `GET /event/get?event_id=…`.
 * No extra calls for location backfill, custom data, or calendar location details.
 */
export async function getEventById(
  eventId: string,
  options: GetEventByIdOptions = {}
): Promise<GetEventByIdResult> {
  try {
    const id = String(eventId ?? "").trim();
    if (!id) return { ok: false, error: "eventId is required." };

    const { baseUrl: resolvedBase, consumer: resolvedConsumer } = resolveBlazeoConnection(options);
    ensureConfigure(options);

    const baseUrl = resolvedBase;
    const consumer = resolvedConsumer;
    if (!options.localOnly && !baseUrl) {
      return {
        ok: false,
        error:
          "baseUrl is missing. Set `blazeoClientConfig.baseUrl` in `appointment-client/src/config/blazeoClientDefaults.ts` or call `configure({ baseUrl })`.",
      };
    }

    if (options.localOnly) {
      const env = buildModelEnv(baseUrl, consumer, true);
      const node: any = EventModel.create({ eventId: id }, env);
      const event = mapBlazeoEventToClientEvent(mapAppointmentEventToPlain(node));
      return { ok: true, event };
    }

    const rawGet = await getEventByIdRaw(id, options);
    if (isFailureStatus(rawGet)) {
      const msg =
        rawGet.message ??
        (typeof rawGet.data === "string" ? rawGet.data : undefined) ??
        JSON.stringify(rawGet);
      return {
        ok: false,
        error: msg || "Event get failed",
        ...(options.includeRawGet ? { rawGet } : {}),
      };
    }

    const rawData =
      rawGet.data != null && typeof rawGet.data === "object"
        ? (rawGet.data as Record<string, unknown>)
        : null;

    if (!rawData) {
      return {
        ok: false,
        error: "Event not found.",
        ...(options.includeRawGet ? { rawGet } : {}),
      };
    }

    const event = mapBlazeoEventToClientEvent(rawData);

    return {
      ok: true,
      event,
      ...(options.includeRawGet ? { rawGet } : {}),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
