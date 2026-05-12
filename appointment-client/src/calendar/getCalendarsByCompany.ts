import { CalendarModel, CalendarParticipantModel } from "@blazeo.com/calendar-client";
import { ensureBlazeoHttpReady } from "../config/ensureBlazeoHttpReady.js";
import { mapToDesiredCalendarResponse } from "./mapToDesiredResponse.js";

/**
 * Fetches all calendars for a company and populates each with its members (participants).
 * Uses a highly optimized single-request approach per calendar to ensure speed in list views.
 * Results are normalized via mapToDesiredCalendarResponse.
 */
export async function getCalendarsByCompany(
  companyKey: string,
  connection: { baseUrl?: string; consumer?: string } = {}
) {
  const ready = ensureBlazeoHttpReady(connection);
  if (!ready.ok) {
    throw new Error(ready.error);
  }

  // 1. Get all calendars for the company
  const result = await CalendarModel.getByCompany(companyKey);
  const calendars = Array.isArray(result) ? result : (result as any)?.calendars ?? [];

  if (!calendars || calendars.length === 0) {
    return [];
  }

  // 2. Fetch lightweight members for each calendar in parallel
  const enrichedCalendars = await Promise.all(
    calendars.map(async (cal: any) => {
      const calendarId = cal.calendarId ?? String(cal.id ?? "");
      if (!calendarId) return null;

      try {
        // Optimization: Use only getInfoByCalendar to get names/emails in a single request.
        // This is much faster for a list view than fetching both list and info records.
        const infoRaw = await CalendarParticipantModel.getInfoByCalendar(calendarId);
        const info = Array.isArray(infoRaw) ? infoRaw : (infoRaw as any)?.info ?? [];

        // Merge logic to ensure names are matched to IDs
        const membersMap = new Map<string, any>();

        // Use participantId GUID as the primary key
        const getAnyId = (obj: any) =>
          obj.participantId ?? obj.ParticipantId ?? obj.participant_id ?? obj.id ?? obj.Id;

        // 1. Process info list (Name, Email, Alias)
        info.forEach((i: any) => {
          const mid = getAnyId(i);
          if (!mid) return;
          const key = String(mid).toLowerCase();

          const resolvedEmail = i.email ?? i.Email ?? i.userSsoEmail ?? i.UserSsoEmail;
          const memberData = {
            id: mid,
            name: i.name ?? i.Name ?? i.alias ?? i.Alias ?? "Member",
            email: resolvedEmail,
            status: i.status ?? i.Status ?? 1,
          };

          if (!membersMap.has(key)) {
            membersMap.set(key, memberData);
          }
        });

        const members = Array.from(membersMap.values());

        // Use the unified mapper to ensure all properties (duration, calendarId, etc.) are included
        return mapToDesiredCalendarResponse(cal, [], members);
      } catch (err) {
        console.error(`[getCalendarsByCompany] Error fetching members for ${calendarId}:`, err);
        // Fallback to minimal mapping if enrichment fails
        return mapToDesiredCalendarResponse(cal, [], []);
      }
    })
  );

  return enrichedCalendars.filter(Boolean);
}
