import { getConfig } from "@blazeo.com/calendar-client";
import { buildAuthHeaders, ensureValidAccessToken } from "./blazeoAuth.js";import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import type { BlazeoConnectionOptions } from "../config/blazeoConnection.js";

export type BlazeoHttpEnvelope<T = unknown> = {
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

export type BlazeoHttpRequestOptions = {
  method?: string;
  body?: unknown;
  query?: Record<string, unknown>;
  connection?: BlazeoConnectionOptions;
  /** When `false`, skip `ensureValidAccessToken()` (rare). Default `true`. */
  withAuth?: boolean;
};

/**
 * Authenticated Blazeo REST call using global `configure()` state (baseUrl, consumer, JWT).
 * Attaches `Authorization: Bearer …` when an access token is configured.
 */
export async function blazeoHttpRequest(
  path: string,
  options: BlazeoHttpRequestOptions = {}
): Promise<BlazeoHttpEnvelope> {
  const { connection = {}, withAuth = true } = options;
  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    return { status: "failure", message: ready.error };
  }

  const env = getConfig();
  const baseUrl = env?.baseUrl?.replace(/\/+$/, "");
  if (!baseUrl) {
    return { status: "failure", message: "Blazeo baseUrl is not configured." };
  }

  if (withAuth) {
    await ensureValidAccessToken();
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

  const headers = buildAuthHeaders(
    body != null ? { "Content-Type": "application/json" } : {}
  );

  const url = `${baseUrl}${path}${buildQuery(options.query)}`;
  const res = await fetchFn(url, { method, headers, body });
  const text = await res.text();

  let data: BlazeoHttpEnvelope;
  try {
    data = JSON.parse(text) as BlazeoHttpEnvelope;
  } catch {
    data = { status: "failure", message: text || res.statusText };
  }

  if (!res.ok && data.status !== "failure") {
    data.status = "failure";
    data.message = data.message ?? `HTTP ${res.status}`;
  }

  return data;
}

export function blazeoHttpGet(
  path: string,
  query: Record<string, unknown> | undefined,
  connection: BlazeoConnectionOptions = {}
): Promise<BlazeoHttpEnvelope> {
  return blazeoHttpRequest(path, { method: "GET", query, connection });
}

export function blazeoHttpPost(
  path: string,
  body: unknown,
  query: Record<string, unknown> | undefined,
  connection: BlazeoConnectionOptions = {}
): Promise<BlazeoHttpEnvelope> {
  return blazeoHttpRequest(path, { method: "POST", body, query, connection });
}
