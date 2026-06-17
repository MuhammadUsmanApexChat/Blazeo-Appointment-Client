import { getConfig } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import type { BlazeoPreferenceConnection } from "../preference/setPreference.js";

export type EventApiEnvelope = {
  status?: string;
  data?: unknown;
  message?: string;
};

function buildQuery(params: Record<string, unknown> | undefined): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v === undefined || v === null) continue;
    search.set(k, String(v));
  }
  const q = search.toString();
  return q ? `?${q}` : "";
}

async function blazeoRequest(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    query?: Record<string, unknown>;
    connection?: BlazeoPreferenceConnection;
  } = {}
): Promise<EventApiEnvelope> {
  const ready = ensureBlazeoHttpReady(options.connection ?? {});
  if (!ready.ok) {
    return { status: "failure", message: ready.error };
  }

  const env = getConfig();
  const baseUrl = env?.baseUrl?.replace(/\/+$/, "");
  if (!baseUrl) {
    return { status: "failure", message: "Blazeo baseUrl is not configured." };
  }

  const fetchFn =
    env?.fetch ??
    (typeof fetch !== "undefined"
      ? fetch
      : () => {
          throw new Error("fetch is not available");
        });

  const method = options.method ?? "GET";
  const body =
    options.body != null && method !== "GET" ? JSON.stringify(options.body) : undefined;
  const headers: Record<string, string> = {};
  if (body != null) headers["Content-Type"] = "application/json";
  if (env?.consumer && !headers["Consumer"]) headers["Consumer"] = env.consumer;

  const url = `${baseUrl}${path}${buildQuery(options.query)}`;
  const res = await fetchFn(url, { method, headers, body });
  const text = await res.text();

  let data: EventApiEnvelope;
  try {
    data = JSON.parse(text) as EventApiEnvelope;
  } catch {
    data = { status: "failure", message: text || res.statusText };
  }

  if (!res.ok && data.status !== "failure") {
    data.status = "failure";
    data.message = data.message ?? `HTTP ${res.status}`;
  }

  return data;
}

/** `GET /event/get?event_id=…` — raw API envelope (all fields from Blazeo). */
export async function getEventByIdRaw(
  eventId: string,
  connection: BlazeoPreferenceConnection = {}
): Promise<EventApiEnvelope> {
  const id = String(eventId ?? "").trim();
  if (!id) return { status: "failure", message: "eventId is required" };
  return blazeoRequest("/event/get", {
    query: { event_id: id },
    connection,
  });
}
