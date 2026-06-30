import type { BlazeoConnectionOptions } from "../config/blazeoConnection.js";
import {
  blazeoHttpGet,
  blazeoHttpPost,
  blazeoHttpRequest,
  type BlazeoHttpEnvelope,
} from "../http/blazeoHttpRequest.js";

export type BlazeoCustomFieldConnection = BlazeoConnectionOptions;

export type ApiEnvelope<T = unknown> = BlazeoHttpEnvelope<T>;

export async function blazeoCustomFieldRequest(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    query?: Record<string, unknown>;
    connection?: BlazeoCustomFieldConnection;
  } = {}
): Promise<ApiEnvelope> {
  return blazeoHttpRequest(path, options);
}

export function blazeoCustomFieldGet(
  path: string,
  query: Record<string, unknown> | undefined,
  connection: BlazeoCustomFieldConnection
): Promise<ApiEnvelope> {
  return blazeoHttpGet(path, query, connection);
}

export function blazeoCustomFieldPost(
  path: string,
  body: unknown,
  query: Record<string, unknown> | undefined,
  connection: BlazeoCustomFieldConnection
): Promise<ApiEnvelope> {
  return blazeoHttpPost(path, body, query, connection);
}
