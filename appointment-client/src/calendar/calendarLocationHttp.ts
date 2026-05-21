import { getConfig } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import type { BlazeoPreferenceConnection } from "../preference/setPreference.js";
import type { CalendarLocationSavePayload } from "./mapCalendarLocation.js";

type ApiEnvelope<T = unknown> = {
  status?: string;
  data?: T;
  message?: string;
};

function buildQuery(params: Record<string, unknown> | undefined): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      for (const item of v) search.append(k, String(item));
    } else {
      search.set(k, String(v));
    }
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
): Promise<ApiEnvelope> {
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

  let data: ApiEnvelope;
  try {
    data = JSON.parse(text) as ApiEnvelope;
  } catch {
    data = { status: "failure", message: text || res.statusText };
  }

  if (!res.ok && data.status !== "failure") {
    data.status = "failure";
    data.message = data.message ?? `HTTP ${res.status}`;
  }

  return data;
}

/** `GET /Calendar/Location/Get?calendar_id=…` — plain API rows (no MST). */
export async function getCalendarLocationsByCalendar(
  calendarId: string,
  connection: BlazeoPreferenceConnection = {}
): Promise<Record<string, unknown>[] | null> {
  const res = await blazeoRequest("/Calendar/Location/Get", {
    query: { calendar_id: calendarId },
    connection,
  });
  if (res.status === "success" && Array.isArray(res.data)) {
    return res.data as Record<string, unknown>[];
  }
  return null;
}

/** `POST /Calendar/Location/Save` — plain saved row (no MST). */
export async function saveCalendarLocationApi(
  payload: CalendarLocationSavePayload,
  connection: BlazeoPreferenceConnection = {}
): Promise<Record<string, unknown> | null> {
  const res = await blazeoRequest("/Calendar/Location/Save", {
    method: "POST",
    body: payload,
    connection,
  });
  if (res.status === "success" && res.data && typeof res.data === "object") {
    return res.data as Record<string, unknown>;
  }
  return null;
}
