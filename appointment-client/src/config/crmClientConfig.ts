let configuredCrmApiUrl: string | undefined;

/** Persist CRM API base URL from {@link initializeAppointmentClient} or host bootstrap. */
export function setCrmApiUrl(url?: string): void {
  const trimmed = url?.trim().replace(/\/+$/, "");
  configuredCrmApiUrl = trimmed || undefined;
}

export function getCrmApiUrl(): string | undefined {
  return configuredCrmApiUrl;
}

/** Per-call `crmApiUrl` overrides global config from {@link setCrmApiUrl}. */
export function resolveCrmApiUrl(options: { crmApiUrl?: string } = {}): string | undefined {
  const fromOptions = options.crmApiUrl?.trim().replace(/\/+$/, "");
  return fromOptions || configuredCrmApiUrl;
}
