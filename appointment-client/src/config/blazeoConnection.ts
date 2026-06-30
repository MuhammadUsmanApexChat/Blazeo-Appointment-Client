/**
 * Per-call Blazeo connection overrides (merged into global `@blazeo.com/calendar-client` `configure()`).
 */
export type BlazeoConnectionOptions = {
  baseUrl?: string;
  consumer?: string;
  /** JWT from your identity provider — sent as `Authorization: Bearer …`. */
  accessToken?: string;
  /** Token expiry (UTC ISO string). Aliases: `tokenExpiresAt`, `expires_at_utc`. */
  expiresAtUtc?: string;
  tokenExpiresAt?: string;
  expires_at_utc?: string;
  /** Refresh callback when the stored JWT is missing or near expiry. */
  getAccessToken?: () => Promise<string | undefined>;
};

/** Build the `configure()` payload from connection options (omits undefined keys). */
export function blazeoConnectionToConfigureEnv(
  options: BlazeoConnectionOptions = {}
): Record<string, unknown> {
  const baseUrl = options.baseUrl?.trim().replace(/\/+$/, "");
  const consumer = options.consumer?.trim();
  const expiresAtUtc =
    options.expiresAtUtc ?? options.tokenExpiresAt ?? options.expires_at_utc;

  const env: Record<string, unknown> = {};
  if (baseUrl) env.baseUrl = baseUrl;
  if (consumer) env.consumer = consumer;
  if (options.accessToken != null && String(options.accessToken).trim() !== "") {
    env.accessToken = String(options.accessToken).trim();
  }
  if (expiresAtUtc != null && String(expiresAtUtc).trim() !== "") {
    env.expiresAtUtc = String(expiresAtUtc).trim();
  }
  if (options.getAccessToken != null) {
    env.getAccessToken = options.getAccessToken;
  }
  return env;
}
