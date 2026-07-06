export const CRM_CALENDAR_LEAD_FIELDS_PATH = "/crm/calendar/lead-fields";

export function buildCrmCalendarLeadFieldsUrl(crmApiUrl: string, calendarId?: string): string {
  const base = crmApiUrl.replace(/\/+$/, "");
  const id = calendarId != null ? String(calendarId).trim() : "";
  return id ? `${base}${CRM_CALENDAR_LEAD_FIELDS_PATH}/${encodeURIComponent(id)}` : `${base}${CRM_CALENDAR_LEAD_FIELDS_PATH}`;
}
