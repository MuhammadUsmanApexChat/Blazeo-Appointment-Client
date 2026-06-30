import { blazeoHttpGet, type BlazeoHttpEnvelope } from "../http/blazeoHttpRequest.js";
import type { BlazeoConnectionOptions } from "../config/blazeoConnection.js";

export type BlazeoPreferenceConnection = BlazeoConnectionOptions;

export type EventApiEnvelope = BlazeoHttpEnvelope;

/** `GET /event/get?event_id=…` — raw API envelope (all fields from Blazeo). */
export async function getEventByIdRaw(
  eventId: string,
  connection: BlazeoPreferenceConnection = {}
): Promise<EventApiEnvelope> {
  const id = String(eventId ?? "").trim();
  if (!id) return { status: "failure", message: "eventId is required" };
  return blazeoHttpGet("/event/get", { event_id: id }, connection);
}
