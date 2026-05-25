import { getConfig } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";

export type BlazeoCustomFieldConnection = {
  baseUrl?: string;
  consumer?: string;
};

export type ApiEnvelope<T = unknown> = {
  status?: string;
  data?: T;
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

export async function blazeoCustomFieldRequest(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    query?: Record<string, unknown>;
    connection?: BlazeoCustomFieldConnection;
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

export function blazeoCustomFieldGet(
  path: string,
  query: Record<string, unknown> | undefined,
  connection: BlazeoCustomFieldConnection
): Promise<ApiEnvelope> {
  return blazeoCustomFieldRequest(path, { method: "GET", query, connection });
}

export function blazeoCustomFieldPost(
  path: string,
  body: unknown,
  query: Record<string, unknown> | undefined,
  connection: BlazeoCustomFieldConnection
): Promise<ApiEnvelope> {
  return blazeoCustomFieldRequest(path, { method: "POST", body, query, connection });
}
