import { configure as calendarConfigure, getConfig } from "@blazeo.com/calendar-client";
import * as CalendarClientNamespace from "@blazeo.com/calendar-client";import type { BlazeoConnectionOptions } from "../config/blazeoConnection.js";

export type AuthState = {
  accessToken?: string;
  tokenExpiresAt?: string;
};

export const DEFAULT_TOKEN_REFRESH_SKEW_MS = 60_000;

type CalendarClientAuth = {
  configure?: (env: Record<string, unknown>) => void;
  setAccessToken?: (token: string, expiresAtUtc?: string) => void;
  setGetAccessToken?: (fn: () => Promise<string | undefined>) => void;
  clearAccessToken?: () => void;
  clearAuth?: () => void;
};

const authStore: {
  accessToken?: string;
  tokenExpiresAt?: string;
  getAccessToken?: () => Promise<string | undefined>;
} = {};

function cc(): CalendarClientAuth {
  return CalendarClientNamespace as CalendarClientAuth;
}

/** Read JWT from calendar-client `getConfig()` (no static `getAuth` — older bundles omit it). */
function readCalendarClientAccessToken(): string | undefined {
  const fromConfig = getConfig()?.accessToken;
  if (fromConfig != null && String(fromConfig).trim() !== "") {
    return String(fromConfig).trim();
  }
  return undefined;
}

function resolveExpiresAt(options: BlazeoConnectionOptions): string | undefined {
  const raw =
    options.expiresAtUtc ?? options.tokenExpiresAt ?? options.expires_at_utc;
  if (raw == null || String(raw).trim() === "") return undefined;
  return String(raw).trim();
}

function syncAuthToCalendarClient(
  accessToken?: string,
  expiresAtUtc?: string,
  getAccessToken?: () => Promise<string | undefined>
): void {
  const api = cc();
  if (accessToken != null && typeof api.setAccessToken === "function") {
    api.setAccessToken(accessToken, expiresAtUtc);
  } else if (accessToken != null && typeof api.configure === "function") {
    api.configure({
      accessToken,
      ...(expiresAtUtc ? { expiresAtUtc } : {}),
      ...(getAccessToken ? { getAccessToken } : {}),
    });
  }
  if (getAccessToken != null && typeof api.setGetAccessToken === "function") {
    api.setGetAccessToken(getAccessToken);
  }
}

/** Merge auth fields from connection / configure options into the local auth store. */
export function applyAppointmentAuth(options: BlazeoConnectionOptions = {}): void {
  if (options.accessToken != null && String(options.accessToken).trim() !== "") {
    const token = String(options.accessToken).trim();
    const expiresAtUtc = resolveExpiresAt(options);
    authStore.accessToken = token;
    authStore.tokenExpiresAt = expiresAtUtc;
    syncAuthToCalendarClient(token, expiresAtUtc, options.getAccessToken);
  }
  if (options.getAccessToken != null) {
    authStore.getAccessToken = options.getAccessToken;
    syncAuthToCalendarClient(authStore.accessToken, authStore.tokenExpiresAt, options.getAccessToken);
  }
}

export function isAccessTokenExpired(
  expiresAtUtc?: string | number | Date | null,
  skewMs: number = DEFAULT_TOKEN_REFRESH_SKEW_MS
): boolean {
  if (expiresAtUtc == null || expiresAtUtc === "") return false;
  const expMs = new Date(expiresAtUtc).getTime();
  if (Number.isNaN(expMs)) return false;
  return Date.now() >= expMs - skewMs;
}

export function getAuth(): AuthState {
  return {
    accessToken: authStore.accessToken,
    tokenExpiresAt: authStore.tokenExpiresAt,
  };
}

export function setAccessToken(accessToken: string, expiresAtUtc?: string): void {
  const token = accessToken ? String(accessToken).trim() : "";
  if (!token) {
    clearAccessToken();
    return;
  }
  authStore.accessToken = token;
  authStore.tokenExpiresAt =
    expiresAtUtc != null && String(expiresAtUtc).trim() !== ""
      ? String(expiresAtUtc).trim()
      : undefined;
  syncAuthToCalendarClient(authStore.accessToken, authStore.tokenExpiresAt, authStore.getAccessToken);
}

export function setGetAccessToken(fn: () => Promise<string | undefined>): void {
  authStore.getAccessToken = fn;
  const api = cc();
  if (typeof api.setGetAccessToken === "function") {
    api.setGetAccessToken(fn);
  }
}

export function clearAccessToken(): void {
  authStore.accessToken = undefined;
  authStore.tokenExpiresAt = undefined;
  const api = cc();
  if (typeof api.clearAccessToken === "function") {
    api.clearAccessToken();
  }
}

export function clearAuth(): void {
  clearAccessToken();
  authStore.getAccessToken = undefined;
  const api = cc();
  if (typeof api.clearAuth === "function") {
    api.clearAuth();
  }
}

export async function ensureValidAccessToken(): Promise<string | undefined> {
  const { accessToken, tokenExpiresAt } = getAuth();
  if (accessToken && !isAccessTokenExpired(tokenExpiresAt)) {
    return accessToken;
  }
  const refresh = authStore.getAccessToken;
  if (typeof refresh === "function") {
    const next = await refresh();
    if (next) {
      setAccessToken(next);
      return next;
    }
  }
  return accessToken;
}

export function buildAuthHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers = { ...extra };
  const consumer = getConfig()?.consumer;
  if (!headers.Consumer && consumer) {
    headers.Consumer = consumer;
  }
  const { accessToken } = getAuth();
  const token = accessToken || readCalendarClientAccessToken();
  if (!headers.Authorization && token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

type ConfigureEnv = BlazeoConnectionOptions & {
  fetch?: typeof fetch;
  getDefaultOffset?: () => number;
};

/** `configure()` + local auth store (safe with older `@blazeo.com/calendar-client`). */
export function configureAppointmentClient(env: ConfigureEnv = {}): void {
  const { fetch: fetchFn, getDefaultOffset, ...connection } = env;
  calendarConfigure({
    ...(connection.baseUrl ? { baseUrl: connection.baseUrl } : {}),
    ...(connection.consumer ? { consumer: connection.consumer } : {}),
    ...(fetchFn ? { fetch: fetchFn } : {}),
    ...(getDefaultOffset ? { getDefaultOffset } : {}),
    ...(connection.accessToken ? { accessToken: connection.accessToken } : {}),
    ...(resolveExpiresAt(connection) ? { expiresAtUtc: resolveExpiresAt(connection) } : {}),
    ...(connection.getAccessToken ? { getAccessToken: connection.getAccessToken } : {}),
  } as Parameters<typeof calendarConfigure>[0]);
  applyAppointmentAuth(connection);
}
