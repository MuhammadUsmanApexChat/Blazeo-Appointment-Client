function pick<T>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k] as T;
  }
  return undefined;
}

function isTruthyCrmFlag(value: unknown): boolean {
  if (value === true) return true;
  if (value === 1) return true;
  if (typeof value === "string") {
    const token = value.trim().toLowerCase();
    return token === "true" || token === "1";
  }
  return false;
}

/** True when the calendar payload was sent from the CRM frontend (`isCrm` / `IsCrm`). */
export function isCrmCalendar(calendar: unknown): boolean {
  if (calendar == null || typeof calendar !== "object") return false;
  const row = calendar as Record<string, unknown>;
  return isTruthyCrmFlag(pick(row, "isCrm", "IsCrm", "isCRM"));
}

/** True when `fetchCalendarDetails` should load fields from the CRM API. */
export function resolveFetchCrmMode(
  options: { isCrm?: unknown },
  calendarPayload?: unknown
): boolean {
  if (options.isCrm !== undefined && options.isCrm !== null) {
    return isTruthyCrmFlag(options.isCrm);
  }
  return isCrmCalendar(calendarPayload);
}

/** Company key from calendar payload, with optional fetch-option override when the calendar has none. */
export function resolveFetchCompanyKey(
  options: { companyKey?: string },
  calendarPayload?: unknown
): string {
  const fromCalendar = resolveCompanyKeyFromCalendar(calendarPayload);
  if (fromCalendar) return fromCalendar;
  return String(options.companyKey ?? "").trim();
}

/** Company key on the portal calendar create/update payload. */
export function resolveCompanyKeyFromCalendar(calendar: unknown): string {
  if (calendar == null || typeof calendar !== "object") return "";
  const row = calendar as Record<string, unknown>;
  return String(
    row.companyKey ?? row.CompanyKey ?? row.company_key ?? ""
  ).trim();
}
